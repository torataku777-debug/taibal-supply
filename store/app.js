(() => {
  const cfg = window.TAIBAL_CHECKOUT || {};
  const test = cfg.mode === 'test' && new URLSearchParams(location.search).get('test') === '1';
  if (test) {
    const notice = document.createElement('div');
    notice.className = 'test-notice';
    notice.textContent = 'テスト決済モード：実際の注文・請求は発生しません。';
    document.body.prepend(notice);
    document.querySelectorAll('[data-test-link]').forEach(a => {
      const url = new URL(a.href);
      if (url.origin === location.origin) {
        url.searchParams.set('test', '1');
        a.href = url.href;
      }
    });
  }
  document.querySelectorAll('.js-buy').forEach(button => {
    const value = cfg[button.dataset.id];
    let valid = false;
    try {
      const url = new URL(value);
      const isTest = url.pathname.startsWith('/test_');
      valid = url.protocol === 'https:' && url.hostname === 'buy.stripe.com' &&
        ((test && isTest) || (cfg.mode === 'live' && cfg.enabled === true && !isTest));
    } catch {}
    button.hidden = !valid;
    button.disabled = !valid;
    if (!valid) return;
    button.textContent = test ? 'テスト決済へ' : '購入手続きへ';
    if (!test) button.parentElement.querySelector('.launch-note')?.remove();
    button.addEventListener('click', () => { location.href = value; });
  });
})();
