// Telegram notifications using native fetch (Node 18+)

const TOKEN = process.env.TELEGRAM_TOKEN;

export async function notifyTelegram(chatId: string, message: string) {
  if (!TOKEN) {
    console.warn("⚠️ TELEGRAM_TOKEN not set");
    return;
  }

  const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message
      }),
    });

    if (!response.ok) {
      console.error("❌ Telegram API error:", await response.text());
    }
  } catch (err) {
    console.error("❌ Failed to send Telegram message:", err);
  }
}
