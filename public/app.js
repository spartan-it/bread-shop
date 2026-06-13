/* ── app.js ─ Burgervault interactions ──────────────────────────────────── */

// ── Navbar scroll effect ─────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Mobile menu toggle ───────────────────────────────────────────────────
const burgerToggle = document.getElementById('burger-toggle');
const mobileMenu   = document.getElementById('mobile-menu');
burgerToggle.addEventListener('click', () => {
  burgerToggle.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burgerToggle.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ── Floating particles ───────────────────────────────────────────────────
const particlesEl = document.getElementById('particles');
function createParticle() {
  const p    = document.createElement('div');
  const size = Math.random() * 6 + 2;
  p.className = 'particle';
  p.style.cssText = `
    width:${size}px; height:${size}px;
    left:${Math.random() * 100}%;
    bottom:-${size}px;
    animation-duration:${Math.random() * 15 + 8}s;
    animation-delay:${Math.random() * 10}s;
    opacity:${Math.random() * 0.6 + 0.2};
  `;
  particlesEl.appendChild(p);
  p.addEventListener('animationend', () => p.remove());
}
for (let i = 0; i < 30; i++) createParticle();
setInterval(createParticle, 800);

// ── Menu filter ──────────────────────────────────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const menuCards  = document.querySelectorAll('.menu-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    menuCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = 'fadeSlideUp 0.4s ease both';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ── Add-to-order toast ───────────────────────────────────────────────────
const toast    = document.getElementById('cart-toast');
const toastMsg = toast.querySelector('.toast-msg');
let toastTimer;

function showToast(name) {
  toastMsg.textContent = `${name} added to your order!`;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

const addBtns = {
  'add-smashvault': 'The Smashvault',
  'add-goldenpat':  'The Golden Pat',
  'add-hellfire':   'Hellfire',
  'add-smokehouse': 'Smokehouse King',
  'add-nashville':  'Nashville Hot',
  'add-greenhouse': 'The Greenhouse',
};
Object.entries(addBtns).forEach(([id, name]) => {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener('click', () => showToast(name));
});

// ── Newsletter form ──────────────────────────────────────────────────────
const newsletterForm = document.getElementById('newsletter-form');
newsletterForm.addEventListener('submit', e => {
  e.preventDefault();
  const input = document.getElementById('email-input');
  showToast('🎉 You\'re subscribed');
  input.value = '';
});

// ── Intersection Observer (reveal on scroll) ─────────────────────────────
const observerOpts = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeSlideUp 0.6s ease both';
      observer.unobserve(entry.target);
    }
  });
}, observerOpts);

document.querySelectorAll(
  '.menu-card, .special-card, .pillar, .order-option, .about-img-wrap'
).forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});

// ── Smooth active nav link ───────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--amber)' : '';
  });
});

// ── Live Order Log Database Testing ──────────────────────────────────────
const orderForm = document.getElementById('order-form');
const ordersList = document.getElementById('orders-list');

async function fetchOrders() {
  try {
    const res = await fetch('/api/orders');
    const data = await res.json();
    ordersList.innerHTML = '';
    
    if (data.length === 0) {
      ordersList.innerHTML = '<p style="text-align: center; color: var(--text-muted); font-style: italic;">No orders placed yet.</p>';
      return;
    }
    
    data.reverse().forEach(o => {
      const orderDiv = document.createElement('div');
      orderDiv.style.cssText = `
        padding: 0.8rem;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.05);
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: white;
      `;
      
      const date = new Date(o.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      orderDiv.innerHTML = `
        <span><strong>${escapeHTML(o.name)}</strong> ordered <strong>${escapeHTML(o.burger)}</strong></span>
        <span style="font-size: 0.8rem; color: var(--text-muted);">${date}</span>
      `;
      ordersList.appendChild(orderDiv);
    });
  } catch (err) {
    console.error('Failed to fetch orders:', err);
  }
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

orderForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nameInput = document.getElementById('order-name');
  const burgerInput = document.getElementById('order-burger');
  const name = nameInput.value.trim();
  const burger = burgerInput.value;
  
  if (!name || !burger) return;
  
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, burger })
    });
    
    if (res.ok) {
      nameInput.value = '';
      burgerInput.value = '';
      showToast('🍔 Order recorded in database!');
      await fetchOrders();
    } else {
      showToast('❌ Failed to record order.');
    }
  } catch (err) {
    console.error('Failed to place order:', err);
    showToast('❌ Network error.');
  }
});

// Load live orders on page startup
if (orderForm && ordersList) {
  fetchOrders();
  // Poll every 5 seconds to show real-time changes
  setInterval(fetchOrders, 5000);
}
