require("dotenv").config();
const schedule = require("node-schedule");
const processNews = require("./services/processNews");

// Scheduler (tiap 1 menit, bisa ubah ke "0 * * * *" untuk tiap 1 jam)
schedule.scheduleJob("* * * * *", async () => {
  try {
    await processNews();
  } catch (err) {
    console.error("Scheduler error:", err);
  }
});

console.log("Scheduler berjalan...");
