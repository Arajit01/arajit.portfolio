/* Helper shortcuts */
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

/* Init EmailJS */
emailjs.init("jx3isFO17H8uIbius");

/* ----------------------------
   CUSTOM CURSOR
---------------------------- */
const cursor = $("#cursor");
document.addEventListener("mousemove", e => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top  = e.clientY + "px";
});

/* ----------------------------
   CONTINUOUS TYPING EFFECT
---------------------------- */
const typed = $("#typed-text");
const caret = $("#hero-caret");
const hero = $("#home");

const lines = [
  "Futuristic Graphic Designer",
  "UI/UX Specialist",
  "Brand Identity Expert",
  "Motion Designer"
];

let li = 0, ci = 0, del = false;

function typing() {
  const word = lines[li];
  typed.textContent = del ? word.substring(0, --ci) : word.substring(0, ++ci);

  if (!del && ci === word.length) { del = true; setTimeout(typing, 1000); return; }
  if (del && ci === 0) { del = false; li = (li + 1) % lines.length; }

  setTimeout(typing, del ? 40 : 110);
}
typing();

/* caret visible only in hero */
new IntersectionObserver(entries => {
  entries.forEach(e => caret.style.opacity = e.isIntersecting ? "1" : "0");
},{threshold:0.4}).observe(hero);

/* ----------------------------
   SCROLL ARROW
---------------------------- */
const arrow = $("#scroll-arrow");
const nextSection = $("#portfolio");

arrow.addEventListener("click", () => {
  nextSection.scrollIntoView({ behavior: "smooth" });
  arrow.classList.remove("show-arrow");
  arrow.classList.add("hide-arrow");
});

/* Show/hide arrow based on hero visibility */
function updateArrow() {
  const rect = hero.getBoundingClientRect();
  if (rect.bottom > window.innerHeight * 0.5) {
    arrow.classList.add("show-arrow");
    arrow.classList.remove("hide-arrow");
  } else {
    arrow.classList.add("hide-arrow");
    arrow.classList.remove("show-arrow");
  }
}
window.addEventListener("scroll", updateArrow);
updateArrow();

/* ----------------------------
   3D Reveal Sections
---------------------------- */
const reveals = $$(".reveal");
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("active");
      obs.unobserve(e.target);
    }
  });
},{ threshold:0.2 });
reveals.forEach(r => obs.observe(r));

/* ----------------------------
   Filter Portfolio
---------------------------- */
const filters = $$(".filter");
filters.forEach(btn => {
  btn.addEventListener("click", () => {
    filters.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const type = btn.dataset.filter;

    $$(".card").forEach(card => {
      card.style.display = (type==="all" || card.dataset.category===type) ? "block" : "none";
    });
  });
});

/* ----------------------------
   Lightbox
---------------------------- */
let lb = null;

function openLB(src) {
  if (lb) return;
  lb = document.createElement("div");
  lb.className = "lightbox";
  lb.innerHTML = `<button class="lb-close">&times;</button><img src="${src}">`;
  document.body.appendChild(lb);
  document.body.style.overflow = "hidden";

  lb.querySelector(".lb-close").onclick = closeLB;
  lb.onclick = e => { if (e.target === lb) closeLB(); };
}
function closeLB() {
  lb.remove();
  lb = null;
  document.body.style.overflow = "";
}

$$(".card img").forEach(img => {
  img.onclick = () => openLB(img.src);
});

/* ----------------------------
   Smooth Anchor Scrolling
---------------------------- */
$$('a[href^="#"]').forEach(a => {
  a.onclick = e => {
    const id = a.getAttribute("href");
    if (id !== "#") {
      e.preventDefault();
      $(id).scrollIntoView({ behavior: "smooth" });
    }
  };
});

/* ----------------------------
   CONTACT FORM + AUTO REPLY
---------------------------- */
const form = $("#contactForm");
const statusMsg = $("#statusMsg");

form.addEventListener("submit", e => {
  e.preventDefault();

  const params = {
    from_name: $("#name").value.trim(),
    reply_to: $("#email").value.trim(),
    message: $("#message").value.trim()
  };

  statusMsg.textContent = "Sending...";

  emailjs.send("service_d34z2l8", "template_mcod6qm", params)
  .then(() => emailjs.send("service_d34z2l8", "template_p0u4mwf", params))
  .then(() => {
    statusMsg.textContent = "Message sent successfully!";
    form.reset();   // <<< AUTO CLEAR FIXED
    setTimeout(()=> statusMsg.textContent = "", 3000);
  })
  .catch(() => statusMsg.textContent = "Failed to send message.");
});
