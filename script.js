'use strict';
document.documentElement.classList.add('js');

/* 1. Countdown: adapts to before / during / after the event (UTC+1) */
(function () {
  const el = document.getElementById('countdown');
  if (!el) return;
  const start = new Date('2026-10-22T09:00:00+01:00');
  const end = new Date('2026-10-23T17:00:00+01:00');
  const tick = () => {
    const now = new Date();
    if (now >= end) { el.textContent = 'Merci à tous : l\u2019édition 2026 est terminée.'; return clearInterval(timer); }
    if (now >= start) { el.textContent = 'L\u2019événement est en cours !'; return; }
    const d = start - now, day = 864e5, h = 36e5, m = 6e4;
    el.textContent = `Dans ${Math.floor(d / day)} j ${Math.floor(d % day / h)} h ${Math.floor(d % h / m)} min`;
  };
  const timer = setInterval(tick, 30000); tick();
})();

/* 2. Programme: accessible day tabs (progressive enhancement) */
(function () {
  const days = [...document.querySelectorAll('[data-day]')];
  if (days.length < 2) return;
  const list = document.createElement('div');
  list.className = 'day-tabs'; list.setAttribute('role', 'tablist');
  const tabs = days.map((sec, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'day-tab'; b.setAttribute('role', 'tab');
    b.id = 'tab-' + i; sec.id = 'panel-' + i;
    b.setAttribute('aria-controls', sec.id);
    sec.setAttribute('role', 'tabpanel'); sec.setAttribute('aria-labelledby', b.id);
    b.textContent = sec.querySelector('h2').textContent.replace(/^./, c => c.toUpperCase());
    b.addEventListener('click', () => select(i));
    b.addEventListener('keydown', e => {
      const n = { ArrowRight: i + 1, ArrowLeft: i - 1 }[e.key];
      if (n !== undefined) { select((n + days.length) % days.length); tabs[(n + days.length) % days.length].focus(); }
    });
    list.append(b); return b;
  });
  function select(i) {
    days.forEach((s, j) => { s.hidden = j !== i; tabs[j].setAttribute('aria-selected', j === i); tabs[j].tabIndex = j === i ? 0 : -1; });
  }
  days[0].before(list);
  select(new Date() >= new Date('2026-10-23T00:00:00+01:00') ? 1 : 0);
  document.querySelectorAll('.tag').forEach(t => { if (t.textContent === 'pause') t.closest('.schedule-item').classList.add('is-break'); });
})();

/* 3. Registration: validation + confirmation (front-end only, no data sent) */
(function () {
  const form = document.querySelector('.registration-form');
  if (!form) return;
  const labels = { jeudi: 'le jeudi 22 octobre', vendredi: 'le vendredi 23 octobre', both: 'les 22 et 23 octobre' };
  const messages = {
    fullname: 'Indiquez votre nom complet.',
    email: 'Utilisez une adresse du type nom@domaine.com.',
    phone: 'Utilisez le format +212612345678 ou 0612345678.'
  };
  form.querySelectorAll('input[type=text],input[type=email],input[type=tel]').forEach(inp => {
    const err = document.createElement('span');
    err.className = 'field-error'; err.id = inp.id + '-error'; err.setAttribute('aria-live', 'polite');
    inp.after(err); inp.setAttribute('aria-describedby', err.id);
    const check = () => { err.textContent = inp.validity.valid || !inp.value ? '' : messages[inp.id]; };
    inp.addEventListener('blur', check);
    inp.addEventListener('input', () => { if (err.textContent) check(); });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const box = document.createElement('div');
    box.className = 'form-success'; box.tabIndex = -1;
    const h = document.createElement('h2'); h.textContent = 'Inscription enregistrée';
    const p = document.createElement('p');
    p.textContent = `Merci ${data.get('fullname')} ! Votre place est réservée pour ${labels[data.get('attendance')]}. Une confirmation sera envoyée à ${data.get('email')}.`;
    box.append(h, p); form.replaceWith(box); box.focus();
  });
})();


(function () {
  const items = document.querySelectorAll('.speaker-card');
  if (!items.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { threshold: 0.15 });
  items.forEach(i => { i.classList.add('reveal'); io.observe(i); });
})();
