require("dotenv").config();
const schedule = require("node-schedule");
const sequelize = require("./models/index");
const News = require("./models/News");
const fetchRSS = require("./services/rssFetcher");
const isRelevant = require("./services/filter");
const broadcastToTelegram = require("./services/telegram");

// Inisialisasi DB
sequelize
  .authenticate()
  .then(() => console.log("MySQL terhubung."))
  .catch((err) => console.error("Koneksi MySQL gagal:", err));

// Daftar RSS feed
const rssUrls = process.env.RSS_FEED_URLS.split(",");

// Fungsi utama
async function processNews() {
  for (const url of rssUrls) {
    const items = await fetchRSS(url);
    for (const item of items) {
      // Cek apakah berita sudah diproses
      const existing = await News.findOne({ where: { link: item.link } });
      if (existing) continue;

      const relevant = await isRelevant(item.title);
      if (relevant) {
        try {
          const message = `
🚨 *${item.title}*
🔗 [Baca selengkapnya](${item.link})
#Crypto #News
`;
          await broadcastToTelegram(message);
          const isExist = await News.findOne({ where: { link: item.link } });
          if (isExist) {
            await News.update(
              {
                title: item.title,
                link: item.link,
                isRelevant: true,
                isSent: true,
                sentAt: new Date(),
              },
              {
                where: { link: item.link },
              }
            );
          } else {
            await News.create({
              title: item.title,
              link: item.link,
              isRelevant: true,
              isSent: true,
              sentAt: new Date(),
            });
          }
        } catch (err) {
          // Jika gagal kirim, simpan dengan isSent = false
          await News.create({
            title: item.title,
            link: item.link,
            isRelevant: true,
            isSent: false,
          });
        }
      } else {
        await News.create({
          title: item.title,
          link: item.link,
          isRelevant: false,
          isSent: false,
        });
      }
    }
  }
}

// Jalankan setiap 1 jam
schedule.scheduleJob("* * * * *", processNews);

console.log("Scheduler berjalan...");
