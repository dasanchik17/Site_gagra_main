// Прокрутка к якорям
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
      });

      // Закрываем мобильное меню после клика
      const navbarCollapse = document.querySelector(".navbar-collapse");
      if (navbarCollapse.classList.contains("show")) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
        bsCollapse.hide();
      }
    }
  });
});

// Изменение навбара при скролле
const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", function () {
  if (window.scrollY > 100) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Кнопка "Наверх"
const backToTopButton = document.getElementById("backToTop");
window.addEventListener("scroll", function () {
  if (window.scrollY > 300) {
    backToTopButton.classList.add("visible");
  } else {
    backToTopButton.classList.remove("visible");
  }
});

backToTopButton.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Галерея изображений
const galleryModal = document.getElementById("galleryModal");
if (galleryModal) {
  galleryModal.addEventListener("show.bs.modal", function (event) {
    const button = event.relatedTarget;
    const imgSrc = button.getAttribute("data-img");
    const modalImage = document.getElementById("modalImage");
    modalImage.src = imgSrc;
  });
}

// Backend часть
async function sendForm(data) {
  try {
    const response = await fetch("http://localhost:3001/send-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при отправке формы:", error);
    throw error;
  }
}

// Единственный обработчик формы
document
  .getElementById("contactForm")
  ?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById("submitBtn");
    const form = e.target;

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Отправка...';

      const formData = {
        name: form.elements.name.value,
        phone: form.elements.phone.value, // Изменил с email на phone
        message: form.elements.message.value,
      };

      const result = await sendForm(formData);
      alert(result.message || "Форма успешно отправлена!");
      form.reset();
    } catch (error) {
      alert("Ошибка при отправке: " + error.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = "Отправить сообщение";
    }
  });
