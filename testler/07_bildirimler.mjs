/* Bildirimler — arayüz tarafı.
 *
 * Kurallar veritabaninda (sqltest/05_bildirimler.sql). Burada arayuzun
 * dogru cizdigine bakiyoruz. En onemlisi:
 *   - BEGENI BILDIRIMINDE ISIM GECMEYECEK. Begeniyi bilerek isimsiz
 *     yaptik; bildirimde isim gostermek o karari delerdi. Sahte sunucu
 *     da gercegi gibi o alani null donduruyor, yani test "arayuz
 *     gizliyor mu" degil "veri yokken bir yerden isim uyduruyor mu"
 *     diye bakiyor.
 *   - Okunmamis 0 iken rozet hic yazilmayacak.
 *   - Panel acilinca hepsi okundu olacak ve rozet dusecek.
 */
import { kur, esit, dogru, icerir, icermez, ozet } from './ortak.mjs';

const { sayfa, hatalar } = await kur(8207);
await sayfa.waitForTimeout(600);

const rozet = () => sayfa.evaluate(function () {
  const r = document.getElementById('bildirimSayi');
  const d = document.getElementById('bildirimBtn');
  return { gizli: r.hidden, metin: r.textContent, dolu: d.classList.contains('dolu'),
           dugmeGizli: d.hidden };
});

let r = await rozet();
esit('zil oturum acikken gorunuyor', r.dugmeGizli, false);
esit('okunmamis 2 -> rozet 2', r.metin, '2');
esit('rozet gorunur', r.gizli, false);
dogru('zil dolu gorunumde', r.dolu);

/* --- panel --- */
await sayfa.click('#bildirimBtn');
await sayfa.waitForTimeout(500);

const kartlar = () => sayfa.evaluate(function () {
  return [].slice.call(document.querySelectorAll('#bildirimListe .bildirim-kart'))
    .map(function (k) {
      return { metin: k.querySelector('.bildirim-metin').textContent,
               zaman: k.querySelector('.bildirim-zaman').textContent,
               yeni:  k.classList.contains('yeni'),
               simge: !!k.querySelector('.bildirim-simge'),
               avatar:!!k.querySelector('.avatar') };
    });
});
let k = await kartlar();
esit('uc bildirim listeleniyor', k.length, 3);
icerir('arkadaslik istegi metni', k[0].metin, 'mert');
icerir('arkadaslik istegi metni 2', k[0].metin, 'arkadaşlık isteği');
icerir('begeni metninde sehir var', k[1].metin, 'Istanbul');
icerir('begeni metninde sayi var', k[1].metin, '3 beğeni');
icerir('kabul metni', k[2].metin, 'kabul etti');

/* --- BEGENI BILDIRIMI ISIMSIZ ---------------------------------------- */
icermez('begeni bildiriminde mert gecmiyor', k[1].metin, 'mert');
icermez('begeni bildiriminde ayse gecmiyor', k[1].metin, 'Ayşe');
icermez('begeni bildiriminde "gezgin" uydurulmuyor', k[1].metin, 'gezgin');
esit('begeni bildiriminde avatar yok', k[1].avatar, false);
dogru('begeni bildiriminde simge var', k[1].simge);
dogru('arkadaslik bildiriminde avatar var', k[0].avatar);

esit('okunmus bildirim "yeni" isaretli degil', k[2].yeni, false);
dogru('okunmamis bildirim "yeni" isaretli', k[0].yeni);
esit('zaman yazisi', k[0].zaman, '5 dk');
esit('saat yazisi', k[1].zaman, '3 sa');
esit('gun yazisi', k[2].zaman, '4 gün');

/* --- panel acilinca okundu --- */
esit('sunucuya okundu gitti',
  await sayfa.evaluate(function () { return (window.__log.bildirim || []).join(','); }),
  'okudum:2');
r = await rozet();
esit('rozet dustu', r.gizli, true);
esit('zil sade gorunume dondu', r.dolu, false);

/* --- begeni bildirimine tiklayinca sehir sayfasi acilsin --- */
await sayfa.evaluate(function () {
  document.querySelectorAll('#bildirimListe .bildirim-kart')[1].click();
});
await sayfa.waitForTimeout(800);
esit('panel kapandi',
  await sayfa.evaluate(function () { return document.getElementById('bildirimPanel').hidden; }),
  true);
icerir('sehir sayfasi acildi',
  (await sayfa.textContent('#sehirDetayBaslik')).trim(), 'Istanbul');

/* --- bos liste --- */
await sayfa.evaluate(function () { hepsiniKapat(); window.__bildirimler = []; });
await sayfa.waitForTimeout(300);
await sayfa.click('#bildirimBtn');
await sayfa.waitForTimeout(500);
icerir('bos listede aciklama var',
  await sayfa.textContent('#bildirimListe'), 'Henüz bildirimin yok');
esit('bos listede rozet yok', (await rozet()).gizli, true);
await sayfa.click('#bildirimKapat');

/* --- sifir okunmamis: rozet hic yazilmasin --- */
await sayfa.evaluate(function () {
  window.__bildirimler = [{ id:9, tur:'arkadas_kabul', sayi:1, okundu:true,
    guncellendi:new Date().toISOString(), kullanici_adi:'mert', isim:'Mert',
    foto:null, ulke:null, sehir:null }];
  return bildirimSayisiTazele();
});
await sayfa.waitForTimeout(300);
r = await rozet();
esit('okunmamis 0 -> rozet BOS', r.gizli, true);
esit('okunmamis 0 -> zil sade', r.dolu, false);

/* --- 99'dan fazla --- */
await sayfa.evaluate(function () {
  window.__bildirimler = [];
  for (let i = 0; i < 120; i++) window.__bildirimler.push(
    { id:100+i, tur:'arkadas_istek', sayi:1, okundu:false,
      guncellendi:new Date().toISOString(), kullanici_adi:'mert', isim:'Mert',
      foto:null, ulke:null, sehir:null });
  return bildirimSayisiTazele();
});
await sayfa.waitForTimeout(300);
esit('120 okunmamis -> 99+', (await rozet()).metin, '99+');

process.exit(await ozet('Bildirimler', hatalar));
