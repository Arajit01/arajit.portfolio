/* ======================================================
   HELPERS
====================================================== */
const $  = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* ======================================================
   PORTRAIT-AWARE REFLECT + FACE LIGHT ENGINE
====================================================== */
const aboutImgWrap = document.querySelector(".about-img-visual");
if (aboutImgWrap) {
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
    const percentX = (x / wrapRect.width - 0.5) * 2;
    const percentY = (y / wrapRect.height - 0.5) * 2;

    aiLight.style.opacity = 1;
    aiLight.style.left = `${x}px`;
    aiLight.style.top = `${y}px`;

    const dist = Math.sqrt(percentX * percentX + percentY * percentY);

    if (dist < 0.35) skinBounce.dataset.bounce = "strong";
    else if (dist < 0.65) skinBounce.dataset.bounce = "medium";
    else skinBounce.dataset.bounce = "soft";

    skinBounce.style.opacity = 1;
    skinBounce.style.left = `${x}px`;
    skinBounce.style.top = `${y}px`;
  });

  aboutImgWrap.addEventListener("mouseleave", () => {
    aiLight.style.opacity = 0;
    skinBounce.style.opacity = 0;
  });
}

/* ======================================================
   EMAILJS INIT
====================================================== */
if (window.emailjs && typeof emailjs.init === "function") {
  try { emailjs.init("jx3isFO17H8uIbius"); } 
  catch (e) { console.warn("EmailJS init failed", e); }
}

/* ======================================================
   CUSTOM CURSOR
====================================================== */
const cursor = document.getElementById("cursor");
if (cursor) {
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

  const hoverTargets = "a, button, .btn, .card, .filter, .price-card, .service-card";
  document.querySelectorAll(hoverTargets).forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("cursor-hover"));
  });
}

/* ======================================================
   HERO TYPING
====================================================== */
const typedEl = $("#typed-text");
const typingWords = [
  "Modern Graphic Designer",
  "Brand Identity Specialist",
  "UI Layout & Visual Designer",
  "Motion & Promo Visuals",
];
let wordIndex = 0, charIndex = 0, deleting = false;

(function typingLoop() {
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

/* ======================================================
   GENERAL UI (Scroll, Filters, Lightbox)
====================================================== */
const scrollArrow = document.getElementById("scroll-arrow");
const nextSection = document.getElementById("portfolio");
if (scrollArrow && nextSection) {
  scrollArrow.addEventListener("click", () => nextSection.scrollIntoView({ behavior: "smooth" }));
}

// Portfolio Filter
const filters = $$(".filter");
const underline = $("#filter-underline");
const cards = $$(".card");
const portfolioSection = $("#portfolio");

function moveUnderlineTo(btn) {
  if (!btn || !underline) return;
  underline.style.width = `${btn.offsetWidth}px`;
  underline.style.left = `${btn.offsetLeft}px`;
}
if (filters.length && underline) {
  const active = document.querySelector(".filter.active") || filters[0];
  moveUnderlineTo(active);
  window.addEventListener("resize", () => moveUnderlineTo(document.querySelector(".filter.active") || filters[0]));
}
filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    filters.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    moveUnderlineTo(btn);
    const f = btn.dataset.filter;
    cards.forEach((card, i) => {
      if (f === "all" || card.dataset.category === f) {
        card.style.display = "block";
        setTimeout(() => { card.classList.remove("hidden"); card.classList.add("revealed"); }, 50);
      } else {
        card.classList.add("hidden");
        setTimeout(() => (card.style.display = "none"), 300);
      }
    });
  });
});

if (portfolioSection) {
  const portfolioObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          cards.forEach((card, i) => {
            card.classList.add("hidden");
            setTimeout(() => {
              card.style.display = "block";
              card.classList.remove("hidden");
              card.classList.add("revealed");
            }, i * 120);
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
  portfolioObserver.observe(portfolioSection);
}

// Lightbox
let lightbox = null;
function openLightbox(src, alt = "") {
  if (lightbox) return;
  lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `<button class="lb-close">&times;</button><img src="${src}" alt="${alt}">`;
  document.body.appendChild(lightbox);
  document.body.style.overflow = "hidden";
  lightbox.querySelector(".lb-close").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });
}
function closeLightbox() {
  if (!lightbox) return;
  lightbox.remove();
  lightbox = null;
  document.body.style.overflow = "";
}
$$(".card").forEach((card) => {
  card.addEventListener("click", () => {
    const img = card.querySelector("img");
    if (img && img.src) openLightbox(img.src, img.alt || "");
  });
});

/* ======================================================
   WEBHOOK URL (IMPORTANT: PASTE YOUR URL HERE)
====================================================== */
const BOOKING_WEBHOOK = "YOUR_WEB_APP_URL_HERE"; 


/* ======================================================
   CONTACT & BOOKING SYSTEM (Main Page)
====================================================== */
const contactForm = document.getElementById("contactForm");
const statusMsg = document.getElementById("statusMsg");

if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = $("#name").value.trim();
    const email = $("#email").value.trim();
    const message = $("#message").value.trim();

    if (!name || !email || !message) {
      statusMsg.textContent = "Please fill out all fields.";
      statusMsg.style.color = "red";
      return;
    }
    statusMsg.textContent = "Sending…";
    statusMsg.style.color = "var(--accent)";

    try {
      await emailjs.send("service_d34z2l8", "template_mcod6qm", { from_name: name, reply_to: email, message: message });
      statusMsg.textContent = "Message sent successfully!";
      contactForm.reset();
      setTimeout(() => { statusMsg.textContent = ""; }, 4000);
    } catch (err) {
      console.error("EmailJS Error:", err);
      statusMsg.textContent = "Sending failed.";
      statusMsg.style.color = "red";
    }
  });
}

// Quick Booking on Main Page
const timeSlotsContainer = document.getElementById("timeSlots");
const bookingStatus = document.getElementById("bookingStatus");
const confirmButton = document.getElementById("confirmBooking");
let selectedTime = "";
const slots = ["10:00 AM","11:00 AM","12:00 PM","2:00 PM","3:00 PM","4:00 PM","6:00 PM","8:00 PM"];

if (timeSlotsContainer) {
  slots.forEach((t) => {
    const btn = document.createElement("button");
    btn.className = "time-slot";
    btn.type = "button";
    btn.textContent = t;
    btn.addEventListener("click", () => {
      document.querySelectorAll(".time-slot").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedTime = t;
    });
    timeSlotsContainer.appendChild(btn);
  });
}

if (confirmButton) {
  confirmButton.addEventListener("click", () => {
    const dateInput = document.getElementById("bookingDate");
    const selectedDate = dateInput ? dateInput.value : "";
    if (!selectedDate || !selectedTime) {
      bookingStatus.textContent = "Please select a date and time.";
      bookingStatus.style.color = "red";
      return;
    }
    bookingStatus.textContent = `Booking...`;
    fetch(BOOKING_WEBHOOK, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({ type: "booking", date: selectedDate, time: selectedTime, plan: "Quick Booking" }),
    }).then(() => {
        bookingStatus.textContent = `Booking Confirmed for ${selectedDate} at ${selectedTime}.`;
        bookingStatus.style.color = "var(--accent)";
    }).catch(e => {
        bookingStatus.textContent = "Error booking.";
    });
  });
}

// Pricing Redirect
$$(".price-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const plan = btn.dataset.plan || "Standard";
    window.location.href = "booking.html?plan=" + encodeURIComponent(plan);
  });
});

/* ======================================================
   THEME SWITCHER & LOADER
====================================================== */
const themeToggleBtn = $("#themeToggle");
const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector("i") : null;
function applyTheme(theme) {
  document.body.dataset.theme = theme;
  if (themeIcon) themeIcon.className = theme === "light" ? "fa-regular fa-sun" : "fa-regular fa-moon";
}
const savedTheme = localStorage.getItem("theme") || "dark";
applyTheme(savedTheme);
if(themeToggleBtn){
    themeToggleBtn.addEventListener("click", () => {
        const newTheme = document.body.dataset.theme === "light" ? "dark" : "light";
        localStorage.setItem("theme", newTheme);
        applyTheme(newTheme);
    });
}
const loader = $("#loader");
window.addEventListener("load", () => {
  if (loader) setTimeout(() => loader.classList.add("loader-hide"), 500);
});


/* ======================================================
   CHATBOT 2.0 (With In-Chat Booking)
====================================================== */
const CHATBOT_API = "https://script.google.com/macros/s/AKfycbxnY8v1hs51GY1dUK-YyRpG7KDba_KqsHbD8K654MNi24-0SUP3UHkWalppa2L9kx0Y/exec";

let chatMemory = [];
const chatBox = document.getElementById("chatbot-box");
const chatBody = document.getElementById("chatbot-body");
const chatInput = document.getElementById("chatbot-text");
const chatSend = document.getElementById("chatbot-send");
const chatOpen = document.getElementById("chatbot-button");
const chatClose = document.getElementById("chatbot-close");

if(chatOpen) chatOpen.addEventListener("click", () => chatBox.classList.add("open"));
if(chatClose) chatClose.addEventListener("click", () => chatBox.classList.remove("open"));

function addUser(msg){
  const el = document.createElement("div");
  el.className = "user-msg";
  el.textContent = msg;
  chatBody.appendChild(el);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function typeBot(msg){
  const el = document.createElement("div");
  el.className = "bot-msg";
  chatBody.appendChild(el);
  
  let i = 0;
  const interval = setInterval(() => {
    el.textContent += msg.charAt(i);
    chatBody.scrollTop = chatBody.scrollHeight;
    i++;
    if (i >= msg.length) clearInterval(interval);
  }, 15);
}

function showThinking(){
  const t = document.createElement("div");
  t.className = "bot-msg typing";
  t.innerHTML = "<span></span><span></span><span></span>";
  chatBody.appendChild(t);
  chatBody.scrollTop = chatBody.scrollHeight;
  return t;
}

// *** MINI BOOKING FORM RENDERER ***
function renderBookingForm() {
    const formID = "chat-form-" + Date.now();
    const div = document.createElement("div");
    div.className = "bot-msg";
    div.innerHTML = `
        <p style="margin-bottom:8px;">Fill this out to book a session instantly:</p>
        <div class="chat-form" id="${formID}">
            <input type="text" placeholder="Your Name" class="chat-input c-name">
            <input type="email" placeholder="Your Email" class="chat-input c-email">
            <input type="date" class="chat-input c-date">
            <select class="chat-input c-time">
                <option value="" disabled selected>Select Time</option>
                <option>10:00 AM</option>
                <option>12:00 PM</option>
                <option>02:00 PM</option>
                <option>04:00 PM</option>
                <option>06:00 PM</option>
            </select>
            <button class="chat-submit-btn">Confirm Booking</button>
        </div>
    `;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;

    const btn = div.querySelector(".chat-submit-btn");
    btn.addEventListener("click", () => {
        const name = div.querySelector(".c-name").value;
        const email = div.querySelector(".c-email").value;
        const date = div.querySelector(".c-date").value;
        const time = div.querySelector(".c-time").value;

        if(!name || !email || !date || !time) {
            typeBot("Please fill all fields to proceed.");
            return;
        }

        btn.textContent = "Booking...";
        btn.disabled = true;

        fetch(BOOKING_WEBHOOK, {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify({
                type: "booking",
                name: name,
                email: email,
                date: date,
                time: time,
                plan: "Chat Booking"
            })
        }).then(() => {
            // Updated Success Handler with Invoice Button
            div.innerHTML = `
                <div class="success-msg" style="text-align:center; padding:20px;">
                    <i class="fa-solid fa-circle-check" style="font-size:40px; color:var(--accent);"></i>
                    <h3 style="margin-top:15px; color:#fff;">Booking Confirmed!</h3>
                    <p style="font-size:14px; opacity:0.8; color:#fff;">Thanks ${name}! Check your email for details.</p>
                    <button onclick="downloadInvoice('${name}', '${time}', '${date}')" class="btn" style="margin-top:15px; font-size:12px; cursor:pointer; background:var(--accent); border:none; border-radius:8px; padding:10px;">
                        <i class="fa-solid fa-file-invoice"></i> Download Invoice
                    </button>
                </div>
            `;
        }).catch(() => {
            btn.textContent = "Retry";
            btn.disabled = false;
            typeBot("Network error. Please try again.");
        });
    });
}

// FAQ Logic for Chatbot
function handleFAQ(type) {
    let userQuestion = "";
    let botReply = "";

    switch(type) {
        case 'contact':
            userQuestion = "How can I contact you directly?";
            botReply = "I'd love to discuss your project! You can reach Arajit directly via:\n\n📱 WhatsApp: +91 6295577953\n📧 Email: arajithalder123@gmail.com\n\nFeel free to drop a message anytime!";
            break;
        case 'process':
            userQuestion = "What is your design process?";
            botReply = "I start with a discovery phase to understand your brand, then move to sketching, creating 2-3 initial concepts, and finally refining based on your feedback.";
            break;
        case 'files':
            userQuestion = "What files will I receive?";
            botReply = "You will receive high-resolution files in multiple formats like AI, EPS, SVG, PDF, and PNG for both print and web use.";
            break;
        case 'time':
            userQuestion = "How long does a project take?";
            botReply = "A single asset like a logo usually takes 3-5 days. Larger branding projects may take 1-2 weeks depending on complexity.";
            break;
        case 'refund':
            userQuestion = "What about refunds?";
            botReply = "I offer full refunds before work starts and partial refunds during the process. Once final files are delivered, no refunds are issued as per my policy.";
            break;
    }

    if(userQuestion) {
        addUser(userQuestion); 
        setTimeout(() => typeBot(botReply), 500); 
    }
}

function updateChatSuggestions() {
    const suggestionsContainer = document.querySelector(".chatbot-suggestions");
    if (suggestionsContainer) {
        suggestionsContainer.innerHTML = `
            <button class="suggest-btn" onclick="handleFAQ('contact')">Direct Contact</button>
            <button class="suggest-btn" onclick="handleFAQ('process')">Design Process</button>
            <button class="suggest-btn" onclick="handleFAQ('files')">Deliverables</button>
            <button class="suggest-btn" onclick="handleFAQ('time')">Timeline</button>
        `;
    }
}

// AI Chat Integration
async function askAI(msg){
  const thinking = showThinking();
  let replied = false;
  try {
    const response = await fetch(CHATBOT_API, {
      method: "POST",
      redirect: "follow", 
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ type: "chat", message: msg, memory: chatMemory })
    });
    if(response.ok) {
        const data = await response.json();
        const reply = data.reply;
        if(reply) {
            thinking.remove();
            typeBot(reply);
            chatMemory.push(msg, reply);
            replied = true;
        }
    }
  } catch(err) { }
  if (!replied) {
    thinking.remove();
    typeBot("I'm currently offline, but you can book a session or use the FAQ buttons!");
  }
}

function sendChatMessage(){
  const text = chatInput.value.trim();
  if(!text) return;
  addUser(text);
  chatInput.value = "";
  const lower = text.toLowerCase();
  if (lower.includes("book") || lower.includes("appointment")) {
    renderBookingForm();
  } else if (lower.includes("price") || lower.includes("cost")) {
    typeBot("Scrolling to pricing...");
    document.getElementById("pricing").scrollIntoView({behavior:"smooth"});
  } else {
    askAI(text);
  }
}

// Global Event Listeners
if(chatSend) chatSend.addEventListener("click", sendChatMessage);
if(chatInput) chatInput.addEventListener("keydown", e => { if(e.key === "Enter") sendChatMessage(); });
window.addEventListener('DOMContentLoaded', updateChatSuggestions);

// Invoice Downloader Function
function downloadInvoice(name, time, date) {
    const invoiceContent = `
        INVOICE - ARAJIT HALDER
        -----------------------
        Client: ${name}
        Date: ${date}
        Time Slot: ${time}
        Status: Confirmed
        
        Contact: arajithalder123@gmail.com
        WhatsApp: +91 6295577953
        -----------------------
        Thank you for your business!
    `;
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_Arajit_Halder_${name}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}



/* ==============================
   MOBILE MENU FIX (FINAL)
============================== */
const menuToggle = document.getElementById("menuToggle");
const fullscreenMenu = document.getElementById("fullscreenMenu");

if(menuToggle && fullscreenMenu){
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("open");
    fullscreenMenu.classList.toggle("open");
    document.body.style.overflow =
      fullscreenMenu.classList.contains("open") ? "hidden" : "";
  });

  // Close menu on link click
  fullscreenMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      fullscreenMenu.classList.remove("open");
      menuToggle.classList.remove("open");
      document.body.style.overflow = "";
    });
  });
}


function openTestimonial(card){
  const modal = document.getElementById("testimonialModal");
  const content = document.getElementById("modalContent");
  content.innerHTML = card.innerHTML;
  modal.classList.add("open");
}

function closeTestimonial(){
  document.getElementById("testimonialModal").classList.remove("open");
}

