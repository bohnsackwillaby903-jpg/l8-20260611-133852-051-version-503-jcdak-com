function initMoviePlayer(sourceUrl) {
  var video = document.querySelector('[data-player-video]');
  var trigger = document.querySelector('[data-player-trigger]');
  var hlsInstance = null;
  var attached = false;

  if (!video || !sourceUrl) {
    return;
  }

  function attachSource() {
    if (attached) {
      return;
    }

    attached = true;

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(sourceUrl);
      hlsInstance.attachMedia(video);
    } else {
      video.src = sourceUrl;
    }
  }

  function playVideo() {
    attachSource();

    if (trigger) {
      trigger.classList.add('is-hidden');
    }

    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  if (trigger) {
    trigger.addEventListener('click', playVideo);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      playVideo();
    }
  });

  video.addEventListener('play', function () {
    if (trigger) {
      trigger.classList.add('is-hidden');
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
