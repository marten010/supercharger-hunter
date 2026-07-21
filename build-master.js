// Bouwt een verse masterlijst vanaf supercharge.info (publieke community-database):
//   - data.js voor de app (alle OPEN locaties in Europa)
//   - "Hunter masterlist NIEUW.xlsx" als nieuwe Excel-masterlijst
// Bezocht-status wordt overgenomen uit de bestaande data.js (match op naam, anders op GPS < 700 m).
// Gebruik: node build-master.js
const path = require('path');
const fs = require('fs');
const XLSX = require(path.join(process.env.TEMP, 'claude', 'C--Users-mailm-Desktop-Supercharger-Tesla', 'f0db9ba9-1f29-4cfa-9716-35074ee35ab2', 'scratchpad', 'node_modules', 'xlsx'));

const URL = 'https://supercharge.info/service/supercharge/allSites';
const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const R = 6371;
const hav = (a, b) => {
  const dLat = (b.lat - a.lat) * Math.PI / 180, dLng = (b.lng - a.lng) * Math.PI / 180;
  const x = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180) * Math.cos(b.lat*Math.PI/180) * Math.sin(dLng/2)**2;
  return 2 * R * Math.asin(Math.sqrt(x));
};

(async () => {
  // 1. bezochte locaties uit de huidige data.js bewaren
  let oldVisited = [];
  try {
    const raw = fs.readFileSync(path.join(__dirname, 'data.js'), 'utf8');
    const old = JSON.parse(raw.slice(raw.indexOf('['), raw.lastIndexOf(']') + 1));
    oldVisited = old.filter(s => s.visited);
    console.log('Bezocht in huidige data.js:', oldVisited.length);
  } catch (e) { console.log('Geen bestaande data.js gevonden — start zonder bezocht-status.'); }
  const visitedNames = new Set(oldVisited.map(s => norm(s.name)));
  // Let op: Tesla gebruikt soms andere namen dan de community-database
  // (bijv. Tesla "Poitiers Sud" = database "Croutelle, France";
  //  Tesla "Nîmes - Carré Sud" = database "Nîmes, France - Rue Jean Lauret").

  // 2. verse lijst ophalen
  console.log('Ophalen van supercharge.info…');
  const res = await fetch(URL, { headers: { 'User-Agent': 'personal-supercharger-tracker' } });
  if (!res.ok) throw new Error('Ophalen mislukt: HTTP ' + res.status);
  const all = await res.json();
  // OPEN + EXPANDING (bestaande palen werken, er komen alleen bij) tellen als bruikbaar.
  // Een eerder bezochte locatie nooit laten verdwijnen door een statuswissel
  // (bijv. tijdelijk CLOSED_TEMP) — anders verliest die zijn vinkje stilzwijgend.
  const open = all.filter(s => s.address.region === 'Europe' &&
    (s.status === 'OPEN' || s.status === 'EXPANDING' || visitedNames.has(norm(s.name))));
  console.log(`Ontvangen: ${all.length} wereldwijd, ${open.length} bruikbaar/bezocht in Europa`);

  // 3. nieuwe lijst opbouwen met bezocht-status
  const sites = open.map((s, i) => ({
    id: i,
    name: s.name.trim(),
    address: (s.address.street || '').trim(),
    city: (s.address.city || '').trim(),
    state: (s.address.state || '').trim(),
    zip: (s.address.zip || '').trim(),
    country: (s.address.country || '').trim(),
    lat: s.gps.latitude,
    lng: s.gps.longitude,
    stalls: s.stallCount || null,
    version: s.stalls ? Object.keys(s.stalls).sort().pop().toUpperCase() : '',
    kw: s.powerKilowatt || null,
    opened: s.dateOpened || '',
    visited: visitedNames.has(norm(s.name)),
  }));

  // GPS-fallback voor bezochte locaties waarvan de naam niet matchte
  const matchedNames = new Set(sites.filter(s => s.visited).map(s => norm(s.name)));
  let gpsMatched = 0;
  const stillMissing = [];
  for (const oldSite of oldVisited) {
    if (matchedNames.has(norm(oldSite.name))) continue;
    let best = null, bd = Infinity;
    for (const s of sites) { const d = hav(oldSite, s); if (d < bd) { bd = d; best = s; } }
    if (best && bd < 0.7) { if (!best.visited) { best.visited = true; gpsMatched++; } }
    else stillMissing.push(oldSite.name + ` (dichtstbij: ${best.name}, ${bd.toFixed(1)} km)`);
  }
  if (gpsMatched) console.log('Via GPS alsnog gematcht:', gpsMatched);
  if (stillMissing.length) console.log('NIET teruggevonden in nieuwe lijst:\n  ' + stillMissing.join('\n  '));

  // 4. wegschrijven: data.js
  fs.writeFileSync(path.join(__dirname, 'data.js'), 'const SITES = ' + JSON.stringify(sites) + ';\n');
  console.log(`data.js geschreven: ${sites.length} locaties, ${sites.filter(s => s.visited).length} bezocht`);

  // 5. wegschrijven: nieuwe Excel-masterlijst
  const rows = sites.map(s => ({
    'Site Name': s.name, 'Street Address': s.address, 'City': s.city, 'State': s.state,
    'Zip': s.zip, 'Country': s.country, 'GPS': `${s.lat}, ${s.lng}`,
    'Stalls': s.stalls, 'Type': s.version, 'kW': s.kw, 'Opened': s.opened,
    'Visited': s.visited ? 'Yes' : 'No',
  }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), 'Superchargers');
  const xlsxPath = path.join(__dirname, 'Hunter masterlist NIEUW.xlsx');
  XLSX.writeFile(wb, xlsxPath);
  console.log('Excel geschreven:', xlsxPath);
})();
