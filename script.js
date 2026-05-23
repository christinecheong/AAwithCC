/**
 * ===================================================
 * LUXE INTERIORS — script.js
 * Luxury Interior Design Landing Page
 * ===================================================
 */

'use strict';

/* ─────────────────────────────────────────────────────
   1. NAVBAR — scroll effect + mobile toggle
───────────────────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const navAnchors = document.querySelectorAll('.nav-link');

// Scroll: add .scrolled class when page is scrolled past 50px
window.addEventListener('scroll', onScroll, { passive: true });

function onScroll() {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 50);
  updateActiveNav();
  toggleBackToTop();
}

// Mobile hamburger toggle
hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

// Close mobile nav when a link is clicked
navLinks.addEventListener('click', (e) => {
  if (e.target.classList.contains('nav-link')) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

// Highlight the nav link for the current visible section
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  let currentId = '';

  sections.forEach(section => {
    const top = section.offsetTop - var_navHeight() - 40;
    if (window.scrollY >= top) {
      currentId = section.getAttribute('id');
    }
  });

  navAnchors.forEach(link => {
    const matches = link.getAttribute('href') === `#${currentId}`;
    link.classList.toggle('active', matches);
  });
}

function var_navHeight() {
  return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
}

/* ─────────────────────────────────────────────────────
   2. DARK / LIGHT MODE TOGGLE
───────────────────────────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const htmlEl      = document.documentElement;

const ICONS = {
  light: `<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>`,
  dark:  `<circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1"     x2="12" y2="3"/>
    <line x1="12" y1="21"    x2="12" y2="23"/>
    <line x1="4.22" y1="4.22"   x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1"  y1="12"    x2="3"  y2="12"/>
    <line x1="21" y1="12"    x2="23" y2="12"/>
    <line x1="4.22" y1="19.78"  x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"/>`
};

function applyTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  // Show moon icon in light mode (to switch to dark), sun icon in dark mode
  themeIcon.innerHTML = theme === 'dark' ? ICONS.dark : ICONS.light;
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  localStorage.setItem('luxe-theme', theme);
}

// Restore saved preference on load
const savedTheme = localStorage.getItem('luxe-theme') || 'light';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

/* ─────────────────────────────────────────────────────
   3. SCROLL FADE-IN ANIMATIONS (IntersectionObserver)
───────────────────────────────────────────────────── */
const fadeEls = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    // Stagger siblings inside the same parent
    const siblings = Array.from(entry.target.parentElement.querySelectorAll('.fade-in:not(.visible)'));
    const delay    = siblings.indexOf(entry.target) * 90;

    setTimeout(() => entry.target.classList.add('visible'), delay);
    fadeObserver.unobserve(entry.target);
  });
}, { threshold: 0.05, rootMargin: '0px 0px 60px 0px' });

fadeEls.forEach(el => fadeObserver.observe(el));

// Safety fallback: if any elements still hidden after 1.5s, force them visible
setTimeout(() => {
  document.querySelectorAll('.fade-in:not(.visible)').forEach(el => {
    el.classList.add('visible');
  });
}, 1500);

/* ─────────────────────────────────────────────────────
   4. STATS COUNTER (IntersectionObserver + rAF)
───────────────────────────────────────────────────── */
const statNumbers = document.querySelectorAll('.stat-number');

function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 2200; // ms
  const startTime = performance.now();

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function tick(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    el.textContent = Math.floor(easeOutExpo(progress) * target);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target; // snap to exact value
    }
  }

  requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => statsObserver.observe(el));

/* ─────────────────────────────────────────────────────
   5. PORTFOLIO FILTER
───────────────────────────────────────────────────── */
const filterBtns     = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    portfolioCards.forEach(card => {
      const matches = filter === 'all' || card.dataset.category === filter;

      if (matches) {
        card.classList.remove('hidden');
        // Reset and re-trigger entrance animation
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = 'fadeInUp 0.45s ease both';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ─────────────────────────────────────────────────────
   6. LIGHTBOX
───────────────────────────────────────────────────── */
const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose   = document.getElementById('lightboxClose');

// Open on card click or keyboard Enter/Space
portfolioCards.forEach(card => {
  card.addEventListener('click', openLightbox);
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox.call(card);
    }
  });

  function openLightbox() {
    const img     = card.querySelector('img');
    const heading = card.querySelector('h3');
    const sub     = card.querySelector('p');

    // Swap to a larger image for the lightbox
    lightboxImg.src = img.src.replace('w=800', 'w=1400');
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = `${heading.textContent}  ·  ${sub.textContent}`;

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lightboxImg.src = '';
}

lightboxClose.addEventListener('click', closeLightbox);

// Close on backdrop click
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && lightbox.classList.contains('open')) {
    closeLightbox();
  }
});

/* ─────────────────────────────────────────────────────
   7. TESTIMONIAL CAROUSEL
───────────────────────────────────────────────────── */
const track    = document.getElementById('carouselTrack');
const dotsWrap = document.getElementById('carouselDots');
const prevBtn  = document.getElementById('prevBtn');
const nextBtn  = document.getElementById('nextBtn');
const slides   = track.querySelectorAll('.testimonial-card');

let currentSlide = 0;
let autoTimer    = null;

// Build dot indicators
slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
  dot.setAttribute('role', 'tab');
  dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
  dotsWrap.appendChild(dot);
});

function goTo(index) {
  currentSlide = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;

  dotsWrap.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
    dot.setAttribute('aria-selected', String(i === currentSlide));
  });
}

function startAuto() {
  autoTimer = setInterval(() => goTo(currentSlide + 1), 4500);
}

function stopAuto() {
  clearInterval(autoTimer);
}

prevBtn.addEventListener('click', () => { stopAuto(); goTo(currentSlide - 1); startAuto(); });
nextBtn.addEventListener('click', () => { stopAuto(); goTo(currentSlide + 1); startAuto(); });

// Pause on hover
track.addEventListener('mouseenter', stopAuto);
track.addEventListener('mouseleave', startAuto);

// Touch swipe support
let touchStartX = 0;
track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
  const delta = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(delta) > 50) {
    stopAuto();
    goTo(currentSlide + (delta > 0 ? 1 : -1));
    startAuto();
  }
});

startAuto();

/* ─────────────────────────────────────────────────────
   8. CONTACT FORM — Validation + FormSubmit (fetch)
───────────────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const toast       = document.getElementById('toast');

let toastTimer = null;

/** Display a toast notification */
function showToast(message, type = 'success') {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.className   = `toast ${type} show`;

  toastTimer = setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => { toast.className = 'toast'; }, 450);
  }, 5500);
}

/** Validate a single field and toggle error UI */
function validateField(inputId, errorId, validatorFn) {
  const input   = document.getElementById(inputId);
  const errorEl = document.getElementById(errorId);
  const valid   = validatorFn(input.value.trim());

  input.classList.toggle('error', !valid);
  errorEl.classList.toggle('show', !valid);
  return valid;
}

/** Full form validation */
function validateForm() {
  const okName  = validateField('name',    'nameError',    v => v.length >= 2);
  const okEmail = validateField('email',   'emailError',   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
  const okMsg   = validateField('message', 'messageError', v => v.length >= 10);
  return okName && okEmail && okMsg;
}

// Clear individual field errors on input
['name', 'email', 'message'].forEach(id => {
  document.getElementById(id).addEventListener('input', function () {
    this.classList.remove('error');
    const errEl = document.getElementById(id + 'Error');
    if (errEl) errEl.classList.remove('show');
  });
});

/** Handle form submission */
contactForm.addEventListener('submit', async e => {
  e.preventDefault();

  if (!validateForm()) return;

  // Enter loading state
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  // Collect form data
  const payload = Object.fromEntries(new FormData(contactForm).entries());

  try {
    const response = await fetch('https://formsubmit.co/ajax/christinecheong88@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept':       'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (response.ok && result.success === 'true') {
      contactForm.reset();
      showToast("✓ Thank you! We'll be in touch within 24 hours.", 'success');
    } else {
      throw new Error(result.message || 'Submission failed');
    }

  } catch (err) {
    console.error('Form submission error:', err);
    showToast('✗ Something went wrong. Please email us directly at hello@luxeinteriors.sg', 'error');
  } finally {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  }
});

/* ─────────────────────────────────────────────────────
   9. BACK TO TOP BUTTON
───────────────────────────────────────────────────── */
const backToTopBtn = document.getElementById('backToTop');

function toggleBackToTop() {
  backToTopBtn.classList.toggle('visible', window.scrollY > 400);
}

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─────────────────────────────────────────────────────
   10. SMOOTH ANCHOR SCROLL — offset for fixed navbar
───────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;

    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - var_navHeight();
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─────────────────────────────────────────────────────
   Init: trigger onScroll once on load to set initial state
───────────────────────────────────────────────────── */
onScroll();
