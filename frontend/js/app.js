document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const submitBtn = document.getElementById("submitBtn");

  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<div class="spinner"></div> Отправка...';

  try {
    const formData = {
      name: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      message: document.getElementById("message").value,
    };

    const response = await fetch("/.netlify/functions/submit-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.error || "Ошибка сервера");

    // Показываем красивый toast
    showToast("success", result.message);
    document.getElementById("contactForm").reset();
  } catch (error) {
    showToast("error", error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
});

// Функция для отображения уведомлений
function showToast(type, message) {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}
