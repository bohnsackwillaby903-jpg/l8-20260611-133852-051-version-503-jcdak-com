(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    function setupNav() {
        var toggle = document.querySelector("[data-nav-toggle]");
        var links = document.querySelector("[data-nav-links]");
        if (!toggle || !links) {
            return;
        }
        toggle.addEventListener("click", function () {
            links.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var slider = document.querySelector("[data-hero-slider]");
        if (!slider) {
            return;
        }
        var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
        if (slides.length < 2) {
            return;
        }
        var current = 0;
        var timer = null;
        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === current);
                dot.setAttribute("aria-pressed", i === current ? "true" : "false");
            });
        }
        function start() {
            stop();
            timer = setInterval(function () {
                show(current + 1);
            }, 5600);
        }
        function stop() {
            if (timer) {
                clearInterval(timer);
            }
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
                start();
            });
        });
        slider.addEventListener("mouseenter", stop);
        slider.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function setupFilters() {
        var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]"));
        panels.forEach(function (panel) {
            var input = panel.querySelector("[data-search-input]");
            var year = panel.querySelector("[data-filter-year]");
            var type = panel.querySelector("[data-filter-type]");
            var scope = panel.parentElement || document;
            var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-movie-card]"));
            var empty = scope.querySelector("[data-empty-state]");
            function apply() {
                var q = input ? input.value.trim().toLowerCase() : "";
                var y = year ? year.value : "";
                var t = type ? type.value : "";
                var visible = 0;
                cards.forEach(function (card) {
                    var haystack = [
                        card.dataset.title || "",
                        card.dataset.region || "",
                        card.dataset.type || "",
                        card.dataset.genre || "",
                        card.dataset.tags || ""
                    ].join(" ").toLowerCase();
                    var matched = true;
                    if (q && haystack.indexOf(q) === -1) {
                        matched = false;
                    }
                    if (y && (card.dataset.year || "") !== y) {
                        matched = false;
                    }
                    if (t && (card.dataset.type || "").indexOf(t) === -1 && (card.dataset.genre || "").indexOf(t) === -1) {
                        matched = false;
                    }
                    card.classList.toggle("is-hidden", !matched);
                    if (matched) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle("is-visible", visible === 0);
                }
            }
            [input, year, type].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });
            apply();
        });
    }

    window.initMoviePlayer = function (streamUrl) {
        var video = document.querySelector("[data-player-video]");
        var overlay = document.querySelector("[data-player-button]");
        if (!video || !streamUrl) {
            return;
        }
        var attached = false;
        function attach() {
            if (attached) {
                return;
            }
            attached = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    maxBufferLength: 30,
                    enableWorker: true
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
        }
        function begin() {
            attach();
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
            var playTask = video.play();
            if (playTask && typeof playTask.catch === "function") {
                playTask.catch(function () {});
            }
        }
        if (overlay) {
            overlay.addEventListener("click", function (event) {
                event.preventDefault();
                begin();
            });
        }
        video.addEventListener("click", function () {
            if (!attached || video.paused) {
                begin();
            }
        });
        video.addEventListener("play", function () {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
        });
    };

    ready(function () {
        setupNav();
        setupHero();
        setupFilters();
    });
})();
