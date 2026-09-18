/* Gizlilik (kapali profil), tema gecisi ve paylasim gorseli.
 *
 * Gizlilik neden burada: kapali bir profilin icerigi arayuzde SIZMAMALI.
 * Asil koruma veritabaninda (sqltest/), ama arayuzun de kilitli profili
 * dogru cizdigini bilmemiz lazim -- yanlis cizerse kullanici ayarina
 * guvenemez.
 *
 * Tema: tercih cihazda saklaniyor, yenilemede kaybolmamali.
 * Paylasim: uygulamanin buyume kanali; gorsel uretilmezse kanal yok.
 */
import { kur, esit, dogru, icerir, icermez, ozet } from './ortak.mjs';

const { sayfa, hatalar } = await kur(8203);

/* --- kapali profil ------------------------------------------------------ */
/* Sahte sunucuda mert'i "goremezsin" yapiyoruz. */
await sayfa.evaluate(function () {
  window.__gorebilir = false;
  window.__ark = 'yok';
});
await sayfa.evaluate(function () { return gezginiAc('mert'); });
await sayfa.waitForTimeout(900);

/* Kapali profil ARAMADA cikmali ve sayilari gorunmeli; gizlenen sey
   listeler. Bu bilincli bir karardi, testte de oyle duruyor. */
const profilMetni = await sayfa.evaluate(function () {
  return document.getElementById('profilKart').innerText;
});
icerir('kapali profilde ulke sayisi goruluyor', profilMetni, '2 ülke');
icerir('kapali profilde sehir sayisi goruluyor', profilMetni, '3 şehir');
icerir('kapali profilde kilit aciklamasi var', profilMetni, 'sadece arkadaşlarına');

const gezdimIcerik = await sayfa.evaluate(function () {
  return document.querySelectorAll('#sekmeGezdim .gezgin-ulke').length;
});
esit('kapali profilde gezilen ulke listesi bos', gezdimIcerik, 0);

/* Acinca liste gelmeli — kilidin gercekten ayara bagli oldugunu gorelim */
await sayfa.evaluate(function () { window.__gorebilir = true; });
await sayfa.evaluate(function () { return gezginiAc('mert'); });
await sayfa.waitForTimeout(900);
icermez('acik profilde kilit yazisi yok',
  await sayfa.evaluate(function () {
    return document.getElementById('profilKart').innerText;
  }), 'sadece arkadaşlarına');
esit('acik profilde iki ulke listelendi',
  await sayfa.evaluate(function () {
    return [].slice.call(document.querySelectorAll('#sekmeGezdim .gezgin-ulke span'))
             .map(function (e) { return e.textContent; });
  }), ['Japan', 'Italy']);

await sayfa.evaluate(function () { profilKapat(); });
await sayfa.waitForTimeout(300);

/* --- tema --------------------------------------------------------------- */
esit('varsayilan tema koyu',
  await sayfa.evaluate(function () {
    return document.documentElement.getAttribute('data-tema');
  }), 'koyu');

await sayfa.evaluate(function () { temayiDegistir(true); });
await sayfa.waitForTimeout(300);
esit('acik temaya gecildi',
  await sayfa.evaluate(function () {
    return document.documentElement.getAttribute('data-tema');
  }), 'acik');
esit('tarayici cubugu rengi de degisti',
  await sayfa.evaluate(function () {
    return document.querySelector('meta[name="theme-color"]').getAttribute('content');
  }), '#EEF1F5');

/* Tercih cihazda kalmali */
await sayfa.reload({ waitUntil: 'load' });
await sayfa.waitForTimeout(1300);
esit('yenilemeden sonra tema hatirlandi',
  await sayfa.evaluate(function () {
    return document.documentElement.getAttribute('data-tema');
  }), 'acik');

await sayfa.evaluate(function () { temayiDegistir(false); });
await sayfa.waitForTimeout(300);
esit('koyu temaya geri donuldu',
  await sayfa.evaluate(function () {
    return document.documentElement.getAttribute('data-tema');
  }), 'koyu');

/* --- paylasim gorseli ---------------------------------------------------- */
/* Hikaye 1080x1920, gonderi 1080x1080 olmali. */
const hikaye = await sayfa.evaluate(function () {
  const t = paylasGorselCiz('hikaye');
  return { en: t.width, boy: t.height };
});
esit('hikaye gorseli 1080x1920', hikaye, { en: 1080, boy: 1920 });

const gonderi = await sayfa.evaluate(function () {
  const t = paylasGorselCiz('gonderi');
  return { en: t.width, boy: t.height };
});
esit('gonderi gorseli 1080x1080', gonderi, { en: 1080, boy: 1080 });

/* Gorsel bos olmamali: tuvalde gercekten piksel var mi diye bakiyoruz.
   Bos bir tuval de dogru olculerde olurdu, o yuzden bu ayri bir iddia. */
const doluluk = await sayfa.evaluate(function () {
  const t = paylasGorselCiz('gonderi');
  const d = t.getContext('2d').getImageData(0, 0, t.width, t.height).data;
  let farkli = 0;
  for (let i = 0; i < d.length; i += 4 * 997) {   /* seyrek orneklem */
    if (d[i] !== d[0] || d[i+1] !== d[1] || d[i+2] !== d[2]) farkli++;
  }
  return farkli;
});
dogru('paylasim gorseli bos degil', doluluk > 20, 'farkli piksel sayisi: ' + doluluk);

/* --- profil düğmesindeki avatar -----------------------------------
   Bu kutu .avatar sınıfını taşımıyor; oradaki kırpma kurallarını
   devralmıyor. Bir kez unutuldu ve fotoğrafın sol üst köşesi 44
   piksellik dairede görünüp koyu fotoğrafta daire siyah çıktı.
   Kural kopyalandığı için ayrıca sınanıyor. */
await sayfa.evaluate(function () {
  window.__pfoto = 'test-kullanici/p.jpg';
  return veriYukle();
});
await sayfa.waitForTimeout(700);
const avatarKutu = await sayfa.evaluate(function () {
  const e = document.getElementById('profilFoto');
  const b = getComputedStyle(e);
  return { resim: b.backgroundImage.indexOf('url(') === 0,
           boyut: b.backgroundSize, yer: b.backgroundPosition,
           tekrar: b.backgroundRepeat };
});
dogru('profil düğmesinde fotoğraf var', avatarKutu.resim);
esit('fotoğraf daireye kırpılıyor', avatarKutu.boyut, 'cover');
esit('fotoğraf ortalanıyor', avatarKutu.yer, '50% 50%');
esit('fotoğraf döşenmiyor', avatarKutu.tekrar, 'no-repeat');

process.exit(await ozet('Gizlilik, tema ve paylaşım', hatalar));
