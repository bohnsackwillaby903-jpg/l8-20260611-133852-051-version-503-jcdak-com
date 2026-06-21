
(function () {
  var toggle = document.querySelector('[data-mobile-toggle]');
  var panel = document.querySelector('[data-mobile-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
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
    if (timer) {
      clearInterval(timer);
    }
    timer = setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var index = Number(dot.getAttribute('data-hero-dot')) || 0;
      showSlide(index);
      startHero();
    });
  });

  if (slides.length) {
    showSlide(0);
    startHero();
  }

  var input = document.querySelector('[data-search-input]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
  var empty = document.querySelector('[data-empty-state]');

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function filterCards(value) {
    var query = normalize(value);
    var shown = 0;

    cards.forEach(function (card) {
      var haystack = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-region'),
        card.getAttribute('data-year'),
        card.getAttribute('data-category')
      ].join(' '));
      var visible = !query || haystack.indexOf(query) !== -1;
      card.classList.toggle('is-hidden', !visible);
      if (visible) {
        shown += 1;
      }
    });

    if (empty) {
      empty.classList.toggle('is-visible', cards.length > 0 && shown === 0);
    }
  }

  if (input && cards.length) {
    input.addEventListener('input', function () {
      filterCards(input.value);
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-search-chip]')).forEach(function (chip) {
    chip.addEventListener('click', function () {
      var value = chip.getAttribute('data-search-chip') || '';
      if (input) {
        input.value = value;
      }
      filterCards(value);
    });
  });
})();
