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

  // Shared utility functions
  const HERO_VH_REF = 340;
  function smoothstep(t) { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ═════════════════════════════════════════════
     SERVICES — SCROLL-DRIVEN CAROUSEL ENGINE
     Phase 1: Intro text + car left (0→15%)
     Phase 2: Car transitions to center (15→25%)  
     Phase 3: Carousel rotates (25→95%)
     Phase 4: Fade out (95→100%)
     ═════════════════════════════════════════════ */
  const servicesIntro = document.getElementById('servicesIntro');
  const carouselSection = document.getElementById('carouselSection');
  const carouselCards = document.querySelectorAll('#carouselSection .carousel__card');
  const carouselCounterEl = document.getElementById('carouselCounterCurrent');
  const carouselTitleEl = document.getElementById('carouselTitle');

  // Carousel layout config (from prototype)
  const CAROUSEL_CFG = {
    radiusX: 480,
    scaleFront: 1.05, scaleBack: 0.45,
    opacityFront: 1.0, opacityBack: 0.08,
    blurBack: 10,
    cardTiltMax: 35,
    orbitTiltY: 120,  // vertical tilt amplitude
  };
  const NUM_CARDS = carouselCards.length || 4;
  const ANGLE_PER_CARD = (Math.PI * 2) / NUM_CARDS;

  /**
   * Position carousel cards with Orbital Spawn entrance.
   * @param {number} angle - carousel rotation angle
   * @param {number} spawn - 0 = all cards at center (car position), 1 = full orbit
   */
  function positionCarouselCards(angle, spawn) {
    const sp = Math.max(0, Math.min(1, spawn));
    let frontIndex = 0, frontDepth = -2;
    carouselCards.forEach((card, i) => {
      // Stagger: each card spawns slightly later
      const cardSpawn = smoothstep(Math.max(0, Math.min(1, (sp - i * 0.08) / 0.7)));

      const a = i * ANGLE_PER_CARD + angle;
      const x = Math.sin(a) * CAROUSEL_CFG.radiusX;
      const depth = Math.cos(a);
      if (depth > frontDepth) { frontDepth = depth; frontIndex = i; }
      const dn = (depth + 1) / 2;
      const finalScale = CAROUSEL_CFG.scaleBack + dn * (CAROUSEL_CFG.scaleFront - CAROUSEL_CFG.scaleBack);
      const finalOpacity = CAROUSEL_CFG.opacityBack + dn * (CAROUSEL_CFG.opacityFront - CAROUSEL_CFG.opacityBack);
      const blur = CAROUSEL_CFG.blurBack * (1 - dn);
      const tiltY = Math.sin(a) * -CAROUSEL_CFG.cardTiltMax;
      const y = depth * CAROUSEL_CFG.orbitTiltY;

      // Orbital Spawn: lerp from center (0,60px,scale0) to final orbit position
      const spawnX = lerp(0, x, cardSpawn);
      const spawnY = lerp(60, y, cardSpawn);  // 60px = car center offset
      const spawnScale = lerp(0, finalScale, cardSpawn);
      const spawnOpacity = lerp(0, finalOpacity, cardSpawn);
      const spawnBlur = lerp(25, blur, cardSpawn);
      const spawnTilt = lerp(0, tiltY, cardSpawn);

      card.style.transform = `translateX(${spawnX}px) translateY(${spawnY}px) scale(${spawnScale}) rotateY(${spawnTilt}deg)`;
      card.style.opacity = spawnOpacity;
      card.style.filter = spawnBlur > 0.5 ? `blur(${spawnBlur.toFixed(1)}px)` : 'none';
      card.style.zIndex = Math.round(dn * 100);
    });
    if (carouselCounterEl) {
      carouselCounterEl.textContent = String(frontIndex + 1).padStart(2, '0');
    }
  }

  // Car target states
  const introX = -1.6, introY = 0.8, introRotY = Math.PI * 0.15, introRotX = 0.4;
  // Carousel center position (matching prototype)
  const carouselX = 0, carouselY = 0.45, carouselRotY = -0.2, carouselRotX = 0, carouselScale = 0.8;

  let carAutoAngle = 0;

  function updateServicesState() {
    if (!servicesEl) return;
    const vh = window.innerHeight;
    const heroH = (HERO_VH_REF / 100) * vh;
    const animStart = heroH * 0.70;
    const servicesEnd = servicesEl.offsetTop + servicesEl.offsetHeight;
    const animEnd = servicesEnd * 0.92;
    const scrollY = window.scrollY;

    if (scrollY < animStart) return;
    // Don't kill car after services — orbit section needs it visible
    const orbitEl = document.getElementById('servicesOrbit');
    const orbitEnd = orbitEl ? orbitEl.offsetTop + orbitEl.offsetHeight : servicesEnd;
    if (scrollY > orbitEnd) { car3d.setOpacity(0); return; }

    const progress = Math.max(0, Math.min(1, (scrollY - animStart) / (animEnd - animStart)));

    // ── OPACITY ── (car stays visible through services; orbit section handles fade-out)
    car3d.setOpacity(1);

    // ── CAR POSITION ──
    let posX, posY, rotY, rotX, carScale = 1.0;
    let camX = 0, camY = 0.3, camZ = 6, lookX = 0, lookY = 0.6, lookZ = 0, fov = 35;

    if (progress <= 0.25) {
      // Phase 1: car moves left (intro) — 0→25%
      const p = smoothstep(Math.min(progress / 0.25, 1));
      posX = p * introX; posY = p * introY;
      rotY = p * introRotY; rotX = p * introRotX;
    } else if (progress <= 0.45) {
      // Phase 2: car transitions to carousel center — 25→45%
      const p = smoothstep((progress - 0.25) / 0.20);
      posX = lerp(introX, carouselX, p);
      posY = lerp(introY, carouselY, p);
      rotY = lerp(introRotY, carouselRotY, p);
      rotX = lerp(introRotX, carouselRotX, p);
      carScale = lerp(1.0, carouselScale, p);
      // Camera: transition to 3/4 front view (matching prototype)
      camX = lerp(0, 2.5, p);
      camY = lerp(0.3, 1.8, p);
      camZ = lerp(6, 5, p);
      lookY = lerp(0.6, 0.3, p);
      fov = lerp(35, 32, p);
    } else {
      // Phase 3+4: carousel — car stays centered with gentle oscillation
      posX = carouselX; posY = carouselY;
      rotX = carouselRotX; carScale = carouselScale;
      // Oscillation fades in smoothly (0.48→0.60) to avoid position jump
      const oscBlend = Math.min(1, Math.max(0, (progress - 0.48) / 0.12));
      carAutoAngle += 0.0003;
      rotY = carouselRotY + Math.sin(carAutoAngle) * 0.15 * oscBlend;
      camX = 2.5; camY = 1.8; camZ = 5; lookX = 0; lookY = 0.3; lookZ = 0; fov = 32;
    }

    car3d.update({ positionX: posX, positionY: posY, rotationY: rotY, rotationX: rotX, scale: carScale });
    if (progress >= 0.25) {
      car3d.updateCamera({ positionX: camX, positionY: camY, positionZ: camZ, lookAtX: lookX, lookAtY: lookY, lookAtZ: lookZ, fov });
    }

    // ── INTRO TEXT ──
    if (servicesIntro) {
      if (progress < 0.12) {
        servicesIntro.style.opacity = '0';
        servicesIntro.style.transform = 'translateY(-50%) translateX(30px)';
      } else if (progress < 0.18) {
        const t = smoothstep((progress - 0.12) / 0.06);
        servicesIntro.style.opacity = String(t);
        servicesIntro.style.transform = `translateY(-50%) translateX(${30 * (1 - t)}px)`;
      } else if (progress < 0.28) {
        servicesIntro.style.opacity = '1';
        servicesIntro.style.transform = 'translateY(-50%) translateX(0)';
      } else if (progress < 0.35) {
        const t = smoothstep((progress - 0.28) / 0.07);
        servicesIntro.style.opacity = String(1 - t);
      } else {
        servicesIntro.style.opacity = '0';
      }
    }

    // ── CAROUSEL SECTION ── (spawn in services, rotation in orbit)
    if (carouselSection) {
      const canvasEl = document.getElementById('car3dCanvas');
      const orbitEl = document.getElementById('servicesOrbit');
      
      // Calculate orbit section progress (0→1 over its height)
      let orbitProgress = 0;
      if (orbitEl) {
        const orbitTop = orbitEl.offsetTop;
        const orbitHeight = orbitEl.offsetHeight;
        orbitProgress = Math.max(0, Math.min(1, (scrollY - orbitTop) / orbitHeight));
      }
      
      // Carousel active: from services 0.48 through orbit section end
      const carouselActive = progress >= 0.48 || (orbitProgress > 0 && orbitProgress < 0.92);
      
      // Pre-mount carousel to body once (avoids DOM reflow stutter during animation)
      if (carouselSection.parentElement !== document.body) {
        document.body.appendChild(carouselSection);
        carouselSection.style.position = 'fixed';
        carouselSection.style.inset = '0';
        carouselSection.style.zIndex = '8';
      }
      
      if (carouselActive) {
        carouselSection.classList.add('is-active');
        if (canvasEl) canvasEl.style.zIndex = '6';
        
        // Spawn IN: in SERVICES section (progress 0.48→0.65) — no dead space!
        let spawnProgress = 0;
        if (orbitProgress <= 0) {
          spawnProgress = Math.min(1, (progress - 0.48) / 0.27);
        } else if (orbitProgress >= 0.55) {
          // Despawn OUT: fade (0.55→0.85)
          spawnProgress = 1 - smoothstep((orbitProgress - 0.55) / 0.30);
        } else {
          spawnProgress = 1;
        }
        
        // Fade title & counter with spawnProgress
        if (carouselTitleEl) carouselTitleEl.style.opacity = String(spawnProgress);
        if (carouselCounterEl) {
          const counterParent = carouselCounterEl.closest('.carousel-section__counter');
          if (counterParent) counterParent.style.opacity = String(spawnProgress);
        }
        
        // Rotation: starts in SERVICES (progress 0.55) and continues through ORBIT (65%)
        // Uses raw scrollY for seamless cross-section calculation
        const rotStartY = animStart + 0.55 * (animEnd - animStart);
        const rotEndY = orbitEl ? orbitEl.offsetTop + orbitEl.offsetHeight * 0.55 : rotStartY + 4000;
        const rotProgress = Math.min(1, Math.max(0, (scrollY - rotStartY) / (rotEndY - rotStartY)));
        const carouselAngle = rotProgress * Math.PI * 2;  // 360°
        positionCarouselCards(carouselAngle, spawnProgress);
        
        // Car visible during orbit, fades at orbit end
        if (orbitProgress > 0) {
          car3d.setOpacity(orbitProgress < 0.60 ? 1 : 1 - smoothstep((orbitProgress - 0.60) / 0.25));
        }
      } else {
        carouselSection.classList.remove('is-active');
        if (canvasEl) canvasEl.style.zIndex = '6';
        // Reset title & counter
        if (carouselTitleEl) carouselTitleEl.style.opacity = '0';
        if (carouselCounterEl) {
          const counterParent = carouselCounterEl.closest('.carousel-section__counter');
          if (counterParent) counterParent.style.opacity = '0';
        }
        // Reset cards to hidden
        carouselCards.forEach(card => {
          card.style.transform = 'scale(0)';
          card.style.opacity = '0';
          card.style.filter = 'blur(25px)';
        });
      }
    }

    // ── GRID BG ──
    const gridEl = document.getElementById('servicesGrid');
    if (gridEl) {
      if (progress < 0.05) { gridEl.style.opacity = '0'; }
      else if (progress < 0.15) { gridEl.style.opacity = String(smoothstep((progress - 0.05) / 0.10) * 0.85); }
      else if (progress < 0.90) { gridEl.style.opacity = '0.85'; }
      else { gridEl.style.opacity = String(0.85 * (1 - smoothstep((progress - 0.90) / 0.10))); }
    }
  }

  gsap.ticker.add(updateServicesState);

  // Reset camera when scrolling back above services
  gsap.ticker.add(() => {
    const vh = window.innerHeight;
    const heroH = (HERO_VH_REF / 100) * vh;
    const animStart = heroH * 0.70;
    if (window.scrollY < animStart) {
      car3d.updateCamera({
        positionX: 0, positionY: 0.3, positionZ: 6,
        lookAtX: 0, lookAtY: 0.6, lookAtZ: 0,
        fov: 35,
      });
    }
  });

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


/* ═════════════════════════════════════════════════════════════
   PORTFOLIO — SCATTERED HORIZONTAL GALLERY
   ═════════════════════════════════════════════════════════════ */
{
  const PORTFOLIO_CARS = [
    {
      name: 'BMW M3 Competition',
      tag: 'PPF & Leštění',
      services: ['Detailní ruční mytí celého vozu','Chemická dekontaminace laku','Mechanická dekontaminace laku','1 krokové leštění laku','PPF folie - celopolep'],
      text: 'Kompletní ošetření černého laku včetně PPF celopolep fólií XPEL Ultimate Plus. Vůz prošel důkladnou dekontaminací a jednokorokovým leštěním před aplikací ochranné fólie.',
      photos: [
        'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1619362280286-f1f8fd5032ed?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1607853554439-0ef3e0be4e0c?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1493238792000-8113da705763?w=500&h=700&fit=crop&q=80',
      ]
    },
    {
      name: 'Porsche 911 GT3',
      tag: 'Keramika & Detailing',
      services: ['Keramická ochrana Ceramic Pro 9H','2-krokové leštění laku','Hloubkové čištění interiéru','Ošetření kůže a plastů'],
      text: 'Porsche 911 GT3 v barvě Guards Red. Aplikace 4 vrstev Ceramic Pro 9H po dvoustupňové korekci laku. Interiér kompletně vyčištěn a ošetřen.',
      photos: [
        'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1614162692292-7ac56d7f831e?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1546768292-fb12f6c92568?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=500&h=700&fit=crop&q=80',
      ]
    },
    {
      name: 'Audi RS6 Avant',
      tag: 'PPF & Korekce',
      services: ['PPF ochrana přední části','3-kroková korekce laku','Ceramic Pro Rain na skla','Nano ochrana disků'],
      text: 'Audi RS6 Avant v Nardo Grey. Přední část vozu chráněna PPF fólií, celý vůz prošel 3-krokovou korekcí laku a aplikací keramického coatingu.',
      photos: [
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1542362567-b07e54358753?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1606611013016-969c19ba27a6?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1583267746897-2cf415887172?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1504215680853-026ed2a45def?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=500&h=700&fit=crop&q=80',
      ]
    },
    {
      name: 'Mercedes-AMG GT',
      tag: 'Full Detailing',
      services: ['Kompletní exteriérový detailing','Leštění laku 3-step','Keramický coating 5 vrstev','Window tinting 15%'],
      text: 'Mercedes-AMG GT v Obsidian Black Metallic. Kompletní detailing včetně tříkrokového leštění a 5 vrstev keramického coatingu pro maximální ochranu a lesk.',
      photos: [
        'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&h=700&fit=crop&q=80',
      ]
    },
    {
      name: 'Tesla Model 3',
      tag: 'PPF & Chrome Delete',
      services: ['PPF celopolep XPEL Ultimate','Keramický coating','Chrome delete - černý lesk','Tónování skel'],
      text: 'Tesla Model 3 Performance v Pearl White. Celopolep PPF, chrome delete v černém lesku a tónování skel. Moderní ochrana pro moderní vůz.',
      photos: [
        'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1619317904081-10e86c9b7bdd?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?w=500&h=700&fit=crop&q=80',
      ]
    },
    {
      name: 'Volkswagen Golf R',
      tag: 'Korekce & Ochrana',
      services: ['Korekce laku - swirl removal','Ceramic Pro Sport','Čištění motorového prostoru','Renovace plastových dílů'],
      text: 'VW Golf R v Lapiz Blue. Odstranění swirl marks a hologramů, aplikace Ceramic Pro Sport a kompletní renovace exteriérových plastových dílů.',
      photos: [
        'https://images.unsplash.com/photo-1542362567-b07e54358753?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1606611013016-969c19ba27a6?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1619362280286-f1f8fd5032ed?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=700&fit=crop&q=80',
        'https://images.unsplash.com/photo-1493238792000-8113da705763?w=500&h=700&fit=crop&q=80',
      ]
    },
  ];

  const PORTFOLIO_LAYOUT = [
    { x: 100,  y: 50,  w: 300, h: 420, rot: 1 },
    { x: 620,  y: 200, w: 260, h: 360, rot: 2 },
    { x: 1120, y: 30,  w: 320, h: 440, rot: 3 },
    { x: 1680, y: 180, w: 280, h: 380, rot: 4 },
    { x: 2220, y: 40,  w: 300, h: 420, rot: 5 },
    { x: 2780, y: 210, w: 270, h: 370, rot: 6 },
  ];

  const pfPad = n => String(n).padStart(2, '0');

  /* — Build scattered cards — */
  const pfTrack = document.getElementById('portfolioTrack');
  if (pfTrack) {
    const lastCard = PORTFOLIO_LAYOUT[PORTFOLIO_LAYOUT.length - 1];
    const pfTotalWidth = lastCard.x + lastCard.w + 200;
    pfTrack.style.width = pfTotalWidth + 'px';
    pfTrack.style.height = '700px';

    PORTFOLIO_CARS.forEach((car, i) => {
      const L = PORTFOLIO_LAYOUT[i];
      const card = document.createElement('div');
      card.className = `photo-card photo-card--rot-${L.rot}`;
      card.style.cssText = `
        --card-w: ${L.w}px; --card-h: ${L.h}px;
        left: ${L.x}px; top: ${L.y}px;
      `;
      card.dataset.idx = i;
      card.innerHTML = `
        <div class="photo-card__img-wrap">
          <img src="${car.photos[0]}" alt="${car.name}" loading="lazy"/>
          <div class="photo-card__overlay">
            <div class="photo-card__tag">${pfPad(i+1)} · ${car.tag}</div>
            <div class="photo-card__name">${car.name}</div>
          </div>
          <div class="photo-card__plus">+</div>
        </div>
        <div class="photo-card__label">${car.name}</div>
      `;
      pfTrack.appendChild(card);
    });

    /* — GSAP ScrollTrigger: Two-phase portfolio reveal — */
    const pfTrackEl = document.getElementById('portfolioTrack');
    const pfPinEl = document.getElementById('portfolioPin');
    const pfSectionEl = document.getElementById('portfolio');
    const pfBgText = document.getElementById('portfolioBgText');

    // Wait a tick for DOM to settle after card injection
    requestAnimationFrame(() => {
      const trackWidth = pfTrackEl.scrollWidth;
      const viewportWidth = window.innerWidth;
      const horizontalDistance = trackWidth - viewportWidth;
      const textRevealDistance = window.innerHeight; // 1 viewport of scroll for text reveal

      if (horizontalDistance > 0) {
        // Track starts off-screen to the right — cards enter naturally from right
        const startX = viewportWidth;
        const totalSlide = startX + horizontalDistance; // full travel distance
        const totalScrollDistance = textRevealDistance + totalSlide;

        // Build timeline
        const pfTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: pfSectionEl,
            pin: pfPinEl,
            start: 'top top',
            end: () => `+=${totalScrollDistance}`,
            scrub: 1,
            invalidateOnRefresh: true,
          }
        });

        // Phase 1: Text reveal — slides up from below and fades in
        const textPortion = textRevealDistance / totalScrollDistance;
        pfTimeline.fromTo(pfBgText,
          { y: '60vh', opacity: 0 },
          { y: 0, opacity: 1, ease: 'power2.out', duration: textPortion }
        );

        // Phase 2: Horizontal gallery — track slides from right edge to final position
        // Cards naturally enter from the right, no fade needed
        pfTimeline.fromTo(pfTrackEl,
          { x: startX },
          { x: -horizontalDistance, ease: 'none', duration: 1 - textPortion }
        );
      }
    });

    /* — Click card → Expand (stacked deck) — */
    const pfExpandEl = document.getElementById('cardExpand');
    const pfFanEl = document.getElementById('cardExpandFan');
    const pfExpandName = document.getElementById('cardExpandName');
    const pfExpandNum = document.getElementById('cardExpandNum');
    const pfExpandServices = document.getElementById('cardExpandServices');
    let pfCurrentCar = null;
    let pfClickedDuringDrag = false;
    let pfExpandStackIdx = 0;

    pfTrackEl.addEventListener('mousedown', () => { pfClickedDuringDrag = false; });
    pfTrackEl.addEventListener('mousemove', () => { pfClickedDuringDrag = true; });


    pfTrack.addEventListener('click', e => {
      if (pfClickedDuringDrag) return;
      const card = e.target.closest('.photo-card');
      if (!card) return;
      openPfExpand(+card.dataset.idx);
    });

    function openPfExpand(idx) {
      pfCurrentCar = idx;
      pfExpandStackIdx = 0;
      const car = PORTFOLIO_CARS[idx];
      pfExpandName.textContent = car.name;
      pfExpandNum.textContent = pfPad(idx + 1);
      pfExpandServices.innerHTML = car.services.map(s => `<li>${s}</li>`).join('');

      const total = car.photos.length;
      pfFanEl.innerHTML = car.photos.map((photo, i) => `
        <div class="stack-card ${i === 0 ? 'stack-card--active' : ''}"
             data-stack="${i}"
             style="
               z-index: ${total - i};
               transform: translateY(${i * 4}px) scale(${1 - i * 0.02});
             ">
          <img src="${photo}" alt="${car.name} foto ${i+1}" loading="lazy"/>
        </div>
      `).join('') + `
        <div class="stack-counter" id="stackCounter">1 / ${total}</div>
        <div class="stack-controls">
          <button class="stack-btn" id="stackPrev">‹</button>
          <button class="stack-btn" id="stackNext">›</button>
        </div>
      `;

      pfExpandEl.classList.add('open');

      setTimeout(() => {
        document.getElementById('stackPrev').addEventListener('click', e => { e.stopPropagation(); pfStackNav(-1); });
        document.getElementById('stackNext').addEventListener('click', e => { e.stopPropagation(); pfStackNav(1); });
      }, 50);
    }

    function pfStackNav(dir) {
      const car = PORTFOLIO_CARS[pfCurrentCar];
      const total = car.photos.length;
      const cards = pfFanEl.querySelectorAll('.stack-card');
      const current = cards[pfExpandStackIdx];

      if (dir > 0 && pfExpandStackIdx < total - 1) {
        current.classList.add('stack-card--thrown');
        current.style.transform = `translateX(-120%) rotate(-12deg)`;
        current.style.opacity = '0';
        pfExpandStackIdx++;
      } else if (dir < 0 && pfExpandStackIdx > 0) {
        pfExpandStackIdx--;
        const prev = cards[pfExpandStackIdx];
        prev.classList.remove('stack-card--thrown');
        prev.style.transform = `translateY(0) scale(1)`;
        prev.style.opacity = '1';
      }

      cards.forEach((c, i) => {
        if (i < pfExpandStackIdx) return;
        const offset = i - pfExpandStackIdx;
        c.style.zIndex = total - offset;
        if (offset === 0) {
          c.style.transform = `translateY(0) scale(1)`;
          c.classList.add('stack-card--active');
        } else {
          c.style.transform = `translateY(${offset * 4}px) scale(${1 - offset * 0.02})`;
          c.classList.remove('stack-card--active');
        }
      });

      document.getElementById('stackCounter').textContent = `${pfExpandStackIdx + 1} / ${total}`;
    }

    function closePfExpand() {
      pfExpandEl.classList.remove('open');
      pfExpandStackIdx = 0;
    }

    document.getElementById('cardExpandClose').addEventListener('click', closePfExpand);
    document.getElementById('cardExpandCloseBtn').addEventListener('click', closePfExpand);

    /* CTA → detail modal */
    document.getElementById('cardExpandCTA').addEventListener('click', () => {
      if (pfCurrentCar === null) return;
      closePfExpand();
      setTimeout(() => openPfDetail(pfCurrentCar), 300);
    });

    /* — Detail Modal — */
    const pfDetailModal = document.getElementById('detailModal');

    function openPfDetail(idx) {
      const car = PORTFOLIO_CARS[idx];
      document.getElementById('detailName').textContent = car.name;
      document.getElementById('detailServices').innerHTML = car.services.map(s => `<li>${s}</li>`).join('');
      document.getElementById('detailText').textContent = car.text;
      document.getElementById('detailGallery').innerHTML = car.photos.map((p, i) =>
        `<img src="${p}" alt="${car.name} foto ${i+1}" loading="lazy"/>`
      ).join('');
      pfDetailModal.classList.add('open');
    }

    document.getElementById('detailModalClose').addEventListener('click', () => pfDetailModal.classList.remove('open'));
    document.getElementById('detailModalCloseBtn').addEventListener('click', () => pfDetailModal.classList.remove('open'));

    /* Close modals on Escape */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closePfExpand();
        pfDetailModal.classList.remove('open');
      }
    });

    console.log('📸 Portfolio — Scattered Gallery loaded');
  }
}
