/* ═══════════════════════════════════════════════════════════
   JOHNY CAR DETAILING — MAIN JS
   Lenis + GSAP ScrollTrigger + Cinematic Effects
   ═══════════════════════════════════════════════════════════ */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Car3DEngine } from './car3d.js';

gsap.registerPlugin(ScrollTrigger);


/* ═════════════════════════════════════════════
   1. LENIS SMOOTH SCROLL — Buttery glide
   ═════════════════════════════════════════════ */
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
  touchMultiplier: 1.5,
});

// Connect Lenis to GSAP's ticker
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);


/* ═════════════════════════════════════════════
   GOLD PARTICLES SYSTEM
   ═════════════════════════════════════════════ */
class GoldParticles {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    this.isActive = true;
    this.resize();
    this.init();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  init() {
    const count = Math.min(80, Math.floor(this.width * this.height / 15000));
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        flickerSpeed: Math.random() * 0.02 + 0.005,
        flickerOffset: Math.random() * Math.PI * 2,
        hue: 43 + Math.random() * 10 - 5,
        sat: 60 + Math.random() * 20,
        light: 50 + Math.random() * 20,
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  animate() {
    if (!this.isActive) return;
    this.ctx.clearRect(0, 0, this.width, this.height);
    const time = performance.now() * 0.001;

    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;

      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        const force = (200 - dist) / 200 * 0.01;
        p.vx += dx * force * 0.01;
        p.vy += dy * force * 0.01;
      }

      p.vx *= 0.99;
      p.vy *= 0.99;

      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;
      if (p.y < -10) p.y = this.height + 10;
      if (p.y > this.height + 10) p.y = -10;

      const flicker = Math.sin(time * p.flickerSpeed * 60 + p.flickerOffset) * 0.3 + 0.7;
      const alpha = p.opacity * flicker;

      this.ctx.save();
      this.ctx.globalAlpha = alpha;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      this.ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${p.light}%, 0.05)`;
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${p.light}%, 0.8)`;
      this.ctx.fill();

      this.ctx.restore();
    }

    this.ctx.save();
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const a = this.particles[i];
        const b = this.particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const alpha = (1 - dist / 100) * 0.04;
          this.ctx.beginPath();
          this.ctx.moveTo(a.x, a.y);
          this.ctx.lineTo(b.x, b.y);
          this.ctx.strokeStyle = `rgba(200, 168, 70, ${alpha})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }
    this.ctx.restore();

    requestAnimationFrame(() => this.animate());
  }

  destroy() {
    this.isActive = false;
  }
}

const particleCanvas = document.getElementById('heroParticles');
if (particleCanvas) {
  new GoldParticles(particleCanvas);
}


/* ═════════════════════════════════════════════
   NAVIGATION
   ═════════════════════════════════════════════ */
const nav = document.getElementById('nav');
ScrollTrigger.create({
  start: 100,
  onUpdate: (self) => {
    if (self.direction === 1 && self.scroll() > 100) {
      nav.classList.add('nav--scrolled');
    } else if (self.scroll() < 100) {
      nav.classList.remove('nav--scrolled');
    }
  }
});


/* ═════════════════════════════════════════════
   5. LETTER EXPLOSION — Split & scatter
   ═════════════════════════════════════════════ */

// Split text into individual character spans
function splitTextToChars(element) {
  const text = element.textContent;
  element.textContent = '';
  element.setAttribute('aria-label', text);
  
  const chars = [];
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const span = document.createElement('span');
    span.className = 'hero__char';
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.display = 'inline-block';
    span.style.willChange = 'transform, filter, opacity';
    element.appendChild(span);
    chars.push(span);
  }
  return chars;
}

// ══ WAIT FOR FONTS BEFORE SPLITTING TEXT ══
// Prevents font-swap reflow flash (display:swap causes layout shift)
document.fonts.ready.then(() => {

// Split both title lines into characters
const titleLine1 = document.querySelector('.hero__title-line--1');
const titleLine2 = document.querySelector('.hero__title-line--2');

let chars1 = [];
let chars2 = [];

if (titleLine1 && titleLine2) {
  chars1 = splitTextToChars(titleLine1);
  chars2 = splitTextToChars(titleLine2);
}

// Pre-set chars to invisible state before revealing
if (chars1.length > 0) gsap.set(chars1, { opacity: 0, y: 100, filter: 'blur(12px)' });
if (chars2.length > 0) gsap.set(chars2, { opacity: 0, y: 80, filter: 'blur(10px)' });

// NOW safe to reveal — fonts loaded, chars pre-hidden
gsap.set('#heroTitle', { visibility: 'visible', opacity: 1 });

/* ═════════════════════════════════════════════
   HERO ENTRY ANIMATION
   ═════════════════════════════════════════════ */

// If user refreshed mid-scroll, skip entry animation — just show everything
const isScrolledPastTop = window.scrollY > 50;

if (isScrolledPastTop) {
  // Instantly show all elements in their natural state
  gsap.set(chars1, { opacity: 1, y: 0, filter: 'blur(0px)' });
  gsap.set(chars2, { opacity: 1, y: 0, filter: 'blur(0px)' });
  gsap.set('.hero__tagline', { opacity: 1, y: 0 });
  gsap.set('.hero__scroll', { opacity: 1 });
  gsap.set('.hero__media-frame', { opacity: 1 });
} else {
  // Normal entry animation — user is at the top
  const heroTl = gsap.timeline({ delay: 0.3 });

  if (chars1.length > 0) {
    heroTl.fromTo(chars1,
      { y: 100, opacity: 0, filter: 'blur(12px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, stagger: 0.04, ease: 'power3.out' }
    );
  }

  if (chars2.length > 0) {
    heroTl.fromTo(chars2,
      { y: 80, opacity: 0, filter: 'blur(10px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9, stagger: 0.03, ease: 'power3.out' },
    '-=0.6');
  }

  heroTl
    .to('.hero__tagline', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
    }, '-=0.4')
    .to('.hero__scroll', {
      opacity: 1,
      duration: 0.6,
    }, '-=0.3')
    .to('.hero__media-frame', {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
    }, '-=0.5');

  // Start the sweep after entry animation finishes
  heroTl.call(createLightSweep);
}


/* ═════════════════════════════════════════════
   4. GOLDEN LIGHT SWEEP — Staggered color flash
   Light reflecting off car paint effect
   ═════════════════════════════════════════════ */
function createLightSweep() {
  const allChars = [...chars1, ...chars2];
  if (allChars.length === 0) return;

  // Store original colors
  const origColors = allChars.map((char) => {
    const isLine1 = chars1.includes(char);
    return isLine1 ? '#C8A846' : '#F5F0E8';
  });

  const sweepTl = gsap.timeline({
    repeat: -1,
    repeatDelay: 3,
    delay: 2.5,
  });

  // Sweep: each char briefly flashes bright white then returns
  allChars.forEach((char, i) => {
    const isLine1 = chars1.includes(char);
    const brightColor = isLine1 ? '#FFF8DC' : '#FFFFFF';
    const origColor = origColors[i];

    sweepTl
      .to(char, {
        color: brightColor,
        textShadow: isLine1 
          ? '0 0 30px rgba(255, 248, 220, 0.6), 0 0 60px rgba(200, 168, 70, 0.3)'
          : '0 0 30px rgba(255, 255, 255, 0.4)',
        duration: 0.08,
        ease: 'power2.in',
      }, i * 0.04)
      .to(char, {
        color: origColor,
        textShadow: isLine1 
          ? '0 0 80px rgba(200, 168, 70, 0.35)'
          : 'none',
        duration: 0.3,
        ease: 'power2.out',
      }, i * 0.04 + 0.08);
  });
}

// Start the sweep — after entry animation or immediately if scrolled
if (isScrolledPastTop) {
  createLightSweep();
}


/* ═════════════════════════════════════════════
   SCROLL: LETTER EXPLOSION (Phase 1: 0%→30%)
   Each letter flies in a unique direction
   ═════════════════════════════════════════════ */

// Pre-calculate unique explosion vectors for each character
function generateExplosionData(chars, lineIndex) {
  return chars.map((char, i) => {
    const total = chars.length;
    const centerOffset = (i / total) - 0.5; // -0.5 to 0.5
    
    // Pseudo-random but deterministic directions
    const seed = i * 137.508 + lineIndex * 42;
    const angle = (seed % 360) * (Math.PI / 180);
    
    // Distance scales with how far from center the char is
    const baseDist = 300 + Math.abs(centerOffset) * 600;
    
    return {
      x: Math.cos(angle) * baseDist * (1 + Math.random() * 0.5),
      y: Math.sin(angle) * baseDist * (0.5 + Math.random() * 0.5),
      rotation: (Math.random() - 0.5) * 360,
      scale: Math.random() * 0.5, // scale down to 0-0.5
      blur: 8 + Math.random() * 15,
    };
  });
}

if (chars1.length > 0 && chars2.length > 0) {
  const explosion1 = generateExplosionData(chars1, 0);
  const explosion2 = generateExplosionData(chars2, 1);

  const explosionTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: '30% top',
      scrub: 1.5,
      pin: false,
    }
  });

  // Animate each char of line 1 individually
  chars1.forEach((char, i) => {
    const data = explosion1[i];
    explosionTl.to(char, {
      x: data.x,
      y: data.y,
      rotation: data.rotation,
      scale: data.scale,
      filter: `blur(${data.blur}px)`,
      opacity: 0,
      ease: 'power2.in',
      duration: 1,
    }, 0);
  });

  // Animate each char of line 2 individually
  chars2.forEach((char, i) => {
    const data = explosion2[i];
    explosionTl.to(char, {
      x: data.x,
      y: data.y,
      rotation: data.rotation,
      scale: data.scale,
      filter: `blur(${data.blur}px)`,
      opacity: 0,
      ease: 'power2.in',
      duration: 1,
    }, 0);
  });

  // Tagline and scroll indicator fade out together
  explosionTl
    .to('.hero__tagline', {
      y: -40,
      opacity: 0,
      ease: 'none',
      duration: 1,
    }, 0)
    .to('.hero__scroll', {
      opacity: 0,
      ease: 'none',
      duration: 0.5,
    }, 0);
}

// Force ScrollTrigger to recalculate positions based on current scroll
// Critical for mid-page refresh where browser restores scroll position
ScrollTrigger.refresh();

}); // end document.fonts.ready


/* ═════════════════════════════════════════════
   SCROLL: GARAGE DOOR OPENS (Phase 1.5: 20%→45%)
   Sectional door slides up revealing the scene
   ═════════════════════════════════════════════ */
const garageDoor = document.getElementById('heroGarageDoor');
if (garageDoor) {
  gsap.timeline({
    scrollTrigger: {
      trigger: '#hero',
      start: '35% top',
      end: '55% top',
      scrub: 1.5,
    }
  })
    .to(garageDoor, {
      yPercent: -100,
      ease: 'none',
    });
}


/* ═════════════════════════════════════════════
   3D BMW E30 M3 — PŘÍMÝ SCROLL CONTROLLER
   Žádný ScrollTrigger pro 3D auto.
   Počítáme stav přímo ze scroll pozice každý frame.
   Bulletproof — funguje vždy, dopředu i zpět.
   ═════════════════════════════════════════════ */
const car3d = new Car3DEngine();
car3d.init();

car3d.loadModel('/models/free_bmw_m3_e30.glb', (progress) => {
  console.log(`Loading BMW: ${Math.round(progress * 100)}%`);
}).then(() => {
  console.log('✅ BMW E30 M3 ready');

  // Vynutit skrytí na startu
  car3d.setOpacity(0);

  // Hero výška = 340vh, počítáme z CSS, ne z offsetHeight
  // (offsetHeight může být nespolehlivý při prvním renderování)
  const HERO_VH = 340;

  // Služby element pro detekci konce
  const servicesEl = document.querySelector('.services');

  // ── HLAVNÍ SCROLL HANDLER — volaný každý frame ──
  function updateCarState() {
    const vh = window.innerHeight;
    const heroHeight = (HERO_VH / 100) * vh; // 340vh v pixelech
    const scrollY = window.scrollY;

    // Pixelové hranice pro fáze
    const fadeStart = heroHeight * 0.55;   // auto začne fade-in (později)
    const fadeEnd   = heroHeight * 0.70;   // auto plně viditelné (rychlejší)
    const moveStart = heroHeight * 0.82;   // auto jede dopředu
    const moveEnd   = heroHeight * 0.98;   // konec animace
    const servicesTop = servicesEl ? servicesEl.offsetTop : heroHeight;

    // ── OPACITY ──
    let opacity = 0;
    if (scrollY < fadeStart) {
      // Nad garážovými vraty → auto neviditelné
      opacity = 0;
    } else if (scrollY < fadeEnd) {
      // Garáž se otevírá → plynulý fade-in 0→1
      opacity = (scrollY - fadeStart) / (fadeEnd - fadeStart);
    } else {
      // Garáž otevřená → plně viditelné (services handler přebírá)
      opacity = 1;
    }
    car3d.setOpacity(opacity);

    // (Phase 3c odstraněna — auto zůstává statické v hero)

    // ── OVERLAY TEXT — fade out (78% → 85%) ──
    // Pod 78% ho NEŘÍDÍME — jiné animace ho zobrazují
    const overlayEl = document.getElementById('heroOverlayText');
    if (overlayEl) {
      const textFadeStart = heroHeight * 0.78;
      const textFadeEnd   = heroHeight * 0.85;
      if (scrollY >= textFadeStart && scrollY < textFadeEnd) {
        const p = (scrollY - textFadeStart) / (textFadeEnd - textFadeStart);
        overlayEl.style.opacity = String(1 - p);
        overlayEl.style.transform = `translateY(${-30 * p}px)`;
      } else if (scrollY >= textFadeEnd) {
        overlayEl.style.opacity = '0';
        overlayEl.style.transform = 'translateY(-30px)';
      }
    }

    // ── MEDIA WRAPPER — fade out (80% → 92%) ──
    const mediaEl = document.getElementById('heroMediaWrapper');
    if (mediaEl) {
      const mediaFadeStart = heroHeight * 0.80;
      const mediaFadeEnd   = heroHeight * 0.92;
      if (scrollY < mediaFadeStart) {
        mediaEl.style.opacity = '1';
      } else if (scrollY < mediaFadeEnd) {
        const p = (scrollY - mediaFadeStart) / (mediaFadeEnd - mediaFadeStart);
        mediaEl.style.opacity = String(1 - p);
      } else {
        mediaEl.style.opacity = '0';
      }
    }
  }

  // Připojit na GSAP ticker — běží 60fps, synchronizovaný s Lenis
  gsap.ticker.add(updateCarState);

  /* ═════════════════════════════════════════════
     SERVICES — INTRO SCROLLYTELLING
     Auto jede doleva + rotuje (střecha viditelná).
     Vše lineárně mapované na scroll.
     ═════════════════════════════════════════════ */
  const servicesIntro = document.getElementById('servicesIntro');

  // Animace auta začíná od konce hero (fadeEnd) a končí na 90% services
  const HERO_VH_REF = 340;

  function updateServicesState() {
    if (!servicesEl) return;

    const vh = window.innerHeight;
    const heroH = (HERO_VH_REF / 100) * vh;
    const animStart = heroH * 0.70;  // fadeEnd — auto právě viditelné
    const servicesEnd = servicesEl.offsetTop + servicesEl.offsetHeight;
    const animEnd = servicesEnd * 0.90; // 90% celého rozsahu
    const scrollY = window.scrollY;

    // Před animací → nic
    if (scrollY < animStart) return;
    // Za koncem services → drží finál
    if (scrollY > servicesEnd) return;

    // Progress 0–1 přes celý rozsah (hero fadeEnd → 90% services)
    const rawProgress = (scrollY - animStart) / (animEnd - animStart);
    const progress = Math.max(0, Math.min(1, rawProgress));

    // Auto zůstává viditelné
    car3d.setOpacity(1);

    // Auto dokončí pohyb na 45% progress (těsně PŘED textem na 100% = 50%)
    const carP = Math.min(progress / 0.45, 1);

    // ── AUTO: posun doleva ~400px (≈ 1.6 units) ──
    const posX = carP * -1.6;

    // positionY: auto jede nahoru (0 → +0.8)
    const posY = carP * 0.8;

    // rotationY: jenom lehce otočit (0 → ~27°)
    const rotY = carP * Math.PI * 0.15;

    // rotationX: naklonit pro viditelnost střechy (0 → +23°)
    const rotX = carP * 0.4;

    car3d.update({
      positionX: posX,
      positionY: posY,
      rotationY: rotY,
      rotationX: rotX,
    });

    // ── NADPIS: fade-in od 30% do 50% progress ──
    if (servicesIntro) {
      if (progress < 0.30) {
        servicesIntro.style.opacity = '0';
        servicesIntro.style.transform = 'translateY(-50%) translateX(30px)';
      } else if (progress < 0.50) {
        const t = (progress - 0.30) / 0.20;
        servicesIntro.style.opacity = String(t);
        servicesIntro.style.transform = `translateY(-50%) translateX(${30 * (1 - t)}px)`;
      } else {
        servicesIntro.style.opacity = '1';
        servicesIntro.style.transform = 'translateY(-50%) translateX(0)';
      }
    }
  }

  gsap.ticker.add(updateServicesState);

}).catch((err) => {
  console.warn('3D car not available:', err);
});


/* ═════════════════════════════════════════════
   SCROLL: MEDIA EXPANSION (Phase 2: 15%→70%)
   ═════════════════════════════════════════════ */
const expandTl = gsap.timeline({
  scrollTrigger: {
    trigger: '#hero',
    start: '15% top',
    end: '70% top',
    scrub: 2,
    pin: false,
  }
});

expandTl
  .to('#heroMediaFrame', {
    width: window.innerWidth,
    height: window.innerHeight,
    borderRadius: 0,
    borderColor: 'rgba(200, 168, 70, 0)',
    boxShadow: '0 0 0px rgba(200, 168, 70, 0)',
    ease: 'power2.inOut',
  });


/* ═════════════════════════════════════════════
   SCROLL: OVERLAY TEXT REVEAL (Phase 2c: 55%→75%)
   ═════════════════════════════════════════════ */
const overlayText = document.getElementById('heroOverlayText');
if (overlayText) {
  gsap.timeline({
    scrollTrigger: {
      trigger: '#hero',
      start: '60% top',
      end: '78% top',
      scrub: 1,
    }
  })
    .fromTo(overlayText,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0 }
    );
}


/* ═════════════════════════════════════════════
   SCROLL: FLOATING TEXT PARALLAX (Phase 2b: 20%→55%)
   ═════════════════════════════════════════════ */
const floaterEls = document.querySelectorAll('.hero__float-text');
floaterEls.forEach((el) => {
  const x = el.dataset.x;
  const y = el.dataset.y;
  el.style.left = `${x}%`;
  el.style.top = `${y}%`;

  const speed = parseFloat(el.dataset.speed) || 1;

  gsap.timeline({
    scrollTrigger: {
      trigger: '#hero',
      start: '20% top',
      end: '55% top',
      scrub: 1,
    }
  })
    .fromTo(el,
      { opacity: 0, y: 50 * speed },
      { opacity: 1, y: 0, duration: 0.5 }
    )
    .to(el, {
      y: -80 * speed,
      opacity: 0,
      duration: 0.5,
    });
});


/* ═════════════════════════════════════════════
   SCROLL: PARTICLES FADE (Phase 3: 60%→80%)
   ═════════════════════════════════════════════ */
gsap.to('#heroParticles', {
  opacity: 0,
  scrollTrigger: {
    trigger: '#hero',
    start: '60% top',
    end: '80% top',
    scrub: 1,
  }
});


/* ═════════════════════════════════════════════
   FIXED → ABSOLUTE TRANSITION
   ═════════════════════════════════════════════ */
ScrollTrigger.create({
  trigger: '#hero',
  start: 'top top',
  end: 'bottom bottom',
  onLeave: () => {
    gsap.set(['.hero__text-layer', '.hero__media-wrapper', '.hero__floaters', '.hero__particles', '.hero__scroll', '.hero__overlay-text'], {
      position: 'absolute',
      bottom: 0,
      top: 'auto',
    });
    // Canvas stays visible — Phase 3 manages its visibility
  },
  onEnterBack: () => {
    gsap.set(['.hero__text-layer', '.hero__media-wrapper', '.hero__floaters', '.hero__particles', '.hero__scroll', '.hero__overlay-text'], {
      position: 'fixed',
      top: 0,
      bottom: 'auto',
    });
  }
});


/* ═════════════════════════════════════════════
   MOBILE BURGER
   ═════════════════════════════════════════════ */
const burger = document.getElementById('navBurger');
if (burger) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
  });
}


/* ═════════════════════════════════════════════
   RESIZE HANDLER
   ═════════════════════════════════════════════ */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 250);
});

console.log('🚗 Johny Car Detailing — Cinematic Hero v2 loaded');
