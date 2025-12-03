/* tiny helpers */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* EmailJS init (your public key from earlier) */
(function(){ emailjs.init('jx3isFO17H8uIbius'); })();

/* Custom cursor */
const cursor = $('#cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});
const interactives = ['a','button','.card','.btn','.filter'];
function setHoverState(on){
  if(on){ cursor.style.transform = 'translate(-50%,-50%) scale(1.9)'; cursor.style.background = 'rgba(0,232,255,0.12)'; }
  else   { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; cursor.style.background = 'transparent'; }
}
$$('[data-skip-hover]').forEach(n=>n.setAttribute('data-skip-hover','true')); // no-op default
interactives.forEach(selector=>{
  $$(selector).forEach(el=>{
    el.addEventListener('mouseenter', ()=> setHoverState(true));
    el.addEventListener('mouseleave', ()=> setHoverState(false));
  });
});

/* Typing effect (hero only while in view) */
const hero = $('#home');
const typed = $('#typed-text');
const caret = $('#hero-caret');
const words = ['Futuristic Graphic Designer','UI/UX Specialist','Brand Identity Expert'];
let wi = 0, ci = 0;
let typingTimer = null;

const heroObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      caret.style.opacity = '1';
      // start typing if not started
      if(!typingTimer && typed.textContent === '') {
        typingTimer = setTimeout(typeChar, 300);
      }
    } else {
      caret.style.opacity = '0';
      // pause typing by clearing timers
      clearTimeout(typingTimer);
      typingTimer = null;
    }
  });
},{threshold:0.25});
heroObserver.observe(hero);

function typeChar(){
  if(ci < words[wi].length){
    typed.textContent += words[wi].charAt(ci++);
    typingTimer = setTimeout(typeChar, 80);
  } else {
    typingTimer = setTimeout(eraseChar, 1100);
  }
}
function eraseChar(){
  if(ci > 0){
    typed.textContent = words[wi].substring(0, ci-1);
    ci--;
    typingTimer = setTimeout(eraseChar, 40);
  } else {
    wi = (wi + 1) % words.length;
    typingTimer = setTimeout(typeChar, 300);
  }
}

/* Scroll arrow -> portfolio */
document.addEventListener("DOMContentLoaded", function () {

  /* -------------------- Scroll Arrow -------------------- */
  const arrow = document.getElementById("scroll-arrow");
  const nextSection = document.querySelector("#portfolio");

  arrow.addEventListener("click", () => {
      nextSection.scrollIntoView({ behavior: "smooth" });
  });

  /* -------------------- Typing Animation -------------------- */
  const typedText = document.getElementById("typed-text");
  const texts = ["A Creative Designer", "UI/UX Specialist", "Brand Identity Expert", "Motion Designer"];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
      let current = texts[textIndex];
      let displayed = isDeleting ? current.substring(0, charIndex--) : current.substring(0, charIndex++);
      typedText.textContent = displayed;

      if (!isDeleting && charIndex === current.length + 1) {
          isDeleting = true;
          setTimeout(type, 1000); // pause before deleting
      } else if (isDeleting && charIndex === -1) {
          isDeleting = false;
          textIndex = (textIndex + 1) % texts.length;
          setTimeout(type, 500);
      } else {
          setTimeout(type, isDeleting ? 50 : 100);
      }
  }

  type(); // start typing

});


/* 3D reveal using IntersectionObserver */
const reveals = $$('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(ent => {
    if(ent.isIntersecting){ ent.target.classList.add('active'); revealObserver.unobserve(ent.target); }
  });
},{threshold:0.18});
reveals.forEach(el => revealObserver.observe(el));

/* Portfolio filtering */
const filters = $$('.filter');
filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    $$('.card').forEach(card => {
      if(f === 'all' || card.dataset.category === f) card.style.display = 'block';
      else card.style.display = 'none';
    });
  });
});

/* Lightbox (click card to open) */
let lb = null;
function openLightbox(src, alt){
  if(lb) return;
  lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `<button class="lb-close" aria-label="Close">&times;</button><img src="${src}" alt="${alt}">`;
  document.body.appendChild(lb);
  document.body.style.overflow = 'hidden';
  lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
  lb.addEventListener('click', e => { if(e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', onKey);
}
function closeLightbox(){
  if(!lb) return;
  lb.remove();
  lb = null;
  document.body.style.overflow = '';
  document.removeEventListener('keydown', onKey);
}
function onKey(e){ if(e.key === 'Escape') closeLightbox(); }
$$('.card').forEach(card => {
  card.addEventListener('click', () => {
    const img = card.querySelector('img');
    openLightbox(img.src, img.alt || '');
  });
  card.addEventListener('keydown', e => { if(e.key === 'Enter') card.click(); });
});

/* Smooth anchor scrolling for header links */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if(href.length > 1){
      e.preventDefault();
      const target = document.querySelector(href);
      if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});

/* EmailJS contact */
(function(){
    emailjs.init("jx3isFO17H8uIbius"); 
})();

document.getElementById("contactForm").addEventListener("submit", function(e){
    e.preventDefault();

    const params = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value
    };

    // 1️⃣ Send Email to YOU
    emailjs.send("service_d34z2l8", "template_mcod6qm", params)
    .then(function() {

        // 2️⃣ Auto reply email to visitor
        return emailjs.send("service_d34z2l8", "template_p0u4mwf", params);

    }).then(function() {
        document.getElementById("statusMsg").innerHTML =
            "Message sent successfully! Check your inbox.";
    }).catch(function(error){
        console.error("Error:", error);
        document.getElementById("statusMsg").innerHTML =
            "Something went wrong. Please try again.";
    });
});
