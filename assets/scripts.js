/* ─── CURSOR (founder-approved) ─── */
const cursor=document.getElementById('cursor');
const ring=document.getElementById('cursor-ring');
if(cursor && ring){
  let mx=window.innerWidth/2,my=window.innerHeight/2,rx=mx,ry=my;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cursor.style.left=mx+'px';cursor.style.top=my+'px'});
  (function animRing(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animRing)})();
  document.querySelectorAll('a,button,input,textarea').forEach(el=>{
    el.addEventListener('mouseenter',()=>{cursor.classList.add('hover');ring.classList.add('hover')});
    el.addEventListener('mouseleave',()=>{cursor.classList.remove('hover');ring.classList.remove('hover')});
  });
}

/* ─── LOADER (homepage only) ─── */
window.addEventListener('load',()=>{
  const l=document.getElementById('loader');
  if(l) setTimeout(()=>{l.style.display='none'},2800);
});

/* ─── HERO CLAY REVEAL (homepage only) ─── */
const hero=document.getElementById('hero');
const heroWarm=document.querySelector('.hero-img.warm');
if(hero && heroWarm){
  let hx=window.innerWidth/2,hy=window.innerHeight/2,hxc=hx,hyc=hy;
  hero.addEventListener('mousemove',e=>{const r=hero.getBoundingClientRect();hx=e.clientX-r.left;hy=e.clientY-r.top});
  hero.addEventListener('mouseleave',()=>{hx=hero.offsetWidth/2;hy=hero.offsetHeight/2});
  (function easeHero(){hxc+=(hx-hxc)*.18;hyc+=(hy-hyc)*.18;heroWarm.style.setProperty('--mx',hxc+'px');heroWarm.style.setProperty('--my',hyc+'px');requestAnimationFrame(easeHero)})();
  if(window.matchMedia('(hover:none)').matches){
    heroWarm.style.setProperty('--mx','50%');heroWarm.style.setProperty('--my','50%');
    heroWarm.style.webkitMaskImage='none';heroWarm.style.maskImage='none';heroWarm.style.opacity='.8';
  }
}

/* ─── NAV state (scrolled, on-dark, on-clay) ─── */
const navbar=document.getElementById('navbar');
if(navbar){
  const darkSections=document.querySelectorAll('#hero,#credo,#work,.handstrip,#venture,footer,.page-hero-dark');
  function navState(){
    navbar.classList.toggle('scrolled',window.scrollY>60);
    const probeY=window.innerHeight*0.08;let onDark=false;
    darkSections.forEach(el=>{const r=el.getBoundingClientRect();if(r.top<=probeY && r.bottom>=probeY) onDark=true});
    navbar.classList.toggle('light',onDark);
    document.body.classList.toggle('on-dark',onDark);
    if(hero){const hr=hero.getBoundingClientRect();document.body.classList.toggle('on-clay',hr.top<probeY*4 && hr.bottom>probeY*4)}
  }
  window.addEventListener('scroll',navState,{passive:true});
  window.addEventListener('resize',navState);
  navState();
}

/* ─── SCROLL REVEAL ─── */
const ro=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -60px 0px'});
document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));

/* ─── SIGIL (scroll-progress ring) ─── */
const sigilFill=document.querySelector('#sigil .sigil-ring .fill');
if(sigilFill){
  window.addEventListener('scroll',()=>{
    const max=document.documentElement.scrollHeight-window.innerHeight;
    const ratio=Math.max(0,Math.min(1,window.scrollY/Math.max(max,1)));
    sigilFill.style.strokeDashoffset = 100 - ratio*100;
  },{passive:true});
}

/* ─── MODALS ─── */
const modalOpeners=document.querySelectorAll('[data-modal-open]');
const modalClosers=document.querySelectorAll('[data-modal-close]');
function openModal(key){const m=document.getElementById(key+'-modal');if(!m)return;m.classList.add('open');document.body.style.overflow='hidden'}
function closeAllModals(){document.querySelectorAll('.modal-back.open').forEach(m=>m.classList.remove('open'));document.body.style.overflow=''}
modalOpeners.forEach(b=>b.addEventListener('click',e=>{e.preventDefault();openModal(b.dataset.modalOpen)}));
modalClosers.forEach(b=>b.addEventListener('click',closeAllModals));
document.querySelectorAll('.modal-back').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeAllModals()}));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllModals()});


/* ─── MOBILE NAV (hamburger) ─── */
const navToggle = document.querySelector('.nav-toggle');
const navScrim = document.querySelector('.nav-scrim');
function closeMenu(){document.body.classList.remove('menu-open');if(navToggle)navToggle.setAttribute('aria-expanded','false')}
if(navToggle){
  navToggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', closeMenu));
}
if(navScrim) navScrim.addEventListener('click', closeMenu);
document.addEventListener('keydown', e => { if(e.key==='Escape') closeMenu() });
