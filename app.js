/* ============================================
   app.js - Portfolio JavaScript
   ============================================ */
'use strict';
// ============ NAVBAR SCROLL EFFECT ============
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNavLink();
});
// ============ HAMBURGER MENU ============
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksContainer.classList.toggle('open');
});
// Close menu when link is clicked
navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksContainer.classList.remove('open');
  });
});
// ============ ACTIVE NAV LINK ON SCROLL ============
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.dataset.section === current) {
      link.classList.add('active');
    }
  });
}
// ============ REVEAL ANIMATIONS (Intersection Observer) ============
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Animate skill bars when skills section comes into view
        const skillBar = entry.target.querySelector?.('.skill-bar');
        if (skillBar) {
          animateSkillBar(skillBar);
        }
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
// Animate all skill bars when skill cards appear
const skillCardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target.querySelector('.skill-bar');
        if (bar) {
          setTimeout(() => animateSkillBar(bar), parseInt(entry.target.style.getPropertyValue('--i') || 0) * 70);
        }
      }
    });
  },
  { threshold: 0.3 }
);
document.querySelectorAll('.skill-card').forEach(card => skillCardObserver.observe(card));
function animateSkillBar(barEl) {
  const fill = barEl.querySelector('.skill-bar-fill');
  const width = barEl.dataset.width;
  if (fill && width) {
    fill.style.width = width + '%';
  }
}
// ============ TYPED TEXT ANIMATION ============
const typedEl = document.getElementById('typed-text');
const phrases = [
  'Data Science Enthusiast',
  'Python Learner',
  'ML Explorer',
  'BTech CS Student',
  'Aspiring Data Scientist',
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeTimeout;
function typeEffect() {
  const current = phrases[phraseIndex];
  if (!isDeleting) {
    typedEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      typeTimeout = setTimeout(typeEffect, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  const speed = isDeleting ? 55 : 90;
  typeTimeout = setTimeout(typeEffect, speed);
}
// Start typing after a short delay
setTimeout(typeEffect, 800);
// ============ COUNTER ANIMATION ============
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start);
    }
  }, 16);
}
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.stat-number').forEach(el => {
          animateCounter(el, parseInt(el.dataset.target));
        });
        statsObserver.disconnect();
      }
    });
  },
  { threshold: 0.5 }
);
const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);
// ============ FLOATING PARTICLES ============
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const colors = ['rgba(6,182,212,', 'rgba(124,58,237,', 'rgba(79,70,229,'];
  const count = 25;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 4 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const opacity = Math.random() * 0.5 + 0.1;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: ${color}${opacity});
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      --dur: ${Math.random() * 10 + 6}s;
      --delay: -${Math.random() * 10}s;
      box-shadow: 0 0 ${size * 3}px ${color}0.5);
    `;
    container.appendChild(p);
  }
}
createParticles();
// ============ CONTACT FORM VALIDATION ============
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const submitBtn = document.getElementById('submit-btn');
const btnText = document.getElementById('btn-text');
function validateField(id, validator, errorMsg) {
  const input = document.getElementById(id);
  const error = document.getElementById(`${id}-error`);
  const value = input.value.trim();
  if (!validator(value)) {
    input.classList.add('error');
    error.textContent = errorMsg;
    return false;
  } else {
    input.classList.remove('error');
    error.textContent = '';
    return true;
  }
}
function validateForm() {
  const nameOk = validateField('name', v => v.length >= 2, 'Please enter your full name.');
  const emailOk = validateField('email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Please enter a valid email address.');
  const subjectOk = validateField('subject', v => v.length >= 3, 'Please enter a subject (min 3 characters).');
  const msgOk = validateField('message', v => v.length >= 10, 'Please enter a message (min 10 characters).');
  return nameOk && emailOk && subjectOk && msgOk;
}
// Real-time validation on blur
['name', 'email', 'subject', 'message'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('blur', () => {
    if (id === 'name') validateField('name', v => v.length >= 2, 'Please enter your full name.');
    if (id === 'email') validateField('email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Please enter a valid email address.');
    if (id === 'subject') validateField('subject', v => v.length >= 3, 'Please enter a subject.');
    if (id === 'message') validateField('message', v => v.length >= 10, 'Please enter a message (min 10 characters).');
  });
  el.addEventListener('input', () => {
    el.classList.remove('error');
    const errorEl = document.getElementById(`${id}-error`);
    if (errorEl) errorEl.textContent = '';
  });
});
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  // Simulate sending
  submitBtn.disabled = true;
  btnText.textContent = 'Sending…';
  setTimeout(() => {
    submitBtn.disabled = false;
    btnText.textContent = 'Send Message';
    contactForm.reset();
    formSuccess.classList.add('visible');
    setTimeout(() => {
      formSuccess.classList.remove('visible');
    }, 5000);
  }, 1600);
});
// ============ SMOOTH SCROLL FOR ALL ANCHORS ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
// ============ ORBIT ICON COUNTER-SPIN FIX ============
// Ensure orbit icons don't wobble by using CSS custom properties
// (handled purely in CSS via keyframes)
console.log('%c👋 Hello, fellow developer!', 'color: #06b6d4; font-size: 18px; font-weight: bold;');
console.log('%cPortfolio built with ❤️ using HTML, CSS & Vanilla JS', 'color: #94a3b8; font-size: 13px;');
// ============ CURSOR GLOW TRACKING ============
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow) {
  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top  = e.clientY + 'px';
  });
}
// ============ 3D CARD TILT EFFECT ============
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width  / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -8;
    const rotY = ((x - cx) / cx) *  8;
    card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
// ============ MAGNETIC BUTTON EFFECT ============
document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width  / 2;
    const y = e.clientY - rect.top  - rect.height / 2;
    btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px) translateY(-2px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});
// ============ RIPPLE ON CLICK ============
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect   = this.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute; border-radius:50%; background:rgba(255,255,255,0.25);
      width:${size}px; height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top  - size/2}px;
      animation: rippleAnim 0.55s ease-out forwards; pointer-events:none;
    `;
    if (!document.getElementById('ripple-style')) {
      const s = document.createElement('style');
      s.id = 'ripple-style';
      s.textContent = '@keyframes rippleAnim { from{transform:scale(0);opacity:1} to{transform:scale(2.5);opacity:0} }';
      document.head.appendChild(s);
    }
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});
// ============ DIRECTIONAL REVEAL OBSERVER ============
const dirRevealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal-left, .reveal-right').forEach(el => dirRevealObserver.observe(el));