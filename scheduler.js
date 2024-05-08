const Outlet = require('./models/outlet');
const moment = require('moment-timezone');


const cron =  async () => {
    try {
        const currentTime = moment.tz('Asia/Shanghai').toDate();
        console.log("Current Time: " + currentTime);
        const outlets = await Outlet.find();
        for (const outlet of outlets) {
            let isActive = true;
            for (const schedule of outlet.schedule) {
                if (!schedule.startTime || !schedule.endTime) {
                    console.error(`Invalid schedule for outlet ${outlet._id}`);
                    continue;
                }
                const startTime = new Date(currentTime.toDateString() + ' ' + schedule.startTime);
                const endTime = new Date(currentTime.toDateString() + ' ' + schedule.endTime);
                if (currentTime >= startTime && currentTime <= endTime) {
                    console.log("Condition is true. Turning off the outlet.");
                    isActive = false;
                    break;
                }
            }
            outlet.status = isActive;
            await outlet.save();
        }
    } catch (err) {
        console.error('Error scheduling tasks:', err);
    }
}

module.exports = cron;