/* Shared cart rules. The checkout provider must verify the same prices and quantities. */
(function (root, factory) {
  const model = factory();
  if (typeof module === 'object' && module.exports) module.exports = model;
  else root.TaibalCart = model;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const products = Object.freeze({
    lower: Object.freeze({ name: 'ローダメージ', range: '10〜120', unit: '6個入り', price: 5480, image: (typeof document !== 'undefined' ? new URL('assets/lower/low_damage_counter_blue.webp', document.currentScript.src).href : 'assets/lower/low_damage_counter_blue.webp') }),
    higher: Object.freeze({ name: 'ハイダメージ', range: '130〜240', unit: '6個入り', price: 5480, image: (typeof document !== 'undefined' ? new URL('assets/higher/high_damage_counter_blue.png', document.currentScript.src).href : 'assets/higher/high_damage_counter_blue.png') }),
    ability: Object.freeze({ name: '特性使用済みマーカー', unit: '2個入り', price: 3280, image: 'https://cdn.shopify.com/s/files/1/0813/2188/6018/files/metal-pokemon-tcg-ability-markers-aluminum-us.jpg?v=1768006305&width=1200' }),
    condition: Object.freeze({ name: 'どく・やけどマーカー', unit: '各1個入り', price: 3280, image: 'https://cdn.shopify.com/s/files/1/0813/2188/6018/files/7B2783A1-62B4-43B6-96C0-BC7A64C24586.png?v=1782411405&width=1200' }),
    case: Object.freeze({ name: '収納ケース', unit: 'ケース1個', price: 9480, image: 'https://cdn.shopify.com/s/files/1/0813/2188/6018/files/802EC6D9-BE73-4D0C-B43A-35C3DD17DD65.jpg?v=1744613641&width=1200' })
  });
  const MAX_QUANTITY = 99;
  function quantity(value) {
    if (typeof value !== 'number' || !Number.isFinite(value)) return 0;
    return Math.max(0, Math.min(MAX_QUANTITY, Math.floor(value)));
  }
  function normalize(raw) {
    return Object.fromEntries(Object.keys(products).map(id => [id, quantity(raw?.[id])]));
  }
  function calculate(raw) {
    const cart = normalize(raw);
    const count = Object.values(cart).reduce((sum, q) => sum + q, 0);
    const pairs = Math.min(cart.lower, cart.higher);
    const markerPairs = Math.min(cart.ability, cart.condition);
    const fullSets = Math.min(pairs, markerPairs);
    const subtotal = Object.entries(cart).reduce((sum,[id,q]) => sum + products[id].price * q, 0);
    const discounts = [
      {label:'ロー＋ハイ',count:pairs,amount:pairs*480},
      {label:'マーカー2種類',count:markerPairs,amount:markerPairs*580},
      {label:'4種類まとめ買い追加割引',count:fullSets,amount:fullSets*480}
    ].filter(d=>d.count>0);
    const discount = discounts.reduce((sum,d)=>sum+d.amount,0);
    return { cart, count, pairs, markerPairs, fullSets, discounts, subtotal, discount, total: subtotal - discount };
  }
  // Existing Payment Links represent exactly one SKU, or one lower/higher pair.
  // Never send a larger cart to a link which would charge for fewer goods.
  function checkoutKey(raw) {
    const cart = normalize(raw);
    if (cart.ability || cart.condition || cart.case) return null;
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
