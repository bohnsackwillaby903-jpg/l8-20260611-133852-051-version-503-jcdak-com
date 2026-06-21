import { H as Hls } from './hls.js';

document.addEventListener('DOMContentLoaded', function () {
  var videos = Array.prototype.slice.call(document.querySelectorAll('[data-player-source]'));
  videos.forEach(function (video) {
    var source = video.getAttribute('data-player-source');
    var box = video.closest('.player-box');
    var trigger = box ? box.querySelector('[data-player-trigger]') : null;
    var loaded = false;
    var hls = null;

    function prepare() {
      if (loaded || !source) return;
      loaded = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (Hls && Hls.isSupported()) {
        hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function start() {
      prepare();
      video.controls = true;
      if (trigger) trigger.classList.add('is-hidden');
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          if (trigger) trigger.classList.remove('is-hidden');
        });
      }
    }

    if (trigger) {
      trigger.addEventListener('click', start);
    }
    video.addEventListener('click', function () {
      if (video.paused) start();
    });
    video.addEventListener('play', function () {
      if (trigger) trigger.classList.add('is-hidden');
    });
    window.addEventListener('pagehide', function () {
      if (hls) hls.destroy();
    });
  });
});
