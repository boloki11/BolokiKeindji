/* =========================
   Portfolio JS
   ========================= */

/* --- Helpers & selectors --- */
const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const langSelect = document.getElementById('langSelect');
const typedTextEl = document.getElementById('typed-text');
const taglineEl = document.getElementById('tagline');
const aboutTextEl = document.getElementById('aboutText');

/* --- Dark / Light Mode --- */
function setTheme(isLight) {
  if (isLight) {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
    // update floating profile glow
  } else {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
  }
}
let lightMode = false;
themeToggle.addEventListener('click', () => {
  lightMode = !lightMode;
  setTheme(lightMode);
  themeToggle.classList.toggle('active', lightMode);
  themeToggle.title = lightMode ? 'Light mode' : 'Dark mode';
});

/* --- Language switcher --- */
function setLanguage(lang) {
  // hero subtitle
  const typedData = typedTextEl.getAttribute(`data-${lang}`);
  const taglineData = taglineEl.getAttribute(`data-${lang}`);
  const aboutData = aboutTextEl.getAttribute(`data-${lang}`);

  if (typedData) typedTextEl._source = typedData;
  if (taglineData) taglineEl.textContent = taglineData;
  if (aboutData) aboutTextEl.textContent = aboutData;

  // update other headings (example, data-lang attributes already present for h2)
  document.querySelectorAll('[data-lang-en]').forEach(el => {
    const txt = el.getAttribute(`data-lang-${lang}`);
    if (txt !== null) el.textContent = txt;
  });
}
langSelect.addEventListener('change', (e) => setLanguage(e.target.value));
setLanguage('en'); // default

/* --- Typing animation for hero subtitle --- */
(function typingRunner(){
  // uses typedTextEl._source loaded by setLanguage
  const defaultTexts = typedTextEl.getAttribute('data-en') || '';
  typedTextEl._source = typedTextEl._source || defaultTexts;
  const toType = typedTextEl._source;
  let i = 0, j = 0, typing = true;

  function typeLoop(){
    const text = typedTextEl._source;
    if (!text) return;
    if (typing) {
      typedTextEl.textContent = text.slice(0, j+1);
      j++;
      if (j >= text.length) { typing = false; setTimeout(typeLoop, 1200); return; }
      setTimeout(typeLoop, 60);
    } else {
      typedTextEl.textContent = text.slice(0, j-1);
      j--;
      if (j <= 0) { typing = true; setTimeout(typeLoop, 300); return; }
      setTimeout(typeLoop, 30);
    }
  }
  typeLoop();
})();

/* --- Scroll fade-in (IntersectionObserver) --- */
const faders = document.querySelectorAll('.fade-in');
const appearOptions = { threshold: 0.18 };
const appearOnScroll = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('appear');
      obs.unobserve(entry.target);
    }
  });
}, appearOptions);
faders.forEach(f => appearOnScroll.observe(f));

/* --- Projects carousel (auto-slide, arrows, pause on hover) --- */
const carousel = document.getElementById('projectCarousel');
const projects = carousel.querySelectorAll('.project');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
let carouselIndex = 0;
let carouselInterval = null;

function showCarousel(index) {
  // scroll so that the project is visible (smooth)
  const project = projects[index];
  project.scrollIntoView({behavior:'smooth',inline:'center'});
  // tiny highlight
  projects.forEach(p => p.style.transform = 'scale(1)');
  project.style.transform = 'scale(1.02)';
}

function nextProject() {
  carouselIndex = (carouselIndex + 1) % projects.length;
  showCarousel(carouselIndex);
}
function prevProjectFn() {
  carouselIndex = (carouselIndex - 1 + projects.length) % projects.length;
  showCarousel(carouselIndex);
}
nextBtn.addEventListener('click', nextProject);
prevBtn.addEventListener('click', prevProjectFn);

/* autoplay */
function startCarouselAuto() {
  stopCarouselAuto();
  carouselInterval = setInterval(() => { nextProject(); }, 4800);
}
function stopCarouselAuto() { if (carouselInterval) { clearInterval(carouselInterval); carouselInterval = null; } }

carousel.addEventListener('mouseenter', stopCarouselAuto);
carousel.addEventListener('mouseleave', startCarouselAuto);

/* initialize */
showCarousel(0);
startCarouselAuto();

/* --- Floating particles (canvas) --- */
const pCanvas = document.getElementById('particles');
const pCtx = pCanvas.getContext('2d');
let pW = pCanvas.width = window.innerWidth;
let pH = pCanvas.height = window.innerHeight;
let particles = [];
const PARTICLE_COUNT = Math.min(140, Math.floor((pW*pH)/12000));

class P {
  constructor(){
    this.reset();
  }
  reset(){
    this.x = Math.random()*pW;
    this.y = Math.random()*pH;
    this.size = Math.random()*2.4 + 0.5;
    this.vx = (Math.random()-0.5) * 0.6;
    this.vy = (Math.random()-0.5) * 0.6;
    this.h = Math.random()*360;
    this.alpha = 0.4 + Math.random()*0.6;
  }
  update(){
    this.x += this.vx; this.y += this.vy;
    if (this.x < -20 || this.x > pW+20 || this.y < -20 || this.y > pH+20) this.reset();
  }
  draw(){
    pCtx.beginPath();
    pCtx.fillStyle = `hsla(${this.h}, 100%, 60%, ${this.alpha})`;
    pCtx.shadowColor = `hsla(${this.h}, 100%, 60%, ${this.alpha})`;
    pCtx.shadowBlur = 16;
    pCtx.arc(this.x,this.y,this.size,0,Math.PI*2);
    pCtx.fill();
  }
}

function initParticles(){
  particles = [];
  for (let i=0;i<PARTICLE_COUNT;i++) particles.push(new P());
}
function animateParticles(){
  pCtx.clearRect(0,0,pW,pH);
  for (let pt of particles){pt.update();pt.draw();}
  requestAnimationFrame(animateParticles);
}

// neon lines canvas
const nCanvas = document.getElementById('neon-lines');
const nCtx = nCanvas.getContext('2d');
function resizeCanvases(){
  pW = pCanvas.width = window.innerWidth;
  pH = pCanvas.height = window.innerHeight;
  nCanvas.width = pW; nCanvas.height = pH;
  initParticles();
}
window.addEventListener('resize', resizeCanvases);
resizeCanvases();
initParticles();
animateParticles();

/* --- Animated neon connector lines between sections --- */
function drawNeonLines(){
  nCtx.clearRect(0,0,nCanvas.width,nCanvas.height);
  const sections = document.querySelectorAll('main > section');
  nCtx.lineWidth = 2.6;

  for (let i=0;i<sections.length-1;i++){
    const a = sections[i].getBoundingClientRect();
    const b = sections[i+1].getBoundingClientRect();

    // compute points in viewport coords, then convert to canvas coordinates by adding scrollY
    const x1 = (a.left + a.right) / 2;
    const y1 = a.bottom + window.scrollY - 30;
    const x2 = (b.left + b.right) / 2;
    const y2 = b.top + window.scrollY + 30;

    const grad = nCtx.createLinearGradient(x1,y1,x2,y2);
    grad.addColorStop(0, 'rgba(0,255,242,0.85)');
    grad.addColorStop(0.5, 'rgba(255,0,208,0.75)');
    grad.addColorStop(1, 'rgba(255,212,0,0.85)');

    nCtx.strokeStyle = grad;
    nCtx.beginPath();
    // a smooth curve
    const midX = (x1 + x2)/2;
    nCtx.moveTo(x1 - window.scrollX, y1 - window.scrollY);
    nCtx.bezierCurveTo(midX - window.scrollX, y1 - window.scrollY - 40, midX - window.scrollX, y2 - window.scrollY + 40, x2 - window.scrollX, y2 - window.scrollY);
    nCtx.stroke();

    // slight glowing copy for blur
    nCtx.globalAlpha = 0.25;
    nCtx.lineWidth = 8;
    nCtx.strokeStyle = grad;
    nCtx.stroke();
    nCtx.globalAlpha = 1;
    nCtx.lineWidth = 2.6;
  }
  requestAnimationFrame(drawNeonLines);
}
drawNeonLines();

/* --- Contact form simple handler --- */
document.getElementById('contactForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  alert('Thanks — message captured (demo).');
  e.target.reset();
});

/* --- Smooth nav link scrolling & active link highlight --- */
document.querySelectorAll('.nav-link').forEach(link=>{
  link.addEventListener('click',(ev)=>{
    ev.preventDefault();
    const id = link.getAttribute('href');
    const target = document.querySelector(id);
    if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
  });
});

/* --- Start/stop features on visibility change for performance --- */
document.addEventListener('visibilitychange', ()=>{
  if(document.hidden) stopCarouselAuto();
  else startCarouselAuto();
});

/* --- initial language (already set to en) --- */
setLanguage = (lang) => {
  // update texts already handled by setLanguage earlier call; keep function local here
  // populate typed-text source
  const src = typedTextEl.getAttribute(`data-${lang}`);
  typedTextEl._source = src || typedTextEl._source;
  taglineEl.textContent = taglineEl.getAttribute(`data-${lang}`) || taglineEl.textContent;
  aboutTextEl.textContent = aboutTextEl.getAttribute(`data-${lang}`) || aboutTextEl.textContent;

  // update headings using data-lang-* attributes
  document.querySelectorAll('[data-lang-en]').forEach(el=>{
    const val = el.getAttribute(`data-lang-${lang}`);
    if(val) el.textContent = val;
  });
};
langSelect.addEventListener('change', (e)=> setLanguage(e.target.value));
setLanguage('en'); // default call to load strings
