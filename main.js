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

// Waitlist form -> Joul API. Nothing is stored in the browser.
(function () {
  const form = document.getElementById('waitlist-form');
  if (!form) return;
  const status = document.getElementById('waitlist-status');
  const btn = form.querySelector('button[type=submit]');
  const API = 'https://api.joul.health/waitlist';
  const say = (msg, isError) => { status.textContent = msg; status.classList.toggle('error', !!isError); };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    form.querySelectorAll('.field').forEach(f => f.classList.remove('invalid'));
    const d = Object.fromEntries(new FormData(form));
    const name = (d.name || '').trim(), email = (d.email || '').trim(), whatsapp = (d.whatsapp || '').trim();
    const waDigits = whatsapp.replace(/[\s().-]/g, '');
    const bad = [];
    if (!name) bad.push('wl-name');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) bad.push('wl-email');
    if (!/^\+[1-9]\d{7,14}$/.test(waDigits)) bad.push('wl-wa');
    if (bad.length) {
      bad.forEach(id => document.getElementById(id).closest('.field').classList.add('invalid'));
      return say(bad.includes('wl-wa') && bad.length === 1 ? 'Add your WhatsApp number with country code, like +52 55 1234 5678.' : 'Please check the highlighted fields.', true);
    }
    if (!form.consent.checked) return say('Please tick the box so we can contact you.', true);
    btn.disabled = true; say('Sending…');
    try {
      const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, whatsapp, consent: true, website: d.website || '' }) });
      if (res.status === 201) { form.classList.add('done'); say("You're on the list. We'll write when there's room."); return; }
      if (res.status === 429) return say('Too many tries. Please wait a few minutes and try again.', true);
      const body = await res.json().catch(() => ({}));
      say(body.message || 'Something went wrong. Please try again.', true);
    } catch {
      say("Couldn't reach the server. Please try again, or email hq@joul.health.", true);
    } finally { btn.disabled = false; }
  });
})();
