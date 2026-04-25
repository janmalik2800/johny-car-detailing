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
      const carouselActive = progress >= 0.48 || (orbitProgress > 0 && orbitProgress < 0.70);
      
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
        } else if (orbitProgress >= 0.38) {
          // Despawn OUT: longer fade (0.38→0.65)
          spawnProgress = 1 - smoothstep((orbitProgress - 0.38) / 0.27);
        } else {
          spawnProgress = 1;
        }
        
        // Rotation: starts in SERVICES (progress 0.55) and continues through ORBIT (72%)
        // Uses raw scrollY for seamless cross-section calculation
        const rotStartY = animStart + 0.55 * (animEnd - animStart);
        const rotEndY = orbitEl ? orbitEl.offsetTop + orbitEl.offsetHeight * 0.37 : rotStartY + 4000;
        const rotProgress = Math.min(1, Math.max(0, (scrollY - rotStartY) / (rotEndY - rotStartY)));
        const carouselAngle = rotProgress * Math.PI * 2;  // 360°
        positionCarouselCards(carouselAngle, spawnProgress);
        
        // Car visible during orbit, fades at orbit end
        if (orbitProgress > 0) {
          car3d.setOpacity(orbitProgress < 0.45 ? 1 : 1 - smoothstep((orbitProgress - 0.45) / 0.20));
        }
      } else {
        carouselSection.classList.remove('is-active');
        if (canvasEl) canvasEl.style.zIndex = '6';
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
