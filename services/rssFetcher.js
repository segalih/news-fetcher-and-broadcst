const Parser = require("rss-parser");
const parser = new Parser({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36",
    Accept: "application/rss+xml,application/xml;q=0.9,*/*;q=0.8",
  },
});

async function fetchRSS(url) {
  try {
    console.log(`Mengambil RSS feed: ${url}`);
    const feed = await parser.parseURL(url);
    return feed; // Daftar berita
  } catch (err) {
    console.error("Gagal fetch RSS:", err);
    return [];
  }
}

module.exports = fetchRSS;
