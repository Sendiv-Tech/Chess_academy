/* ============================================================
   CHESS ACADEMY — script.js
   Handles: sticky nav, mobile menu, scroll reveal,
            testimonial slider, contact form, counters
   ============================================================ */

'use strict';

/* ── STICKY NAVBAR ───────────────────────────────────────── */
const navbar = document.querySelector('.navbar');
if (navbar) {
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ── ACTIVE NAV LINK ─────────────────────────────────────── */
(function setActiveLink() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ── MOBILE MENU ─────────────────────────────────────────── */
const hamburger  = document.querySelector('.hamburger');
const mobileNav  = document.querySelector('.mobile-nav');
const mobileLinks = document.querySelectorAll('.mobile-nav .nav-link, .mobile-nav .btn');

function toggleMenu(open) {
  hamburger?.classList.toggle('open', open);
  mobileNav?.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

hamburger?.addEventListener('click', () => {
  const isOpen = mobileNav?.classList.contains('open');
  toggleMenu(!isOpen);
});
mobileLinks.forEach(link => link.addEventListener('click', () => toggleMenu(false)));

/* ── SCROLL REVEAL ───────────────────────────────────────── */
function initReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* ── TESTIMONIAL SLIDER ──────────────────────────────────── */
function initSlider() {
  const track  = document.querySelector('.testimonial-track');
  const dotsWrap = document.querySelector('.slider-dots');
  const btnPrev  = document.querySelector('.slider-btn.prev');
  const btnNext  = document.querySelector('.slider-btn.next');
  if (!track) return;

  const cards     = track.querySelectorAll('.testimonial-card');
  const total     = cards.length;
  let current     = 0;
  let autoInterval;

  // Build dots
  if (dotsWrap) {
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function getVisible() {
    const w = track.parentElement.offsetWidth;
    if (w < 640) return 1;
    if (w < 1024) return 2;
    return 3;
  }

  function goTo(index) {
    const vis    = getVisible();
    const maxIdx = Math.max(0, total - vis);
    current = Math.max(0, Math.min(index, maxIdx));

    const cardW  = cards[0].offsetWidth + 24; // gap = 1.5rem = 24px
    track.style.transform = `translateX(-${current * cardW}px)`;

    document.querySelectorAll('.slider-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  btnPrev?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  btnNext?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  function resetAuto() {
    clearInterval(autoInterval);
    autoInterval = setInterval(() => {
      const vis = getVisible();
      const nextIdx = current + 1 > total - vis ? 0 : current + 1;
      goTo(nextIdx);
    }, 5000);
  }

  resetAuto();
  window.addEventListener('resize', () => goTo(current));
}

/* ── COUNTER ANIMATION ───────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const start  = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(ease * target);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ── CONTACT FORM ────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-gold');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    // Simulate async submit
    setTimeout(() => {
      form.style.display = 'none';
      const success = document.querySelector('.form-success');
      if (success) success.style.display = 'block';
    }, 1400);
  });
}

/* ── SMOOTH ANCHOR SCROLL ────────────────────────────────── */
function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ── GALLERY LIGHTBOX (minimal) ──────────────────────────── */
function initGallery() {
  const items = document.querySelectorAll('.gallery-item');
  items.forEach(item => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') item.click();
    });
  });
}

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initSlider();
  initCounters();
  initContactForm();
  initSmoothLinks();
  initGallery();
});
