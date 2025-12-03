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
const cursor = $('#cursor');
if (cursor) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });
  // hover growth
  const interactives = ['a','button','.card','.btn','.filter'];
  interactives.forEach(sel => {
    $$(sel).forEach(el=>{
      el.addEventListener('mouseenter', ()=> { cursor.style.transform = 'translate(-50%,-50%) scale(1.8)'; cursor.style.background = 'rgba(0,232,255,0.12)'; });
      el.addEventListener('mouseleave', ()=> { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; cursor.style.background = 'transparent'; });
    });
  });
}

/* ==========================
   Typing — continuous loop
   - caret visibility controlled via IO (hero)
   ========================== */
const typedEl = $('#typed-text');
const caretEl  = $('#hero-caret');
const typingWords = [
  "Futuristic Graphic Designer",
  "UI/UX Specialist",
  "Brand Identity Expert",
  "Motion Designer"
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
   - visible when hero is mostly visible
   - click -> scroll to portfolio -> hide arrow
   - reappear when hero visible again
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
   Portfolio filter + sliding underline + stagger reveal
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
function closeLightbox(){ if (!lightbox) return; lightbox.remove(); lightbox = null; document.body.style.overflow = ''; document.removeEventListener('keydown', escLB); }
function escLB(e){ if (e.key === 'Escape') closeLightbox(); }
$$('.card').forEach(card=>{
  card.addEventListener('click', ()=> {
    const img = card.querySelector('img');
    if (img && img.src) openLightbox(img.src, img.alt || '');
  });
});

/* ==========================
   Smooth anchor nav (closes nothing here)
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
   Contact form (EmailJS send + auto-reply) + auto-clear
   ========================== */
const contactForm = $('#contactForm');
const statusMsg = $('#statusMsg');

if (contactForm) {
  contactForm.addEventListener('submit', e=>{
    e.preventDefault();

    if (!window.emailjs || typeof emailjs.send !== 'function') {
      statusMsg && (statusMsg.textContent = 'Email service unavailable.');
      return;
    }

    const params = {
      from_name: ($('#name') ? $('#name').value.trim() : ''),
      reply_to: ($('#email') ? $('#email').value.trim() : ''),
      message: ($('#message') ? $('#message').value.trim() : '')
    };

    if (!params.from_name || !params.reply_to || !params.message) {
      statusMsg && (statusMsg.textContent = 'Please fill all fields.');
      return;
    }

    statusMsg && (statusMsg.textContent = 'Sending…');

    // 1) send to owner
    emailjs.send('service_d34z2l8', 'template_mcod6qm', params)
      .then(()=> {
        // 2) auto reply to visitor
        return emailjs.send('service_d34z2l8', 'template_p0u4mwf', params);
      }).then(()=> {
        statusMsg && (statusMsg.textContent = 'Message sent! Check your inbox.');
        contactForm.reset(); // CLEAR FORM
        setTimeout(()=> statusMsg && (statusMsg.textContent = ''), 4500);
      }).catch(err=>{
        console.error('EmailJS error:', err);
        statusMsg && (statusMsg.textContent = 'Failed to send. Try again later.');
      });
  });
}
