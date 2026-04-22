/* ═══════════════════════════════════════════════════════════
   JOHNY CAR DETAILING — MAIN JS
   Lenis + GSAP ScrollTrigger + Cinematic Effects
   ═══════════════════════════════════════════════════════════ */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

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

// Split both title lines into characters
const titleLine1 = document.querySelector('.hero__title-line--1');
const titleLine2 = document.querySelector('.hero__title-line--2');

let chars1 = [];
let chars2 = [];

if (titleLine1 && titleLine2) {
  chars1 = splitTextToChars(titleLine1);
  chars2 = splitTextToChars(titleLine2);
}


/* ═════════════════════════════════════════════
   HERO ENTRY ANIMATION
   ═════════════════════════════════════════════ */
const heroTl = gsap.timeline({ delay: 0.3 });

// Animate individual characters in on load
if (chars1.length > 0) {
  heroTl.from(chars1, {
    y: 100,
    opacity: 0,
    filter: 'blur(12px)',
    duration: 1,
    stagger: 0.04,
    ease: 'power3.out',
  });
}

if (chars2.length > 0) {
  heroTl.from(chars2, {
    y: 80,
    opacity: 0,
    filter: 'blur(10px)',
    duration: 0.9,
    stagger: 0.03,
    ease: 'power3.out',
  }, '-=0.6');
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

// Start the sweep after entry animation finishes
heroTl.call(createLightSweep);


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
      start: '55% top',
      end: '75% top',
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
