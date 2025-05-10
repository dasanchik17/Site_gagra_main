require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));

// Настройка Nodemailer с переменными окружения
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // Данные из .env
    pass: process.env.GMAIL_PASSWORD,
  },
});

// Обработка POST-запроса
app.post("/send-form", (req, res) => {
  const { name, phone, message } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: "Не хватает name или phone" });
  }

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER,
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

// Обработка GET-запросов
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Порт
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
