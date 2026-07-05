/* =========================================================
   VOLT SPORTS — Store logic
   Table of contents:
   1. Product data
   2. State
   3. DOM references
   4. Helpers
   5. Rendering: products
   6. Rendering: cart
   7. Cart actions
   8. Toast
   9. Modal
   10. Header interactions (search, menu, cart drawer)
   11. Filtering
   12. Countdown timer
   13. Newsletter form
   14. Init
========================================================= */

/* ---------- 1. Product data ---------- */
const PRODUCTS = [
  { id: 1, name: 'Momentum Runner',    category: 'Running',    price: 129.99, oldPrice: null,  badge: 'New',  icon: '👟', rating: 4.5 },
  { id: 2, name: 'Apex Trainer',       category: 'Training',   price: 89.99,  oldPrice: null,  badge: null,   icon: '🏋️', rating: 4.0 },
  { id: 3, name: 'Court King Jersey',  category: 'Basketball', price: 59.99,  oldPrice: 79.99, badge: 'Sale', icon: '🏀', rating: 4.8 },
  { id: 4, name: 'Strike Pro Ball',    category: 'Football',   price: 34.99,  oldPrice: null,  badge: null,   icon: '⚽', rating: 4.3 },
  { id: 5, name: 'Flex Training Shorts', category: 'Training', price: 29.99,  oldPrice: null,  badge: null,   icon: '🩳', rating: 4.1 },
  { id: 6, name: 'Sprint Cap',         category: 'Running',    price: 19.99,  oldPrice: null,  badge: null,   icon: '🧢', rating: 4.2 },
  { id: 7, name: 'Baseline Hoodie',    category: 'Basketball', price: 64.99,  oldPrice: 84.99, badge: 'Sale', icon: '🎽', rating: 4.6 },
  { id: 8, name: 'Trailblazer Backpack', category: 'Outdoor',  price: 49.99,  oldPrice: null,  badge: null,   icon: '🎒', rating: 4.4 },
  { id: 9, name: 'PowerGrip Gloves',   category: 'Training',   price: 24.99,  oldPrice: null,  badge: 'New',  icon: '🧤', rating: 4.0 },
];

/* ---------- 2. State ---------- */
// Cart persists only for the current session (in-memory), keyed by product id.
let cart = [];          // [{ id, qty }]
let activeFilter = 'All';

/* ---------- 3. DOM references ---------- */
const productGrid   = document.getElementById('productGrid');
const filterBar      = document.getElementById('filterBar');
const cartItemsEl    = document.getElementById('cartItems');
const cartSubtotalEl = document.getElementById('cartSubtotal');
const cartCountEl    = document.getElementById('cartCount');
const cartDrawer     = document.getElementById('cartDrawer');
const overlay        = document.getElementById('overlay');
const toastEl        = document.getElementById('toast');
const modalOverlay   = document.getElementById('modalOverlay');

/* ---------- 4. Helpers ---------- */
const formatPrice = (value) => `$${value.toFixed(2)}`;

const renderStars = (rating) => {
  const fullStars = Math.round(rating);
  return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
};

const findProduct = (id) => PRODUCTS.find((product) => product.id === id);

/* ---------- 5. Rendering: products ---------- */
function renderProducts() {
  const visibleProducts = activeFilter === 'All'
    ? PRODUCTS
    : PRODUCTS.filter((product) => product.category === activeFilter);

  productGrid.innerHTML = visibleProducts.map(buildProductCard).join('');
}

function buildProductCard(product) {
  const badgeHtml = product.badge
    ? `<span class="product-badge ${product.badge === 'Sale' ? 'sale' : ''}">${product.badge}</span>`
    : '';

  const priceHtml = product.oldPrice
    ? `<span class="price">${formatPrice(product.price)}</span><span class="price-old">${formatPrice(product.oldPrice)}</span>`
    : `<span class="price">${formatPrice(product.price)}</span>`;

  return `
    <article class="product-card">
      <div class="product-media">
        ${badgeHtml}
        <span aria-hidden="true">${product.icon}</span>
      </div>
      <div class="product-body">
        <span class="product-cat">${product.category}</span>
        <h3 class="product-name">${product.name}</h3>
        <span class="product-rating">${renderStars(product.rating)}</span>
        <div class="product-footer">
          <div class="price-row">${priceHtml}</div>
          <button class="add-btn" data-id="${product.id}" aria-label="Add ${product.name} to cart">+</button>
        </div>
      </div>
    </article>
  `;
}

/* ---------- 6. Rendering: cart ---------- */
function renderCart() {
  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p class="cart-empty">Your cart is empty. Go find your next favorite gear.</p>';
  } else {
    cartItemsEl.innerHTML = cart.map(buildCartItem).join('');
  }
  updateCartSummary();
}

function buildCartItem(cartEntry) {
  const product = findProduct(cartEntry.id);
  return `
    <div class="cart-item">
      <div class="cart-item-media">${product.icon}</div>
      <div class="cart-item-info">
        <h5>${product.name}</h5>
        <span class="ci-price">${formatPrice(product.price)}</span>
        <div class="qty-control">
          <button class="qty-decrease" data-id="${product.id}" aria-label="Decrease quantity">−</button>
          <span>${cartEntry.qty}</span>
          <button class="qty-increase" data-id="${product.id}" aria-label="Increase quantity">+</button>
        </div>
        <button class="remove-btn" data-id="${product.id}">Remove</button>
      </div>
    </div>
  `;
}

function updateCartSummary() {
  const totalItems = cart.reduce((sum, entry) => sum + entry.qty, 0);
  const subtotal = cart.reduce((sum, entry) => sum + entry.qty * findProduct(entry.id).price, 0);

  cartCountEl.textContent = totalItems;
  cartSubtotalEl.textContent = formatPrice(subtotal);
}

/* ---------- 7. Cart actions ---------- */
function addToCart(productId) {
  const existingEntry = cart.find((entry) => entry.id === productId);

  if (existingEntry) {
    existingEntry.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }

  renderCart();
  showToast(`${findProduct(productId).name} added to cart`);
}

function changeQuantity(productId, delta) {
  const entry = cart.find((item) => item.id === productId);
  if (!entry) return;

  entry.qty += delta;

  if (entry.qty <= 0) {
    removeFromCart(productId);
    return;
  }
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((entry) => entry.id !== productId);
  renderCart();
}

/* ---------- 8. Toast ---------- */
let toastTimer = null;
function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
}

/* ---------- 9. Modal ---------- */
function openModal() {
  modalOverlay.classList.add('active');
}
function closeModal() {
  modalOverlay.classList.remove('active');
}

/* ---------- 10. Header interactions ---------- */
function openCartDrawer() {
  cartDrawer.classList.add('open');
  overlay.classList.add('active');
}
function closeCartDrawer() {
  cartDrawer.classList.remove('open');
  overlay.classList.remove('active');
}

function toggleSearchBar() {
  document.getElementById('searchBar').classList.toggle('open');
  document.getElementById('searchInput').focus();
}
function closeSearchBar() {
  document.getElementById('searchBar').classList.remove('open');
}

function toggleMobileMenu() {
  document.getElementById('mainNav').classList.toggle('mobile-open');
}

/* ---------- 11. Filtering ---------- */
function setActiveFilter(filterValue) {
  activeFilter = filterValue;

  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.filter === filterValue);
  });

  renderProducts();
  document.getElementById('shop').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ---------- 12. Countdown timer ---------- */
function startCountdown() {
  const saleEndDate = new Date();
  saleEndDate.setDate(saleEndDate.getDate() + 2); // flash sale ends in 2 days

  const dayEl = document.getElementById('cdDays');
  const hourEl = document.getElementById('cdHours');
  const minEl = document.getElementById('cdMinutes');
  const secEl = document.getElementById('cdSeconds');

  function tick() {
    const remainingMs = saleEndDate - new Date();

    if (remainingMs <= 0) {
      [dayEl, hourEl, minEl, secEl].forEach((el) => (el.textContent = '00'));
      clearInterval(intervalId);
      return;
    }

    const days = Math.floor(remainingMs / 86400000);
    const hours = Math.floor((remainingMs % 86400000) / 3600000);
    const minutes = Math.floor((remainingMs % 3600000) / 60000);
    const seconds = Math.floor((remainingMs % 60000) / 1000);

    dayEl.textContent = String(days).padStart(2, '0');
    hourEl.textContent = String(hours).padStart(2, '0');
    minEl.textContent = String(minutes).padStart(2, '0');
    secEl.textContent = String(seconds).padStart(2, '0');
  }

  tick();
  const intervalId = setInterval(tick, 1000);
}

/* ---------- 13. Newsletter form ---------- */
function handleNewsletterSubmit(event) {
  event.preventDefault();
  const emailInput = document.getElementById('newsletterEmail');
  const messageEl = document.getElementById('formMsg');

  messageEl.textContent = `Thanks! We'll send drops to ${emailInput.value}.`;
  emailInput.value = '';
}

/* ---------- 14. Init ---------- */
function attachEventListeners() {
  // Product grid: event delegation for "add to cart"
  productGrid.addEventListener('click', (event) => {
    const button = event.target.closest('.add-btn');
    if (!button) return;
    addToCart(Number(button.dataset.id));
  });

  // Category filter buttons (shop section)
  filterBar.addEventListener('click', (event) => {
    const button = event.target.closest('.filter-btn');
    if (!button) return;
    setActiveFilter(button.dataset.filter);
  });

  // Category cards (hero categories section) reuse the same filter logic
  document.querySelectorAll('.category-card').forEach((card) => {
    card.addEventListener('click', () => setActiveFilter(card.dataset.filter));
  });

  // Cart drawer: quantity controls, removal (event delegation)
  cartItemsEl.addEventListener('click', (event) => {
    const id = Number(event.target.dataset.id);
    if (event.target.classList.contains('qty-increase')) changeQuantity(id, 1);
    if (event.target.classList.contains('qty-decrease')) changeQuantity(id, -1);
    if (event.target.classList.contains('remove-btn')) removeFromCart(id);
  });

  // Cart open/close
  document.getElementById('cartToggle').addEventListener('click', openCartDrawer);
  document.getElementById('cartClose').addEventListener('click', closeCartDrawer);
  overlay.addEventListener('click', closeCartDrawer);

  // Checkout flow
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) {
      showToast('Your cart is empty');
      return;
    }
    closeCartDrawer();
    openModal();
    cart = [];
    renderCart();
  });
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOk').addEventListener('click', closeModal);

  // Search bar
  document.getElementById('searchToggle').addEventListener('click', toggleSearchBar);
  document.getElementById('searchClose').addEventListener('click', closeSearchBar);

  // Mobile menu
  document.getElementById('menuToggle').addEventListener('click', toggleMobileMenu);

  // Newsletter
  document.getElementById('newsletterForm').addEventListener('submit', handleNewsletterSubmit);

  // Close mobile menu after choosing a link
  document.querySelectorAll('#mainNav a').forEach((link) => {
    link.addEventListener('click', () => document.getElementById('mainNav').classList.remove('mobile-open'));
  });
}

function init() {
  renderProducts();
  renderCart();
  startCountdown();
  attachEventListeners();
}

document.addEventListener('DOMContentLoaded', init);