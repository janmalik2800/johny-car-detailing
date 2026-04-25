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
     SERVICES — FULL SCROLLYTELLING ENGINE
     Phases: Intro → PPF → Camera transition → 3× Service panels (ping-pong)
     Single section (1200vh), auto moves L↔R, camera goes bird's-eye.
     ═════════════════════════════════════════════ */
  const servicesIntro = document.getElementById('servicesIntro');
  const serviceDetail1 = document.getElementById('serviceDetail1');
  const servicePanel2 = document.getElementById('servicePanel2');
  const servicePanel3 = document.getElementById('servicePanel3');
  const servicePanel4 = document.getElementById('servicePanel4');

  // Animation range constants
  const HERO_VH_REF = 340;

  // Smooth easing function (smoothstep)
  function smoothstep(t) {
    t = Math.max(0, Math.min(1, t));
    return t * t * (3 - 2 * t);
  }

  // Linear interpolation
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  // Animate a panel: opacity + translateY + translateX
  function animatePanel(el, progress, fadeIn, holdEnd, fadeOut, side) {
    if (!el) return;
    const offsetX = side === 'right' ? 40 : -40;

    if (progress < fadeIn) {
      el.style.opacity = '0';
      el.style.transform = `translateY(-50%) translateX(${offsetX}px)`;
    } else if (progress < holdEnd) {
      // Fade in
      const dur = holdEnd - fadeIn;
      const inP = dur > 0 ? Math.min((progress - fadeIn) / (dur * 0.4), 1) : 1;
      const ease = smoothstep(inP);
      el.style.opacity = String(ease);
      el.style.transform = `translateY(-50%) translateX(${offsetX * (1 - ease)}px)`;
    } else if (progress < fadeOut) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(-50%) translateX(0)';
    } else if (progress < fadeOut + 0.03) {
      const outP = (progress - fadeOut) / 0.03;
      const ease = smoothstep(outP);
      el.style.opacity = String(1 - ease);
      el.style.transform = `translateY(-50%) translateX(${-offsetX * 0.5 * ease}px)`;
    } else {
      el.style.opacity = '0';
    }
  }

  function updateServicesState() {
    if (!servicesEl) return;

    const vh = window.innerHeight;
    const heroH = (HERO_VH_REF / 100) * vh;
    const animStart = heroH * 0.70;
    const servicesEnd = servicesEl.offsetTop + servicesEl.offsetHeight;
    const animEnd = servicesEnd * 0.92;
    const scrollY = window.scrollY;

    if (scrollY < animStart) return;
    if (scrollY > servicesEnd) {
      car3d.setOpacity(0);
      return;
    }

    const rawProgress = (scrollY - animStart) / (animEnd - animStart);
    const progress = Math.max(0, Math.min(1, rawProgress));

    // ═══════════════════════════════════════════
    // COMPRESSION: Old 450vh phases → first ~35% of 1200vh
    // Ratio: 450/1200 ≈ 0.375, but we use animEnd math
    // Old thresholds mapped: multiply by ~0.41
    // ═══════════════════════════════════════════

    // ── CAR OPACITY ──
    // Always visible during animation, fade-out at very end
    if (progress < 0.93) {
      car3d.setOpacity(1);
    } else {
      const fadeOut = (progress - 0.93) / 0.07;
      car3d.setOpacity(1 - smoothstep(fadeOut));
    }

     // ═══ PHASE 1: INTRO — Car moves left (0→15%) ═══
    // ═══ PHASE 2: PPF DETAIL — Car moves right (18→28%) ═══

    const phase1End = 0.15;
    const phase1X = -1.6;
    const phase1Y = 0.8;
    const phase1RotY = Math.PI * 0.15;
    const phase1RotX = 0.4;

    const phase2Start = 0.18;
    const phase2End = 0.28;
    const phase2X = 1.6;
    const phase2RotY = -Math.PI * 0.30;

    // ═══ PHASE 3: Camera transition + scale down (28→38%) ═══
    // Longer transition — this is the cinematic moment
    const birdStart = 0.28;
    const birdEnd = 0.38;

    // ═══ PHASE 4-6: Service panels with ping-pong ═══
    // Longer transitions between panels, shorter text holds
    // Panel 2: 38→52% — car LEFT, panel RIGHT
    // Transition: 52→60%
    // Panel 3: 60→74% — car RIGHT, panel LEFT
    // Transition: 74→82%
    // Panel 4: 82→94% — car LEFT, panel RIGHT

    const p2Start = 0.38, p2End = 0.52;
    const p3Start = 0.60, p3End = 0.74;
    const p4Start = 0.82, p4End = 0.94;

    // Car positions for ping-pong
    const carLeftX = -1.8;
    const carRightX = 1.8;
    const carBirdY = 0.6;
    const carBirdRotX = 0.55;
    const carBirdScale = 0.5; // SCALE DOWN — car is much smaller in bird's-eye

    // ── COMPUTE CAR STATE ──
    let posX, posY, rotY, rotX;
    let carScale = 1.0;

    // Camera state
    let camX = 0, camY = 0.3, camZ = 6;
    let lookX = 0, lookY = 0.6, lookZ = 0;
    let fov = 35;

    if (progress <= phase1End) {
      // Phase 1: car moves left
      const p = Math.min(progress / phase1End, 1);
      const ease = smoothstep(p);
      posX = ease * phase1X;
      posY = ease * phase1Y;
      rotY = ease * phase1RotY;
      rotX = ease * phase1RotX;
    } else if (progress <= phase2Start) {
      // Hold at phase 1 end
      posX = phase1X;
      posY = phase1Y;
      rotY = phase1RotY;
      rotX = phase1RotX;
    } else if (progress <= phase2End) {
      // Phase 2: car moves right
      const p = smoothstep((progress - phase2Start) / (phase2End - phase2Start));
      posX = lerp(phase1X, phase2X, p);
      posY = phase1Y;
      rotY = lerp(phase1RotY, phase2RotY, p);
      rotX = phase1RotX;
    } else if (progress <= birdEnd) {
      // Phase 3: Camera transition + SCALE DOWN
      // Long, cinematic transition — this is where the magic happens
      const p = smoothstep((progress - birdStart) / (birdEnd - birdStart));
      posX = lerp(phase2X, carLeftX, p);
      posY = lerp(phase1Y, carBirdY, p);
      rotY = lerp(phase2RotY, Math.PI * 0.12, p);
      rotX = lerp(phase1RotX, carBirdRotX, p);
      carScale = lerp(1.0, carBirdScale, p);

      // Camera transition: side view → elevated 3/4 view
      camX = lerp(0, carLeftX * 0.3, p);
      camY = lerp(0.3, 3.5, p);
      camZ = lerp(6, 4.5, p);
      lookX = lerp(0, carLeftX * 0.5, p);
      lookY = lerp(0.6, 0, p);
      fov = lerp(35, 28, p);
    } else if (progress <= p2End) {
      // Panel 2: car LEFT, stable, scaled down
      posX = carLeftX;
      posY = carBirdY;
      rotY = Math.PI * 0.12;
      rotX = carBirdRotX;
      carScale = carBirdScale;
      camX = carLeftX * 0.3;
      camY = 3.5;
      camZ = 4.5;
      lookX = carLeftX * 0.5;
      lookY = 0;
      fov = 28;
    } else if (progress <= p3Start) {
      // Transition: car LEFT → RIGHT (LONGER — 8% of scroll)
      const p = smoothstep((progress - p2End) / (p3Start - p2End));
      posX = lerp(carLeftX, carRightX, p);
      posY = carBirdY;
      rotY = lerp(Math.PI * 0.12, -Math.PI * 0.12, p);
      rotX = carBirdRotX;
      carScale = carBirdScale;
      camX = lerp(carLeftX * 0.3, carRightX * 0.3, p);
      camY = 3.5;
      camZ = 4.5;
      lookX = lerp(carLeftX * 0.5, carRightX * 0.5, p);
      lookY = 0;
      fov = 28;
    } else if (progress <= p3End) {
      // Panel 3: car RIGHT, stable
      posX = carRightX;
      posY = carBirdY;
      rotY = -Math.PI * 0.12;
      rotX = carBirdRotX;
      carScale = carBirdScale;
      camX = carRightX * 0.3;
      camY = 3.5;
      camZ = 4.5;
      lookX = carRightX * 0.5;
      lookY = 0;
      fov = 28;
    } else if (progress <= p4Start) {
      // Transition: car RIGHT → LEFT (LONGER — 8% of scroll)
      const p = smoothstep((progress - p3End) / (p4Start - p3End));
      posX = lerp(carRightX, carLeftX, p);
      posY = carBirdY;
      rotY = lerp(-Math.PI * 0.12, Math.PI * 0.12, p);
      rotX = carBirdRotX;
      carScale = carBirdScale;
      camX = lerp(carRightX * 0.3, carLeftX * 0.3, p);
      camY = 3.5;
      camZ = 4.5;
      lookX = lerp(carRightX * 0.5, carLeftX * 0.5, p);
      lookY = 0;
      fov = 28;
    } else if (progress <= p4End) {
      // Panel 4: car LEFT, stable
      posX = carLeftX;
      posY = carBirdY;
      rotY = Math.PI * 0.12;
      rotX = carBirdRotX;
      carScale = carBirdScale;
      camX = carLeftX * 0.3;
      camY = 3.5;
      camZ = 4.5;
      lookX = carLeftX * 0.5;
      lookY = 0;
      fov = 28;
    } else {
      // Outro: car stays, just fading out
      posX = carLeftX;
      posY = carBirdY;
      rotY = Math.PI * 0.12;
      rotX = carBirdRotX;
      carScale = carBirdScale;
      camX = carLeftX * 0.3;
      camY = 3.5;
      camZ = 4.5;
      lookX = carLeftX * 0.5;
      lookY = 0;
      fov = 28;
    }

    // Apply car state (now includes scale)
    car3d.update({ positionX: posX, positionY: posY, rotationY: rotY, rotationX: rotX, scale: carScale });

    // Apply camera state (only during bird's-eye phases)
    if (progress >= birdStart) {
      car3d.updateCamera({
        positionX: camX, positionY: camY, positionZ: camZ,
        lookAtX: lookX, lookAtY: lookY, lookAtZ: lookZ,
        fov: fov,
      });
    }

    // ═══ TEXT ANIMATIONS ═══

    // Intro text: fade-in 10→14%, hold 14→16%, fade-out 16→19%
    if (servicesIntro) {
      if (progress < 0.10) {
        servicesIntro.style.opacity = '0';
        servicesIntro.style.transform = 'translateY(-50%) translateX(30px)';
      } else if (progress < 0.14) {
        const t = smoothstep((progress - 0.10) / 0.04);
        servicesIntro.style.opacity = String(t);
        servicesIntro.style.transform = `translateY(-50%) translateX(${30 * (1 - t)}px)`;
      } else if (progress < 0.16) {
        servicesIntro.style.opacity = '1';
        servicesIntro.style.transform = 'translateY(-50%) translateX(0)';
      } else if (progress < 0.19) {
        const t = smoothstep((progress - 0.16) / 0.03);
        servicesIntro.style.opacity = String(1 - t);
        servicesIntro.style.transform = `translateY(-50%) translateX(${-30 * t}px)`;
      } else {
        servicesIntro.style.opacity = '0';
      }
    }

    // PPF detail: fade-in 22→25%, hold 25→27%, fade-out 27→30%
    if (serviceDetail1) {
      if (progress < 0.22) {
        serviceDetail1.style.opacity = '0';
        serviceDetail1.style.transform = 'translateY(-50%) translateX(-30px)';
      } else if (progress < 0.25) {
        const t = smoothstep((progress - 0.22) / 0.03);
        serviceDetail1.style.opacity = String(t);
        serviceDetail1.style.transform = `translateY(-50%) translateX(${-30 * (1 - t)}px)`;
      } else if (progress < 0.27) {
        serviceDetail1.style.opacity = '1';
        serviceDetail1.style.transform = 'translateY(-50%) translateX(0)';
      } else if (progress < 0.30) {
        const t = smoothstep((progress - 0.27) / 0.03);
        serviceDetail1.style.opacity = String(1 - t);
        serviceDetail1.style.transform = `translateY(-50%) translateX(${-20 * t}px)`;
      } else {
        serviceDetail1.style.opacity = '0';
      }
    }

    // Panel 2 (Leštění): RIGHT side — appears shortly after car arrives
    animatePanel(servicePanel2, progress, 0.40, 0.44, 0.49, 'right');

    // Panel 3 (Keramika): LEFT side
    animatePanel(servicePanel3, progress, 0.62, 0.66, 0.71, 'left');

    // Panel 4 (Interiér): RIGHT side
    animatePanel(servicePanel4, progress, 0.84, 0.88, 0.92, 'right');

    // ── GRID BG ──
    const gridEl = document.getElementById('servicesGrid');
    if (gridEl) {
      if (progress < 0.05) {
        gridEl.style.opacity = '0';
      } else if (progress < 0.15) {
        gridEl.style.opacity = String(smoothstep((progress - 0.05) / 0.10) * 0.85);
      } else if (progress < 0.90) {
        gridEl.style.opacity = '0.85';
      } else {
        gridEl.style.opacity = String(0.85 * (1 - smoothstep((progress - 0.90) / 0.10)));
      }
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
