# ⚡ Supercharger Hunter 2026

Persoonlijke tracker en routeplanner voor de Tesla Supercharger-wedstrijd 2026: zoveel mogelijk verschillende Europese Superchargers bezoeken.

- **App**: `index.html` — kaart (Leaflet), bezoek-tracking (localStorage), dagroute-planner met drie modi (open route, lus, lus met eigen overnachtingen), Google Maps-export.
- **Data**: `data.js` — alle open Europese Superchargers, gegenereerd vanaf de publieke [supercharge.info](https://supercharge.info) API.
- **Verversen**: `node build-master.js` haalt de actuele lijst op en behoudt de bezocht-status.

Lokaal draaien: `npx http-server -p 8765 -c-1 .`
