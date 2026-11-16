// Spare Frame Studios: the film rests on the right hand column and widens to the full page as it scrolls into view.
(() => {
  const film = document.querySelector('.sf-film');
  if (!film) return;
  const video = film.querySelector('video');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  // The film opens on a five second storyboard morph. Playback starts and loops after it; set to 0 to play the whole film.
  const FILM_START = 5;
  let raf = 0;

  function update() {
    raf = 0;
    if (reduce.matches) { film.style.removeProperty('--p'); return; }
    const vh = innerHeight;
    // 0 while the top of the film is in the lower fifth of the window, 1 once it nears the top.
    const raw = Math.min(1, Math.max(0, (vh * 0.8 - film.getBoundingClientRect().top) / (vh * 0.65)));
    film.style.setProperty('--p', (raw * raw * (3 - 2 * raw)).toFixed(4));
  }
  const queue = () => { if (!raf) raf = requestAnimationFrame(update); };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue, { passive: true });
  reduce.addEventListener('change', () => { setPlayback(); queue(); });
  queue();

  if (!video) return;

  function setPlayback() {
    if (reduce.matches) {
      video.pause();
      video.controls = true;
    } else {
      video.controls = false;
      video.play().catch(() => { video.controls = true; });
    }
  }

  video.addEventListener('loadedmetadata', () => { if (video.currentTime < FILM_START) video.currentTime = FILM_START; });
  video.addEventListener('ended', () => { video.currentTime = FILM_START; if (!reduce.matches) video.play().catch(() => {}); });

  // Only play while the film is on screen.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setPlayback(); else video.pause();
    }, { threshold: 0.05 }).observe(film);
  } else {
    setPlayback();
  }
})();
