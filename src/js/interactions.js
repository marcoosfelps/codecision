/**
 * CoDecision Core Interactions & Scroll-Driven Animation System
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initHeaderScroll();
  initMobileMenu();
  initScrollDrivenAnimations();
  initParallaxAndSpheres();
  initModalActions();
});

/* -------------------------------------------------------------------------- */
/* THEME TOGGLE                                                               */
/* -------------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const html = document.documentElement;
  
  // Default to dark mode for high-tech obsidian look
  const savedTheme = localStorage.getItem('codecision-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('codecision-theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }
}

function updateThemeIcon(theme) {
  const iconWrap = document.getElementById('themeIcon');
  if (!iconWrap) return;
  if (theme === 'dark') {
    iconWrap.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>`;
  } else {
    iconWrap.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>`;
  }
}

/* -------------------------------------------------------------------------- */
/* HEADER SCROLL BLUR                                                         */
/* -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* -------------------------------------------------------------------------- */
/* MOBILE MENU                                                                */
/* -------------------------------------------------------------------------- */
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.querySelector('.nav-menu');
  const links = document.querySelectorAll('.nav-menu .nav-link');

  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('mobile-open');
    // Change icon to X when open
    if (menu.classList.contains('mobile-open')) {
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    } else {
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    }
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('mobile-open');
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    });
  });
}

/* -------------------------------------------------------------------------- */
/* SCROLL-DRIVEN ANIMATION ENGINE                                             */
/* -------------------------------------------------------------------------- */
function initScrollDrivenAnimations() {
  const progressBar = document.getElementById('scrollProgressBar');
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  // 1. Scroll Progress Bar
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / (scrollHeight || 1)) * 100;
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
  }, { passive: true });

  // 2. IntersectionObserver for Reveal Animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        
        // Check if there are metric counters to animate
        const counters = entry.target.querySelectorAll('.animate-counter');
        counters.forEach(counter => animateNumberCounter(counter));
        
        // Optional: unobserve once revealed
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

function animateNumberCounter(el) {
  if (el.dataset.animated) return;
  el.dataset.animated = 'true';

  const targetText = el.textContent.trim();
  const numericMatch = targetText.match(/\d+(\.\d+)?/);
  if (!numericMatch) return;

  const targetNum = parseFloat(numericMatch[0]);
  const prefix = targetText.slice(0, numericMatch.index);
  const suffix = targetText.slice(numericMatch.index + numericMatch[0].length);

  let current = 0;
  const duration = 1600;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    // Ease out cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = (easeProgress * targetNum);

    el.textContent = `${prefix}${targetNum % 1 !== 0 ? currentVal.toFixed(1) : Math.floor(currentVal)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = targetText;
    }
  }

  requestAnimationFrame(update);
}

/* -------------------------------------------------------------------------- */
/* 3D PARALLAX & CHROME SPHERES SCROLL MOTION                                 */
/* -------------------------------------------------------------------------- */
function initParallaxAndSpheres() {
  const heroVisual = document.querySelector('.hero-visual');
  const spheres = document.querySelectorAll('.chrome-sphere');
  const floatingCards = document.querySelectorAll('.glass-profile-card, .glass-focus-card, .glass-notification-card, .glass-progress-card');

  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;
  let scrollY = 0;

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY || 0;
  }, { passive: true });

  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  if (heroVisual && !isTouchDevice) {
    window.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX = (e.clientX - centerX) / (rect.width / 2 || 1);
      mouseY = (e.clientY - centerY) / (rect.height / 2 || 1);
    });
  }

  function renderPhysics() {
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;

    spheres.forEach((sphere, index) => {
      const speed = (index + 1) * 12;
      const scrollFactor = (index + 1) * 0.15;
      const rotate = currentX * 10 + scrollY * 0.05;
      const translateY = currentY * speed + (scrollY * scrollFactor * -0.5);
      sphere.style.transform = `translate(${currentX * speed}px, ${translateY}px) rotate(${rotate}deg)`;
    });

    floatingCards.forEach((card, idx) => {
      const cardSpeed = (idx + 1) * 4;
      const scrollCardFactor = (idx + 1) * -0.06;
      card.style.transform = `translate(${currentX * cardSpeed}px, ${currentY * cardSpeed + scrollY * scrollCardFactor}px)`;
    });

    requestAnimationFrame(renderPhysics);
  }

  renderPhysics();

  // 3D Card Tilt on Hover (Only for desktop)
  if (!isTouchDevice) {
    const tiltCards = document.querySelectorAll('.glass-card, .product-card, .case-card');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
      });
    });
  }
}

/* -------------------------------------------------------------------------- */
/* MODAL ACTIONS                                                              */
/* -------------------------------------------------------------------------- */
function initModalActions() {
  const openButtons = document.querySelectorAll('.open-collaborate-modal');
  const modal = document.getElementById('collaborateModal');
  const closeBtn = document.getElementById('closeModalBtn');

  if (!modal) return;

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}
