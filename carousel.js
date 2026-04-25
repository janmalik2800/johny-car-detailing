/* ═══════════════════════════════════════════════════
   CAROUSEL ENGINE
   3D CSS carousel of service cards around BMW model.
   Scroll/drag/keyboard → rotate. Momentum + snap.
   ═══════════════════════════════════════════════════ */

import { Car3DEngine } from './car3d.js';

// ──────────────────────────────────────────
// CONFIG
// ──────────────────────────────────────────
const CONFIG = {
  // Carousel geometry
  radiusX: 480,           // horizontal spread (px)
  radiusDepth: 0.9,       // depth multiplier (0–1 range mapped to scale/opacity)

  // Card visual range
  scaleFront: 1.05,       // scale of front-facing card
  scaleBack: 0.45,        // scale of back card
  opacityFront: 1.0,
  opacityBack: 0.08,
  blurBack: 10,           // px blur on back cards
  cardTiltMax: 35,        // max rotateY tilt on side cards (degrees)

  // Physics
  friction: 0.88,         // velocity decay per frame (lower = more friction)
  snapStrength: 0.08,     // how fast it snaps to nearest slot
  scrollSensitivity: 0.00015, // wheel delta → velocity multiplier (low = smooth)
  snapThreshold: 0.002,   // velocity below which snap kicks in

  // Car
  carAutoRotSpeed: 0.0003, // very gentle constant auto-rotation (radians/frame)
};

const NUM_CARDS = 4;
const ANGLE_PER_CARD = (Math.PI * 2) / NUM_CARDS; // 90° in radians


// ──────────────────────────────────────────
// STATE
// ──────────────────────────────────────────
let currentAngle = 0;     // current carousel rotation (radians)
let velocity = 0;         // current rotation velocity
let activeIndex = 0;      // which card is in front (0–3)
let isDragging = false;
let dragStartX = 0;
let dragLastX = 0;
let scrollHintVisible = true;


// ──────────────────────────────────────────
// DOM REFS
// ──────────────────────────────────────────
const cards = document.querySelectorAll('.carousel__card');
const counterEl = document.getElementById('counterCurrent');
const scrollHintEl = document.getElementById('scrollHint');
const navPrev = document.getElementById('navPrev');
const navNext = document.getElementById('navNext');


// ──────────────────────────────────────────
// 3D CAR INIT
// ──────────────────────────────────────────
const car3d = new Car3DEngine();
car3d.init();

let carAutoAngle = 0; // for gentle constant rotation

car3d.loadModel('/models/free_bmw_m3_e30.glb', (p) => {
  // progress callback
}).then(() => {
  console.log('🚗 BMW ready for carousel');

  // Elegant 3/4 front view — camera slightly elevated and to the side
  car3d.updateCamera({
    positionX: 2.5,
    positionY: 1.8,
    positionZ: 5,
    lookAtX: 0,
    lookAtY: 0.3,
    lookAtZ: 0,
    fov: 32,
  });

  // Car centered, decent size, slight angle
  car3d.update({
    scale: 0.8,
    rotationX: 0,
    rotationY: -0.2,  // slight angle towards camera
    positionX: 0,
    positionY: 0.45,  // centered in viewport
  });

  // Make visible
  car3d.setOpacity(1);

}).catch((err) => {
  console.warn('3D car not available:', err);
});


// ──────────────────────────────────────────
// CAROUSEL MATH
// ──────────────────────────────────────────

/**
 * Update all card positions based on current carousel angle.
 * Each card sits on a circular path. We compute:
 *   x = sin(angle) * radius      → horizontal offset
 *   depth = cos(angle)            → -1 (back) to +1 (front)
 *   From depth: scale, opacity, blur, z-index, rotateY
 */
function updateCards() {
  let frontIndex = 0;
  let frontDepth = -2;

  cards.forEach((card, i) => {
    const baseAngle = i * ANGLE_PER_CARD;
    const angle = baseAngle + currentAngle;

    // Position on circle
    const x = Math.sin(angle) * CONFIG.radiusX;
    const depth = Math.cos(angle); // -1 to +1

    // Track which card is frontmost
    if (depth > frontDepth) {
      frontDepth = depth;
      frontIndex = i;
    }

    // Map depth → visual properties
    const depthNorm = (depth + 1) / 2; // 0 (back) to 1 (front)

    const scale = CONFIG.scaleBack + depthNorm * (CONFIG.scaleFront - CONFIG.scaleBack);
    const opacity = CONFIG.opacityBack + depthNorm * (CONFIG.opacityFront - CONFIG.opacityBack);
    const blur = CONFIG.blurBack * (1 - depthNorm);
    const zIndex = Math.round(depthNorm * 100);

    // Tilt: side cards angle towards center
    const tiltY = Math.sin(angle) * -CONFIG.cardTiltMax;

    // Tilted orbit: front card sits lower (closer to car), back card floats higher
    const y = depth * 120;

    // Apply transforms
    card.style.transform = `translateX(${x}px) translateY(${y}px) scale(${scale}) rotateY(${tiltY}deg)`;
    card.style.opacity = opacity;
    card.style.filter = blur > 0.5 ? `blur(${blur.toFixed(1)}px)` : 'none';
    card.style.zIndex = zIndex;

    // Active state class
    card.classList.toggle('is-active', false);
  });

  // Mark front card as active
  if (cards[frontIndex]) {
    cards[frontIndex].classList.add('is-active');

    // Update counter
    if (frontIndex !== activeIndex) {
      activeIndex = frontIndex;
      if (counterEl) {
        counterEl.textContent = String(frontIndex + 1).padStart(2, '0');
      }

      // Hide scroll hint after first interaction
      if (scrollHintVisible && scrollHintEl) {
        scrollHintVisible = false;
        scrollHintEl.style.opacity = '0';
        scrollHintEl.style.transition = 'opacity 0.6s ease';
      }
    }
  }
}


// ──────────────────────────────────────────
// ANIMATION LOOP
// ──────────────────────────────────────────
function animate() {
  // Apply velocity
  currentAngle += velocity;

  // Friction only — no snap, stays where you stop
  velocity *= CONFIG.friction;

  // Update card visuals
  updateCards();

  // Gentle constant auto-rotation (NOT synced with scroll)
  carAutoAngle += CONFIG.carAutoRotSpeed;
  car3d.update({
    rotationY: -0.2 + Math.sin(carAutoAngle) * 0.15, // subtle oscillation around base angle
  });

  requestAnimationFrame(animate);
}


// ──────────────────────────────────────────
// INPUT: SCROLL (WHEEL)
// ──────────────────────────────────────────
window.addEventListener('wheel', (e) => {
  e.preventDefault();
  velocity -= e.deltaY * CONFIG.scrollSensitivity; // inverted: scroll down = next card
}, { passive: false });


// ──────────────────────────────────────────
// INPUT: KEYBOARD
// ──────────────────────────────────────────
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    velocity += 0.12;
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    velocity -= 0.12;
  }
});


// ──────────────────────────────────────────
// INPUT: DRAG (MOUSE + TOUCH)
// ──────────────────────────────────────────
const carouselEl = document.getElementById('carousel');

function onDragStart(clientX) {
  isDragging = true;
  dragStartX = clientX;
  dragLastX = clientX;
  velocity = 0; // kill momentum on grab
  document.body.style.cursor = 'grabbing';
}

function onDragMove(clientX) {
  if (!isDragging) return;
  const delta = clientX - dragLastX;
  velocity = delta * -0.003; // invert: drag right = rotate left
  currentAngle += velocity;
  dragLastX = clientX;
}

function onDragEnd() {
  isDragging = false;
  document.body.style.cursor = '';
}

// Mouse
carouselEl.addEventListener('mousedown', (e) => {
  e.preventDefault();
  onDragStart(e.clientX);
});
window.addEventListener('mousemove', (e) => onDragMove(e.clientX));
window.addEventListener('mouseup', onDragEnd);

// Touch
carouselEl.addEventListener('touchstart', (e) => {
  onDragStart(e.touches[0].clientX);
}, { passive: true });
window.addEventListener('touchmove', (e) => {
  onDragMove(e.touches[0].clientX);
}, { passive: true });
window.addEventListener('touchend', onDragEnd);


// ──────────────────────────────────────────
// INPUT: NAV BUTTONS
// ──────────────────────────────────────────
if (navPrev) {
  navPrev.addEventListener('click', () => {
    velocity -= 0.15;
  });
}

if (navNext) {
  navNext.addEventListener('click', () => {
    velocity += 0.15;
  });
}


// ──────────────────────────────────────────
// CARD CLICK → Navigate to service page
// ──────────────────────────────────────────
cards.forEach((card) => {
  card.addEventListener('click', (e) => {
    // Only navigate if this is the active (front) card
    if (!card.classList.contains('is-active')) {
      e.preventDefault();
      // Rotate carousel to put this card in front
      const cardIndex = parseInt(card.dataset.index);
      const targetAngle = -cardIndex * ANGLE_PER_CARD;

      // Find shortest path
      const diff = targetAngle - currentAngle;
      const normalizedDiff = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI;
      velocity = normalizedDiff * 0.05;
      return;
    }

    // Active card clicked — follow the link
    const link = card.querySelector('.carousel__cta');
    if (link && link.href) {
      window.location.href = link.href;
    }
  });
});


// ──────────────────────────────────────────
// START
// ──────────────────────────────────────────
updateCards(); // initial render
animate();     // start loop

console.log('🎠 Carousel engine loaded — scroll, drag, or use arrows');
