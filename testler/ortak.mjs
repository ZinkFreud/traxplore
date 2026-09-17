/* Traxplore JS testleri icin ortak kosum.
 *
 * Neden var: elimizdeki cek_*.mjs betikleri OLCUM yapiyordu, ben goz ile
 * bakiyordum. Burasi IDDIA ediyor: beklenen degeri yaziyoruz, tutmazsa
 * "KALDI" diyor ve cikis kodu 1 oluyor. Boylece testler.sh tek seferde
 * hepsini calistirip tek bir cevap verebiliyor.
 *
 * Sahte Supabase (stub.js) uzerinde calisiyor; gercek veritabanini
 * sinamiyor, onu sqltest/ yapiyor. Buradaki soru: "arayuz ve mantik
 * dogru davraniyor mu".
 */
import pw from '/home/claude/.npm-global/lib/node_modules/playwright/index.js';
import http from 'http';
import fs from 'fs';
import path from 'path';

const { chromium } = pw;
const KOK = path.dirname(new URL(import.meta.url).pathname).replace(/\/testler$/, '');

let sunucu = null, tarayici = null;
const sonuclar = [];

const TURLER = {
  '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.svg': 'image/svg+xml'
};

/* Test sayfasi index.html'den URETILIYOR, elde tutulan bir kopya YOK.
 * Once index_test.html diye ayri bir dosya vardi ve sessizce geride
 * kaliyordu: index.html'e eklenen bir dugme testte hic yoktu, test de
 * "boyle bir dugme yok" diye hakli hakli patliyordu. Tek fark disaridan
 * gelen iki betigin yerine sahte sunucunun gecmesi; onu da burada
 * yapiyoruz.
 */
function testSayfasi() {
  let h = fs.readFileSync(path.join(KOK, 'index.html'), 'utf8');
  h = h.replace(/\s*<link rel="manifest"[^>]*>/, '');
  h = h.replace(/\s*<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/globe\.gl[^>]*><\/script>/,
                '\n    <script src="stub.js"></script>');
  h = h.replace(/\s*<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase[^>]*><\/script>/, '');
  if (h.indexOf('stub.js') === -1) {
    throw new Error('test sayfasi uretilemedi: index.html\'deki betik etiketleri degismis');
  }
  return h;
}

export async function kur(port, ayar) {
  ayar = ayar || {};
  sunucu = http.createServer(function (istek, cevap) {
    let yol = istek.url.split('?')[0];
    if (yol === '/') {
      cevap.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return cevap.end(testSayfasi());
    }
    const tam = path.join(KOK, yol);
    if (!tam.startsWith(KOK) || !fs.existsSync(tam) || fs.statSync(tam).isDirectory()) {
      cevap.writeHead(404); return cevap.end();
    }
    const tur = TURLER[path.extname(yol)] || 'text/html';
    cevap.writeHead(200, { 'Content-Type': tur + (tur.startsWith('text') ? '; charset=utf-8' : '') });
    cevap.end(fs.readFileSync(tam));
  });
  await new Promise(function (c) { sunucu.listen(port, c); });

  tarayici = await chromium.launch({ args: ['--no-sandbox'] });
  const baglam = await tarayici.newContext({
    viewport: ayar.viewport || { width: 1440, height: 900 },
    hasTouch: !!ayar.mobil, isMobile: !!ayar.mobil, deviceScaleFactor: 1
  });
  const sayfa = await baglam.newPage();

  /* Sayfa hatasi sessizce gecmesin: testin kendisi gecse bile
     konsola dusen bir istisna gercek bir sorundur. */
  const hatalar = [];
  sayfa.on('pageerror', function (e) { hatalar.push(e.message); });

  /* captureStream'in izini izliyoruz: kayit bitince akis kapatiliyor mu?
     Gercek tarayicida da calisan bir sarmalayici, davranisi degistirmiyor. */
  await sayfa.addInitScript(function () {
    const asil = HTMLCanvasElement.prototype.captureStream;
    if (!asil) return;
    HTMLCanvasElement.prototype.captureStream = function () {
      const akis = asil.apply(this, arguments);
      akis.getVideoTracks().forEach(function (iz) {
        const eskiDur = iz.stop.bind(iz);
        iz.stop = function () { window.__izDurduruldu = true; return eskiDur(); };
        /* Kac kere "su kareyi al" dendigini sayiyoruz: her cizim bir
           kare olmali. */
        if (typeof iz.requestFrame === "function") {
          const eskiIste = iz.requestFrame.bind(iz);
          iz.requestFrame = function () {
            window.__elleKareKullanildi = true;
            window.__kareIstegi = (window.__kareIstegi || 0) + 1;
            return eskiIste();
          };
        }
      });
      return akis;
    };
  });

  await sayfa.goto('http://localhost:' + port + '/', { waitUntil: 'load' });
  await sayfa.waitForTimeout(ayar.bekle || 1300);
  return { sayfa, hatalar };
}

/* --- iddialar --------------------------------------------------------- */

function kaydet(ad, gecti, aciklama) {
  sonuclar.push({ ad, gecti, aciklama });
  console.log((gecti ? '  gecti  ' : '  KALDI  ') + ad + (gecti ? '' : '  ->  ' + aciklama));
}

export function esit(ad, gercek, beklenen) {
  const g = JSON.stringify(gercek), b = JSON.stringify(beklenen);
  kaydet(ad, g === b, 'beklenen ' + b + ', gelen ' + g);
}

export function dogru(ad, kosul, aciklama) {
  kaydet(ad, !!kosul, aciklama || 'kosul saglanmadi');
}

export function icerir(ad, metin, parca) {
  const m = String(metin == null ? '' : metin);
  kaydet(ad, m.indexOf(parca) >= 0, '"' + parca + '" gecmiyor; gelen: "' + m.slice(0, 120) + '"');
}

export function icermez(ad, metin, parca) {
  const m = String(metin == null ? '' : metin);
  kaydet(ad, m.indexOf(parca) < 0, '"' + parca + '" gecmemeliydi; gelen: "' + m.slice(0, 120) + '"');
}

/* --- kapanis ---------------------------------------------------------- */

export async function ozet(baslik, hatalar) {
  if (hatalar && hatalar.length) {
    kaydet('sayfada javascript hatasi yok', false, hatalar.join(' | ').slice(0, 200));
  }
  if (tarayici) await tarayici.close();
  if (sunucu) sunucu.close();

  const kalan = sonuclar.filter(function (s) { return !s.gecti; });
  console.log('');
  if (kalan.length) {
    console.log('KALDI  ' + baslik + '  (' + kalan.length + '/' + sonuclar.length + ' basarisiz)');
  } else {
    console.log('GECTI  ' + baslik + '  (' + sonuclar.length + ' iddia)');
  }
  return kalan.length ? 1 : 0;
}
