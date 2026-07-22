(function () {
  const mapEl = document.getElementById('routeMap');
  if (!mapEl || typeof L === 'undefined') return;

  const locations = {
    india: { name: 'India', flag: '🇮🇳', lat: 20.5937, lng: 78.9629, type: 'start' },
    uk: { name: 'United Kingdom', flag: '🇬🇧', lat: 54.5, lng: -3.4, type: 'base' },
    turkey: { name: 'Turkey', flag: '🇹🇷', lat: 39.0, lng: 35.2433 },
    france: { name: 'France', flag: '🇫🇷', lat: 46.2276, lng: 2.2137 },
    belgium: { name: 'Belgium', flag: '🇧🇪', lat: 50.5039, lng: 4.4699 },
    netherlands: { name: 'Netherlands', flag: '🇳🇱', lat: 52.1326, lng: 5.2913 },
    poland: { name: 'Poland', flag: '🇵🇱', lat: 51.9194, lng: 19.1451 },
    czechia: { name: 'Czechia', flag: '🇨🇿', lat: 49.8175, lng: 15.4730 },
    austria: { name: 'Austria', flag: '🇦🇹', lat: 47.5162, lng: 14.5501 },
    slovakia: { name: 'Slovakia', flag: '🇸🇰', lat: 48.6690, lng: 19.6990 },
    slovenia: { name: 'Slovenia', flag: '🇸🇮', lat: 46.1512, lng: 14.9955 },
    hungary: { name: 'Hungary', flag: '🇭🇺', lat: 47.1625, lng: 19.5033 },
    italy: { name: 'Italy', flag: '🇮🇹', lat: 42.9, lng: 12.5 },
    switzerland: { name: 'Switzerland', flag: '🇨🇭', lat: 46.8182, lng: 8.2275 },
    spain: { name: 'Spain', flag: '🇪🇸', lat: 40.4637, lng: -3.7492 },
    portugal: { name: 'Portugal', flag: '🇵🇹', lat: 39.3999, lng: -8.2245 },
    sweden: { name: 'Sweden', flag: '🇸🇪', lat: 60.1282, lng: 18.6435 }
  };

  const routes = {
    turkey: ['india', 'uk', 'turkey', 'uk'],
    west: ['uk', 'france', 'belgium', 'netherlands', 'uk'],
    central: ['uk', 'poland', 'czechia', 'austria', 'slovakia', 'hungary', 'slovenia', 'hungary', 'uk'],
    south: ['uk', 'italy', 'switzerland', 'italy', 'spain', 'sweden', 'poland', 'uk']
  };

  const routeLabels = {
    all: 'ALL ROUTES',
    turkey: 'TURKEY ROUTE',
    west: 'WESTERN ROUTE',
    central: 'CENTRAL ROUTE',
    south: 'SOUTH + NORDIC ROUTE'
  };
  document.body.classList.add('map-is-locked');
  const map = L.map('routeMap', {
    zoomControl: true,
    dragging: false,
    touchZoom: false,
    doubleClickZoom: false,
    scrollWheelZoom: false,
    boxZoom: false,
    keyboard: false,
    attributionControl: true,
    worldCopyJump: false
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
    maxZoom: 8,
    minZoom: 3,
    attribution: '&copy; OpenStreetMap &copy; CARTO'
  }).addTo(map);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png', {
    maxZoom: 8,
    minZoom: 3,
    opacity: 0.55
  }).addTo(map);

  const bounds = L.latLngBounds([[6.0, -15.5], [63.5, 82.0]]);
  map.fitBounds(bounds, { padding: [36, 36] });
  map.setMaxBounds(bounds.pad(0.42));

  function latlng(key) {
    const place = locations[key];
    return [place.lat, place.lng];
  }

  const markerGroup = L.layerGroup().addTo(map);
  function makeMarkerIcon(place) {
    return L.divIcon({
      className: `travel-marker ${place.type || ''}`.trim(),
      html: `<span class="flag">${place.flag}</span><span class="name">${place.name}</span>`,
      iconSize: null,
      iconAnchor: [16, 16]
    });
  }

  Object.values(locations).forEach(place => {
    L.marker([place.lat, place.lng], { icon: makeMarkerIcon(place), keyboard: true })
      .bindPopup(`<strong>${place.flag} ${place.name}</strong><br>Planned travel location`)
      .addTo(markerGroup);
  });

  function pulseAt(key) {
    const place = locations[key];
    L.marker([place.lat, place.lng], {
      icon: L.divIcon({ className: '', html: '<div class="pulse-ring"></div>', iconSize: [24, 24], iconAnchor: [12, 12] }),
      interactive: false
    }).addTo(map);
  }
  pulseAt('india');
  pulseAt('uk');

  const routeLayers = {};
  function drawRoute(name, keys, color, dash, weight) {
    const points = keys.map(latlng);
    const glow = L.polyline(points, {
      color, weight: weight + 7, opacity: .12, lineCap: 'round', lineJoin: 'round', smoothFactor: 1.15
    });
    const line = L.polyline(points, {
      color, weight, opacity: .94, dashArray: dash, lineCap: 'round', lineJoin: 'round', smoothFactor: 1.15
    });
    routeLayers[name] = { group: L.layerGroup([glow, line]).addTo(map), glow, line };
  }
  drawRoute('turkey', routes.turkey, '#a78bfa', '12 13', 4.2);
  drawRoute('west', routes.west, '#38bdf8', '10 13', 4);
  drawRoute('central', routes.central, '#34d399', '8 11', 3.8);
  drawRoute('south', routes.south, '#f59e0b', '8 11', 3.8);

  function divIcon(html, className) {
    return L.divIcon({ className, html, iconSize: [32, 32], iconAnchor: [16, 16] });
  }
  L.marker(latlng('india'), { icon: divIcon('🧍‍♂️', 'traveller-marker'), interactive: false }).addTo(map);
  L.marker(latlng('uk'), { icon: divIcon('✈️', 'vehicle-marker'), interactive: false }).addTo(map);
  L.marker(latlng('poland'), { icon: divIcon('🚆', 'train-marker'), interactive: false }).addTo(map);

  const status = document.getElementById('routeMapStatus');
  const lockBtn = document.getElementById('mapLockBtn');
  const toggle = document.getElementById('routeToggle');
  let activeRoute = 'all';
  let mapLocked = true;

  function updateStatus(message) {
    if (!status) return;
    status.textContent = message || `${mapLocked ? 'MAP LOCKED' : 'MAP UNLOCKED'} · ${routeLabels[activeRoute]}`;
  }

  function setRouteMode(mode) {
    activeRoute = (mode === 'all' || routes[mode]) ? mode : 'all';
    Object.entries(routeLayers).forEach(([key, layer]) => {
      const show = activeRoute === 'all' || key === activeRoute;
      layer.glow.setStyle({ opacity: show ? .12 : .025 });
      layer.line.setStyle({ opacity: show ? .94 : .10 });
    });
    updateStatus();
  }

  const interactionHandlers = [
    map.dragging,
    map.touchZoom,
    map.doubleClickZoom,
    map.scrollWheelZoom,
    map.boxZoom,
    map.keyboard
  ].filter(Boolean);

  function setMapLocked(locked) {
    mapLocked = locked;
    interactionHandlers.forEach(handler => locked ? handler.disable() : handler.enable());
    document.body.classList.toggle('map-is-locked', locked);
    if (lockBtn) {
      lockBtn.classList.toggle('is-unlocked', !locked);
      lockBtn.setAttribute('aria-pressed', String(locked));
      lockBtn.textContent = locked ? '🔒 Map locked' : '🔓 Map unlocked';
      lockBtn.title = locked ? 'Unlock the map to drag and zoom' : 'Lock the map in place';
    }
    updateStatus();
  }

  if (toggle) {
    toggle.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
      toggle.querySelectorAll('button').forEach(item => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      setRouteMode(button.dataset.route);
    }));
  }
  if (lockBtn) lockBtn.addEventListener('click', () => setMapLocked(!mapLocked));

  setRouteMode('all');
  setMapLocked(true);
  window.setTimeout(() => {
    map.invalidateSize(false);
    map.fitBounds(bounds, { padding: [36, 36], animate: false });
  }, 120);
})();
