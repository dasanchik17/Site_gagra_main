const fetch = require("node-fetch");

exports.handler = async (event) => {
  // Разрешаем CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST",
  };

  // Обрабатываем OPTIONS-запрос
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "CORS разрешены" }),
    };
  }

  try {
    const data = JSON.parse(event.body);

    // Здесь можно добавить:
    // 1. Отправку email через SendGrid/Mailgun
    // 2. Сохранение в Google Sheets
    // 3. Интеграцию с Telegram-ботом

    // Пример логирования данных
    console.log("Получены данные:", data);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Сообщение успешно отправлено!",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: "Ошибка сервера",
      }),
    };
  }
};
