const express = require('express');
const router = express.Router();
const ElectricityBill = require('../models/electricityBill');

router.post('/readings', async (req, res) => {
    try {
        const { owner, value } = req.body;
        const currentDate = new Date();
        let electricityBill = await ElectricityBill.findOneAndUpdate(
            { owner: owner, periodStart: { $lte: currentDate }, periodEnd: { $gte: currentDate } },
            {},
            { new: true, upsert: true }
        );
        if (!electricityBill) {
            const currentPeriodStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            electricityBill = await ElectricityBill.create({
                owner: owner,
                periodStart: currentPeriodStart,
                periodEnd: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999)
            });
        }
        const newReading = {
            value: value,
            timestamp: currentDate
        };
        electricityBill.readings.push(newReading);
        await electricityBill.save();
        res.json("Data posted successfully");
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/readings/:owner', async (req, res) => {
    try {
        const { owner } = req.params;
        const electricityBill = await ElectricityBill.findOne(
            { owner: owner, periodStart: { $lte: new Date() }, periodEnd: { $gte: new Date() } }
        );

        if (!electricityBill) {
            return res.status(404).json({ message: 'Readings not found for the current period' });
        }
        res.json(electricityBill);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
