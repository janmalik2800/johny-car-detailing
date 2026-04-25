/* ═══════════════════════════════════════ */
/* DATA                                   */
/* ═══════════════════════════════════════ */
const CARS = [
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

/* Card layout: scattered positions (x, y, width, height, rotation class) */
const LAYOUT = [
  { x: 100,  y: 50,  w: 300, h: 420, rot: 1 },
  { x: 620,  y: 200, w: 260, h: 360, rot: 2 },
  { x: 1120, y: 30,  w: 320, h: 440, rot: 3 },
  { x: 1680, y: 180, w: 280, h: 380, rot: 4 },
  { x: 2220, y: 40,  w: 300, h: 420, rot: 5 },
  { x: 2780, y: 210, w: 270, h: 370, rot: 6 },
];

const pad = n => String(n).padStart(2, '0');

/* ═══════════════════════════════════════ */
/* BUILD SCATTERED CARDS                  */
/* ═══════════════════════════════════════ */
const track = document.getElementById('portfolioTrack');
const totalWidth = LAYOUT[LAYOUT.length - 1].x + LAYOUT[LAYOUT.length - 1].w + 300;
track.style.width = totalWidth + 'px';
track.style.height = '700px';

CARS.forEach((car, i) => {
  const L = LAYOUT[i];
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
        <div class="photo-card__tag">${pad(i+1)} · ${car.tag}</div>
        <div class="photo-card__name">${car.name}</div>
      </div>
      <div class="photo-card__plus">+</div>
    </div>
    <div class="photo-card__label">${car.name}</div>
  `;
  track.appendChild(card);
});

/* ═══════════════════════════════════════ */
/* DRAG TO SCROLL                         */
/* ═══════════════════════════════════════ */
const scrollArea = document.getElementById('portfolioScrollArea');
let isDragging = false, startX, scrollLeft;

scrollArea.addEventListener('mousedown', e => {
  isDragging = true;
  startX = e.pageX - scrollArea.offsetLeft;
  scrollLeft = scrollArea.scrollLeft;
  scrollArea.style.cursor = 'grabbing';
});
scrollArea.addEventListener('mouseleave', () => { isDragging = false; scrollArea.style.cursor = 'grab'; });
scrollArea.addEventListener('mouseup', () => { isDragging = false; scrollArea.style.cursor = 'grab'; });
scrollArea.addEventListener('mousemove', e => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - scrollArea.offsetLeft;
  scrollArea.scrollLeft = scrollLeft - (x - startX) * 1.5;
});

/* ═══════════════════════════════════════ */
/* CLICK CARD → EXPAND (fan of photos)    */
/* ═══════════════════════════════════════ */
const expandEl = document.getElementById('cardExpand');
const fanEl = document.getElementById('cardExpandFan');
const expandName = document.getElementById('cardExpandName');
const expandNum = document.getElementById('cardExpandNum');
const expandServices = document.getElementById('cardExpandServices');
let currentCar = null;
let clickedDuringDrag = false;

scrollArea.addEventListener('mousedown', () => { clickedDuringDrag = false; });
scrollArea.addEventListener('mousemove', () => { clickedDuringDrag = true; });

track.addEventListener('click', e => {
  if (clickedDuringDrag) return;
  const card = e.target.closest('.photo-card');
  if (!card) return;
  openExpand(+card.dataset.idx);
});

function openExpand(idx) {
  currentCar = idx;
  expandStackIdx = 0;
  const car = CARS[idx];
  expandName.textContent = car.name;
  expandNum.textContent = pad(idx + 1);
  expandServices.innerHTML = car.services.map(s => `<li>${s}</li>`).join('');

  // Build stacked deck of 9 photos
  const total = car.photos.length;
  fanEl.innerHTML = car.photos.map((photo, i) => `
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

  expandEl.classList.add('open');

  // Bind stack navigation
  setTimeout(() => {
    document.getElementById('stackPrev').addEventListener('click', e => { e.stopPropagation(); stackNav(-1); });
    document.getElementById('stackNext').addEventListener('click', e => { e.stopPropagation(); stackNav(1); });
  }, 50);
}

let expandStackIdx = 0;
function stackNav(dir) {
  const car = CARS[currentCar];
  const total = car.photos.length;
  const cards = fanEl.querySelectorAll('.stack-card');
  const current = cards[expandStackIdx];

  if (dir > 0 && expandStackIdx < total - 1) {
    // Throw current card to the left
    current.classList.add('stack-card--thrown');
    current.style.transform = `translateX(-120%) rotate(-12deg)`;
    current.style.opacity = '0';
    expandStackIdx++;
  } else if (dir < 0 && expandStackIdx > 0) {
    expandStackIdx--;
    const prev = cards[expandStackIdx];
    prev.classList.remove('stack-card--thrown');
    prev.style.transform = `translateY(0) scale(1)`;
    prev.style.opacity = '1';
  }

  // Update visible stack
  cards.forEach((c, i) => {
    if (i < expandStackIdx) return;
    const offset = i - expandStackIdx;
    c.style.zIndex = total - offset;
    if (offset === 0) {
      c.style.transform = `translateY(0) scale(1)`;
      c.classList.add('stack-card--active');
    } else {
      c.style.transform = `translateY(${offset * 4}px) scale(${1 - offset * 0.02})`;
      c.classList.remove('stack-card--active');
    }
  });

  document.getElementById('stackCounter').textContent = `${expandStackIdx + 1} / ${total}`;
}

document.getElementById('cardExpandClose').addEventListener('click', closeExpand);
document.getElementById('cardExpandCloseBtn').addEventListener('click', closeExpand);
function closeExpand() {
  expandEl.classList.remove('open');
  expandStackIdx = 0;
}

/* CTA → opens detail modal */
document.getElementById('cardExpandCTA').addEventListener('click', () => {
  if (currentCar === null) return;
  closeExpand();
  setTimeout(() => openDetail(currentCar), 300);
});

/* ═══════════════════════════════════════ */
/* DETAIL MODAL                           */
/* ═══════════════════════════════════════ */
const detailModal = document.getElementById('detailModal');

function openDetail(idx) {
  const car = CARS[idx];
  document.getElementById('detailName').textContent = car.name;
  document.getElementById('detailServices').innerHTML = car.services.map(s => `<li>${s}</li>`).join('');
  document.getElementById('detailText').textContent = car.text;
  document.getElementById('detailGallery').innerHTML = car.photos.map((p, i) =>
    `<img src="${p}" alt="${car.name} foto ${i+1}" loading="lazy"/>`
  ).join('');
  detailModal.classList.add('open');
}

document.getElementById('detailModalClose').addEventListener('click', () => detailModal.classList.remove('open'));
document.getElementById('detailModalCloseBtn').addEventListener('click', () => detailModal.classList.remove('open'));

/* Close modals on Escape */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeExpand();
    detailModal.classList.remove('open');
  }
});

