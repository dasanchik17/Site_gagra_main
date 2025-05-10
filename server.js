const express = require("express");
const path = require("path");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend"))); // Раздача статики

// Настройка Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "renatdasania8@gmail.com",
    pass: "lhez jffg zonc dcsi",
  },
});

// Обработка POST-запроса для формы
app.post("/send-form", (req, res) => {
  const { name, phone, message } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: "Не хватает name или phone" });
  }

  const mailOptions = {
    from: "renatdasania8@gmail.com",
    to: "renatdasania8@gmail.com",
    subject: "Новая заявка с сайта",
    text: `Имя: ${name}\nТелефон: ${phone}\nСообщение: ${
      message || "Не указано"
    }`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Ошибка отправки:", error);
      return res.status(500).json({ error: "Ошибка при отправке письма" });
    }
    res.json({ message: "Сообщение отправлено!" });
  });
});

// Обработка всех GET-запросов (для SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Порт для хостинга или локального запуска
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
