(() => {
 const section = document.querySelector('.journey');
 const video = document.querySelector('#journey-video');
 const reduce = matchMedia('(prefers-reduced-motion: reduce)');
 let loaded = false, raf = 0;
 function update() {
   raf = 0;
   if (reduce.matches || !section || !video) return;
   const rect = section.getBoundingClientRect();
   if (rect.top > innerHeight * 1.5 || rect.bottom < -innerHeight) return;
   if (!loaded) { video.querySelector('source').src = video.querySelector('source').dataset.src; video.load(); loaded = true; }
   if (!Number.isFinite(video.duration) || !video.duration) return;
   const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, section.offsetHeight - innerHeight)));
   const target = Math.min(video.duration - 0.04, progress * video.duration);
   if (!video.seeking && Math.abs(video.currentTime - target) > 0.04) video.currentTime = Math.max(0, target);
 }
 function queue() { if (!raf) raf = requestAnimationFrame(update); }
 addEventListener('scroll', queue, {passive:true}); addEventListener('resize', queue, {passive:true}); video.addEventListener('loadedmetadata', queue); video.addEventListener('seeked', queue); reduce.addEventListener('change', queue); queue();
})();
