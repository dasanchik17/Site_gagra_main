require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

// Настройки CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://abkhaziatourism.ru",
  "http://127.0.0.1:5500", // Добавлен адрес фронтенда
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Доступ запрещен политикой CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"], // Явно разрешаем методы
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Обработка предварительных запросов OPTIONS
app.options("*", cors());

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Настройка Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// Валидация телефона
const validateRequest = (data) => {
  const errors = [];
  if (!data.name?.trim()) errors.push("Не указано имя");
  if (!data.phone?.match(/^\+7\d{10}$/))
    errors.push("Неверный формат телефона");
  return errors;
};

// Обработчик формы
app.post("/send-form", async (req, res) => {
  try {
    const errors = validateRequest(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(", ") });
    }

    const mailOptions = {
      from: `Сайт <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_RECIPIENT || process.env.GMAIL_USER,
      subject: "Новая заявка",
      text: [
        `Имя: ${req.body.name}`,
        `Телефон: ${req.body.phone}`,
        `Сообщение: ${req.body.message || "Не указано"}`,
      ].join("\n"),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Письмо отправлено:", info.messageId);
    res.json({ message: "Сообщение успешно отправлено!" });
  } catch (error) {
    console.error("Ошибка сервера:", error);
    res.status(500).json({
      error: "Произошла ошибка при отправке. Попробуйте позже.",
    });
  }
});

// Все остальные запросы
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Запуск сервера
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
