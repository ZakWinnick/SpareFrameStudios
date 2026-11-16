// Spare Frame Studios: the hero film grows from a small frame to the full screen as you scroll.
(() => {
  const hero = document.querySelector('.sf-hero');
  if (!hero) return;
  const stage = hero.querySelector('.sf-hero-stage');
  const video = hero.querySelector('video');
  const steps = [...hero.querySelectorAll('[data-step]')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  // The film opens on a five second storyboard morph. Playback starts and loops after it; set to 0 to play the whole film.
  const FILM_START = 5;
  let raf = 0;

  const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

  function update() {
    raf = 0;
    if (reduce.matches) {
      stage.style.setProperty('--p', 0);
      stage.classList.remove('is-open');
      return;
    }
    const span = Math.max(1, hero.offsetHeight - innerHeight);
    const raw = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / span));
    // The frame is fully open at 70% of the scroll, then holds full screen.
    const p = ease(Math.min(1, raw / 0.7));
    stage.style.setProperty('--p', p.toFixed(4));
    stage.classList.toggle('is-open', p > 0.5);
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

  // Captions follow the film: three steps across the part that plays.
  video.addEventListener('timeupdate', () => {
    if (!video.duration) return;
    const done = Math.max(0, video.currentTime - FILM_START) / Math.max(0.1, video.duration - FILM_START);
    const i = Math.min(steps.length - 1, Math.floor(done * steps.length));
    steps.forEach((el, n) => el.classList.toggle('is-on', n === i));
  });

  // Only play while the hero is on screen.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setPlayback(); else video.pause();
    }, { threshold: 0.05 }).observe(hero);
  } else {
    setPlayback();
  }
})();
