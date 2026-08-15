// Toegangspoort. Pagina's die dit laden tonen niets zonder login.
//
// Bewust simpel gehouden: één bestand, één regel om het in te haken, en géén
// eigen sessiebeheer. De echte beveiliging zit in de RLS-policies van Supabase —
// dit scherm houdt alleen nieuwsgierige bezoekers buiten. Wie de policies kent
// weet dat er zonder geldig token toch niets op te halen valt.
//
// stand.html laadt dit bewust NIET: dat is het publieke dashboard.
(function () {
  const SUPA_URL = 'https://kgnfkuqzmdfstbdryfcy.supabase.co';
  const SUPA_KEY = 'sb_publishable_eDeD-C79QQHT_EhLaNuIug_MV2uQ3_v';

  const scherm = document.createElement('div');
  scherm.id = 'slotscherm';
  scherm.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#14171c;color:#e8eaed;' +
    'font-family:"Segoe UI",system-ui,sans-serif;display:flex;align-items:center;justify-content:center;padding:20px';
  scherm.innerHTML =
    '<div style="width:100%;max-width:340px">' +
      '<div style="font-size:19px;font-weight:600;margin-bottom:6px">🔒 Supercharger Hunter</div>' +
      '<div style="font-size:13px;color:#9aa3af;margin-bottom:16px">Deze pagina is privé. ' +
        'Het openbare dashboard staat op <a href="stand.html" style="color:#9aa3af">stand.html</a>.</div>' +
      '<input id="slot-mail" type="email" placeholder="Email" autocomplete="username" ' +
        'style="width:100%;background:#262c36;color:#e8eaed;border:1px solid #333a45;border-radius:6px;padding:11px;font-size:15px;margin-bottom:8px">' +
      '<input id="slot-pw" type="password" placeholder="Wachtwoord" autocomplete="current-password" ' +
        'style="width:100%;background:#262c36;color:#e8eaed;border:1px solid #333a45;border-radius:6px;padding:11px;font-size:15px">' +
      '<button id="slot-in" style="width:100%;background:#e82127;color:#fff;border:0;border-radius:6px;' +
        'padding:12px;font-size:15px;font-weight:600;cursor:pointer;margin-top:12px">Inloggen</button>' +
      '<div id="slot-fout" style="font-size:13px;color:#ff8080;margin-top:10px;min-height:18px"></div>' +
    '</div>';

  // meteen dichttrekken, nog vóór de pagina zelf iets tekent
  function toon() {
    if (!document.body) return void setTimeout(toon, 10);
    if (!document.getElementById('slotscherm')) document.body.appendChild(scherm);
    const knop = document.getElementById('slot-in');
    if (knop && !knop.onclick) {
      const pw = document.getElementById('slot-pw');
      knop.onclick = login;
      pw.onkeydown = e => { if (e.key === 'Enter') login(); };
    }
  }
  function verberg() { const el = document.getElementById('slotscherm'); if (el) el.remove(); }

  let supa = null;
  async function login() {
    const fout = document.getElementById('slot-fout');
    fout.textContent = 'Bezig…';
    const { error } = await supa.auth.signInWithPassword({
      email: document.getElementById('slot-mail').value.trim(),
      password: document.getElementById('slot-pw').value });
    if (error) { fout.textContent = 'Inloggen mislukt.'; return; }
    // herladen zodat de pagina zelf zijn gegevens mét geldige sessie ophaalt
    location.reload();
  }

  // wachten tot de supabase-bundel geladen is; volgorde van de script-tags maakt zo niet uit
  (function wacht() {
    if (!window.supabase) { toon(); return void setTimeout(wacht, 30); }
    supa = window.supabase.createClient(SUPA_URL, SUPA_KEY);
    supa.auth.getSession().then(({ data }) => { if (data.session) verberg(); else toon(); });
  })();
})();
