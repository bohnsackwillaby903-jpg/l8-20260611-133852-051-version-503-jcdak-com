(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  ready(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');

    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        panel.classList.toggle('is-open');
      });
    }

    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';
    var queryInputs = document.querySelectorAll('[data-query-sync], [data-page-search]');

    queryInputs.forEach(function (input) {
      if (initialQuery && !input.value) {
        input.value = initialQuery;
      }
    });

    var activeTextFilter = '';
    var activeChannelFilter = '';

    function applyFilters() {
      var searchInput = document.querySelector('[data-page-search]');
      var query = normalize(searchInput ? searchInput.value : initialQuery);
      var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
      var shown = 0;

      cards.forEach(function (card) {
        var keywords = normalize(card.getAttribute('data-keywords'));
        var textMatch = !query || keywords.indexOf(query) !== -1;
        var typeMatch = !activeTextFilter || keywords.indexOf(normalize(activeTextFilter)) !== -1;
        var channelMatch = !activeChannelFilter || card.getAttribute('data-channel') === activeChannelFilter;
        var visible = textMatch && typeMatch && channelMatch;
        card.style.display = visible ? '' : 'none';
        if (visible) {
          shown += 1;
        }
      });

      var empty = document.querySelector('[data-empty-state]');
      if (empty) {
        empty.classList.toggle('is-visible', cards.length > 0 && shown === 0);
      }
    }

    document.querySelectorAll('[data-page-search]').forEach(function (input) {
      input.addEventListener('input', applyFilters);
    });

    document.querySelectorAll('[data-filter-button]').forEach(function (button) {
      button.addEventListener('click', function () {
        document.querySelectorAll('[data-filter-button]').forEach(function (item) {
          item.classList.remove('is-active');
        });
        button.classList.add('is-active');
        activeTextFilter = button.getAttribute('data-filter-button') || '';
        applyFilters();
      });
    });

    document.querySelectorAll('[data-filter-channel]').forEach(function (button) {
      button.addEventListener('click', function () {
        document.querySelectorAll('[data-filter-channel]').forEach(function (item) {
          item.classList.remove('is-active');
        });
        button.classList.add('is-active');
        activeChannelFilter = button.getAttribute('data-filter-channel') || '';
        applyFilters();
      });
    });

    if (initialQuery) {
      applyFilters();
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function startHero() {
      if (timer || slides.length <= 1) {
        return;
      }
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    function restartHero() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
      startHero();
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        restartHero();
      });
    });

    var next = document.querySelector('[data-hero-next]');
    var prev = document.querySelector('[data-hero-prev]');

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        restartHero();
      });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        restartHero();
      });
    }

    startHero();
  });
})();
