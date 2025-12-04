/* ===========================
   script.js — Premium, modular, final
   =========================== */

/* ---------- helpers ---------- */
const $  = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* ---------- EmailJS init (public key) ---------- */
if (window.emailjs && typeof emailjs.init === 'function') {
  try { emailjs.init('jx3isFO17H8uIbius'); }
  catch(e){ console.warn('EmailJS init failed', e); }
}

/* ---------- custom cursor (small) ---------- */
const cursor = document.getElementById("cursor");
if (cursor){
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  const smoothness = 0.12;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * smoothness;
    cursorY += (mouseY - cursorY) * smoothness;
    cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  const hoverTargets = "a, button, .btn, .card, .filter";
  document.querySelectorAll(hoverTargets).forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("cursor-hover"));
  });
}

/* ==========================
   Typing — continuous loop
   ========================== */
const typedEl = $('#typed-text');
const caretEl = $('#hero-caret');
const typingWords = [
  "Modern Graphic Designer",
  "Brand Identity Specialist",
  "UI Layout & Visual Designer",
  "Motion & Promo Visuals"
];

let wordIndex = 0, charIndex = 0, deleting = false;
(function typingLoop(){
  if (!typedEl) return;
  const w = typingWords[wordIndex];
  if (!deleting) {
    typedEl.textContent = w.slice(0, ++charIndex);
    if (charIndex > w.length) {
      deleting = true;
      setTimeout(typingLoop, 1000);
      return;
    }
  } else {
    typedEl.textContent = w.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % typingWords.length;
    }
  }
  setTimeout(typingLoop, deleting ? 45 : 110);
})();

// show/hide caret only when hero is visible
const hero = $('#home');
if (caretEl && hero) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => caretEl.style.opacity = en.isIntersecting ? '1' : '0');
  }, { threshold: 0.35 });
  io.observe(hero);
}

/* ==========================
   Scroll Arrow behavior
   ========================== */
const scrollArrow = document.getElementById("scroll-arrow");
const heroSection = document.getElementById("home");
const nextSection = document.getElementById("portfolio");

/* Show arrow */
function showArrow() {
  scrollArrow.classList.add("show");
  scrollArrow.classList.remove("hide");
}

/* Hide arrow */
function hideArrow() {
  scrollArrow.classList.add("hide");
  scrollArrow.classList.remove("show");
}

/* Click → scroll to next section */
scrollArrow.addEventListener("click", () => {
  nextSection.scrollIntoView({ behavior: "smooth" });
  hideArrow();
});

/* Show arrow ONLY when hero is in view */
const heroObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        showArrow();
      } else {
        hideArrow();
      }
    });
  },
  { threshold: 0.55 }
);

heroObserver.observe(heroSection);/* ==========================
   Floating hero title parallax
   ========================== */
const floatTitle = $('#float-title');
if (floatTitle) {
  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 8;
    floatTitle.style.transform = `translate(${x}px, ${y}px)`;
  });
}

/* ==========================
   Portfolio filter + underline + stagger reveal
   ========================== */
const filters = $$('.filter');
const underline = $('#filter-underline');
const cards = $$('.card');

function moveUnderlineTo(btn) {
  if (!btn || !underline) return;
  underline.style.width = `${btn.offsetWidth}px`;
  underline.style.left = `${btn.offsetLeft}px`;
}

// initial underline
if (filters.length && underline) {
  const active = document.querySelector('.filter.active') || filters[0];
  moveUnderlineTo(active);
  window.addEventListener('resize', ()=> moveUnderlineTo(document.querySelector('.filter.active') || filters[0]));
}

filters.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    filters.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    moveUnderlineTo(btn);

    const f = btn.dataset.filter;
    cards.forEach((card,i)=>{
      if (f === 'all' || card.dataset.category === f) {
        card.style.display = 'block';
        card.classList.remove('hidden');
        setTimeout(()=> card.classList.add('revealed'), i * 90);
      } else {
        card.classList.remove('revealed');
        card.classList.add('hidden');
        setTimeout(()=> card.style.display = 'none', 420);
      }
    });
  });
});

/* On first load, stagger reveal when portfolio enters view */
if (portfolio){
  const portfolioObserver = new IntersectionObserver((entries, obs)=>{
    entries.forEach(entry=>{
      if (entry.isIntersecting) {
        cards.forEach((card,i)=>{
          card.classList.add('hidden');
          setTimeout(()=> {
            card.style.display = 'block';
            card.classList.remove('hidden');
            card.classList.add('revealed');
          }, i*120);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  portfolioObserver.observe(portfolio);
}

/* 3D tilt on card mousemove (subtle) */
cards.forEach(card=>{
  card.addEventListener('mousemove', (e)=>{
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateX(${ -py * 6 }deg) rotateY(${ px * 8 }deg) translateY(-6px) scale(1.02)`;
  });
  card.addEventListener('mouseleave', ()=> {
    card.style.transform = '';
  });
});

/* ==========================
   Lightbox
   ========================== */
let lightbox = null;
function openLightbox(src, alt='') {
  if (lightbox) return;
  lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `<button class="lb-close" aria-label="Close">&times;</button><img src="${src}" alt="${alt}">`;
  document.body.appendChild(lightbox);
  document.body.style.overflow = 'hidden';
  lightbox.querySelector('.lb-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', escLB);
}
function closeLightbox(){
  if (!lightbox) return;
  lightbox.remove();
  lightbox = null;
  document.body.style.overflow = '';
  document.removeEventListener('keydown', escLB);
}
function escLB(e){ if (e.key === 'Escape') closeLightbox(); }

$$('.card').forEach(card=>{
  card.addEventListener('click', ()=> {
    const img = card.querySelector('img');
    if (img && img.src) openLightbox(img.src, img.alt || '');
  });
});

/* ==========================
   Smooth anchor nav
   ========================== */
$$('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const href = a.getAttribute('href');
    if (href && href.length > 1) {
      const tgt = document.querySelector(href);
      if (tgt) {
        e.preventDefault();
        tgt.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

/* ==========================
   Contact form (EmailJS send + auto-reply + auto-clear)
   ========================== */
emailjs.init("jx3isFO17H8uIbius"); // Your Public Key

const contactForm = document.getElementById("contactForm");
const statusMsg   = document.getElementById("statusMsg");

if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name    = document.getElementById("name").value.trim();
    const email   = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Simple validation
    if (!name || !email || !message) {
      statusMsg.textContent = "Please fill out all fields.";
      statusMsg.style.color = "red";
      return;
    }

    statusMsg.textContent = "Sending…";
    statusMsg.style.color = "var(--accent)";

    // Parameters MUST match EmailJS template variable names
    const params = {
      from_name: name,
      reply_to: email,
      message: message
    };

    try {

      /* STEP 1 → Send to OWNER (template_mcod6qm) */
      await emailjs.send(
        "service_d34z2l8",
        "template_mcod6qm",
        params
      );

      /* STEP 2 → Auto-Reply to Client (template_p0u4mwf) */
      await emailjs.send(
        "service_d34z2l8",
        "template_p0u4mwf",
        params
      );

      /* SUCCESS RESPONSE */
      statusMsg.textContent = "Message sent successfully!";
      statusMsg.style.color = "var(--accent)";

      contactForm.reset(); // Auto-clear fields

      setTimeout(() => {
        statusMsg.textContent = "";
      }, 4000);

    } catch (err) {

      console.error("EmailJS Error:", err);

      statusMsg.textContent =
        "Sending failed. Please check EmailJS configuration.";
      statusMsg.style.color = "red";
    }
  });
}


/* ======================
   Booking System (Quick booking on index)
   ====================== */

const timeSlotsContainer = document.getElementById("timeSlots");
const bookingStatus      = document.getElementById("bookingStatus");
const confirmButton      = document.getElementById("confirmBooking");
let selectedTime         = "";
let selectedDate         = "";

const slots = [
  "10:00 AM","11:00 AM","12:00 PM",
  "2:00 PM","3:00 PM","4:00 PM",
  "6:00 PM","8:00 PM"
];

if (timeSlotsContainer){
  // Generate Time Buttons
  slots.forEach(t => {
    const btn = document.createElement("button");
    btn.className = "time-slot";
    btn.type = "button";
    btn.textContent = t;
    
    btn.addEventListener("click", () => {
      document.querySelectorAll(".time-slot").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedTime = t;
    });

    timeSlotsContainer.appendChild(btn);
  });
}

if (confirmButton){
  confirmButton.addEventListener("click", () => {
    const dateInput = document.getElementById("bookingDate");
    selectedDate = dateInput ? dateInput.value : "";

    if (!selectedDate || !selectedTime) {
      bookingStatus.textContent = "Please select a date and time.";
      return;
    }

    bookingStatus.textContent = `Booking Confirmed for ${selectedDate} at ${selectedTime}.`;
    bookingStatus.style.color = "var(--accent)";
  });
}

/* ======================
   Loader hide on window load
   ====================== */
const loader = $('#loader');
window.addEventListener('load', () => {
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('loader-hide');
  }, 500);
});

/* ======================
   Theme Switcher (Dark / Light)
   ====================== */
const themeToggleBtn = $('#themeToggle');
const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

function applyTheme(theme){
  document.body.dataset.theme = theme;
  if (themeIcon){
    themeIcon.className = theme === 'light'
      ? 'fa-regular fa-sun'
      : 'fa-regular fa-moon';
  }
}

const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

themeToggleBtn && themeToggleBtn.addEventListener('click', () => {
  const newTheme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', newTheme);
  applyTheme(newTheme);
});

/* ======================
   Fullscreen Menu Toggle (mobile)
   ====================== */
const menuToggle = $('#menuToggle');
const fullscreenMenu = $('#fullscreenMenu');

if (menuToggle && fullscreenMenu){
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('open');
    fullscreenMenu.classList.toggle('open');
  });

  fullscreenMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      fullscreenMenu.classList.remove('open');
      menuToggle.classList.remove('open');
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape'){
      fullscreenMenu.classList.remove('open');
      menuToggle.classList.remove('open');
    }
  });
}

/* ======================
   Sticky Side Navigation Active Glow
   ====================== */
const sectionIds = ["home","portfolio","services","pricing","booking","blog","contact"];
const navDots = document.querySelectorAll(".side-nav a");

window.addEventListener("scroll", () => {
  let index = sectionIds.length;

  while(--index && document.getElementById(sectionIds[index]) &&
        window.scrollY + 200 < document.getElementById(sectionIds[index]).offsetTop) {}

  navDots.forEach(dot => dot.classList.remove("active"));
  if (navDots[index]) navDots[index].classList.add("active");
});

if (navDots[0]) navDots[0].classList.add("active");

/* ---------------------------------------
   GOOGLE SHEET WEBHOOK (Pricing + Booking + Contact)
---------------------------------------- */
const WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbwqfHOLP1U7Dr7I9qYSAx6QGarJxAyhhgDOA4PkOLCRjr37TA8UyaNpHJ6LFf1zgA8C/exec";

/* ---- Pricing Auto Save + Redirect ---- */
$$(".price-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const plan = btn.dataset.plan || btn.parentElement.querySelector("h3").innerText;

    // Save selected plan to Google Sheet
    fetch(WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({ type: "pricing", plan })
    });

    // Redirect to booking page with plan in URL
    window.location.href = "booking.html?plan=" + encodeURIComponent(plan);
  });
});

/* ---- Quick Booking Auto Save (index page) ---- */
if (confirmButton){
  confirmButton.addEventListener("click", () => {
    const dateInput = document.getElementById("bookingDate");
    const date = dateInput ? dateInput.value : "";

    if (!date || !selectedTime) {
      return; // already handled message above
    }

    fetch(WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({
        type: "booking",
        date,
        time: selectedTime
      })
    });
  });
}

/* ---- Contact Auto Save ---- */
contactForm?.addEventListener("submit", () => {
  const nameVal    = $("#name")?.value || "";
  const emailVal   = $("#email")?.value || "";
  const messageVal = $("#message")?.value || "";

  fetch(WEBHOOK_URL, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify({
      type: "contact",
      name: nameVal,
      email: emailVal,
      message: messageVal
    })
  });
});
