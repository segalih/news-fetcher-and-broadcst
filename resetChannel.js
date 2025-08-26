const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.launch();

// Fungsi untuk scan dan hapus pesan
async function deleteMessages() {
  const messages = await bot.telegram.getChatHistory(CHAT_ID, { limit: 100 });
  for (const message of messages) {
    await bot.telegram.deleteMessage(CHAT_ID, message.message_id);
  }
}

deleteMessages();
