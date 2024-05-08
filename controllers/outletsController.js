const Outlet = require('../models/outlet');

exports.getAllOutlets = async (req, res) => {
    try {
        const outlets = await Outlet.find({}, 'name status');
        res.json(outlets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.controlOutlet = async (req, res) => {
    try {
        let outlet = await Outlet.findOne({ name: req.body.name });
        if (!outlet) {
            outlet = new Outlet({
                name: req.body.name,
                status: req.body.status || false,
                schedule: req.body.schedule || []
            });
        } else {
            if (req.body.schedule !== undefined) {
                if (req.body.schedule.length > 3) {
                    return res.status(400).json({ message: 'Exceeds the limit of 3 schedules' });
                }
                outlet.schedule = req.body.schedule;
            }
            if (req.body.status !== undefined) {
                outlet.status = req.body.status;
            }
        }

        await outlet.save();
        res.json(outlet);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
