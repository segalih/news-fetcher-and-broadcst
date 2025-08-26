const bot = require("../config/telegram");

async function broadcastToTelegram(message) {
  const chatIds = [process.env.TELEGRAM_CHANNEL_ID]; // Ganti dengan chat ID target
  for (const chatId of chatIds) {
    try {
      await bot.telegram.sendMessage(chatId, message, {
        message_thread_id: 8,
        parse_mode: "Markdown",
      });
    } catch (err) {
      console.error("Gagal kirim Telegram:", err);
      throw err;
    }
  }
}

module.exports = broadcastToTelegram;
