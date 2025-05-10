// Прокрутка к якорям
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });

      // Закрытие мобильного меню
      const navbarCollapse = document.querySelector(".navbar-collapse.show");
      if (navbarCollapse) new bootstrap.Collapse(navbarCollapse).hide();
    }
  });
});

// Динамический навбар
window.addEventListener("scroll", () => {
  document
    .querySelector(".navbar")
    .classList.toggle("scrolled", window.scrollY > 100);
});

// Кнопка "Наверх"
const backToTopButton = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  backToTopButton.classList.toggle("visible", window.scrollY > 300);
});

backToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Галерея изображений
const galleryModal = document.getElementById("galleryModal");
if (galleryModal) {
  galleryModal.addEventListener("show.bs.modal", (event) => {
    document.getElementById("modalImage").src = event.relatedTarget.dataset.img;
  });
}

// Отправка формы (исправленная версия)
document
  .getElementById("contactForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const submitBtn = document.getElementById("submitBtn");

    try {
      // Валидация телефона
      const rawPhone = form.phone.value.replace(/\D/g, "");
      if (!/^7\d{10}$/.test(rawPhone)) {
        throw new Error("Номер должен начинаться с 7 и содержать 11 цифр");
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
      <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
      Отправка...
    `;

      // Отправка данных
      const response = await fetch("http://localhost:3001/send-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json", // Добавлен заголовок Accept
        },
        body: JSON.stringify({
          name: form.name.value.trim(),
          phone: `+7${rawPhone.slice(1)}`,
          message: form.message.value.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка сервера");
      }

      alert(data.message);
      form.reset();
    } catch (error) {
      console.error("Ошибка:", error);
      alert(error.message);
      form.phone.focus();
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Отправить сообщение";
    }
  });
