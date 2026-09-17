/* Yorum begenisi.
 *
 * Neden bu testler: begeninin tek isi bir sayiyi dogru gostermek ve
 * kimin begendigini SIZDIRMAMAK. Asil kural veritabaninda
 * (sqltest/04_yorum_begeni.sql); burada arayuzun o kurallari dogru
 * cizdigine bakiyoruz:
 *   - begenmeme dugmesi HIC olmamali (urun karari, kazara eklenmesin),
 *   - 0 sayisi yazilmamali,
 *   - kendi yorumunda dugme olmamali,
 *   - sunucu reddederse ekran eski haline donmeli (iyimser guncelleme
 *     yalan soylemis olmasin).
 *
 * SIRALAMA burada SINANMIYOR: "once kendi yorumum, sonra en cok
 * begenilen" kurali SQL'in isi, sqltest'te olculuyor. Arayuz sunucu ne
 * sirayla verirse onu ciziyor. Sahte veride sira: [0] mert, [1] ben.
 */
import { kur, esit, dogru, icerir, icermez, ozet } from './ortak.mjs';

const { sayfa, hatalar } = await kur(8206);

const OTEKI = 0, BEN = 1;

await sayfa.evaluate(function () { return sehirDetayAc('Turkey', 'Istanbul'); });
await sayfa.waitForTimeout(800);

const kartSay = await sayfa.evaluate(function () {
  return document.querySelectorAll('#yorumListe .yorum-kart').length;
});
esit('iki yorum listeleniyor', kartSay, 2);

const durum = () => sayfa.evaluate(function () {
  return [].slice.call(document.querySelectorAll('#yorumListe .yorum-kart')).map(function (k) {
    const d = k.querySelector('.begeni');
    return {
      benim:   k.classList.contains('benim'),
      dugme:   !!(d && d.tagName === 'BUTTON'),
      gorunur: !!(d && d.offsetParent !== null),
      secili:  !!(d && d.classList.contains('secili')),
      sayi:    d ? (d.querySelector('.begeni-sayi').textContent || '') : null
    };
  });
});
const bas = (i) => sayfa.evaluate(function (i) {
  document.querySelectorAll('#yorumListe .yorum-kart')[i].querySelector('.begeni').click();
}, i);

let d = await durum();
dogru('kendi yorumum "benim" isaretli', d[BEN].benim);
esit('kendi yorumumda dugme yok', d[BEN].dugme, false);
esit('begenisiz kendi yorumumda sayac hic gorunmuyor', d[BEN].gorunur, false);
dogru('baskasinin yorumunda dugme var', d[OTEKI].dugme);
esit('baskasinin yorumunda sayi 2', d[OTEKI].sayi, '2');
esit('baslangicta begenmemisim', d[OTEKI].secili, false);

/* --- begenmeme dugmesi OLMAMALI ---------------------------------------
   Urun karari: bir sehir izleniminin altina "kotu" dugmesi konmuyor.
   Kazara eklenirse bu test kalsin. */
const yorumHtml = await sayfa.innerHTML('#yorumListe');
icermez('begenmeme dugmesi yok (sinif)', yorumHtml, 'begenme');
const dugmeSayisi = await sayfa.evaluate(function () {
  return document.querySelectorAll('#yorumListe .yorum-alt button').length;
});
esit('yorumlarin altinda TEK dugme var', dugmeSayisi, 1);

/* --- begen ----------------------------------------------------------- */
await bas(OTEKI);
await sayfa.waitForTimeout(400);
d = await durum();
esit('begeninde sayi 3 oldu', d[OTEKI].sayi, '3');
dogru('dugme secili gorunuyor', d[OTEKI].secili);
esit('sunucuya bir kez gitti',
  await sayfa.evaluate(function () { return (window.__log.begeni || []).join(','); }),
  'begen:101');

/* --- vazgec ---------------------------------------------------------- */
await bas(OTEKI);
await sayfa.waitForTimeout(400);
d = await durum();
esit('vazgecince sayi 2ye dondu', d[OTEKI].sayi, '2');
esit('dugme secili degil', d[OTEKI].secili, false);

/* --- cift dokunus tek istek ------------------------------------------
   Telefonda cift dokunus kolay. Iki istek giderse ikincisi begeniyi
   geri alir ve kullanici dugmeye bastigi halde hicbir sey olmamis
   gorunur. */
await sayfa.evaluate(function () { window.__log.begeni = []; });
await sayfa.evaluate(function () {
  const b = document.querySelectorAll('#yorumListe .yorum-kart')[0].querySelector('.begeni');
  b.click(); b.click();
});
await sayfa.waitForTimeout(500);
esit('cift dokunus TEK istek gonderiyor',
  await sayfa.evaluate(function () { return (window.__log.begeni || []).length; }), 1);

/* --- sayi 0 iken hic yazilmiyor -------------------------------------- */
await sayfa.evaluate(function () {
  window.__yorumlar[0].begeni = 1; window.__yorumlar[0].begendim = true;
  return sehirDetayAc('Turkey', 'Istanbul');
});
await sayfa.waitForTimeout(800);
await bas(OTEKI);
await sayfa.waitForTimeout(400);
d = await durum();
esit('1den 0a dusunce sayi BOS', d[OTEKI].sayi, '');
dogru('sayi 0 olsa da dugme duruyor', d[OTEKI].dugme);

/* --- kendi yorumumun begenisi gorunuyor ------------------------------- */
await sayfa.evaluate(function () {
  window.__yorumlar[1].begeni = 3;
  return sehirDetayAc('Turkey', 'Istanbul');
});
await sayfa.waitForTimeout(800);
d = await durum();
esit('kendi yorumumun begeni sayisi goruluyor', d[BEN].sayi, '3');
dogru('kendi yorumumun sayaci gorunur', d[BEN].gorunur);
esit('kendi yorumumda hala dugme yok', d[BEN].dugme, false);

/* --- son sozu SUNUCU soylemeli ---------------------------------------
   Sen dugmeye basana kadar baskalari da begenmis olabilir. Arayuz
   iyimser davranip +1 gosteriyor; cevap gelince ustune SUNUCUNUN
   sayisi yazilmali, kendi tahmini degil. */
await sayfa.evaluate(function () {
  window.__yorumlar[0].begeni = 5; window.__yorumlar[0].begendim = false;
  window.__begeniBaskasi = 3;      /* bu arada 3 kisi daha begendi */
  return sehirDetayAc('Turkey', 'Istanbul');
});
await sayfa.waitForTimeout(800);
await bas(OTEKI);
await sayfa.waitForTimeout(400);
d = await durum();
esit('sunucunun sayisi yaziliyor (5+1 degil, 9)', d[OTEKI].sayi, '9');

/* --- sunucu reddederse ekran YALAN SOYLEMESIN ------------------------- */
await sayfa.evaluate(function () {
  window.__begeniHata = 'Bu gezginle iletisim kapali.';
  window.__uyarilar = [];
  window.alert = function (m) { window.__uyarilar.push(m); };
  window.__yorumlar[0].begeni = 4; window.__yorumlar[0].begendim = false;
  return sehirDetayAc('Turkey', 'Istanbul');
});
await sayfa.waitForTimeout(800);
const oncekiSayi = (await durum())[OTEKI].sayi;
await bas(OTEKI);
await sayfa.waitForTimeout(500);
d = await durum();
esit('reddedilince sayi eski haline dondu', d[OTEKI].sayi, oncekiSayi);
esit('reddedilince dugme secili KALMADI', d[OTEKI].secili, false);
icerir('kullaniciya sebep soyleniyor',
  await sayfa.evaluate(function () { return (window.__uyarilar || []).join(' '); }),
  'iletisim kapali');

process.exit(await ozet('Yorum begenisi', hatalar));
