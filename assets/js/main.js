// Nav: solid background after scrolling past the hero top
const nav = document.querySelector(".nav");
const onScroll = () => nav.classList.toggle("nav--solid", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Mobile menu
const burger = document.getElementById("navBurger");
const links = document.getElementById("navLinks");
burger.addEventListener("click", () => links.classList.toggle("open"));
links.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => links.classList.remove("open"))
);

// Scroll-reveal
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal--visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 70}ms`;
  revealObserver.observe(el);
});

// Animated stat counters
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      countObserver.unobserve(el);
      const target = parseInt(el.dataset.count, 10);
      const duration = 1600;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  },
  { threshold: 0.6 }
);
document.querySelectorAll(".stat__num").forEach((el) => countObserver.observe(el));

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Contact form → Formspree
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
let formStatusKey = null;

function setFormStatus(key, type) {
  formStatusKey = key;
  formStatus.textContent = key ? window.GP_I18N.t(key) : "";
  formStatus.className = key ? `form-status form-status--${type}` : "form-status";
}

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.disabled = true;
  setFormStatus("contact.sending", "sending");

  try {
    const res = await fetch(contactForm.action, {
      method: "POST",
      body: new FormData(contactForm),
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error("formspree error");
    setFormStatus("contact.success", "ok");
    contactForm.reset();
  } catch {
    setFormStatus("contact.error", "err");
  } finally {
    btn.disabled = false;
  }
});

window.GP_I18N.onChange(() => {
  if (formStatusKey) formStatus.textContent = window.GP_I18N.t(formStatusKey);
});
