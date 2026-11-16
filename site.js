// Spare Frame Studios
(() => {
  // Reveal on scroll.
  const rv = [...document.querySelectorAll('.rv')];
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    rv.forEach((el) => io.observe(el));
  } else {
    rv.forEach((el) => el.classList.add('in'));
  }

  // Work strip: the arrow buttons move it by most of a screen.
  const strip = document.getElementById('strip');
  if (strip) {
    document.querySelectorAll('[data-strip]').forEach((b) => b.addEventListener('click', () => {
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      strip.scrollBy({ left: Number(b.dataset.strip) * strip.clientWidth * 0.7, behavior: reduce ? 'auto' : 'smooth' });
    }));
  }
})();
