// Basic interactivity: mobile nav, portfolio filter, form behavior, year
document.addEventListener('DOMContentLoaded', function () {
  // set year
  document.getElementById('year').textContent = new Date().getFullYear();

  // mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');
  navToggle && navToggle.addEventListener('click', () => {
    navList.style.display = navList.style.display === 'flex' ? 'none' : 'flex';
    navList.style.flexDirection = 'column';
    navList.style.gap = '12px';
    navList.style.padding = '16px';
    navList.style.background = 'white';
    navList.style.position = 'absolute';
    navList.style.right = '20px';
    navList.style.top = '64px';
    navList.style.boxShadow = '0 12px 30px rgba(20,30,50,0.08)';
  });

  // smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
        // hide mobile menu after click
        if (window.innerWidth <= 780) navList.style.display = 'none';
      }
    });
  });

  // portfolio filter
  const filters = document.querySelectorAll('.filter');
  const cards = document.querySelectorAll('.portfolio-grid .card');

  filters.forEach(btn => {
    btn.addEventListener('click', function () {
      filters.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const f = this.dataset.filter;
      cards.forEach(card => {
        const cat = card.dataset.cat || 'all';
        if (f === 'all' || f === cat) {
          card.style.display = 'block';
          card.style.opacity = 1;
        } else {
          card.style.display = 'none';
          card.style.opacity = 0;
        }
      });
    });
  });

  // contact form basic demo behavior (does not submit anywhere)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // simple success state
      alert('Thanks! Your message has been received (demo).');
      contactForm.reset();
    });
  }
});
