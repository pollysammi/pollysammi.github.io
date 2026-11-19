(function () {
  var root = document.documentElement;
  var buttons = document.querySelectorAll('[data-set-lang]');
  var htmlLang = { en: 'en', zh: 'zh-Hans', ko: 'ko' };

  function setLang(lang) {
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', htmlLang[lang] || 'en');
    buttons.forEach(function (b) { b.classList.toggle('active', b.dataset.setLang === lang); });
    try { localStorage.setItem('site-lang', lang); } catch (e) {}
  }

  var saved = null;
  try { saved = localStorage.getItem('site-lang'); } catch (e) {}
  if (!saved) {
    var nav = (navigator.language || 'en').toLowerCase();
    saved = nav.indexOf('zh') === 0 ? 'zh' : nav.indexOf('ko') === 0 ? 'ko' : 'en';
  }
  setLang(saved);

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.dataset.setLang); });
  });
})();
