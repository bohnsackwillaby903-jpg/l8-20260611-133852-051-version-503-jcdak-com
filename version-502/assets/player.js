
(function () {
  function setError(errorBox, message) {
    if (!errorBox) {
      return;
    }
    errorBox.textContent = message;
    errorBox.classList.add('is-visible');
  }

  function clearError(errorBox) {
    if (!errorBox) {
      return;
    }
    errorBox.textContent = '';
    errorBox.classList.remove('is-visible');
  }

  window.initMoviePlayer = function (options) {
    var video = document.getElementById(options.videoId);
    var overlay = document.getElementById(options.overlayId);
    var errorBox = document.getElementById(options.errorId);
    var source = options.source;
    var hlsInstance = null;

    if (!video || !source) {
      return;
    }

    function attachSource() {
      clearError(errorBox);
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.ERROR, function (_, data) {
          if (!data || !data.fatal) {
            return;
          }
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            setError(errorBox, '网络连接不稳定，正在尝试恢复播放');
            hlsInstance.startLoad();
            return;
          }
          if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            setError(errorBox, '播放出现波动，正在恢复画面');
            hlsInstance.recoverMediaError();
            return;
          }
          setError(errorBox, '暂时无法播放，请稍后再试');
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else {
        setError(errorBox, '暂时无法播放，请稍后再试');
      }
    }

    function play() {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          if (overlay) {
            overlay.classList.remove('is-hidden');
          }
        });
      }
    }

    function togglePlay() {
      if (video.paused) {
        play();
      } else {
        video.pause();
      }
    }

    attachSource();

    if (overlay) {
      overlay.addEventListener('click', play);
    }

    video.addEventListener('click', togglePlay);
    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    });
    video.addEventListener('pause', function () {
      if (overlay && !video.ended) {
        overlay.classList.remove('is-hidden');
      }
    });
    video.addEventListener('ended', function () {
      if (overlay) {
        overlay.classList.remove('is-hidden');
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };
})();
