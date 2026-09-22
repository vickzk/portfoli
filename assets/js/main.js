(function(){
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  try{
    var saved = localStorage.getItem('vt-theme');
    if(saved) document.documentElement.setAttribute('data-theme', saved);
  }catch(e){}

  var themeBtn = document.getElementById('themeBtn');
  themeBtn.addEventListener('click', function(){
    var cur = document.documentElement.getAttribute('data-theme');
    var mql = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var next;
    if(!cur){ next = mql ? 'light' : 'dark'; }
    else if(cur === 'dark'){ next = 'light'; }
    else { next = 'dark'; }
    document.documentElement.setAttribute('data-theme', next);
    try{ localStorage.setItem('vt-theme', next); }catch(e){}
  });

  var mobileNav = document.getElementById('mobileNav');
  var navToggle = document.getElementById('navToggle');
  navToggle.addEventListener('click', function(){
    var open = mobileNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  // Native <a href="#id"> navigation already scrolls (smoothly, via CSS
  // scroll-behavior) and updates the URL — no JS needed for that. We only
  // need to close the mobile menu when a link is used.
  document.querySelectorAll('.mobile-nav a').forEach(function(a){
    a.addEventListener('click', function(){
      mobileNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  var TITLES = {
    home: 'Vignesh T',
    about: 'About — Vignesh T',
    experience: 'Experience — Vignesh T',
    projects: 'Projects — Vignesh T',
    connect: 'Connect — Vignesh T'
  };
  var topnavLinks = document.querySelectorAll('.topnav a, .mobile-nav a');
  var sections = document.querySelectorAll('main > section[id]');

  var sectionObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(!entry.isIntersecting) return;
      var id = entry.target.id;
      topnavLinks.forEach(function(a){
        a.setAttribute('aria-current', a.getAttribute('data-target') === id ? 'true' : 'false');
      });
      if(TITLES[id]) document.title = TITLES[id];
    });
  }, { rootMargin: '-50% 0px -45% 0px', threshold: 0 });
  sections.forEach(function(s){ sectionObserver.observe(s); });

  var revealEls = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function(entries, obs){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(function(el){ revealObserver.observe(el); });
})();
