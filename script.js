const whatsappNumber = "";
const whatsappMessages = {
  quick: "Olá! Gostaria de agendar uma consulta com a Dra. Eduarda Campos.",
  booking:
    "Olá! Gostaria de agendar uma consulta com a Dra. Eduarda Campos.\n\nTenho interesse em:\n( ) Consulta presencial\n( ) Consulta online\n\nMeu principal objetivo com a consulta é:",
  presencial:
    "Olá! Gostaria de agendar uma consulta presencial com a Dra. Eduarda Campos.\n\nMeu principal objetivo com a consulta é:",
  teleconsulta:
    "Olá! Gostaria de agendar uma consulta online com a Dra. Eduarda Campos.\n\nMeu principal objetivo com a consulta é:",
  genero:
    "Olá! Gostaria de conversar sobre acompanhamento em Terapia de Afirmação de Gênero com a Dra. Eduarda Campos.\n\nMeu principal objetivo com a consulta é:",
};

document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
  const messageKey = link.dataset.whatsappLink;
  const message = whatsappMessages[messageKey] || whatsappMessages.quick;
  const baseUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "https://wa.me/";

  link.href = `${baseUrl}?text=${encodeURIComponent(message)}`;
});

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  const formStatus = document.querySelector("#contact-form-status");
  const fields = {
    name: contactForm.elements["name"],
    phone: contactForm.elements["phone"],
    goal: contactForm.elements["goal"],
  };

  const setFieldError = (field, message) => {
    const errorElement = document.querySelector(`#${field.id}-error`);

    field.setAttribute("aria-invalid", message ? "true" : "false");

    if (errorElement) {
      errorElement.textContent = message;
    }
  };

  const validateContactForm = () => {
    let isValid = true;

    if (!fields.name.value.trim()) {
      setFieldError(fields.name, "Informe seu nome.");
      isValid = false;
    } else {
      setFieldError(fields.name, "");
    }

    if (!fields.phone.value.trim()) {
      setFieldError(fields.phone, "Informe seu WhatsApp.");
      isValid = false;
    } else {
      setFieldError(fields.phone, "");
    }

    if (!fields.goal.value.trim()) {
      setFieldError(fields.goal, "Conte brevemente o motivo da consulta.");
      isValid = false;
    } else {
      setFieldError(fields.goal, "");
    }

    return isValid;
  };

  Object.values(fields).forEach((field) => {
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") {
        setFieldError(field, "");
      }
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateContactForm()) {
      const firstInvalidField = Object.values(fields).find(
        (field) => field.getAttribute("aria-invalid") === "true"
      );

      formStatus.textContent = "Revise os campos destacados para continuar.";
      firstInvalidField?.focus();
      return;
    }

    const message = `Olá! Gostaria que a equipe entrasse em contato comigo pelo WhatsApp.\n\nNome: ${fields.name.value.trim()}\nWhatsApp: ${fields.phone.value.trim()}\nPrincipal objetivo com a consulta: ${fields.goal.value.trim()}`;
    const baseUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "https://wa.me/";

    formStatus.textContent = "Abrindo WhatsApp com sua mensagem preenchida.";
    window.open(`${baseUrl}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  });
}

const faqItems = document.querySelectorAll(".faq-item");

if (faqItems.length) {
  const openFaqItem = (item) => {
    item.classList.remove("is-closing");
    item.classList.add("is-opening");
    item.open = true;

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        item.classList.remove("is-opening");
      });
    });
  };

  const closeFaqItem = (item) => {
    if (!item.open || item.classList.contains("is-closing")) {
      return;
    }

    const answer = item.querySelector(".faq-answer");

    if (!answer) {
      item.open = false;
      return;
    }

    item.classList.remove("is-opening");
    item.classList.add("is-closing");

    let fallbackTimer;
    let isFinished = false;

    const finishClosing = () => {
      if (isFinished) {
        return;
      }

      isFinished = true;
      window.clearTimeout(fallbackTimer);
      answer.removeEventListener("transitionend", handleTransitionEnd);
      item.open = false;
      item.classList.remove("is-closing", "is-opening");
    };

    const handleTransitionEnd = (event) => {
      if (event.target === answer && event.propertyName === "grid-template-rows") {
        finishClosing();
      }
    };

    answer.addEventListener("transitionend", handleTransitionEnd);
    fallbackTimer = window.setTimeout(finishClosing, 360);
  };

  faqItems.forEach((item) => {
    const summary = item.querySelector("summary");

    summary?.addEventListener("click", (event) => {
      event.preventDefault();

      const shouldCloseCurrent = item.open && !item.classList.contains("is-closing");

      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          closeFaqItem(otherItem);
        }
      });

      if (shouldCloseCurrent) {
        closeFaqItem(item);
        return;
      }

      openFaqItem(item);
    });
  });
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
