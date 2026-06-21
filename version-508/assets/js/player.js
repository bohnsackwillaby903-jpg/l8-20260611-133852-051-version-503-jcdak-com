(function () {
  function boot(config) {
    var video = document.getElementById(config.videoId);
    var button = document.getElementById(config.buttonId);
    var cover = document.getElementById(config.coverId);
    var attached = false;
    var hls = null;

    if (!video || !button || !cover) {
      return;
    }

    function attach() {
      if (attached) {
        return;
      }
      attached = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = config.source;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          maxBufferLength: 30,
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(config.source);
        hls.attachMedia(video);
        return;
      }

      video.src = config.source;
    }

    function start() {
      attach();
      cover.classList.add('is-hidden');
      video.setAttribute('controls', 'controls');
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    button.addEventListener('click', start);
    cover.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });
    video.addEventListener('play', function () {
      cover.classList.add('is-hidden');
    });
    window.addEventListener('pagehide', function () {
      if (hls && typeof hls.destroy === 'function') {
        hls.destroy();
      }
    });
  }

  window.MoviePlayer = {
    boot: boot
  };
})();
