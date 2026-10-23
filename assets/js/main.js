(() => {
  // Duplicate the reel so the CSS loop is seamless
  const track = document.querySelector('.reel-track');
  if (track) {
    [...track.children].forEach((img) => {
      const copy = img.cloneNode(true);
      copy.alt = '';
      copy.setAttribute('aria-hidden', 'true');
      track.appendChild(copy);
    });
  }

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  // Highlight the nav link for the section in view
  const links = [...document.querySelectorAll('.topnav a')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const setActive = () => {
    const y = window.scrollY + window.innerHeight * 0.35;
    let current = sections[0];
    sections.forEach((s) => { if (s.offsetTop <= y) current = s; });
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) current = sections[sections.length - 1];
    links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + current.id));
  };
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  // Gallery filters
  const tiles = [...document.querySelectorAll('.tile')];
  const filters = document.querySelectorAll('.filter');
  filters.forEach((btn) => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    filters.forEach((b) => {
      const on = b === btn;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    tiles.forEach((t) => t.classList.toggle('is-hidden', f !== 'all' && t.dataset.cat !== f));
  }));

  // Lightbox
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCap');
  let idx = 0;
  const visible = () => tiles.filter((t) => !t.classList.contains('is-hidden'));
  const show = (i) => {
    const list = visible();
    idx = (i + list.length) % list.length;
    const t = list[idx];
    const img = t.querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    const b = t.querySelector('b').textContent;
    const d = t.querySelector('figcaption > span:last-child').textContent;
    lbCap.innerHTML = '';
    const title = document.createElement('b');
    title.textContent = b;
    lbCap.append(title, d);
  };
  tiles.forEach((t) => {
    t.tabIndex = 0;
    t.setAttribute('role', 'button');
    const open = () => { show(visible().indexOf(t)); lb.showModal(); };
    t.addEventListener('click', open);
    t.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
  lb.addEventListener('click', (e) => {
    const action = e.target.closest('[data-lb]')?.dataset.lb;
    if (action === 'close' || e.target === lb) lb.close();
    if (action === 'prev') show(idx - 1);
    if (action === 'next') show(idx + 1);
  });
  lb.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
})();
