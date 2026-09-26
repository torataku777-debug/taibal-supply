(() => {
  'use strict';
  const picker = document.querySelector('.color-picker');
  const photo = document.querySelector('.detail-photo .higher-color-image');
  if (!picker || !photo) return;
  const name = picker.querySelector('[data-color-name]');
  const status = picker.querySelector('[data-color-status]');
  let revision = 0;
  picker.addEventListener('change', event => {
    const input = event.target;
    if (!input.matches('input[name="higher-color"]')) return;
    const current = ++revision;
    const label = input.dataset.colorLabel;
    name.textContent = label;
    status.textContent = label + 'の画像を読み込んでいます。';
    photo.setAttribute('aria-busy', 'true');
    const image = new Image();
    image.onload = () => {
      if (current !== revision) return;
      photo.src = image.src;
      photo.alt = 'ハイダメージ・' + label + 'のカラーイメージ';
      photo.removeAttribute('aria-busy');
      status.textContent = '';
    };
    image.onerror = () => {
      if (current !== revision) return;
      photo.removeAttribute('aria-busy');
      status.textContent = '画像を読み込めませんでした。別の色を選んでから、もう一度お試しください。';
    };
    image.src = input.dataset.colorSrc;
  });
})();
