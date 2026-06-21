(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function initMobileMenu() {
    var toggle = qs('[data-mobile-toggle]');
    var menu = qs('[data-mobile-menu]');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  function initSearchForms() {
    qsa('[data-search-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        var input = qs('input[name="q"]', form);
        var query = input ? input.value.trim() : '';
        if (!query) {
          event.preventDefault();
          return;
        }
        event.preventDefault();
        var action = form.getAttribute('action') || 'search.html';
        window.location.href = action + '?q=' + encodeURIComponent(query);
      });
    });
  }

  function initHero() {
    var hero = qs('[data-hero]');
    if (!hero) return;
    var slides = qsa('[data-hero-slide]', hero);
    var dots = qsa('[data-hero-dot]', hero);
    var thumbs = qsa('[data-hero-thumb]', hero);
    var prev = qs('[data-hero-prev]', hero);
    var next = qs('[data-hero-next]', hero);
    var index = 0;
    var timer = null;

    function setActive(nextIndex) {
      if (!slides.length) return;
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
      thumbs.forEach(function (thumb, i) {
        thumb.classList.toggle('is-active', i === index);
      });
    }

    function restart() {
      if (timer) window.clearInterval(timer);
      timer = window.setInterval(function () {
        setActive(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        setActive(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('mouseenter', function () {
        setActive(Number(thumb.getAttribute('data-hero-thumb')) || 0);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        setActive(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        setActive(index + 1);
        restart();
      });
    }

    restart();
  }

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, '');
  }

  function initFilters() {
    var panel = qs('[data-filter-panel]');
    if (!panel) return;
    var input = qs('[data-filter-keyword]', panel);
    var year = qs('[data-filter-year]', panel);
    var region = qs('[data-filter-region]', panel);
    var type = qs('[data-filter-type]', panel);
    var cards = qsa('[data-title]');
    var empty = qs('[data-no-results]');

    function pass(card) {
      var key = normalize(input ? input.value : '');
      var y = year ? year.value : '';
      var r = region ? region.value : '';
      var t = type ? type.value : '';
      var haystack = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-type'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-category')
      ].join(' '));
      if (key && haystack.indexOf(key) === -1) return false;
      if (y && card.getAttribute('data-year') !== y) return false;
      if (r && card.getAttribute('data-region') !== r) return false;
      if (t && card.getAttribute('data-type') !== t) return false;
      return true;
    }

    function apply() {
      var shown = 0;
      cards.forEach(function (card) {
        var ok = pass(card);
        card.style.display = ok ? '' : 'none';
        if (ok) shown += 1;
      });
      if (empty) empty.classList.toggle('is-visible', shown === 0);
    }

    [input, year, region, type].forEach(function (el) {
      if (el) el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', apply);
    });

    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q && input) input.value = q;
    apply();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initSearchForms();
    initHero();
    initFilters();
  });
})();
