// src/lib/cart.js
// ─── localStorage-based cart (client only) ───────────────────────────────────
'use client';

const CART_KEY = 'athlofit_cart';

export function getCart() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

export function addToCart(product, quantity = 1, variant = null) {
  const cart = getCart();
  // Cart line is unique per product + variant combination.
  const lineId = variant?.variantId ? `${product._id}:${variant.variantId}` : product._id;
  const existing = cart.find((item) => item.lineId === lineId);
  const price = variant?.priceOverride != null
    ? variant.priceOverride
    : (product.discountedPrice ?? product.price);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      lineId,
      productId: product._id,
      variantId: variant?.variantId || null,
      variantLabel: variant ? [variant.size, variant.color].filter(Boolean).join(' / ') : '',
      name: product.name,
      price,
      image: product.images?.[0] || '',
      quantity,
    });
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
}

export function removeFromCart(lineId) {
  const cart = getCart().filter((item) => (item.lineId || item.productId) !== lineId);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
}

export function updateQuantity(lineId, quantity) {
  const cart = getCart();
  const item = cart.find((i) => (i.lineId || i.productId) === lineId);
  if (item) item.quantity = Math.max(1, quantity);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event('cart-updated'));
}

export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Coin conversion: 10 coins = ₹1
export function getCartTotalCoins() {
  return getCartTotal() * 10;
}
