/* ===========================
   script.js — Premium, modular
   =========================== */

/* ---------- helpers ---------- */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* ---------- EmailJS init (public key) ---------- */
if (window.emailjs && typeof emailjs.init === 'function') {
  try { emailjs.init('jx3isFO17H8uIbius'); } catch(e){ console.warn('EmailJS init failed', e); }
}

/* ---------- custom cursor (small) ---------- */
const cursor = document.getElementById("cursor");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let cursorX = mouseX;
let cursorY = mouseY;

// Smooth trailing speed
const smoothness = 0.12;

// Track mouse
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Perfectly smooth lerp animation
function animateCursor() {
  cursorX += (mouseX - cursorX) * smoothness;
  cursorY += (mouseY - cursorY) * smoothness;

  cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;

  requestAnimationFrame(animateCursor);
}
animateCursor();

/* Hover effect */
const hoverTargets = "a, button, .btn, .card, .filter";

document.querySelectorAll(hoverTargets).forEach((el) => {
  el.addEventListener("mouseenter", () => cursor.classList.add("cursor-hover"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("cursor-hover"));
});

/* ==========================
   Typing — continuous loop
   ========================== */
const typedEl = $('#typed-text');
const caretEl  = $('#hero-caret');
const typingWords = [
  "Modern Graphic Designer",
  "Brand Identity Specialist",
  "UI Layout & Visual Designer",
  "Motion & Promo Visuals"
];

let wordIndex = 0, charIndex = 0, deleting = false;
(function typingLoop(){
  const w = typingWords[wordIndex];
  if (!deleting) {
    typedEl && (typedEl.textContent = w.slice(0, ++charIndex));
    if (charIndex > w.length) {
      deleting = true;
      setTimeout(typingLoop, 1000);
      return;
    }
  } else {
    typedEl && (typedEl.textContent = w.slice(0, --charIndex));
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
const scrollArrow = $('#scroll-arrow');
const portfolio = $('#portfolio');

function showArrow(){ scrollArrow.classList.remove('hide'); scrollArrow.classList.add('show'); }
function hideArrow(){ scrollArrow.classList.remove('show'); scrollArrow.classList.add('hide'); }

if (scrollArrow && portfolio && hero) {
  // click scroll
  scrollArrow.addEventListener('click', ()=>{
    portfolio.scrollIntoView({ behavior: 'smooth', block: 'start' });
    hideArrow(); // hide immediately after click
  });

  // intersection to show/hide arrow depending on hero visibility
  const heroObserver = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if (en.isIntersecting && en.intersectionRatio > 0.45) showArrow();
      else hideArrow();
    });
  }, { threshold: [0, 0.25, 0.45, 0.6] });

  heroObserver.observe(hero);

  // initial check (in case)
  const rect = hero.getBoundingClientRect();
  if (rect.bottom > window.innerHeight * 0.45) showArrow(); else hideArrow();
}


/* ==========================
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
    // animate hide/show with stagger
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

if (portfolio) portfolioObserver.observe(portfolio);

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
    if (href.length > 1) {
      e.preventDefault();
      const tgt = document.querySelector(href);
      if (tgt) tgt.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ==========================
   Contact form (EmailJS send + auto-reply)
   ========================== */
const contactForm = document.getElementById("contactForm");
const statusMsg = document.getElementById("statusMsg");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      statusMsg.textContent = "Please fill out all fields.";
      return;
    }

    statusMsg.textContent = "Sending…";

    const params = {
      from_name: name,
      reply_to: email,
      message: message
    };

    // ✔ Send to OWNER (template_mcod6qm)
    emailjs
      .send("service_d34z2l8", "template_mcod6qm", params)
      .then(() => {
        // ✔ Send AUTO REPLY to visitor (template_p0u4mwf)
        return emailjs.send(
          "service_d34z2l8",
          "template_p0u4mwf",
          params
        );
      })
      .then(() => {
        statusMsg.textContent = "Message sent! Check your email.";
        contactForm.reset();
        setTimeout(() => (statusMsg.textContent = ""), 5000);
      })
      .catch((err) => {
        console.error("EmailJS Error:", err);
        statusMsg.textContent = "Sending failed. Try again.";
      });
  });
}


/* ======================
   Booking System (Calendar + Times)
   ====================== */

const timeSlotsContainer = document.getElementById("timeSlots");
const bookingStatus = document.getElementById("bookingStatus");
const confirmButton = document.getElementById("confirmBooking");
let selectedTime = "";
let selectedDate = "";

const slots = [
  "10:00 AM","11:00 AM","12:00 PM",
  "2:00 PM","3:00 PM","4:00 PM",
  "6:00 PM","8:00 PM"
];

// Generate Time Buttons
slots.forEach(t => {
  const btn = document.createElement("button");
  btn.className = "time-slot";
  btn.textContent = t;
  
  btn.addEventListener("click", () => {
    document.querySelectorAll(".time-slot").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedTime = t;
  });

  timeSlotsContainer.appendChild(btn);
});

// Confirm Booking
confirmButton.addEventListener("click", () => {
  selectedDate = document.getElementById("bookingDate").value;

  if (!selectedDate || !selectedTime) {
    bookingStatus.textContent = "Please select a date and time.";
    return;
  }

  bookingStatus.textContent = `Booking Confirmed for ${selectedDate} at ${selectedTime}.`;
  bookingStatus.style.color = "var(--accent)";
});


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

  // menu links close overlay
  fullscreenMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      fullscreenMenu.classList.remove('open');
      menuToggle.classList.remove('open');
    });
  });

  // ESC close
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
const sections = ["home","portfolio","services","pricing","booking","contact"];
const navDots = document.querySelectorAll(".side-nav a");

window.addEventListener("scroll", () => {
  let index = sections.length;

  while(--index && window.scrollY + 200 < document.getElementById(sections[index]).offsetTop) {}

  navDots.forEach(dot => dot.classList.remove("active"));
  navDots[index].classList.add("active");
});

// initial active
if (navDots[0]) navDots[0].classList.add("active");



/* ---------------------------------------
   GOOGLE SHEET WEBHOOK (Pricing + Booking + Contact)
---------------------------------------- */
const WEBHOOK_URL =
"https://script.google.com/macros/s/AKfycbwqfHOLP1U7Dr7I9qYSAx6QGarJxAyhhgDOA4PkOLCRjr37TA8UyaNpHJ6LFf1zgA8C/exec";

/* ---- Pricing Auto Save ---- */
$$(".price-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const plan = btn.parentElement.querySelector("h3").innerText;

    fetch(WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({ type: "pricing", plan })
    });

    alert(`Plan Selected: ${plan} (Saved to Google Sheet)`);
  });
});

/* ---- Booking Auto Save ---- */
$("#confirmBooking").addEventListener("click", () => {
  const date = bookingDate.value;
  if (!date || !selectedTime) {
    bookingStatus.textContent = "Please select date & time.";
    return;
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

  bookingStatus.textContent = `Booking Confirmed ✔ (Saved to Google Sheet)`;
});

/* ---- Contact Auto Save ---- */
contactForm?.addEventListener("submit", e => {
  fetch(WEBHOOK_URL, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify({
      type: "contact",
      name: $("#name").value,
      email: $("#email").value,
      message: $("#message").value
    })
  });
});



