// Calendar and bar sketches for the phone mockups (illustrative sample data).
(function () {
  const cal = document.getElementById('cal');
  if (cal) {
    const days = ['S','M','T','W','T','F','S'].map(d => `<div class="h">${d}</div>`).join('');
    const state = {1:'def',2:'def',3:'def',4:'def',5:'def',6:'inc',7:'def',8:'def',9:'def',10:'def',11:'inc',12:'def',13:'def',14:'def',15:'sur',16:'def',17:'def',18:'def',19:'def',20:'today'};
    let cells = '<div></div><div></div><div></div><div></div>';
    for (let d = 1; d <= 31; d++) {
      const s = state[d] || '';
      cells += `<div class="d ${s === 'today' ? 'def today' : s}">${d}</div>`;
    }
    cal.innerHTML = days + cells;
  }
  const bars = document.getElementById('bars');
  if (bars) bars.innerHTML = [60, 80, 38, 26, 45, 70, 34].map(h => `<i style="height:${h}%"></i>`).join('');

  // Scroll reveal
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  els.forEach(e => io.observe(e));

  // If the hero video can't play (missing file, data saver), hide it so the gradient shows.
  const v = document.getElementById('heroVideo');
  if (v) {
    v.addEventListener('error', () => v.remove(), true);
    v.querySelector('source')?.addEventListener('error', () => v.remove());
    const p = v.play?.(); if (p?.catch) p.catch(() => {});
  }
})();
