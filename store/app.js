(() => {
  'use strict';
  const model=window.TaibalCart, dialog=document.querySelector('#cart-dialog');
  if(!model||!dialog)return;
  const cfg=window.TAIBAL_CHECKOUT||{};
  const test=cfg.mode==='test'&&new URLSearchParams(location.search).get('test')==='1';
  const storageKey=test?'taibal-cart-test-v2':'taibal-cart-v2';
  const oldKey=test?'taibal-cart-test-v1':'taibal-cart-v1';
  const money=value=>'¥'+value.toLocaleString('ja-JP');
  const $=selector=>document.querySelector(selector);
  const products=model.products;
  let lines=[],returnFocus,toastTimer;
  function readCart(){
    try {
      const saved=localStorage.getItem(storageKey);
      return model.normalizeLines(JSON.parse(saved===null?localStorage.getItem(oldKey):saved));
    } catch{return [];}
  }
  lines=readCart();
  function save(){try{localStorage.setItem(storageKey,JSON.stringify(lines));}catch{}}
  save();
  if(test){const notice=document.createElement('div');notice.className='test-notice';notice.textContent='テスト表示：実際の注文・請求は発生しません。';document.body.prepend(notice);}
  function announce(message){
    $('[data-cart-announcement]').textContent=message;
    if(dialog.open)return;
    clearTimeout(toastTimer);$('[data-toast]').textContent=message;$('[data-toast]').hidden=false;
    toastTimer=setTimeout(()=>{$('[data-toast]').hidden=true;},3500);
  }
  function colorSelect(line){
    if(!model.hasColors(line.id))return '';
    return `<label class="cart-color-label">カラー<select data-line-color="${model.lineKey(line)}" aria-label="${model.lineName(line)}のカラー"><option value="">カラーを選択</option>${Object.entries(model.colors).map(([key,label])=>`<option value="${key}" ${key===line.color?'selected':''}>${label}</option>`).join('')}</select></label>`;
  }
  function render(preserveItems=false){
    const state=model.calculateLines(lines),cart=state.cart;
    document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=state.count);
    $('[data-cart-dock]').hidden=!state.count;$('[data-dock-count]').textContent=state.count+'点';$('[data-dock-total]').textContent=money(state.total);
    $('[data-dock-discount]').textContent=state.discount?money(state.discount)+'の割引を適用済み・税込':'税込・送料別';
    $('[data-cart-empty]').hidden=Boolean(state.count);$('[data-cart-content]').hidden=!state.count;
    if(!preserveItems)$('[data-cart-items]').innerHTML=state.lines.map(line=>{
      const p=products[line.id],key=model.lineKey(line),name=model.lineName(line);
      return `<article class="cart-item"><img src="${model.lineImage(line)}" alt="${name}" width="88" height="88"><div><h3>${p.name}</h3><p class="item-meta">${p.unit} / ${money(p.price)}（税込・予定）</p>${colorSelect(line)}<div class="cart-item-controls"><div class="quantity"><button data-change="${key}" data-delta="-1" aria-label="${name}を1点減らす">−</button><input type="number" inputmode="numeric" min="1" max="${model.MAX_QUANTITY}" step="1" value="${line.quantity}" data-quantity="${key}" aria-label="${name}の数量"><button data-change="${key}" data-delta="1" aria-label="${name}を1点増やす" ${cart[line.id]>=model.MAX_QUANTITY?'disabled':''}>＋</button></div><strong data-item-total="${key}">${money(p.price*line.quantity)}</strong></div><button class="remove-button" data-remove="${key}" aria-label="${name}をカートから削除">削除</button></div></article>`;
    }).join('');
    state.lines.forEach(line=>{
      const key=model.lineKey(line),total=dialog.querySelector(`[data-item-total="${key}"]`),plus=dialog.querySelector(`[data-change="${key}"][data-delta="1"]`);
      if(total)total.textContent=money(products[line.id].price*line.quantity);
      if(plus)plus.disabled=cart[line.id]>=model.MAX_QUANTITY;
    });
    const missing=cart.lower>cart.higher?'higher':cart.higher>cart.lower?'lower':null;
    const active=state.discount?`<strong>まとめ買い割引 −${money(state.discount)}</strong><p>${state.discounts.map(d=>`${d.label} ${d.count}組：−${money(d.amount)}`).join('<br>')}</p>`:'<strong>組み合わせに応じて、自動で割引。</strong><p>ロー＋ハイは480円引き。マーカー2種類は580円引き。4種類を揃えるとさらに480円引き。</p>';
    let suggestions=missing?`<button data-add="${missing}">${products[missing].name}を1点追加（${money(products[missing].price)}）</button><p>ロー＋ハイの割引が480円増えます。追加後にカラーを選べます。</p>`:'';
    const markerMissing=cart.ability>cart.condition?'condition':cart.condition>cart.ability?'ability':null;
    if(markerMissing)suggestions+=`<button data-add="${markerMissing}">${products[markerMissing].name}を1点追加（${money(products[markerMissing].price)}）</button><p>マーカー2種類の割引が580円増えます。</p>`;
    $('[data-cart-offer]').innerHTML=active+suggestions;
    $('[data-subtotal]').textContent=money(state.subtotal);$('[data-discount-row]').hidden=!state.discount;$('[data-discount]').textContent='−'+money(state.discount);
    $('[data-pairs]').textContent='カラーが異なる組み合わせも対象';$('[data-total]').textContent=money(state.total);
    const shipping=state.count && state.total<10000?350:0;
    if($('[data-shipping-estimate]'))$('[data-shipping-estimate]').textContent=shipping?money(shipping):'無料';
    if($('[data-estimated-total]'))$('[data-estimated-total]').textContent=money(state.total+shipping);
    $('[data-checkout]').hidden=true;$('[data-checkout]').removeAttribute('href');$('[data-launch-note]').hidden=false;
    const unselected=state.lines.some(l=>model.hasColors(l.id)&&!l.color);
    $('[data-checkout-status]').hidden=!unselected&&!test;
    $('[data-checkout-status]').textContent=unselected?'カラー未選択の商品があります。各商品のカラーを選んでください。':test?'カラーを含む注文受付は準備中です。':'';
  }
  function commit(message,preserve=false){lines=model.normalizeLines(lines);save();render(preserve);if(message)announce(message+' 商品合計'+money(model.calculateLines(lines).total)+'。');}
  function find(key){return lines.find(line=>model.lineKey(line)===key);}
  function selectedColor(id,target){
    if(!model.hasColors(id)||dialog.contains(target))return '';
    const detail=target.closest('.product-detail');
    const photo=detail?.querySelector('.product-color-image');
    if(!photo)return '';
    const color=photo.dataset.displayColor||'blue';
    detail.querySelector('.color-picker')?.dispatchEvent(new CustomEvent('colorcommit',{detail:{color}}));
    return color;
  }
  document.addEventListener('click',event=>{
    const target=event.target.closest('button');if(!target)return;
    if(target.matches('[data-cart-open]')){returnFocus=target;render();$('[data-toast]').hidden=true;dialog.showModal();document.body.classList.add('cart-open');}
    else if(target.matches('[data-cart-close]'))dialog.close();
    else if(target.matches('[data-add]')){
      const id=target.dataset.add;if(!Object.hasOwn(products,id))return;
      if(model.calculateLines(lines).cart[id]>=model.MAX_QUANTITY){announce('1種類につき全カラー合計99点まで追加できます。');return;}
      const color=selectedColor(id,target);lines=model.addLine(lines,id,color);
      commit(model.lineName({id,color})+'を1点追加しました。');
      if(dialog.contains(target))dialog.querySelector(`[data-quantity="${model.lineKey({id,color})}"]`)?.focus();
    }else if(target.matches('[data-add-pair]')){
      const cart=model.calculateLines(lines).cart;
      if(cart.lower>=model.MAX_QUANTITY||cart.higher>=model.MAX_QUANTITY){announce('1種類につき全カラー合計99点まで追加できます。');return;}
      lines=model.addLine(model.addLine(lines,'lower'),'higher');commit('ロー・ハイを各1点追加しました。カートでカラーを選べます。');
     }else if(target.matches('[data-add-bundle]')){
      const bundles={damage:['lower','higher'],marker:['ability','condition'],tournament:['lower','higher','ability','condition']};
      const ids=bundles[target.dataset.addBundle];if(!ids)return;
      const cart=model.calculateLines(lines).cart;
      if(ids.some(id=>cart[id]>=model.MAX_QUANTITY)){announce('1種類につき全カラー合計99点まで追加できます。');return;}
      ids.forEach(id=>{lines=model.addLine(lines,id);});commit(ids.length+'種類を各1点追加しました。カートで内容を確認できます。');
    }else if(target.matches('[data-change],[data-remove]')){
      const key=target.dataset.change||target.dataset.remove,line=find(key);if(!line)return;
      const delta=Number(target.dataset.delta);
      if(delta>0&&model.calculateLines(lines).cart[line.id]>=model.MAX_QUANTITY){announce('1種類につき全カラー合計99点まで追加できます。');return;}
      const qty=target.hasAttribute('data-remove')?0:line.quantity+delta;
      lines=model.setLineQuantity(lines,key,qty);commit(model.lineName(line)+(qty>0?'の数量を変更しました。':'を削除しました。'));
      const next=dialog.querySelector(`[data-change="${key}"][data-delta="${delta}"]`);
      (next&&!next.disabled?next:dialog.querySelector(`[data-quantity="${key}"]`)||$('[data-cart-close]')).focus();
    }
  });
  function changeQuantity(input,final){
    const line=find(input.dataset.quantity);if(!line)return;
    const value=Number(input.value),other=model.calculateLines(lines).cart[line.id]-line.quantity;
    if(!Number.isInteger(value)||value<1||value+other>model.MAX_QUANTITY){if(final){input.value=line.quantity;announce('数量は1以上、同じ種類の全カラー合計99点以内で入力してください。');}return;}
    lines=model.setLineQuantity(lines,model.lineKey(line),value);commit(final?model.lineName(line)+'の数量を変更しました。':'',true);
  }
  dialog.addEventListener('input',e=>{const input=e.target.closest('[data-quantity]');if(input)changeQuantity(input,false);});
  dialog.addEventListener('change',e=>{
    const select=e.target.closest('[data-line-color]');
    if(select){const line=find(select.dataset.lineColor);if(!line)return;const color=select.value,id=line.id;lines=model.setLineColor(lines,model.lineKey(line),color);commit('カラーを'+(model.colors[color]||'未選択')+'に変更しました。');dialog.querySelector(`[data-line-color="${model.lineKey({id,color})}"]`)?.focus();return;}
    const input=e.target.closest('[data-quantity]');if(input)changeQuantity(input,true);
  });
  dialog.addEventListener('click',e=>{if(e.target===dialog&&e.clientX<dialog.getBoundingClientRect().left)dialog.close();});
  dialog.addEventListener('close',()=>{document.body.classList.remove('cart-open');returnFocus?.focus();});
  addEventListener('storage',e=>{if(e.key===storageKey||e.key===null){lines=readCart();render();}});
  render();
})();
