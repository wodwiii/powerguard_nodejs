const mongoose = require('mongoose');

const outletSchema = new mongoose.Schema({
    name: String,
    status: { type: Boolean, default: false },
    schedule: {
        type: [{
            startTime: String,
            endTime: String
        }],
        validate: [schedulesLimit, '{PATH} exceeds the limit of 3']
    }
});

function schedulesLimit(val) {
    return val.length <= 3;
}

module.exports = mongoose.model('Outlet', outletSchema);
