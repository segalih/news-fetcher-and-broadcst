const model = require("../config/gemini");

async function isRelevant(title) {
  const prompt = `
    Apakah judul berita ini berkaitan dengan market, teknis, kebijakan yang mempengaruhi harga atau prospek crypto?
    Judul: "${title}"
    Jawab hanya dengan "YA" atau "TIDAK".
  `;
  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim().includes("YA");
  } catch (err) {
    console.error("Gagal filter Gemini:", err);
    return true;
  }
}

module.exports = isRelevant;
