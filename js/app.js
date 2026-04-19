// ── State ──────────────────────────────────────────────────────────────────
const state = {
  userLat: null, userLng: null,
  selectedMood: null,
  view: 'list',         // 'list' | 'map'
  results: [],
  settings: Storage.getSettings(),
  exclusions: Storage.getExclusions(),
  mapInstance: null,
  mapMarkers: []
};

// ── Geo ────────────────────────────────────────────────────────────────────
function haversine(lat1, lng1, lat2, lng2) {
  const R = 3958.8, dLat = (lat2-lat1)*Math.PI/180, dLng = (lng2-lng1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

function detectLocation() {
  return new Promise(resolve => {
    if (!navigator.geolocation) return resolve({ lat: 37.7749, lng: -122.4194, fallback: true });
    navigator.geolocation.getCurrentPosition(
      p => resolve({ lat: p.coords.latitude, lng: p.coords.longitude, fallback: false }),
      () => resolve({ lat: 37.7749, lng: -122.4194, fallback: true }),
      { timeout: 8000 }
    );
  });
}

// ── Filtering & Sorting ────────────────────────────────────────────────────
function getFilteredRestaurants(mood) {
  const ex = Storage.getExclusions();
  return RESTAURANTS
    .filter(r => !mood || r.cuisine === mood)
    .filter(r => !ex.restaurants.includes(r.id))
    .filter(r => !ex.cuisines.includes(r.cuisine))
    .map(r => ({
      ...r,
      distance: haversine(state.userLat, state.userLng, r.lat, r.lng),
      note: Storage.getNoteForRestaurant(r.id)
    }));
}

function sortRestaurants(list) {
  const s = state.settings;
  const dirMap = { asc: 1, desc: -1 };
  return [...list].sort((a, b) => {
    for (const p of s.priorities) {
      let diff = 0;
      if (p === 'cost')     diff = (a.price - b.price) * dirMap[s.costDir];
      if (p === 'distance') diff = (a.distance - b.distance) * dirMap[s.distDir];
      if (p === 'rating')   diff = (a.rating - b.rating) * dirMap[s.ratingDir];
      if (diff !== 0) return diff;
    }
    return 0;
  });
}

// ── Render Helpers ─────────────────────────────────────────────────────────
const priceStr = n => '$'.repeat(n);
const stars = n => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n));

function renderCard(r) {
  const noteIcon = r.note ? `<span class="note-badge" title="You have notes here">📝</span>` : '';
  return `
    <div class="card" data-id="${r.id}">
      <div class="card-img-wrap">
        <img src="${r.image}" alt="${r.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x200/FF9F1C/fff?text=Zest'">
        ${noteIcon}
      </div>
      <div class="card-body">
        <div class="card-header">
          <h3>${r.name}</h3>
          <span class="price">${priceStr(r.price)}</span>
        </div>
        <div class="card-meta">
          <span class="stars">${stars(r.rating)}</span>
          <span class="rating-num">${r.rating}</span>
          <span class="distance">${r.distance.toFixed(1)} mi</span>
        </div>
        <p class="desc">${r.description}</p>
        <div class="tags">${r.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        <div class="card-actions">
          <button class="btn-reject" onclick="openRejectModal(${r.id})">Not for me</button>
          <button class="btn-note" onclick="openNoteModal(${r.id})">I went here / Add Note</button>
        </div>
      </div>
    </div>`;
}

// ── Search ─────────────────────────────────────────────────────────────────
async function runSearch(mood) {
  state.selectedMood = mood;
  document.querySelectorAll('.mood-chip').forEach(c => c.classList.toggle('active', c.dataset.mood === mood));
  const results = sortRestaurants(getFilteredRestaurants(mood));
  state.results = results;
  renderResults();
}

function adventurous() {
  const moods = ['burger','pizza','sushi','healthy','mexican','chinese','italian','dessert'];
  const pick = moods[Math.floor(Math.random() * moods.length)];
  document.querySelectorAll('.mood-chip').forEach(c => c.classList.remove('active'));
  runSearch(pick);
  showToast(`🎲 Rolling the dice on ${pick}!`);
}

// ── View Rendering ─────────────────────────────────────────────────────────
function renderResults() {
  const container = document.getElementById('results-container');
  if (state.view === 'list') {
    if (state.results.length === 0) {
      container.innerHTML = `<div class="empty-state"><p>No matches found.<br>Try a different mood or clear some exclusions.</p></div>`;
      return;
    }
    container.innerHTML = state.results.map(renderCard).join('');
  } else {
    renderMapView();
  }
}

function renderMapView() {
  const container = document.getElementById('results-container');
  container.innerHTML = `<div id="map-container"></div>`;
  if (!state.mapInstance) {
    state.mapInstance = L.map('map-container').setView([state.userLat, state.userLng], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(state.mapInstance);
  } else {
    state.mapInstance.getContainer().id = 'map-container';
    container.replaceChildren(state.mapInstance.getContainer());
    state.mapInstance.invalidateSize();
  }
  state.mapMarkers.forEach(m => m.remove());
  state.mapMarkers = [];
  state.results.forEach(r => {
    const m = L.marker([r.lat, r.lng])
      .addTo(state.mapInstance)
      .bindPopup(`<b>${r.name}</b><br>${priceStr(r.price)} · ${r.distance.toFixed(1)} mi<br>${r.rating}★`);
    state.mapMarkers.push(m);
  });
  L.marker([state.userLat, state.userLng], {
    icon: L.divIcon({ className: 'user-pin', html: '📍', iconSize: [24,24] })
  }).addTo(state.mapInstance).bindPopup('You are here');
}

function switchView(v) {
  state.view = v;
  document.getElementById('btn-list').classList.toggle('active', v === 'list');
  document.getElementById('btn-map').classList.toggle('active', v === 'map');
  renderResults();
}

// ── Reject Modal ───────────────────────────────────────────────────────────
function openRejectModal(id) {
  const r = RESTAURANTS.find(x => x.id === id);
  const modal = document.getElementById('reject-modal');
  modal.dataset.id = id;
  modal.dataset.cuisine = r.cuisine;
  modal.querySelector('.modal-title').textContent = `No worries! We'll find something better.`;
  modal.classList.add('open');
}

function confirmReject() {
  const modal = document.getElementById('reject-modal');
  const val = modal.querySelector('select').value;
  const id = parseInt(modal.dataset.id);
  const cuisine = modal.dataset.cuisine;
  if (val === 'restaurant') {
    Storage.addRestaurantExclusion(id);
  } else {
    Storage.addCuisineExclusion(cuisine);
  }
  closeModal('reject-modal');
  runSearch(state.selectedMood);
  showToast('Got it! We\'ve noted your preference.');
}

// ── Note Modal ─────────────────────────────────────────────────────────────
function openNoteModal(id) {
  const r = RESTAURANTS.find(x => x.id === id);
  const modal = document.getElementById('note-modal');
  modal.dataset.id = id;
  modal.querySelector('.modal-restaurant-name').textContent = r.name;
  const existing = Storage.getNoteForRestaurant(id);
  modal.querySelector('#note-items').value = existing ? existing.itemsOrdered.join(', ') : '';
  modal.querySelector('#note-rating').value = existing ? existing.myRating : '5';
  modal.querySelector('#note-text').value = existing ? existing.notes : '';
  updateStarDisplay(existing ? existing.myRating : 5);
  modal.classList.add('open');
}

function updateStarDisplay(val) {
  document.querySelectorAll('.star-btn').forEach(b => {
    b.classList.toggle('active', parseInt(b.dataset.val) <= parseInt(val));
  });
}

function saveNote() {
  const modal = document.getElementById('note-modal');
  const id = parseInt(modal.dataset.id);
  const r = RESTAURANTS.find(x => x.id === id);
  const rating = parseInt(modal.querySelector('#note-rating').value);
  const items = modal.querySelector('#note-items').value.split(',').map(s => s.trim()).filter(Boolean);
  const notes = modal.querySelector('#note-text').value;
  Storage.addNote({
    restaurantId: id, restaurantName: r.name,
    dateVisited: new Date().toISOString().split('T')[0],
    itemsOrdered: items, myRating: rating, notes
  });
  // Auto-exclude 1-star
  if (rating <= 1) Storage.addRestaurantExclusion(id);
  closeModal('note-modal');
  runSearch(state.selectedMood);
  showToast('Note saved! Great choice, enjoy your meal 🍽️');
}

// ── Priority Drag & Drop ───────────────────────────────────────────────────
function initPriorityDrag() {
  const list = document.getElementById('priority-list');
  let dragging = null;
  list.querySelectorAll('.priority-item').forEach(item => {
    item.addEventListener('dragstart', () => { dragging = item; item.classList.add('dragging'); });
    item.addEventListener('dragend', () => { item.classList.remove('dragging'); savePriorities(); });
    item.addEventListener('dragover', e => {
      e.preventDefault();
      const after = getDragAfter(list, e.clientY);
      if (after) list.insertBefore(dragging, after); else list.appendChild(dragging);
    });
  });
}

function getDragAfter(container, y) {
  const items = [...container.querySelectorAll('.priority-item:not(.dragging)')];
  return items.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    return offset < 0 && offset > closest.offset ? { offset, element: child } : closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function savePriorities() {
  const items = [...document.querySelectorAll('.priority-item')];
  state.settings.priorities = items.map(i => i.dataset.priority);
  state.settings.costDir = document.getElementById('cost-dir').value;
  state.settings.distDir = document.getElementById('dist-dir').value;
  state.settings.ratingDir = document.getElementById('rating-dir').value;
  Storage.saveSettings(state.settings);
  if (state.results.length) runSearch(state.selectedMood);
}

// ── Modals & Panels ────────────────────────────────────────────────────────
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function toggleSettings() {
  document.getElementById('settings-panel').classList.toggle('open');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── What's New ─────────────────────────────────────────────────────────────
function checkWhatsNew() {
  const s = Storage.getSettings();
  if (s.whatsNewViews >= 5) return;
  const newRestaurants = RESTAURANTS.slice(-3);
  const modal = document.getElementById('whatsnew-modal');
  const list = modal.querySelector('.whatsnew-list');
  list.innerHTML = newRestaurants.map(r =>
    `<div class="whatsnew-item"><strong>${r.name}</strong> — ${r.description}</div>`
  ).join('');
  const note = modal.querySelector('.whatsnew-note');
  s.whatsNewViews++;
  if (s.whatsNewViews >= 5) {
    note.textContent = 'You can always find new restaurants in the Trending section.';
    note.style.display = 'block';
  }
  Storage.saveSettings(s);
  modal.classList.add('open');
}

// ── Init ───────────────────────────────────────────────────────────────────
async function init() {
  const loc = await detectLocation();
  state.userLat = loc.lat; state.userLng = loc.lng;
  if (loc.fallback) showToast('Using default location (San Francisco). Enable GPS for accurate results.');

  // Init priority UI from saved settings
  const s = state.settings;
  document.getElementById('cost-dir').value = s.costDir;
  document.getElementById('dist-dir').value = s.distDir;
  document.getElementById('rating-dir').value = s.ratingDir;

  const list = document.getElementById('priority-list');
  const items = [...list.querySelectorAll('.priority-item')];
  s.priorities.forEach((p, i) => {
    const el = items.find(x => x.dataset.priority === p);
    if (el) list.appendChild(el);
  });
  initPriorityDrag();

  // Direction change listeners
  ['cost-dir','dist-dir','rating-dir'].forEach(id => {
    document.getElementById(id).addEventListener('change', savePriorities);
  });

  checkWhatsNew();
}

document.addEventListener('DOMContentLoaded', init);

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}
