(() => {
  'use strict';
  const picker = document.querySelector('.color-picker');
  const photo = document.querySelector('.detail-photo .product-color-image');
  if (!picker || !photo) return;
  const inputs = [...picker.querySelectorAll('input[name="product-color"]')];
  const status = picker.querySelector('[data-color-status]');
  const pause = picker.querySelector('[data-color-pause]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let revision = 0, timer, stopped = reduced.matches;
  photo.dataset.displayColor = inputs.find(input=>input.checked)?.value || 'blue';
  const add = document.querySelector('.detail-copy [data-add]');
  function pending(active) { if(add) add.disabled=active; }
  function stop() { stopped = true; clearTimeout(timer); pause.hidden = true; }
  function schedule() {
    clearTimeout(timer);
    if (!stopped && !document.hidden) timer = setTimeout(() => {
      const index = inputs.findIndex(input => input.checked);
      show(inputs[(index + 1) % inputs.length], false);
    }, 3200);
  }
  function show(input, manual) {
    if (manual) { stop(); pending(true); }
    const current = ++revision;
    const image = new Image();
    photo.setAttribute('aria-busy', 'true');
    image.onload = () => {
      if (current !== revision) return;
      photo.src = image.src;
      photo.dataset.displayColor = input.value;
      pending(false);
      photo.alt = photo.dataset.productName + '・' + input.dataset.colorLabel + 'のカラーイメージ';
      input.checked = true;
      photo.removeAttribute('aria-busy');
      status.textContent = '';
      schedule();
    };
    image.onerror = () => {
      if (current !== revision) return;
      photo.removeAttribute('aria-busy');
      pending(false);
      const displayed=inputs.find(x=>x.value===photo.dataset.displayColor);
      if(displayed)displayed.checked=true;
      if (manual) status.textContent = '画像を読み込めませんでした。別の色を選んでください。';
      stop();
    };
    image.src = input.dataset.colorSrc;
  }
  picker.addEventListener('click', event => {
    if (event.target.matches('input[name="product-color"]')) show(event.target, true);
  });
  picker.addEventListener('change', event => {
    if (event.target.matches('input[name="product-color"]')) show(event.target, true);
  });
  picker.addEventListener('focusin', () => { stop(); });
  picker.addEventListener('colorcommit', event => {
    stop(); ++revision; pending(false); photo.removeAttribute('aria-busy');
    const shown=inputs.find(x=>x.value===event.detail.color);if(shown)shown.checked=true;
  });
  pause.addEventListener('click', stop);
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', event => { if (event.matches) stop(); });
  pause.hidden = stopped;
  schedule();
})();
