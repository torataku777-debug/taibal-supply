(() => {
  document.querySelector('[data-preorder]')?.addEventListener('click', event => {
    const link = event.currentTarget;
    const url = new URL(link.href);
    const photo = document.querySelector('.detail-photo .product-color-image');
    const color = photo?.dataset.displayColor;
    if (color) {
      document.querySelector('.color-picker')?.dispatchEvent(new CustomEvent('colorcommit',{detail:{color}}));
      url.searchParams.set('color', color);
    }
    link.href = url.href;
  });
  const form = document.querySelector('[data-preorder-form]');
  if (!form) return;
  const params = new URLSearchParams(location.search);
  for (const name of ['product','color']) {
    const select = form.elements[name];
    if ([...select.options].some(o => o.value === params.get(name))) select.value = params.get(name);
  }
  function update() {
    const id = form.elements.product.value;
    const known = ['lower','higher'].includes(id);
    const product = window.TaibalCart.products[id];
    form.querySelector('[data-preorder-color]').hidden = !known;
    const qty = Number(form.elements.quantity.value);
    form.querySelector('[data-preorder-total]').textContent = !product ? '商品を選択してください。' : Number.isInteger(qty) && qty >= 1 && qty <= 99 ? '商品小計：¥' + (product.price * qty).toLocaleString('ja-JP') + '（税込・送料別）' : '数量は1〜99で入力してください。';
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if(!form.reportValidity())return;
    document.dispatchEvent(new CustomEvent('taibal:add-selection',{detail:{
      id:form.elements.product.value,color:form.elements.color.value,quantity:Number(form.elements.quantity.value)
    }}));
  });
  form.addEventListener('input', update);
  update();
})();
