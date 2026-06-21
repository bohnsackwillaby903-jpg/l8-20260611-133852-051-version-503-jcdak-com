(function () {
  var body = document.body;
  var mobileToggle = document.querySelector('[data-mobile-toggle]');

  if (mobileToggle) {
    mobileToggle.addEventListener('click', function () {
      body.classList.toggle('nav-open');
    });
  }

  var headerSearchForms = document.querySelectorAll('[data-header-search]');
  headerSearchForms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      var input = form.querySelector('input[name="q"]');
      if (!input || !input.value.trim()) {
        event.preventDefault();
        return;
      }
      form.action = './search.html';
    });
  });

  document.querySelectorAll('[data-hero-carousel]').forEach(function (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var previous = carousel.querySelector('[data-hero-prev]');
    var next = carousel.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    function play() {
      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      play();
    }

    if (previous) {
      previous.addEventListener('click', function () {
        showSlide(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(index + 1);
        restart();
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
        restart();
      });
    });

    showSlide(0);
    play();
  });

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function applyFilters(scope) {
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
    if (!cards.length) {
      return;
    }

    var searchInput = scope.querySelector('[data-filter-input]');
    var yearSelect = scope.querySelector('[data-filter-year]');
    var typeSelect = scope.querySelector('[data-filter-type]');
    var query = normalize(searchInput && searchInput.value);
    var year = normalize(yearSelect && yearSelect.value);
    var type = normalize(typeSelect && typeSelect.value);

    cards.forEach(function (card) {
      var text = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-tags'),
        card.getAttribute('data-region'),
        card.textContent
      ].join(' '));
      var cardYear = normalize(card.getAttribute('data-year'));
      var cardType = normalize(card.getAttribute('data-type'));
      var matchesQuery = !query || text.indexOf(query) !== -1;
      var matchesYear = !year || cardYear === year;
      var matchesType = !type || cardType.indexOf(type) !== -1;
      card.classList.toggle('hidden-by-filter', !(matchesQuery && matchesYear && matchesType));
    });
  }

  document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
    var controls = scope.querySelectorAll('[data-filter-input], [data-filter-year], [data-filter-type]');
    controls.forEach(function (control) {
      control.addEventListener('input', function () {
        applyFilters(scope);
      });
      control.addEventListener('change', function () {
        applyFilters(scope);
      });
    });
  });

  var searchPage = document.querySelector('[data-search-page]');
  if (searchPage) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    var input = searchPage.querySelector('[data-filter-input]');
    if (q && input) {
      input.value = q;
      applyFilters(searchPage);
    }
  }
})();
