// Scroll reveal (content stays visible if this script does not run).
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(e => io.observe(e));

  // Videos: hide one that can't play so the gradient shows, and pause the ones scrolled out of view.
  const vids = document.querySelectorAll('.reel video');
  vids.forEach(v => {
    v.addEventListener('error', () => v.remove(), true);
    v.querySelector('source')?.addEventListener('error', () => v.remove());
  });
  if ('IntersectionObserver' in window) {
    const vo = new IntersectionObserver(es => es.forEach(e => { const p = e.isIntersecting ? e.target.play?.() : e.target.pause?.(); if (p?.catch) p.catch(() => {}); }), { threshold: 0.1 });
    vids.forEach(v => vo.observe(v));
  }
})();
