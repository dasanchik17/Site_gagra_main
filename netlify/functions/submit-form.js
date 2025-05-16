const fetch = require("node-fetch");

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {
    const data = JSON.parse(event.body);

    // Отправка в Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot6542482262:AAESBr-ge4kVmSVUOo8OFRj0D4k_ZfCGRMc/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: "6297870983",
          text: `🔥 Новая заявка!\n\n👤 Имя: ${data.name}\n📞 Телефон: ${data.phone}\n📝 Сообщение: ${data.message}`,
        }),
      }
    );

    if (!telegramResponse.ok) {
      const error = await telegramResponse.json();
      throw new Error(`Telegram: ${error.description}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Сообщение отправлено в Telegram!",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
};
