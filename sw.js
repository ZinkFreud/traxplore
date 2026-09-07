/* =====================================================================
   TRAXPLORE — SERVIS ISCISI

   Ne yapiyor: uygulamanin kabugunu (html, css, js, simgeler) telefonun
   icinde tutuyor. Acilis internetten dosya beklemiyor, aninda geliyor.

   Ne YAPMIYOR: uygulamayi cevrimdisi calisir hale getirmiyor. Veriler
   Supabase'den geliyor, o internet ister. Cevrimdisiyken uygulama
   aciliyor ama harita bos kaliyor. Bunu soz olarak vermiyoruz.

   Surum degisince eski onbellek siliniyor. SURUM satirini her yeni
   yayinda degistirmek gerekiyor, yoksa telefon eski dosyalari tutar.
   ===================================================================== */

const SURUM  = "traxplore-20260907c";
const KABUK  = [
  "./",
  "./index.html",
  "./style.css?v=20260907c",
  "./script.js?v=20260907c",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png"
];
/* Bunlar baska sunucudan geliyor; biri inmezse kurulum bozulmasin diye
   tek tek ve hatayi yutarak ekliyoruz. */
const DISARIDAN = [
  "https://cdn.jsdelivr.net/npm/globe.gl@2.46.2/dist/globe.gl.min.js",
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"
];

self.addEventListener("install", function (olay) {
  olay.waitUntil(
    caches.open(SURUM).then(function (kap) {
      return kap.addAll(KABUK).then(function () {
        return Promise.all(DISARIDAN.map(function (a) {
          return kap.add(a).catch(function () {});
        }));
      });
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (olay) {
  olay.waitUntil(
    caches.keys().then(function (adlar) {
      return Promise.all(adlar.map(function (ad) {
        if (ad !== SURUM) return caches.delete(ad);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (olay) {
  const istek = olay.request;
  if (istek.method !== "GET") return;

  const adres = new URL(istek.url);
  const bizim = adres.origin === self.location.origin;
  const cdn   = adres.hostname === "cdn.jsdelivr.net";
  if (!bizim && !cdn) return;            // Supabase, Vikipedi, fotograflar: dokunma

  /* Sayfanin kendisi: once internetten. Boylece yeni surum yayinlaninca
     kullanici eski sayfada kalmiyor. Internet yoksa onbellekten. */
  if (istek.mode === "navigate") {
    olay.respondWith(
      fetch(istek).then(function (cevap) {
        const kopya = cevap.clone();
        caches.open(SURUM).then(function (k) { k.put("./index.html", kopya); });
        return cevap;
      }).catch(function () {
        return caches.match("./index.html");
      })
    );
    return;
  }

  /* Geri kalan (css, js, simge): once onbellek. Adreslerinde surum
     etiketi var, yeni surum yeni adres demek -- bayat dosya sorunu yok. */
  olay.respondWith(
    caches.match(istek).then(function (bulunan) {
      if (bulunan) return bulunan;
      return fetch(istek).then(function (cevap) {
        if (cevap && cevap.ok && cevap.type !== "opaque") {
          const kopya = cevap.clone();
          caches.open(SURUM).then(function (k) { k.put(istek, kopya); });
        }
        return cevap;
      });
    })
  );
});
