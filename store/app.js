(() => {
  'use strict';
  const model = window.TaibalCart;
  const dialog = document.querySelector('#cart-dialog');
  if (!model || !dialog) return;
  const cfg = window.TAIBAL_CHECKOUT || {};
  const test = cfg.mode === 'test' && new URLSearchParams(location.search).get('test') === '1';
  const storageKey = test ? 'taibal-cart-test-v1' : 'taibal-cart-v1';
  const money = value => '¥' + value.toLocaleString('ja-JP');
  const $ = selector => document.querySelector(selector);
  const products = model.products;
  let cart = model.normalize({});
  let returnFocus;
  let toastTimer;
  try { cart = model.normalize(JSON.parse(localStorage.getItem(storageKey))); } catch {}
  if (test) {
    const notice = document.createElement('div');
    notice.className = 'test-notice';
    notice.textContent = 'テスト決済モード：実際の注文・請求は発生しません。';
    document.body.prepend(notice);
    document.querySelectorAll('[data-test-link]').forEach(a => {
      const url = new URL(a.href);
      if (url.origin === location.origin) { url.searchParams.set('test', '1'); a.href = url.href; }
    });
  }
  function save() { try { localStorage.setItem(storageKey, JSON.stringify(cart)); } catch {} }
  function announce(message) {
    $('[data-cart-announcement]').textContent = message;
    if (dialog.open) return;
    clearTimeout(toastTimer);
    $('[data-toast]').textContent = message;
    $('[data-toast]').hidden = false;
    toastTimer = setTimeout(() => { $('[data-toast]').hidden = true; }, 3500);
  }
  function render(preserveItems = false) {
    const state = model.calculate(cart);
    document.querySelectorAll('[data-cart-count]').forEach(el => { el.textContent = state.count; });
    $('[data-cart-dock]').hidden = !state.count;
    $('[data-dock-count]').textContent = state.count + '点';
    $('[data-dock-total]').textContent = money(state.total);
    $('[data-dock-discount]').textContent = state.discount ? money(state.discount) + 'の割引を適用済み・税込' : '税込・送料別';
    $('[data-cart-empty]').hidden = Boolean(state.count);
    $('[data-cart-content]').hidden = !state.count;
    if (!preserveItems) $('[data-cart-items]').innerHTML = Object.entries(cart).filter(([,q]) => q > 0).map(([id,q]) => {
      const p = products[id];
      return `<article class="cart-item"><img src="${p.image}" alt="${p.name}" width="88" height="88"><div><h3>${p.name}</h3><p class="item-meta">${p.unit} / ${money(p.price)}（税込・予定）</p><div class="cart-item-controls"><div class="quantity"><button data-change="${id}" data-delta="-1" aria-label="${p.name}を1点減らす">−</button><input type="number" inputmode="numeric" min="1" max="${model.MAX_QUANTITY}" step="1" value="${q}" data-quantity="${id}" aria-label="${p.name}の数量"><button data-change="${id}" data-delta="1" aria-label="${p.name}を1点増やす" ${q >= model.MAX_QUANTITY ? 'disabled' : ''}>＋</button></div><strong class="item-total" data-item-total="${id}">${money(p.price*q)}</strong></div><button class="remove-button" data-remove="${id}" aria-label="${p.name}をカートから削除">削除</button></div></article>`;
    }).join('');
    for (const id of Object.keys(products)) {
      const total = dialog.querySelector(`[data-item-total="${id}"]`);
      if (total) total.textContent = money(cart[id] * products[id].price);
      const plus = dialog.querySelector(`[data-change="${id}"][data-delta="1"]`);
      if (plus) plus.disabled = cart[id] >= model.MAX_QUANTITY;
    }
    const missing = cart.lower > cart.higher ? 'higher' : cart.higher > cart.lower ? 'lower' : null;
    const offer = $('[data-cart-offer]');
    const active = state.discount ? `<strong>まとめ買い割引 −${money(state.discount)}</strong><p>${state.discounts.map(d=>`${d.label} ${d.count}組：−${money(d.amount)}`).join('<br>')}</p>` : '<strong>組み合わせに応じて、自動で割引。</strong><p>ロー＋ハイは480円引き。マーカー2種類は580円引き。4種類を揃えるとさらに480円引き。</p>';
    let suggestions = missing ? `<button data-add="${missing}">${products[missing].name}を1点追加（${money(products[missing].price)}）</button><p>ロー＋ハイの割引が480円増えます。</p>` : '';
    const markerMissing = cart.ability > cart.condition ? 'condition' : cart.condition > cart.ability ? 'ability' : null;
    if(markerMissing) suggestions += `<button data-add="${markerMissing}">${products[markerMissing].name}を1点追加（${money(products[markerMissing].price)}）</button><p>マーカー2種類の割引が580円増えます。</p>`;
    offer.innerHTML = active + suggestions;
    $('[data-subtotal]').textContent = money(state.subtotal);
    $('[data-discount-row]').hidden = !state.discount;
    $('[data-discount]').textContent = '−' + money(state.discount);
    $('[data-pairs]').textContent = '組み合わせに応じて自動適用';
    $('[data-total]').textContent = money(state.total);
    const url = model.checkoutUrl(cart, cfg, test);
    const checkout = $('[data-checkout]');
    checkout.hidden = !url;
    checkout.removeAttribute('href');
    if (url) { checkout.href = url; checkout.textContent = test ? 'テスト決済へ' : '購入手続きへ'; }
    $('[data-launch-note]').hidden = Boolean(url && !test);
    const status = $('[data-checkout-status]');
    status.hidden = !test && !(cfg.mode === 'live' && cfg.enabled);
    status.textContent = url ? (test ? '表示中の商品と金額でテスト決済を開きます。' : '') : (test ? 'この数量のテスト決済は準備中です。ダメージカウンター単品1点、またはロー・ハイ各1点のみ対応しています。' : 'この組み合わせの購入受付は準備中です。');
  }
  function change(id, value, message) {
    if (!Object.hasOwn(products, id)) return;
    cart[id] = model.normalize({ [id]: value })[id];
    save(); render();
    const state = model.calculate(cart);
    announce(message + ` 商品合計${money(state.total)}。` + (state.discount ? `まとめ買い割引${money(state.discount)}を適用しました。` : ''));
  }
  document.addEventListener('click', event => {
    const target = event.target.closest('button');
    if (!target) return;
    if (target.matches('[data-cart-open]')) {
      returnFocus = target; render(); $('[data-toast]').hidden = true;
      dialog.showModal(); document.body.classList.add('cart-open');
    } else if (target.matches('[data-cart-close]')) dialog.close();
    else if (target.matches('[data-add]')) {
      const id = target.dataset.add;
      if (!Object.hasOwn(products, id)) return;
      if (cart[id] >= model.MAX_QUANTITY) { announce('1種類につき99点まで追加できます。'); return; }
      const inDialog = dialog.contains(target);
      change(id, cart[id]+1, products[id].name + 'を1点追加しました。');
      if (inDialog) dialog.querySelector(`[data-quantity="${id}"]`)?.focus();
    } else if (target.matches('[data-add-pair]')) {
      if (cart.lower >= model.MAX_QUANTITY || cart.higher >= model.MAX_QUANTITY) { announce('1種類につき99点まで追加できます。'); return; }
      cart.lower++; cart.higher++; save(); render(); announce('2種類を各1点追加しました。');
    } else if (target.matches('[data-add-bundle]')) {
      const bundles = {
        damage: ['lower','higher'],
        marker: ['ability','condition'],
        tournament: ['lower','higher','ability','condition']
      };
      const ids = bundles[target.dataset.addBundle];
      if (!ids) return;
      if (ids.some(id => cart[id] >= model.MAX_QUANTITY)) { announce('1種類につき99点まで追加できます。'); return; }
      ids.forEach(id => { cart[id]++; });
      save(); render();
      const names = target.dataset.addBundle === 'damage' ? 'ダメージ2種類' : target.dataset.addBundle === 'marker' ? 'マーカー2種類' : '4種類セット';
      announce(names + 'を各1点カートに追加しました。');
    } else if (target.matches('[data-change],[data-remove]')) {
      const id = target.dataset.change || target.dataset.remove;
      if (!Object.hasOwn(products, id)) return;
      const delta = Number(target.dataset.delta);
      const value = target.hasAttribute('data-remove') ? 0 : cart[id]+delta;
      change(id,value,products[id].name + (value > 0 ? 'の数量を変更しました。' : 'を削除しました。'));
      const next = dialog.querySelector(`[data-change="${id}"][data-delta="${delta}"]`);
      (next && !next.disabled ? next : dialog.querySelector(`[data-quantity="${id}"]`) || $('[data-cart-close]')).focus();
    }
  });
  dialog.addEventListener('input', event => {
    const input = event.target.closest('[data-quantity]');
    if (!input || !Object.hasOwn(products, input.dataset.quantity)) return;
    const value = Number(input.value);
    if (!Number.isInteger(value) || value < 1 || value > model.MAX_QUANTITY) return;
    cart[input.dataset.quantity] = value;
    save(); render(true);
  });
  dialog.addEventListener('change', event => {
    const input = event.target.closest('[data-quantity]');
    if (!input) return;
    const id = input.dataset.quantity;
    const value = Number(input.value);
    if (!Number.isInteger(value) || value < 1 || value > model.MAX_QUANTITY) {
      input.value = cart[id]; announce('数量は1〜99の整数で入力してください。'); return;
    }
    if (cart[id] !== value) { cart[id] = value; save(); render(true); }
    announce(products[id].name+'の数量を変更しました。商品合計'+money(model.calculate(cart).total)+'。');
  });
  dialog.addEventListener('click',event=>{ if(event.target===dialog && event.clientX<dialog.getBoundingClientRect().left)dialog.close(); });
  dialog.addEventListener('close',()=>{document.body.classList.remove('cart-open');returnFocus?.focus();});
  window.addEventListener('storage',event=>{if(event.key===storageKey||event.key===null){try{cart=model.normalize(JSON.parse(localStorage.getItem(storageKey)));}catch{cart=model.normalize({});}render();}});
  render();
})();
