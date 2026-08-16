// Laadtarieven per Supercharger, handmatig afgelezen uit de Tesla-app.
//
// Er bestaat geen publieke bron voor deze gegevens: Tesla's eigen API's geven wel
// locaties maar geen prijzen, de bekende community-scraper ligt stil sinds juni 2024,
// en vergelijkers als ChargeViz publiceren alleen landgemiddelden. Dit bestand is
// daarom met de hand opgebouwd en groeit mee met elke rit.
//
// bands: [beginuur, einduur, prijs per kWh]. Uren in lokale tijd, 24-uurs.
// Een band die over middernacht loopt eindigt op 24 en begint elders op 0.
// vast: true betekent één prijs, geen tijdvakken.
//
// name moet exact overeenkomen met de naam in data.js.
const TARIEVEN = [
  // --- België ---
  { name: 'Anderlecht, Belgium',            gemeten: '2026-08-16', bands: [[4,10,0.27],[10,20,0.52],[20,24,0.27],[0,4,0.27]] },
  { name: "Braine-l'Alleud, Belgium",       gemeten: '2026-08-16', bands: [[4,8,0.23],[8,20,0.51],[20,24,0.32],[0,4,0.23]] },
  { name: 'Nivelles-Sud, Belgium',          gemeten: '2026-08-16', bands: [[4,8,0.22],[8,20,0.51],[20,24,0.31],[0,4,0.22]] },
  { name: 'Charleroi, Belgium',             gemeten: '2026-08-16', bands: [[4,8,0.24],[8,20,0.51],[20,24,0.35],[0,4,0.24]] },
  { name: 'Couvin, Belgium',                gemeten: '2026-08-16', bands: [[4,8,0.33],[8,20,0.44],[20,24,0.40],[0,4,0.33]] },
  // --- Frankrijk ---
  { name: 'Charleville-Mézières, France',   gemeten: '2026-08-16', bands: [[4,10,0.27],[10,20,0.42],[20,24,0.27],[0,4,0.27]] },
  { name: 'Terville, France',               gemeten: '2026-08-16', bands: [[4,10,0.23],[10,21,0.42],[21,24,0.23],[0,4,0.23]] },
  { name: 'Hauconcourt, France',            gemeten: '2026-08-16', bands: [[4,9,0.16],[9,20,0.42],[20,24,0.25],[0,4,0.16]] },
  { name: 'Moulins-lès-Metz, France',       gemeten: '2026-08-16', bands: [[4,10,0.19],[10,21,0.37],[21,24,0.19],[0,4,0.19]] },
  { name: 'Farébersviller, France',         gemeten: '2026-08-16', bands: [[4,10,0.28],[10,19,0.42],[19,23,0.28],[23,24,0.17],[0,4,0.17]] },
  { name: 'Phalsbourg, France',             gemeten: '2026-08-16', bands: [[4,8,0.14],[8,20,0.39],[20,24,0.25],[0,4,0.14]] },
  { name: 'Strasbourg Sud, France',         gemeten: '2026-08-16', bands: [[4,9,0.24],[9,20,0.42],[20,24,0.31],[0,4,0.20]] },
  // --- Duitsland ---
  { name: 'Offenburg, Germany - Wilhelm-Röntgen-Straße', gemeten: '2026-08-16', bands: [[4,22,0.43],[22,24,0.28],[0,4,0.28]] },
  { name: 'Achern, Germany',                gemeten: '2026-08-16', bands: [[4,9,0.33],[9,18,0.48],[18,22,0.41],[22,24,0.33],[0,4,0.33]] },
  { name: 'Bühl, Germany',                  gemeten: '2026-08-16', vast: 0.41 },
  { name: 'Baden-Baden, Germany',           gemeten: '2026-08-16', bands: [[4,10,0.38],[10,20,0.43],[20,24,0.38],[0,4,0.38]] },
  { name: 'Karlsruhe, Germany - Grünwinkel', gemeten: '2026-08-16', bands: [[4,8,0.28],[8,23,0.43],[23,24,0.28],[0,4,0.28]] },
  { name: 'Karlsruhe, Germany - Südstadt',  gemeten: '2026-08-16', bands: [[4,8,0.28],[8,23,0.43],[23,24,0.28],[0,4,0.28]] },
  { name: 'Pforzheim, Germany',             gemeten: '2026-08-16', vast: 0.41 },
  { name: 'Rauenberg, Germany',             gemeten: '2026-08-16', vast: 0.43 },
];
