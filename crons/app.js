import cron from "node-cron";

import sendMail from "./mailer.js";

// Run cron job every 15 mins
cron.schedule("*/15 * * * *", () => {
    xyzcron();
});

// Schedule a job to run at 8:00 PM IST every day
cron.schedule(
    "0 20 * * *",
    () => {
      sendMail();
    },
    {
      timezone: "Asia/Kolkata",
    }
);