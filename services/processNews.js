const sequelize = require("../models");
const News = require("../models/News");
const fetchRSS = require("./rssFetcher");
const isRelevant = require("./filter");
const broadcastToTelegram = require("./telegram");

const rssUrls = process.env.RSS_FEED_URLS.split(",");

async function saveNews(item, options = {}) {
  await News.upsert({
    title: item.title,
    link: item.link,
    isRelevant: options.isRelevant ?? false,
    isSent: options.isSent ?? false,
    sentAt: options.isSent ? new Date() : null,
  });
}

async function sendToTelegram(item, feedTitle) {
  //   const message = `
  // 🚨 *${item.title}*

  // 🔗 [Baca selengkapnya](${item.link})

  // Sumber: ${feedTitle}
  // #Crypto #News
  // `;
  const message = `
🚨 *${item.title}*

📝 ${
    item.contentSnippet
      ? item.contentSnippet.slice(0, 150) + "..."
      : "Klik link di bawah untuk detail."
  }

🔗 [Baca Selengkapnya](${item.link})

📰 Sumber: ${feedTitle}  
🗓️ ${new Date(item.pubDate).toLocaleString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  })};

#Crypto #News #${feedTitle.replace(/\s+/g, "")}
`;

  await broadcastToTelegram(message);
}

async function processNews() {
  try {
    await sequelize.authenticate();
    console.log("MySQL terhubung.");
  } catch (err) {
    console.error("Koneksi MySQL gagal:", err);
    return;
  }

  for (const url of rssUrls) {
    try {
      const feed = await fetchRSS(url);
      if (!feed?.items) {
        console.log("Feed kosong:", url);
        continue;
      }

      for (const item of feed.items) {
        try {
          // 🔹 cek dulu di DB
          const existing = await News.findOne({ where: { link: item.link } });

          if (existing?.isSent ) {
            continue;
          }

          //   const relevant = await isRelevant(item.title);
          const relevant = true;

          if (relevant) {
            try {
              await sendToTelegram(item, feed.title);
              await saveNews(item, { isRelevant: true, isSent: true });
            } catch (sendErr) {
              console.error("Gagal kirim Telegram:", sendErr);
              await saveNews(item, { isRelevant: true, isSent: false });
            }
          } else {
            // hanya insert sekali kalau belum ada
            if (!existing) {
              await saveNews(item, { isRelevant: false, isSent: false });
            }
          }
        } catch (itemErr) {
          console.error("Error item:", item.link, itemErr);
        }
      }
    } catch (feedErr) {
      console.error("Gagal fetch RSS:", url, feedErr);
    }
  }
}

module.exports = processNews;
