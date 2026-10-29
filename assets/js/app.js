(function () {
  "use strict";

  const root = document.documentElement;
  const body = document.body;

  // Theme: saved choice, else system preference
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };
  const themeBtn = document.getElementById("themeToggle");
  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    themeBtn.innerHTML = t === "dark" ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon-stars"></i>';
  }
  applyTheme(store.get("theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  themeBtn.addEventListener("click", function () {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    store.set("theme", next);
  });

  // Mobile nav
  const navToggle = document.getElementById("navToggle");
  navToggle.addEventListener("click", function () {
    body.classList.toggle("nav-open");
    navToggle.innerHTML = body.classList.contains("nav-open") ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-list"></i>';
  });
  document.querySelectorAll(".nav a").forEach(function (a) {
    a.addEventListener("click", function () {
      body.classList.remove("nav-open");
      navToggle.innerHTML = '<i class="bi bi-list"></i>';
    });
  });

  // Header state, scroll progress, back-to-top, active link
  const header = document.querySelector(".site-header");
  const progress = document.querySelector(".scroll-progress");
  const toTop = document.querySelector(".to-top");
  const links = Array.from(document.querySelectorAll(".nav a"));
  const sections = links.map(function (a) { return document.querySelector(a.getAttribute("href")); });
  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle("scrolled", y > 20);
    toTop.classList.toggle("show", y > 600);
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    let current = 0;
    sections.forEach(function (s, i) { if (s && s.offsetTop - 140 <= y) current = i; });
    links.forEach(function (a, i) { a.classList.toggle("active", i === current); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Typing effect
  const typed = document.getElementById("typed");
  const words = ["Full-Stack .NET Developer", "SaaS Builder", "Manager IT (Software)", "Freelance Software Engineer"];
  let w = 0, c = 0, deleting = false;
  function tick() {
    const word = words[w];
    c += deleting ? -1 : 1;
    typed.textContent = word.slice(0, c);
    let delay = deleting ? 40 : 80;
    if (!deleting && c === word.length) { deleting = true; delay = 1800; }
    else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 300; }
    setTimeout(tick, delay);
  }
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) typed.textContent = words[0];
  else tick();

  // Count-up stats
  const counters = document.querySelectorAll("[data-count]");
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      const el = e.target, end = +el.dataset.count, suffix = el.dataset.suffix || "";
      const start = performance.now();
      (function step(now) {
        const p = Math.min((now - start) / 1200, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(step);
      })(start);
      io.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(function (el) { io.observe(el); });

  // Contact form (Formspree, no page reload)
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Sending...';
    status.className = "form-status";
    fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
      .then(function (r) {
        if (!r.ok) throw new Error();
        form.reset();
        status.textContent = "Thanks! Your message has been sent. I'll reply soon.";
        status.className = "form-status ok";
      })
      .catch(function () {
        status.textContent = "Something went wrong. Please email me directly at mhassaanarain404@gmail.com.";
        status.className = "form-status err";
      })
      .finally(function () {
        btn.disabled = false;
        btn.innerHTML = '<i class="bi bi-send"></i> Send Message';
      });
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  if (window.AOS) AOS.init({ duration: 700, easing: "ease-out-cubic", once: true, offset: 60 });
})();
