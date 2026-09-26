(() => {
  document.querySelector('[data-preorder]')?.addEventListener('click', event => {
    const link = event.currentTarget;
    const url = new URL(link.href);
    const color = document.querySelector('input[name="product-color"]:checked');
    if (color) url.searchParams.set('color', color.value);
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
    const known = ['lower','higher'].includes(form.elements.product.value);
    form.querySelector('[data-preorder-color]').hidden = !known;
    const qty = Number(form.elements.quantity.value);
    form.querySelector('[data-preorder-total]').textContent = !known ? '価格・販売単位は準備中です。' : Number.isInteger(qty) && qty >= 1 && qty <= 99 ? '商品小計：¥' + (5480 * qty).toLocaleString('ja-JP') + '（税込・送料別）' : '数量は1〜99で入力してください。';
  }
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', update);
  update();
})();
