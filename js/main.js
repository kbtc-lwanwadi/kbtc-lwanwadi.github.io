/* ============================================================
   main.js – portfolio interactivity
   ============================================================ */

// ── Year in footer ──────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── Navbar scroll effect ────────────────────────────────────
const header = document.querySelector('.site-header');

function handleScroll() {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  highlightActiveNav();
}

window.addEventListener('scroll', handleScroll, { passive: true });

// ── Mobile nav toggle ───────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navLinks.classList.toggle('open', !expanded);
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
  });
});

// ── Active nav link highlight on scroll ─────────────────────
const sections = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.nav__links a');

function highlightActiveNav() {
  const scrollY = window.scrollY;
  sections.forEach(section => {
    const top    = section.offsetTop - 100;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav__links a[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < bottom);
    }
  });
}

// ── Scroll-in animation (Intersection Observer) ─────────────
const revealElements = document.querySelectorAll(
  '.skill-card, .project-card, .about__grid, .contact__intro'
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});
