const header = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");
const parallaxImage = document.querySelector("[data-parallax]");
const depthItems = document.querySelectorAll("[data-depth]");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-counter]");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const timeline = document.getElementById("timeline");
const projectModal = document.getElementById("projectModal");
const modalImage = document.getElementById("modalImage");
const modalTag = document.getElementById("modalTag");
const modalTitle = document.getElementById("modalTitle");
const modalClose = document.querySelector(".modal-close");
const cursorGlow = document.getElementById("cursorGlow");
const whatsappNumber = "527717296790";
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let ticking = false;

function updateHeader() {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 26);
  document.body.classList.toggle("show-floating", window.scrollY > 260);
}

function updateScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  document.documentElement.style.setProperty("--page-progress", progress.toFixed(4));
}

function updateParallax() {
  if (prefersReducedMotion) return;

  if (parallaxImage) {
    const speed = Number(parallaxImage.dataset.parallax) || 0.12;
    const offset = window.scrollY * speed;
    parallaxImage.style.transform = `translate3d(0, ${offset}px, 0) scale(1.06)`;
  }

  depthItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const depth = Number(item.dataset.depth) || 0.08;
    const shift = (window.innerHeight / 2 - rect.top) * depth;
    item.style.setProperty("--depth-shift", `${shift.toFixed(1)}px`);
  });
}

function updateTimelineProgress() {
  if (!timeline) return;
  const rect = timeline.getBoundingClientRect();
  const start = window.innerHeight * 0.72;
  const total = rect.height + window.innerHeight * 0.12;
  const progress = Math.min(Math.max((start - rect.top) / total, 0), 1);
  timeline.style.setProperty("--timeline-progress", `${(progress * 100).toFixed(2)}%`);
}

function onScrollFrame() {
  updateHeader();
  updateScrollProgress();
  updateParallax();
  updateTimelineProgress();
  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(onScrollFrame);
    ticking = true;
  }
});

window.addEventListener("resize", () => {
  updateScrollProgress();
  updateTimelineProgress();
});

if (cursorGlow && !prefersReducedMotion) {
  window.addEventListener("pointermove", (event) => {
    document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
    document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
  });
}

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu?.classList.remove("open");
    navToggle?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll(".stagger").forEach((group) => {
  group.querySelectorAll(".reveal").forEach((item, index) => {
    item.style.setProperty("--delay", `${index * 90}ms`);
  });
});

document.querySelectorAll(".command-track").forEach((track) => {
  track.innerHTML += track.innerHTML;
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
);

revealItems.forEach((item) => revealObserver.observe(item));

function animateCounter(element) {
  const target = Number(element.dataset.counter);
  const duration = 1500;
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(target * eased);

    if (progress < 1) {
      window.requestAnimationFrame(tick);
    }
  }

  window.requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.45 }
);

counters.forEach((counter) => counterObserver.observe(counter));

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !shouldShow);
      if (shouldShow && !prefersReducedMotion) {
        card.animate(
          [
            { opacity: 0, transform: "translateY(28px) scale(0.96)" },
            { opacity: 1, transform: "translateY(0) scale(1)" }
          ],
          { duration: 420, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
        );
      }
    });
  });
});

function attachTilt(card, strength = 6) {
  if (prefersReducedMotion) return;

  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--tilt-x", `${(-y * strength).toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${(x * strength).toFixed(2)}deg`);
  });

  card.addEventListener("mouseleave", () => {
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  });
}

document.querySelectorAll(".tilt-card").forEach((card) => attachTilt(card, card.classList.contains("project-card") ? 8 : 5));

document.querySelectorAll(".magnet").forEach((element) => {
  if (prefersReducedMotion) return;

  element.addEventListener("mousemove", (event) => {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    element.style.transform = `translate(${x * 0.12}px, ${y * 0.16}px)`;
  });

  element.addEventListener("mouseleave", () => {
    element.style.transform = "";
  });
});

function openProjectModal(card) {
  if (!projectModal || !modalImage || !modalTag || !modalTitle) return;
  const image = card.querySelector("img");
  const tag = card.querySelector(".project-info span");
  const title = card.querySelector(".project-info h3");

  modalImage.src = image.src;
  modalImage.alt = image.alt;
  modalTag.textContent = tag.textContent;
  modalTitle.textContent = title.textContent;
  projectModal.classList.add("open");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeProjectModal() {
  if (!projectModal) return;
  projectModal.classList.remove("open");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

projectCards.forEach((card) => {
  card.addEventListener("click", () => openProjectModal(card));
});

modalClose?.addEventListener("click", closeProjectModal);
projectModal?.addEventListener("click", (event) => {
  if (event.target === projectModal) {
    closeProjectModal();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && projectModal?.classList.contains("open")) {
    closeProjectModal();
  }
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    });
  },
  { threshold: 0.35 }
);

document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

function setFieldError(field, message) {
  const row = field.closest(".form-row");
  const error = row.querySelector(".error-message");
  row.classList.toggle("is-invalid", Boolean(message));
  error.textContent = message;
}

function validateForm(form) {
  let isValid = true;
  const fields = {
    name: form.elements.name,
    company: form.elements.company,
    phone: form.elements.phone,
    email: form.elements.email,
    message: form.elements.message
  };

  Object.values(fields).forEach((field) => setFieldError(field, ""));

  if (fields.name.value.trim().length < 3) {
    setFieldError(fields.name, "Ingresa un nombre valido.");
    isValid = false;
  }

  if (fields.company.value.trim().length < 2) {
    setFieldError(fields.company, "Ingresa el nombre de la empresa.");
    isValid = false;
  }

  if (!/^[0-9+\s()-]{7,}$/.test(fields.phone.value.trim())) {
    setFieldError(fields.phone, "Ingresa un telefono valido.");
    isValid = false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value.trim())) {
    setFieldError(fields.email, "Ingresa un correo valido.");
    isValid = false;
  }

  if (fields.message.value.trim().length < 12) {
    setFieldError(fields.message, "Cuentanos un poco mas del proyecto.");
    isValid = false;
  }

  return isValid;
}

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "";

  if (!validateForm(contactForm)) {
    formStatus.textContent = "Revisa los campos marcados antes de enviar.";
    return;
  }

  const data = new FormData(contactForm);
  const message = [
    "Hola INTEGRA Industrial Solutions.",
    "Me gustaria solicitar atencion para un proyecto industrial.",
    "",
    "Datos de contacto:",
    `Nombre: ${data.get("name")}`,
    `Empresa: ${data.get("company")}`,
    `Telefono: ${data.get("phone")}`,
    `Correo: ${data.get("email")}`,
    "",
    "Detalle del proyecto o servicio requerido:",
    `${data.get("message")}`,
    "",
    "Quedo atento a su respuesta para coordinar diagnostico, visita tecnica o cotizacion."
  ].join("\n");

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank", "noopener");
  formStatus.textContent = "Se abrio WhatsApp con tu solicitud lista para enviar.";
  contactForm.reset();
});

contactForm?.querySelectorAll("input, textarea").forEach((field) => {
  field.addEventListener("input", () => {
    setFieldError(field, "");
    formStatus.textContent = "";
  });
});

updateHeader();
updateScrollProgress();
updateParallax();
updateTimelineProgress();
