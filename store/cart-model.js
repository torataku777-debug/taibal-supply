/* Shared cart rules. The checkout provider must verify the same prices and quantities. */
(function (root, factory) {
  const model = factory();
  if (typeof module === 'object' && module.exports) module.exports = model;
  else root.TaibalCart = model;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const products = Object.freeze({
    lower: Object.freeze({ name: 'ローダメージ', range: '10〜120', price: 5480, image: (typeof document !== 'undefined' ? new URL('assets/lower/low_damage_counter_blue.webp', document.currentScript.src).href : 'assets/lower/low_damage_counter_blue.webp') }),
    higher: Object.freeze({ name: 'ハイダメージ', range: '130〜240', price: 5480, image: (typeof document !== 'undefined' ? new URL('assets/higher/high_damage_counter_blue.png', document.currentScript.src).href : 'assets/higher/high_damage_counter_blue.png') })
  });
  const MAX_QUANTITY = 99;
  function quantity(value) {
    if (typeof value !== 'number' || !Number.isFinite(value)) return 0;
    return Math.max(0, Math.min(MAX_QUANTITY, Math.floor(value)));
  }
  function normalize(raw) {
    return { lower: quantity(raw?.lower), higher: quantity(raw?.higher) };
  }
  function calculate(raw) {
    const cart = normalize(raw);
    const count = cart.lower + cart.higher;
    const pairs = Math.min(cart.lower, cart.higher);
    const subtotal = cart.lower * products.lower.price + cart.higher * products.higher.price;
    const discount = pairs * 480;
    return { cart, count, pairs, subtotal, discount, total: subtotal - discount };
  }
  // Existing Payment Links represent exactly one SKU, or one lower/higher pair.
  // Never send a larger cart to a link which would charge for fewer goods.
  function checkoutKey(raw) {
    const cart = normalize(raw);
    if (cart.lower === 1 && cart.higher === 0) return 'lower';
    if (cart.lower === 0 && cart.higher === 1) return 'higher';
    if (cart.lower === 1 && cart.higher === 1) return 'damageFull';
    return null;
  }
  function checkoutUrl(raw, cfg, test) {
    const key = checkoutKey(raw);
    if (!key) return null;
    try {
      const url = new URL(cfg?.[key]);
      const isTest = url.pathname.startsWith('/test_');
      if (url.protocol !== 'https:' || url.hostname !== 'buy.stripe.com') return null;
      if (test && cfg.mode === 'test' && isTest) return url.href;
      if (!test && cfg.mode === 'live' && cfg.enabled === true && !isTest) return url.href;
    } catch {}
    return null;
  }
  return Object.freeze({ products, MAX_QUANTITY, normalize, calculate, checkoutKey, checkoutUrl });
});
