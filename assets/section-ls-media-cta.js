/**
 * section-ls-media-cta.js
 * Click-to-play handler for both uploaded (native) and external embed videos.
 */

document.querySelectorAll('.ls-mc__video-wrapper').forEach((wrapper) => {
  const playBtn = wrapper.querySelector('.ls-mc__play-btn');
  if (!playBtn) return;

  const videoType = wrapper.dataset.videoType;

  playBtn.addEventListener('click', () => {
    if (videoType === 'native') {
      const videoEl = wrapper.querySelector('.ls-mc__native-video');
      const poster  = wrapper.querySelector('.ls-mc__poster, .ls-mc__poster--placeholder');
      if (!videoEl) return;

      if (poster) poster.style.display = 'none';
      playBtn.style.display = 'none';
      videoEl.style.display = 'block';
      videoEl.play();

    } else if (videoType === 'embed') {
      const embedUrl = wrapper.dataset.videoEmbedUrl;
      if (!embedUrl) return;

      const iframe = document.createElement('iframe');
      iframe.src = embedUrl;
      iframe.allow = 'autoplay; fullscreen; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.className = 'ls-mc__iframe';

      wrapper.innerHTML = '';
      wrapper.appendChild(iframe);
    }
  });
});
