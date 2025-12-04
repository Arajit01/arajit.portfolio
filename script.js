/* ======================================================
   PORTRAIT-AWARE REFLECT + FACE LIGHT ENGINE
   ====================================================== */

const aboutImgWrap = document.querySelector(".about-img-visual");
if (aboutImgWrap) {
  
  // Create elements dynamically so no HTML edit needed
  let aiLight = document.querySelector(".face-ai-light");
  let skinBounce = document.querySelector(".face-bounce");

  if (!aiLight) {
    aiLight = document.createElement("div");
    aiLight.className = "face-ai-light";
    aboutImgWrap.appendChild(aiLight);
  }

  if (!skinBounce) {
    skinBounce = document.createElement("div");
    skinBounce.className = "face-bounce";
    aboutImgWrap.appendChild(skinBounce);
  }

  let wrapRect = null;

  function updateRect() {
    wrapRect = aboutImgWrap.getBoundingClientRect();
  }
  updateRect();
  window.addEventListener("resize", updateRect);

  aboutImgWrap.addEventListener("mousemove", (e) => {
    const x = e.clientX - wrapRect.left;
    const y = e.clientY - wrapRect.top;

    const percentX = (x / wrapRect.width - 0.5) * 2;   // -1 to 1
    const percentY = (y / wrapRect.height - 0.5) * 2;

    // AI cool blue light → directly follows cursor
    aiLight.style.opacity = 1;
    aiLight.style.left = `${x}px`;
    aiLight.style.top = `${y}px`;

    // Distance from center for "skin bounce"
    const dist = Math.sqrt(percentX * percentX + percentY * percentY);

    if (dist < 0.35) {
      skinBounce.dataset.bounce = "strong";
    } else if (dist < 0.65) {
      skinBounce.dataset.bounce = "medium";
    } else {
      skinBounce.dataset.bounce = "soft";
    }

    skinBounce.style.opacity = 1;
    skinBounce.style.left = `${x}px`;
    skinBounce.style.top = `${y}px`;
  });

  aboutImgWrap.addEventListener("mouseleave", () => {
    aiLight.style.opacity = 0;
    skinBounce.style.opacity = 0;
  });
}


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

heroObserver.observe(heroSection);

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


/* ======================================================
   MAGNETIC HOVER + TRAIL (Pro Version)
   ====================================================== */

function createMagnetEffect(targets, strength = 0.25, maxPull = 40) {
  const elements = document.querySelectorAll(targets);

  elements.forEach(el => {
    let rect, centerX, centerY;

    function updateCenter() {
      rect = el.getBoundingClientRect();
      centerX = rect.left + rect.width / 2;
      centerY = rect.top + rect.height / 2;
    }
    updateCenter();
    window.addEventListener("resize", updateCenter);

    el.addEventListener("mousemove", (e) => {
      const dx = (e.clientX - centerX);
      const dy = (e.clientY - centerY);

      const pullX = Math.max(Math.min(dx * strength, maxPull), -maxPull);
      const pullY = Math.max(Math.min(dy * strength, maxPull), -maxPull);

      el.style.transform =
        `translate(${pullX}px, ${pullY}px) scale(1.03)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = `translate(0px, 0px) scale(1)`;
    });
  });
}

/* APPLY MAGNET TO ELEMENTS */
createMagnetEffect(".card", 0.20, 32);
createMagnetEffect(".service-card", 0.20, 28);
createMagnetEffect(".price-card", 0.18, 25);
createMagnetEffect(".blog-card", 0.25, 28);
createMagnetEffect(".about-img-visual", 0.18, 20);   // FIXED ✔



/* ======================================================
   GLOW TRAIL (Global mouse follow)
   ====================================================== */

const bodyTrail = document.body;

document.addEventListener("mousemove", (e) => {
  const dot = document.createElement("div");
  dot.className = "glow-dot";
  dot.style.position = "fixed";
  dot.style.left = e.clientX + "px";
  dot.style.top = e.clientY + "px";
  dot.style.pointerEvents = "none";
  dot.style.zIndex = 9999;

  bodyTrail.appendChild(dot);

  setTimeout(() => dot.remove(), 900);
});



/* ==============================
   CHATBOT LOGIC
=============================== */

const CHATBOT_API = "YOUR_GOOGLE_SCRIPT_WEBAPP_URL";  // <--- replace

let chatMemory = [];
const chatBox = document.getElementById("chatbot-box");
const chatBody = document.getElementById("chatbot-body");
const chatInput = document.getElementById("chatbot-text");
const chatSend = document.getElementById("chatbot-send");
const chatMic = document.getElementById("chatbot-mic");

/* SHOW/HIDE Chatbot */
document.getElementById("chatbot-button").onclick = () => {
  chatBox.classList.add("open");
};
document.getElementById("chatbot-close").onclick = () => {
  chatBox.classList.remove("open");
};

/* Add messages */
function addUser(msg) {
  chatBody.innerHTML += `<div class="user-msg">${msg}</div>`;
  chatBody.scrollTop = chatBody.scrollHeight;
}
function addBot(msg) {
  chatBody.innerHTML += `<div class="bot-msg">${msg}</div>`;
  chatBody.scrollTop = chatBody.scrollHeight;

  speakText(msg);  // AI voice reply
}

/* Thinking Animation */
function showThinking() {
  const t = document.createElement("div");
  t.className = "bot-msg typing";
  t.innerHTML = `<span></span><span></span><span></span>`;
  chatBody.appendChild(t);
  chatBody.scrollTop = chatBody.scrollHeight;
  return t;
}

/* Send to backend */
async function askAI(msg) {
  const thinking = showThinking();

  const res = await fetch(CHATBOT_API, {
    method: "POST",
    body: JSON.stringify({
      message: msg,
      memory: chatMemory
    })
  });

  const data = await res.json();
  thinking.remove();

  const reply = data.reply || "AI error.";
  addBot(reply);

  chatMemory.push(msg);
  chatMemory.push(reply);

  if (chatMemory.length > 10) chatMemory.shift();
}

/* Send message handler */
chatSend.onclick = sendMessage;
chatInput.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  addUser(text);
  chatInput.value = "";
  askAI(text);
}

/* Auto-Suggestions */
document.querySelectorAll(".suggest-btn").forEach(btn => {
  btn.onclick = () => {
    chatInput.value = btn.textContent;
    sendMessage();
  };
});

/* ==========================================
   Voice Input — Speech to Text
========================================== */
let recognition;
if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  chatMic.onclick = () => {
    recognition.start();
    chatMic.style.color = "#00eaff";
  };

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    chatInput.value = text;
    chatMic.style.color = "";
  };

  recognition.onend = () => {
    chatMic.style.color = "";
  };
}

/* ==========================================
   Voice Output — AI speaks reply
========================================== */
function speakText(text) {
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-US";
  msg.pitch = 1.0;
  msg.rate = 1.0;
  speechSynthesis.speak(msg);
}



