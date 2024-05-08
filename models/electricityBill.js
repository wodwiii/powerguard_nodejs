const mongoose = require('mongoose');

const electricityBillSchema = new mongoose.Schema({
  owner: String,
  periodStart: { type: Date, default: setPeriodStart },
  periodEnd: { type: Date, default: setPeriodEnd },
  readings: [{
    value: Number,
    timestamp: { type: Date, default: Date.now }
  }],
}, { toJSON: { virtuals: true } }); 

electricityBillSchema.virtual('total').get(function() {
  return this.readings.reduce((total, reading) => total + reading.value, 0);
});

electricityBillSchema.virtual('powerReading').get(function() {
    const latestReading = this.readings[this.readings.length - 1];
    if (!latestReading) return 0;
    const power = latestReading.value * 60;
    return power;
});

electricityBillSchema.virtual('dailyTotal').get(function() {
    const dailyTotal = {};
    this.readings.forEach(reading => {
      const dateKey = reading.timestamp.toDateString();
      if (!dailyTotal[dateKey]) {
        dailyTotal[dateKey] = 0;
      }
      dailyTotal[dateKey] += reading.value;
    });
    return dailyTotal;
});

function setPeriodStart() {
  const today = new Date();
  const periodStart = new Date(today.getFullYear(), today.getMonth(), 1);
  return periodStart;
}

function setPeriodEnd() {
  const today = new Date();
  const periodEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
  return periodEnd;
}

module.exports = mongoose.models.ElectricityBill || mongoose.model('ElectricityBill', electricityBillSchema);
