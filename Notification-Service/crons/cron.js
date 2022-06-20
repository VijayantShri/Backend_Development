/**
 * We will take help of node-cron to repeat some lines of code at regular interval.
 */

const cron = require("node-cron");

cron.schedule('*/2 * * * * *', () => {
    console.log("Hello World!");
});