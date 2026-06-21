(function() {
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.querySelector('.main-nav');

    if (toggle && nav) {
        toggle.addEventListener('click', function() {
            var open = nav.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    var carousel = document.querySelector('[data-carousel]');

    if (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dot'));
        var prev = carousel.querySelector('.hero-prev');
        var next = carousel.querySelector('.hero-next');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function(slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function(dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
        }

        function play() {
            stop();
            timer = window.setInterval(function() {
                show(index + 1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function(dot, i) {
            dot.addEventListener('click', function() {
                show(i);
                play();
            });
        });

        if (prev) {
            prev.addEventListener('click', function() {
                show(index - 1);
                play();
            });
        }

        if (next) {
            next.addEventListener('click', function() {
                show(index + 1);
                play();
            });
        }

        carousel.addEventListener('mouseenter', stop);
        carousel.addEventListener('mouseleave', play);
        show(0);
        play();
    }

    var searchInput = document.getElementById('movieSearchInput');
    var categoryFilter = document.getElementById('categoryFilter');
    var grid = document.getElementById('searchableGrid');

    if (searchInput && categoryFilter && grid) {
        var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
        var params = new URLSearchParams(window.location.search);
        var initial = params.get('q') || '';
        if (initial) {
            searchInput.value = initial;
        }

        function normalize(text) {
            return (text || '').toString().trim().toLowerCase();
        }

        function filter() {
            var keyword = normalize(searchInput.value);
            var category = normalize(categoryFilter.value);
            cards.forEach(function(card) {
                var content = normalize(card.textContent);
                var matchedKeyword = !keyword || content.indexOf(keyword) !== -1;
                var matchedCategory = !category || content.indexOf(category) !== -1;
                card.classList.toggle('is-hidden', !(matchedKeyword && matchedCategory));
            });
        }

        searchInput.addEventListener('input', filter);
        categoryFilter.addEventListener('change', filter);
        filter();
    }
})();

function bindMoviePlayer(videoId, buttonId, overlayId, streamUrl) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    var overlay = document.getElementById(overlayId);
    var attached = false;
    var hlsPlayer = null;

    if (!video || !button || !overlay || !streamUrl) {
        return;
    }

    function attach() {
        if (attached) {
            return Promise.resolve();
        }
        attached = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = streamUrl;
            return Promise.resolve();
        }

        if (window.Hls && window.Hls.isSupported()) {
            hlsPlayer = new window.Hls({
                enableWorker: true,
                lowLatencyMode: false
            });
            hlsPlayer.loadSource(streamUrl);
            hlsPlayer.attachMedia(video);
            return new Promise(function(resolve) {
                hlsPlayer.on(window.Hls.Events.MANIFEST_PARSED, function() {
                    resolve();
                });
                window.setTimeout(resolve, 1200);
            });
        }

        video.src = streamUrl;
        return Promise.resolve();
    }

    function start(event) {
        if (event) {
            event.preventDefault();
        }
        overlay.classList.add('is-hidden');
        attach().then(function() {
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function() {
                    overlay.classList.remove('is-hidden');
                });
            }
        });
    }

    overlay.addEventListener('click', start);
    button.addEventListener('click', start);

    video.addEventListener('play', function() {
        overlay.classList.add('is-hidden');
    });

    video.addEventListener('pause', function() {
        if (video.currentTime === 0 || video.ended) {
            overlay.classList.remove('is-hidden');
        }
    });

    window.addEventListener('beforeunload', function() {
        if (hlsPlayer) {
            hlsPlayer.destroy();
        }
    });
}
