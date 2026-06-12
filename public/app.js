// ── Navbar scroll ────────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Mobile menu ──────────────────────────────────────────────────────────
const toggle     = document.getElementById('burger-toggle');
const mobileMenu = document.getElementById('mobile-menu');
toggle.addEventListener('click', () => {
  toggle.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    toggle.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ── Bread menu tabs ──────────────────────────────────────────────────────
const tabs  = document.querySelectorAll('.tab');
const cards = document.querySelectorAll('.bread-card');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const selected = tab.dataset.tab;
    cards.forEach(card => {
      if (card.dataset.tab === selected) {
        card.style.display = 'flex';
        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = 'fadeUp 0.4s ease both';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ── Toast ────────────────────────────────────────────────────────────────
const toast    = document.getElementById('toast');
const toastMsg = document.getElementById('toast-msg');
let toastTimer;

function showToast(msg) {
  toastMsg.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

const addButtons = {
  'add-sourdough':   'Country Sourdough',
  'add-rye':         'Dark Rye',
  'add-multigrain':  'Seeded Multigrain',
  'add-ciabatta':    'Ciabatta',
  'add-baguette':    'French Baguette',
  'add-brioche':     'Brioche Rolls',
  'add-dinner-rolls':'Dinner Rolls',
  'add-focaccia':    'Rosemary Focaccia',
  'add-challah':     'Challah',
  'add-olive':       'Olive & Herb Loaf',
};
Object.entries(addButtons).forEach(([id, name]) => {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener('click', () => showToast(`${name} added to your order!`));
});

// ── Order form ───────────────────────────────────────────────────────────
const orderForm = document.getElementById('order-form');
orderForm.addEventListener('submit', e => {
  e.preventDefault();
  const name  = document.getElementById('order-name').value;
  const bread = document.getElementById('order-bread').value;
  showToast(`✅ ${name}'s order for ${bread.split('—')[0].trim()} is reserved!`);
  orderForm.reset();
});

// ── Highlight today's day in schedule ────────────────────────────────────
const dayIds = ['day-sun','day-mon','day-tue','day-wed','day-thu','day-fri','day-sat'];
const todayId = dayIds[new Date().getDay()];
const todayCard = document.getElementById(todayId);
if (todayCard) {
  document.querySelectorAll('.day-card').forEach(c => c.classList.remove('today'));
  todayCard.classList.add('today');
}

// ── Scroll reveal ────────────────────────────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.animation = 'fadeUp 0.6s ease both';
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.bread-card, .step, .badge, .day-card, .about-img-wrap, .order-form, .contact-chip'
).forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});

// ── Active nav ───────────────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--wheat)' : '';
  });
});
