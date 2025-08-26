const Parser = require("rss-parser");
const parser = new Parser();

async function fetchRSS(url) {
  try {
    console.log(`Mengambil RSS feed: ${url}`);
    const feed = await parser.parseURL(url);
    return feed.items; // Daftar berita
  } catch (err) {
    console.error("Gagal fetch RSS:", err);
    return [];
  }
}

module.exports = fetchRSS;
