/* =====================================================================
   TRAXPLORE
   Sehir verisi artik bu dosyanin icinde degil, Supabase'de.
   Harita Leaflet degil, WebGL kure (globe.gl).
   ===================================================================== */

const SUPABASE_URL = "https://nfmbutrdhdomgaltneuq.supabase.co";
const SUPABASE_KEY = "sb_publishable_VHpyi0vznoFhj2RaXewyig_Rk0v07tG";
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const GEOJSON_URL =
  "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";

const SAYFA = 60;            // panelde bir seferde kac sehir
const ILK_GORUS = { lat: 30, lng: 15, altitude: 2.5 };   // kurenin acilis konumu
const RENK_GEZILDI  = "#E67E22";
const RENK_BOS      = "#1e2a3a";
const RENK_HOVER    = "#FF8C1A";
const RENK_KENAR    = "#e8e0d0";
const PIN_RENK      = "#0a1018";   // gezilen ulkeler turuncu; pin lacivert olunca beliriyor
const RENK_MISAFIR  = "#48B7C7";   // baska bir gezginin haritasi

/* ---------------------------------------------------------------------
   DURUM
   Tek dogru kaynak burasi. localStorage sadece sunucuya ulasilamadiginda
   ekranin bos kalmamasi icin yedek; veri yeri degil.
   --------------------------------------------------------------------- */
let ulkeKita   = {};                       // { "Turkey": "Asya", ... }
const kitaToplam = {};                     // kitada kac ulke var
let gezilenler = [];                       // [{ulke, sehir}]
let gezilenKoord = {};                     // "ulke|sehir" -> {lat,lng,nufus}
let sehirDetaylari = {};                   // "ulke|sehir" -> {puan,foto,not}
let profilVeri = { isim: "", konum: "", fotolar: [], kullanici_adi: "" };
let profilDuzenleme = false;
let aktifDetay = { ulke: "", sehir: "" };
let aktifUlke  = "";
let panelDurum = { ulke: "", offset: 0, arama: "", toplam: 0 };
/* Baska birinin haritasina bakiliyorsa burasi dolu olur. Kendi
   haritamiza donunce tekrar null. */
let misafir = null;

/* Kita renkleri ve pastadaki SIRA. Ikisi de sabit.
   Eskiden yedi kita da turuncunun tonlariydi; olctugumuzde en yakin iki
   renk arasindaki fark, normal goren bir goz icin bile ayirt edilebilir
   sinirin cok altindaydi, biri de gri gibi okunuyordu. Bunlar koyu zemin
   icin dogrulanmis bir paletten; halka sirasi da komsu dilimler
   birbirine benzemeyecek sekilde secildi.

   Sira nufusa gore degil SABIT: renk kitanin kendisine ait, kacinci
   sirada oldugna degil. Yoksa sen bir sehir ekleyince butun dilimler
   renk degistiriyor. */
const KITA_SIRA = ["Avrupa", "Asya", "Afrika", "Kuzey Amerika",
                   "Güney Amerika", "Okyanusya", "Antarktika"];
const kitaRenk = {
  "Avrupa":        "#d95926",
  "Asya":          "#3987e5",
  "Afrika":        "#e66767",
  "Kuzey Amerika": "#9085e9",
  "Güney Amerika": "#d55181",
  "Okyanusya":     "#c98500",
  "Antarktika":    "#199e70"
};

function yerelYaz(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function yerelOku(k, v) { try { return JSON.parse(localStorage.getItem(k)) || v; } catch (e) { return v; } }
function anahtar(ulke, sehir) { return ulke + "|" + sehir; }
function gezildiMi(ulke, sehir) {
  return gezilenler.some(function (g) { return g.ulke === ulke && g.sehir === sehir; });
}

/* =====================================================================
   KÜRE
   ===================================================================== */
let kure = null;
let ulkeOzellikleri = [];        // GeoJSON feature listesi
let hoverUlke = null;
let pinListesi = [];             // kurede gorunen pinler
let sonYukseklik = 2.5;
let sonEsik = -1;                // en son uygulanan nufus esigi

function kureKur() {
  if (typeof Globe !== "function") {
    document.getElementById("harita").innerHTML =
      "<div class='kure-hata'>Küre kütüphanesi yüklenemedi.<br>" +
      "İnternet bağlantını kontrol edip sayfayı yenile.</div>";
    return;
  }
  uzayCiz();
  kure = Globe()(document.getElementById("harita"))
    // Saydam: arkasindaki yildiz tuvali gorunsun
    .backgroundColor("rgba(0,0,0,0)")
    .showAtmosphere(true)
    .atmosphereColor("#E67E22")
    .atmosphereAltitude(0.18)
    // Yukseklik SABIT. Fareyle uzerine gelince yukseltmek cazip ama
    // pahali: globe.gl yukseklik degisince 180 ulkenin geometrisini
    // bastan kuruyor ve bu her ulke gecisinde tekrarlaniyor. Vurgu icin
    // sadece rengi degistiriyoruz, o geometriye dokunmuyor.
    .polygonsTransitionDuration(0)
    .polygonAltitude(0.013)
    .polygonCapColor(function (d) {
      if (d === hoverUlke) return RENK_HOVER;
      if (!ulkeGezildiMi(d.properties.name)) return RENK_BOS;
      return misafir ? RENK_MISAFIR : RENK_GEZILDI;
    })
    .polygonSideColor(function () { return "#141c28"; })
    .polygonStrokeColor(function () { return RENK_KENAR; })
    .polygonLabel(function (d) {
      const ad = d.properties.name;
      const say = misafir
        ? misafir.sehirler.filter(function (g) { return g.ulke === ad; }).length
        : gezilenler.filter(function (g) { return g.ulke === ad; }).length;
      return "<div class='kure-etiket'>" + kacisla(ad) +
             (say ? "<span>" + say + " şehir</span>" : "") + "</div>";
    })
    .onPolygonHover(function (d) {
      const yeni = d || null;
      if (yeni === hoverUlke) return;
      hoverUlke = yeni;
      document.getElementById("harita").style.cursor = d ? "pointer" : "grab";
      kure.polygonCapColor(kure.polygonCapColor());
    })
    .onPolygonClick(function (d) { panelAc(d.properties.name); })
    .pointsData([])
    .pointLat("lat").pointLng("lng")
    .pointColor(function () { return PIN_RENK; })
    // Yaricap pinBoyutu() tarafindan yakinliga gore ayarlaniyor.
    .pointAltitude(0.0141)
    .pointResolution(14)
    .pointLabel(function (d) { return "<div class='kure-etiket'>" + kacisla(d.sehir) + "</div>"; })
    .onPointClick(function (d) { sehirDetayAc(d.ulke, d.sehir); });

  // NOT: pinlerin altina isik lekesi koymayi denedik, iyi olmadi.
  // Tek tuk sehirde hos duruyor ama 81 il isaretlenince ulke bulanik
  // bir lekeye donuyor. Igne pinler tek basina daha okunur.

  const m = kure.globeMaterial();
  if (m && m.color) { m.color.set("#0b1119"); m.shininess = 4; }

  kure.pointOfView(ILK_GORUS);

  const kontrol = kure.controls();
  kontrol.autoRotate = true;
  kontrol.autoRotateSpeed = 0.28;
  kontrol.enableDamping = true;
  kontrol.minDistance = 130;

  // Kullanici kureye dokununca kendiliginden donmeyi durdur
  const durdur = function () { kontrol.autoRotate = false; };
  document.getElementById("harita").addEventListener("pointerdown", durdur);
  document.getElementById("harita").addEventListener("wheel", durdur, { passive: true });

  let zamanlayici = null;
  kontrol.addEventListener("change", function () {
    pinBoyutu();
    clearTimeout(zamanlayici);
    zamanlayici = setTimeout(yogunlukGuncelle, 120);
  });

  window.addEventListener("resize", function () {
    kure.width(window.innerWidth).height(window.innerHeight);
    uzayCiz();
  });
  kure.width(window.innerWidth).height(window.innerHeight);

  // Fare koordinati. toGlobeCoords sahneye isin gonderip kesisim ariyor;
  // her fare hareketinde cagirmak bosuna yuk. Saniyede ~10 kez yetiyor.
  let koordZaman = 0;
  document.getElementById("harita").addEventListener("mousemove", function (e) {
    const simdi = performance.now();
    if (simdi - koordZaman < 100 || !kure.toGlobeCoords) return;
    koordZaman = simdi;
    const k = kure.toGlobeCoords(e.clientX, e.clientY);
    document.getElementById("koordinat").textContent =
      k ? k.lat.toFixed(2) + " , " + k.lng.toFixed(2) : "— , —";
  });

  fetch(GEOJSON_URL)
    .then(function (c) { return c.json(); })
    .then(function (v) {
      ulkeOzellikleri = sarmayiDuzelt(v.features);
      kure.polygonsData(ulkeOzellikleri);
      kureRenkTazele();
    })
    .catch(function () {
      console.log("Ülke sınırları yüklenemedi.");
    });
}

/* world.geo.json'da 180 ulke sinirindan 179'u bir yone, Bermuda ise
   ters yone sarilmis. Kurede ters sarilmis bir halka "ic taraf disari"
   demek: o tek ulke butun gezegeni kapliyor, uzerine gelince her yer
   turuncu oluyordu. Cogunluk yonunu bulup aykiri olanlari ceviriyoruz. */
function sarmayiDuzelt(ozellikler) {
  function isaretliAlan(h) {
    let s = 0;
    for (let i = 0, j = h.length - 1; i < h.length; j = i++) {
      s += (h[j][0] - h[i][0]) * (h[j][1] + h[i][1]);
    }
    return s / 2;
  }
  function poligonlari(f) {
    return f.geometry.type === "MultiPolygon"
      ? f.geometry.coordinates : [f.geometry.coordinates];
  }
  let arti = 0, eksi = 0;
  for (let i = 0; i < ozellikler.length; i++) {
    const p = poligonlari(ozellikler[i]);
    for (let j = 0; j < p.length; j++) (isaretliAlan(p[j][0]) > 0 ? arti++ : eksi++);
  }
  const dogru = arti > eksi ? 1 : -1;
  let duzeltilen = 0;
  const sonuc = ozellikler.map(function (f) {
    const cok = f.geometry.type === "MultiPolygon";
    let degisti = false;
    const yeni = poligonlari(f).map(function (halkalar) {
      if ((isaretliAlan(halkalar[0]) > 0 ? 1 : -1) === dogru) return halkalar;
      degisti = true;
      return [halkalar[0].slice().reverse()].concat(halkalar.slice(1));
    });
    if (!degisti) return f;
    duzeltilen++;
    return { type: "Feature", properties: f.properties,
             geometry: { type: f.geometry.type, coordinates: cok ? yeni : yeni[0] } };
  });
  if (duzeltilen) console.log("Ters sarılmış " + duzeltilen + " ülke sınırı düzeltildi.");
  return sonuc;
}


/* ---------------------------------------------------------------------
   UZAY ARKA PLANI
   Yildizlari hazir bir goruntu dosyasi yerine bir kez tuvale ciziyoruz:
   ne indirilecek dosya var ne de sayfaya gomulu kocaman veri. Sabit,
   hicbir animasyon yok; sadece pencere boyutu degisince yeniden ciziliyor.
   --------------------------------------------------------------------- */
function uzayCiz() {
  let tuval = document.getElementById("uzay");
  if (!tuval) {
    tuval = document.createElement("canvas");
    tuval.id = "uzay";
    document.body.insertBefore(tuval, document.body.firstChild);
  }
  const g = tuval.getContext("2d");
  const e = window.innerWidth, y = window.innerHeight;
  const oran = Math.min(window.devicePixelRatio || 1, 2);
  tuval.width = Math.round(e * oran); tuval.height = Math.round(y * oran);
  g.setTransform(oran, 0, 0, oran, 0, 0);

  // derin zemin
  const zemin = g.createLinearGradient(0, 0, e, y);
  zemin.addColorStop(0, "#070b12");
  zemin.addColorStop(0.55, "#050810");
  zemin.addColorStop(1, "#03060b");
  g.fillStyle = zemin; g.fillRect(0, 0, e, y);

  // iki soluk bulutsu
  function bulutsu(x, b, r, renk) {
    const d = g.createRadialGradient(x, b, 0, x, b, r);
    d.addColorStop(0, renk); d.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = d; g.fillRect(x - r, b - r, r * 2, r * 2);
  }
  bulutsu(e * 0.18, y * 0.22, Math.max(e, y) * 0.45, "rgba(60,95,160,0.16)");
  bulutsu(e * 0.85, y * 0.78, Math.max(e, y) * 0.40, "rgba(165,85,40,0.13)");

  // yildizlar — yogunluk ekran alanina gore
  const adet = Math.round(e * y / 1300);
  for (let i = 0; i < adet; i++) {
    const x = Math.random() * e, b = Math.random() * y;
    const t = Math.random();
    const r = t > 0.985 ? 1.6 + Math.random() * 0.6
            : t > 0.90  ? 0.9 + Math.random() * 0.5
            :             0.35 + Math.random() * 0.5;
    const parlaklik = t > 0.90 ? 0.65 + Math.random() * 0.35 : 0.28 + Math.random() * 0.45;
    // birkacini sicak tonlu birak, hepsi bembeyaz olmasin
    const renk = Math.random() < 0.07 ? "255,217,160"
               : Math.random() < 0.12 ? "175,205,255" : "232,240,255";
    if (r > 1.5) {                       // parlak olanlara hafif hale
      const h = g.createRadialGradient(x, b, 0, x, b, r * 5);
      h.addColorStop(0, "rgba(" + renk + ",0.22)");
      h.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = h; g.beginPath(); g.arc(x, b, r * 5, 0, Math.PI * 2); g.fill();
    }
    g.fillStyle = "rgba(" + renk + "," + parlaklik.toFixed(2) + ")";
    g.beginPath(); g.arc(x, b, r, 0, Math.PI * 2); g.fill();
  }
}

function ulkeGezildiMi(ad) {
  if (misafir) return misafir.ulkeler.has(ad);
  for (let i = 0; i < gezilenler.length; i++) if (gezilenler[i].ulke === ad) return true;
  return false;
}

function kureRenkTazele() {
  if (!kure) return;
  kure.polygonCapColor(kure.polygonCapColor());
}

/* Uzaklastikca az, yakinlastikca cok pin.
   Nufus esigi yukseklige gore degisiyor: kureye tepeden bakarken
   sadece buyuk sehirler, yaklasinca hepsi. */
function yogunlukGuncelle(zorla) {
  if (!kure) return;
  const gorus = kure.pointOfView();
  sonYukseklik = gorus.altitude;
  const h = gorus.altitude;
  let esik;
  if (h > 2.0)      esik = 1500000;
  else if (h > 1.2) esik = 600000;
  else if (h > 0.7) esik = 200000;
  else if (h > 0.4) esik = 60000;
  else              esik = 0;

  // Kure kendiliginden donerken "change" olayi saniyede defalarca
  // tetikleniyor. Esik degismediyse pinlere hic dokunmuyoruz; yoksa
  // isik halkalarinin animasyonu her seferinde bastan basliyor ve
  // ekranda titreme olarak gorunuyor.
  if (!zorla && esik === sonEsik) return;
  sonEsik = esik;

  const tum = [];
  if (misafir) {
    for (let i = 0; i < misafir.sehirler.length; i++) {
      const s = misafir.sehirler[i];
      if (s.enlem == null) continue;
      tum.push({ ulke: s.ulke, sehir: s.sehir, lat: s.enlem, lng: s.boylam, nufus: s.nufus || 0 });
    }
  } else {
    for (let i = 0; i < gezilenler.length; i++) {
      const g = gezilenler[i];
      const k = gezilenKoord[anahtar(g.ulke, g.sehir)];
      if (k) tum.push({ ulke: g.ulke, sehir: g.sehir, lat: k.lat, lng: k.lng, nufus: k.nufus });
    }
  }
  let secim = tum.filter(function (p) { return p.nufus >= esik; });
  // Cok az kaldiysa yine de en buyuk 12 tanesini goster
  if (secim.length < 12) {
    secim = tum.slice().sort(function (a, b) { return b.nufus - a.nufus; }).slice(0, 12);
  }
  pinListesi = secim;
  kure.pointsData(secim);
  pinBoyutu();
}

/* Pinler kucuk birer nokta. Iki nokta onemli:
   1. Yaricap "acisal derece" cinsinden, yani cografi olarak sabit —
      ekranda sabit gorunmeleri icin kamera yuksekligiyle orantili
      olmalari gerekiyor. Yoksa yaklastikca sisiyorlar.
   2. Yukseklik SABIT ve ulke katmaninin (0.013) hemen ustunde. Daha
      alcak olursa poligonun icinde kalip gorunmuyor, daha yuksek
      olursa yandan bakinca cubuk gibi uzuyor. */
function pinBoyutu() {
  if (!kure) return;
  const h = kure.pointOfView().altitude;
  kure.pointRadius(Math.max(0.012, Math.min(0.50, 0.11 * h)));
}

function pinleriTazele() { yogunlukGuncelle(true); }

function kureyeGit(lat, lng, yakin) {
  if (!kure) return;
  kure.controls().autoRotate = false;
  kure.pointOfView({ lat: lat, lng: lng, altitude: yakin ? 0.55 : 1.4 }, 900);
}

/* =====================================================================
   YARDIMCI
   ===================================================================== */
function kacisla(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function yedekFoto(ad) {
  return "https://placehold.co/400x200/1a1a1a/E67E22?text=" + encodeURIComponent(ad);
}

/* =====================================================================
   ÜLKELER
   ===================================================================== */
async function ulkeleriYukle() {
  const { data, error } = await db.from("ulkeler").select("ad,kita");
  if (error || !data) {
    ulkeKita = yerelOku("ulkeKita", {});
    return;
  }
  ulkeKita = {};
  for (let i = 0; i < data.length; i++) ulkeKita[data[i].ad] = data[i].kita;
  yerelYaz("ulkeKita", ulkeKita);
  for (const k in kitaToplam) delete kitaToplam[k];
  for (const u in ulkeKita) kitaToplam[ulkeKita[u]] = (kitaToplam[ulkeKita[u]] || 0) + 1;
}

/* =====================================================================
   PANEL — bir ülkenin şehirleri
   ===================================================================== */

/* =====================================================================
   BASKA BIR GEZGININ HARITASI
   Kure gecici olarak onun gezdiklerini gosteriyor (farkli renkte),
   ustte kimin haritasina baktigini yazan bir bar cikiyor. Cikinca
   her sey kendi haritana donuyor.
   ===================================================================== */
async function gezginiAc(kullaniciAdi) {
  const [{ data: profil, error: ph },
         { data: harita, error: hh },
         { data: fotolar }] = await Promise.all([
    db.rpc("gezgin_profil",      { p_kullanici_adi: kullaniciAdi }),
    db.rpc("gezgin_haritasi",    { p_kullanici_adi: kullaniciAdi }),
    db.rpc("gezgin_fotograflari",{ p_kullanici_adi: kullaniciAdi })
  ]);
  if (ph || hh || !profil || !profil.length) {
    console.log("Gezgin acilamadi", ph || hh);
    return;
  }
  const p = profil[0];
  misafir = {
    kullanici_adi: p.kullanici_adi,
    isim: p.isim,
    konum: p.konum,
    kita: p.kita_sayisi, ulke: p.ulke_sayisi, sehirSayisi: p.sehir_sayisi,
    benim: p.benim,
    arkadaslik: p.arkadaslik || "yok",
    sehirler: harita || [],
    ulkeler: new Set((harita || []).map(function (r) { return r.ulke; })),
    fotolar: fotolar || []
  };
  misafirBariGoster();
  kureRenkTazele();
  pinleriTazele();
  gezginPaneli();
}

function misafirdenCik() {
  if (!misafir) return;
  misafir = null;
  const bar = document.getElementById("misafirBar");
  if (bar) bar.remove();
  hepsiniKapat();
  kureRenkTazele();
  pinleriTazele();
  kureyiSifirla();
}

function misafirBariGoster() {
  let bar = document.getElementById("misafirBar");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "misafirBar";
    document.body.appendChild(bar);
  }
  bar.innerHTML = "";
  const yazi = document.createElement("span");
  yazi.textContent = "@" + misafir.kullanici_adi + " haritasına bakıyorsun";
  const cik = document.createElement("button");
  cik.textContent = "kendi haritama dön";
  cik.addEventListener("click", misafirdenCik);
  bar.appendChild(yazi); bar.appendChild(cik);
}

/* Gezginin profili sagdaki panele ciziliyor: sayilar, herkese acik
   fotograflari ve gittigi ulkeler. */
async function gezginPaneli() {
  if (!misafir) return;
  document.getElementById("panelBaslik").textContent = "@" + misafir.kullanici_adi;
  document.getElementById("panelAltBaslik").textContent =
    (misafir.isim || "") + (misafir.konum ? " — " + misafir.konum : "");

  const arama = document.getElementById("panelArama");
  if (arama) arama.style.display = "none";
  const eski = document.getElementById("dahaFazla");
  if (eski) eski.remove();

  const liste = document.getElementById("sehirListe");
  liste.innerHTML = "";
  liste.style.display = "block";

  const sayilar = document.createElement("div");
  sayilar.className = "gezgin-sayilar";
  sayilar.innerHTML =
    "<b>" + misafir.kita + "</b> kıta <b>" + misafir.ulke + "</b> ülke <b>" +
    misafir.sehirSayisi + "</b> şehir";
  liste.appendChild(sayilar);

  if (!misafir.benim) liste.appendChild(arkadaslikDugmesi());

  if (misafir.fotolar.length) {
    const bas = document.createElement("div");
    bas.className = "gezgin-baslik"; bas.textContent = "FOTOĞRAFLARI";
    liste.appendChild(bas);
    const izgara = document.createElement("div");
    izgara.className = "foto-izgara";
    liste.appendChild(izgara);
    const adres = await imzaliAdresler(misafir.fotolar.map(function (f) { return f.yol; }));
    if (!misafir) return;
    for (let i = 0; i < misafir.fotolar.length; i++) {
      const f = misafir.fotolar[i];
      const kart = document.createElement("div");
      kart.className = "foto-kart";
      const im = document.createElement("img");
      im.loading = "lazy";
      if (adres[f.yol]) im.src = adres[f.yol];
      kart.appendChild(im);
      const yer = document.createElement("span");
      yer.className = "foto-sahip";
      yer.textContent = f.sehir;
      kart.appendChild(yer);
      kart.addEventListener("click", function () {
        const s = misafir.sehirler.find(function (x) {
          return x.ulke === f.ulke && x.sehir === f.sehir; });
        if (s && s.enlem != null) kureyeGit(s.enlem, s.boylam, true);
      });
      izgara.appendChild(kart);
    }
  }

  const bas2 = document.createElement("div");
  bas2.className = "gezgin-baslik"; bas2.textContent = "GEZDİĞİ ÜLKELER";
  liste.appendChild(bas2);

  const sayim = {};
  for (let i = 0; i < misafir.sehirler.length; i++) {
    const u = misafir.sehirler[i].ulke;
    sayim[u] = (sayim[u] || 0) + 1;
  }
  const kutu = document.createElement("div");
  kutu.className = "gezgin-ulkeler";
  Object.keys(sayim).sort(function (a, b) { return sayim[b] - sayim[a]; })
    .forEach(function (u) {
      const sat = document.createElement("div");
      sat.className = "gezgin-ulke";
      sat.innerHTML = "<span>" + kacisla(u) + "</span><b>" + sayim[u] + "</b>";
      sat.addEventListener("click", function () {
        const s = misafir.sehirler.find(function (x) { return x.ulke === u && x.enlem != null; });
        if (s) kureyeGit(s.enlem, s.boylam, false);
        panelAc(u);
      });
      kutu.appendChild(sat);
    });
  liste.appendChild(kutu);

  document.getElementById("panel").classList.add("acik");
  document.getElementById("harita").classList.add("itili");
}

function panelAc(ulkeAdi) {
  const arama = document.getElementById("panelArama");
  if (arama) arama.style.display = "";
  document.getElementById("sehirListe").style.display = "";
  aktifUlke = ulkeAdi;
  panelDurum = { ulke: ulkeAdi, offset: 0, arama: "", toplam: 0 };
  document.getElementById("panelBaslik").textContent = ulkeAdi;
  const liste = document.getElementById("sehirListe");
  liste.innerHTML = "<p class='panel-durum'>Yükleniyor…</p>";
  panelAramaKutusu();
  document.getElementById("panel").classList.add("acik");
  document.getElementById("harita").classList.add("itili");
  sehirleriGetir(true);
}

function panelAramaKutusu() {
  let kutu = document.getElementById("panelArama");
  if (!kutu) {
    kutu = document.createElement("input");
    kutu.id = "panelArama";
    kutu.type = "text";
    kutu.placeholder = "Bu ülkede şehir ara…";
    kutu.autocomplete = "off";
    document.getElementById("sehirListe").before(kutu);
    let bekle = null;
    kutu.addEventListener("input", function () {
      clearTimeout(bekle);
      bekle = setTimeout(function () {
        panelDurum.arama = kutu.value.trim();
        panelDurum.offset = 0;
        sehirleriGetir(true);
      }, 250);
    });
  }
  kutu.value = "";
}

async function sehirleriGetir(bastan) {
  const ulkeAdi = panelDurum.ulke;
  const liste = document.getElementById("sehirListe");
  if (bastan) liste.innerHTML = "<p class='panel-durum'>Yükleniyor…</p>";

  const [{ data, error }, sayi] = await Promise.all([
    db.rpc("ulke_sehirleri", {
      p_ulke: ulkeAdi, p_limit: SAYFA,
      p_offset: panelDurum.offset, p_arama: panelDurum.arama || null
    }),
    db.rpc("ulke_sehir_sayisi", { p_ulke: ulkeAdi, p_arama: panelDurum.arama || null })
  ]);

  if (panelDurum.ulke !== ulkeAdi) return;         // kullanici baska ulkeye gecti
  if (error) {
    liste.innerHTML = "<p class='panel-durum'>Şehirler yüklenemedi.</p>";
    return;
  }
  panelDurum.toplam = sayi.data || 0;
  if (bastan) liste.innerHTML = "";
  const eski = document.getElementById("dahaFazla");
  if (eski) eski.remove();

  if (!data.length && bastan) {
    liste.innerHTML = "<p class='panel-durum'>Sonuç yok.</p>";
    return;
  }

  const parca = document.createDocumentFragment();
  for (let i = 0; i < data.length; i++) parca.appendChild(sehirKarti(ulkeAdi, data[i]));
  liste.appendChild(parca);

  panelDurum.offset += data.length;
  if (panelDurum.offset < panelDurum.toplam) {
    const btn = document.createElement("button");
    btn.id = "dahaFazla";
    btn.textContent = "Daha fazla (" + (panelDurum.toplam - panelDurum.offset) + " şehir)";
    btn.addEventListener("click", function () {
      btn.disabled = true;
      sehirleriGetir(false);
    });
    liste.after(btn);
  }
  fotolariTamamla(data, ulkeAdi);
}

function sehirKarti(ulkeAdi, s) {
  // Misafir modunda "gittim" dugmesi yok; onun gittigi sehirler
  // isaretli gorunuyor, kimse baskasinin haritasini degistiremiyor.
  const secili = misafir
    ? misafir.sehirler.some(function (x) { return x.ulke === ulkeAdi && x.sehir === s.ad; })
    : gezildiMi(ulkeAdi, s.ad);
  const kart = document.createElement("div");
  kart.className = "sehir-kart" + (secili ? " secili" : "");
  if (!misafir) kart.addEventListener("click", function () { sehirDetayAc(ulkeAdi, s.ad); });

  if (misafir) {
    if (secili) {
      const im = document.createElement("span");
      im.className = "gittim-btn aktif misafir";
      im.textContent = "✓";
      kart.appendChild(im);
    }
  } else {
    const btn = document.createElement("button");
    btn.className = "gittim-btn" + (secili ? " aktif" : "");
    btn.textContent = secili ? "✓" : "+";
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      sehirSec(btn, ulkeAdi, s);
    });
    kart.appendChild(btn);
  }

  const d = sehirDetaylari[anahtar(ulkeAdi, s.ad)];
  if (d && d.puan) {
    const p = document.createElement("div");
    p.className = "kart-puan";
    let y = "";
    for (let i = 0; i < 5; i++) y += (i < d.puan) ? "★" : "☆";
    p.textContent = y;
    kart.appendChild(p);
  }

  const img = document.createElement("img");
  img.alt = s.ad;
  img.loading = "lazy";
  img.src = s.foto || yedekFoto(s.ad);
  img.addEventListener("error", function () { img.src = yedekFoto(s.ad); });
  img.dataset.sehirId = s.id;
  kart.appendChild(img);

  const bilgi = document.createElement("div");
  bilgi.className = "sehir-bilgi";
  const ad = document.createElement("div");
  ad.className = "sehir-ad";
  ad.textContent = s.ad;
  const alt = document.createElement("div");
  alt.className = "sehir-aciklama";
  alt.textContent = s.nufus ? s.nufus.toLocaleString("tr-TR") + " kişi" : "";
  bilgi.appendChild(ad); bilgi.appendChild(alt);
  kart.appendChild(bilgi);
  return kart;
}

/* Fotografi olmayan sehirler icin Wikipedia'ya sor, bulunani veritabanina
   yaz. Ikinci acilista hic istek gitmiyor. Ayni anda en fazla 3 istek. */
let fotoKuyruk = [];
let fotoCalisan = 0;
function fotolariTamamla(satirlar, ulkeAdi) {
  for (let i = 0; i < satirlar.length; i++) {
    const s = satirlar[i];
    if (s.foto || s.arandi) continue;
    fotoKuyruk.push({ id: s.id, ad: s.ad, ulke: ulkeAdi });
  }
  fotoKuyruguIslet();
}
function fotoKuyruguIslet() {
  while (fotoCalisan < 3 && fotoKuyruk.length) {
    const is = fotoKuyruk.shift();
    fotoCalisan++;
    wikiFotoBul(is.ad, is.ulke, function (foto) {
      fotoCalisan--;
      const img = document.querySelector("img[data-sehir-id='" + is.id + "']");
      if (foto && img) img.src = foto;
      db.rpc("sehir_foto_yaz", { p_id: is.id, p_foto: foto || null })
        .then(function () {}, function () {});
      fotoKuyruguIslet();
    });
  }
}

function paneliKapat() {
  document.getElementById("panel").classList.remove("acik");
  document.getElementById("harita").classList.remove("itili");
  fotoKuyruk = [];
}

/* =====================================================================
   ŞEHİR SEÇME
   ===================================================================== */
async function sehirSec(btn, ulke, s) {
  const kart = btn.closest(".sehir-kart");
  const varMi = gezildiMi(ulke, s.ad);
  const { data: oturum } = await db.auth.getSession();
  const kul = oturum.session ? oturum.session.user.id : null;

  if (!varMi) {
    gezilenler.push({ ulke: ulke, sehir: s.ad });
    gezilenKoord[anahtar(ulke, s.ad)] = { lat: s.enlem, lng: s.boylam, nufus: s.nufus || 0 };
    if (kart) kart.classList.add("secili");
    btn.classList.add("aktif"); btn.textContent = "✓";
    if (kul) {
      const { error } = await db.from("gezilenler")
        .insert({ user_id: kul, ulke: ulke, sehir: s.ad });
      if (error) console.log("yazma hatası:", error.message);
    }
  } else {
    gezilenler = gezilenler.filter(function (g) {
      return !(g.ulke === ulke && g.sehir === s.ad);
    });
    delete gezilenKoord[anahtar(ulke, s.ad)];
    if (kart) kart.classList.remove("secili");
    btn.classList.remove("aktif"); btn.textContent = "+";
    if (kul) {
      const { error } = await db.from("gezilenler").delete()
        .eq("user_id", kul).eq("ulke", ulke).eq("sehir", s.ad);
      if (error) console.log("silme hatası:", error.message);
    }
  }
  yerelYaz("gezilenler", gezilenler);
  istatistikGuncelle();
  gecmisGuncelle();
  kitaChartCiz();
  kureRenkTazele();
  pinleriTazele();
}

/* =====================================================================
   İSTATİSTİK
   ===================================================================== */
function istatistikGuncelle() {
  const ulkeler = [], kitalar = [];
  for (let i = 0; i < gezilenler.length; i++) {
    if (ulkeler.indexOf(gezilenler[i].ulke) === -1) ulkeler.push(gezilenler[i].ulke);
    const k = ulkeKita[gezilenler[i].ulke];
    if (k && kitalar.indexOf(k) === -1) kitalar.push(k);
  }
  document.getElementById("istatistik").textContent =
    kitalar.length + " Kıta — " + ulkeler.length + " Ülke — " + gezilenler.length + " Şehir gezdin";
}

/* =====================================================================
   GEÇMİŞ
   ===================================================================== */
function gecmisGuncelle() {
  const liste = document.getElementById("gecmisListe");
  liste.innerHTML = "";
  const sira = [];
  for (let i = gezilenler.length - 1; i >= 0; i--) {
    const u = gezilenler[i].ulke;
    if (sira.indexOf(u) === -1) sira.push(u);
  }
  const parca = document.createDocumentFragment();
  for (let i = 0; i < Math.min(sira.length, 8); i++) {
    const u = sira[i];
    const sehirler = gezilenler.filter(function (g) { return g.ulke === u; });
    const kutu = document.createElement("div");
    kutu.className = "gecmis-ulke";
    const bas = document.createElement("div");
    bas.className = "gecmis-ulke-ad";
    bas.innerHTML = "<span class='gecmis-ok'>›</span> " + kacisla(u) +
                    " <span style='opacity:.6'>(" + sehirler.length + ")</span>";
    bas.addEventListener("click", function () { kutu.classList.toggle("acik"); });
    kutu.appendChild(bas);
    const alt = document.createElement("div");
    alt.className = "gecmis-sehirler";
    for (let j = sehirler.length - 1; j >= 0; j--) {
      const sh = sehirler[j].sehir;
      const sat = document.createElement("div");
      sat.className = "gecmis-sehir";
      sat.textContent = sh;
      sat.addEventListener("click", function () {
        const k = gezilenKoord[anahtar(u, sh)];
        if (k) kureyeGit(k.lat, k.lng, true);
        sehirDetayAc(u, sh);
      });
      alt.appendChild(sat);
    }
    kutu.appendChild(alt);
    parca.appendChild(kutu);
  }
  liste.appendChild(parca);
}

/* =====================================================================
   KITA GRAFİĞİ
   ===================================================================== */
function kitaChartCiz() {
  const svg = document.getElementById("kitaSvg");
  const lejant = document.getElementById("kitaLejant");
  if (!svg) return;
  svg.innerHTML = ""; lejant.innerHTML = "";

  const sayim = {};
  const gorulen = [];
  for (let i = 0; i < gezilenler.length; i++) {
    const u = gezilenler[i].ulke;
    if (gorulen.indexOf(u) !== -1) continue;
    gorulen.push(u);
    const k = ulkeKita[u];
    if (k) sayim[k] = (sayim[k] || 0) + 1;
  }
  const kitalar = KITA_SIRA.filter(function (k) { return sayim[k]; });
  const toplam = kitalar.reduce(function (t, k) { return t + sayim[k]; }, 0);

  const ns = "http://www.w3.org/2000/svg";
  const MERKEZ = 100, YARICAP = 88;

  if (!toplam) {
    const bos = document.createElementNS(ns, "circle");
    bos.setAttribute("cx", MERKEZ); bos.setAttribute("cy", MERKEZ);
    bos.setAttribute("r", YARICAP);
    bos.setAttribute("fill", "#16202c");
    svg.appendChild(bos);
    lejant.innerHTML = "<div class='lejant-satir' style='opacity:.6'>Henüz gezilen yok</div>";
    return;
  }

  // Tek kita varsa yay komutu ile tam cember cizilemez (baslangic ve bitis
  // noktasi ayni yere denk gelir), dolu daire ciziyoruz.
  if (kitalar.length === 1) {
    const d = document.createElementNS(ns, "circle");
    d.setAttribute("cx", MERKEZ); d.setAttribute("cy", MERKEZ);
    d.setAttribute("r", YARICAP);
    d.setAttribute("fill", kitaRenk[kitalar[0]] || "#888");
    svg.appendChild(d);
  } else {
    let aci = -Math.PI / 2;                       // saat 12'den basla
    for (let i = 0; i < kitalar.length; i++) {
      const k = kitalar[i];
      const pay = sayim[k] / toplam;
      const bitis = aci + pay * Math.PI * 2;
      const x1 = MERKEZ + YARICAP * Math.cos(aci),   y1 = MERKEZ + YARICAP * Math.sin(aci);
      const x2 = MERKEZ + YARICAP * Math.cos(bitis), y2 = MERKEZ + YARICAP * Math.sin(bitis);
      const buyuk = pay > 0.5 ? 1 : 0;
      const dilim = document.createElementNS(ns, "path");
      dilim.setAttribute("d",
        "M " + MERKEZ + " " + MERKEZ +
        " L " + x1.toFixed(2) + " " + y1.toFixed(2) +
        " A " + YARICAP + " " + YARICAP + " 0 " + buyuk + " 1 " +
        x2.toFixed(2) + " " + y2.toFixed(2) + " Z");
      dilim.setAttribute("fill", kitaRenk[k] || "#888");
      dilim.setAttribute("stroke", "#1e2a3a");     // dilimler ayrissin
      dilim.setAttribute("stroke-width", "2");
      svg.appendChild(dilim);
      aci = bitis;
    }
  }

  for (let i = 0; i < kitalar.length; i++) {
    const k = kitalar[i];
    const pay = sayim[k] / toplam;
    const sat = document.createElement("div");
    sat.className = "lejant-satir";
    sat.innerHTML = "<span class='lejant-renk' style='background:" + (kitaRenk[k] || "#888") + "'></span>" +
                    kacisla(k) + "<span class='lejant-yuzde'>" + Math.round(pay * 100) + "%</span>";
    lejant.appendChild(sat);
  }

  svg.classList.remove("donuyor");
  void svg.offsetWidth;
  svg.classList.add("donuyor");
}

function istatistikPaneliDoldur() {
  const kutu = document.getElementById("kitaBarListe");
  kutu.innerHTML = "";
  const sayim = {}, gorulen = [];
  for (let i = 0; i < gezilenler.length; i++) {
    const u = gezilenler[i].ulke;
    if (gorulen.indexOf(u) !== -1) continue;
    gorulen.push(u);
    const k = ulkeKita[u];
    if (k) sayim[k] = (sayim[k] || 0) + 1;
  }
  const kitalar = KITA_SIRA.filter(function (k) { return kitaToplam[k]; });
  for (let i = 0; i < kitalar.length; i++) {
    const k = kitalar[i];
    const git = sayim[k] || 0;
    const tum = kitaToplam[k] || 1;
    const yuzde = Math.round(git / tum * 100);
    const sat = document.createElement("div");
    sat.className = "bar-satir";
    sat.innerHTML =
      "<div class='bar-ust'><span>" + kacisla(k) + "</span>" +
      "<span class='bar-yuzde'>" + git + "/" + tum + " — %" + yuzde + "</span></div>" +
      "<div class='bar-dis'><div class='bar-ic' style='width:" + yuzde + "%;background:" +
      (kitaRenk[k] || "#888") + "'></div></div>";
    kutu.appendChild(sat);
  }
}
function istatistikPaneliAc() {
  istatistikPaneliDoldur();
  document.getElementById("istatistikPanel").classList.add("acik");
}
function istatistikPaneliKapat() {
  document.getElementById("istatistikPanel").classList.remove("acik");
}

/* =====================================================================
   ŞEHİR DETAY
   ===================================================================== */
let seciliPuan = 0;

async function sehirDetayAc(ulke, sehir) {
  aktifDetay = { ulke: ulke, sehir: sehir };
  document.getElementById("sehirDetayBaslik").textContent = sehir;

  const kapak = document.getElementById("sehirKapak");
  kapak.style.display = "none";
  db.rpc("ulke_sehirleri", { p_ulke: ulke, p_limit: 1, p_offset: 0, p_arama: sehir })
    .then(function (r) {
      const s = r.data && r.data[0];
      if (s && s.foto && aktifDetay.sehir === sehir) {
        kapak.src = s.foto; kapak.style.display = "block";
      }
    });

  const d = sehirDetaylari[anahtar(ulke, sehir)] || { puan: 0, not: "" };
  yildizGoster(d.puan || 0);
  document.getElementById("sehirNot").value = d.not || "";
  fotoAlaniHazirla();
  document.getElementById("sehirFotoOnizle").innerHTML = "";
  const dk = document.getElementById("digerFotolar");
  if (dk) dk.innerHTML = "";
  fotoDurum("");
  fotolariGoster();

  const gitti = gezildiMi(ulke, sehir);
  document.getElementById("detayGovde").style.display = gitti ? "block" : "none";
  document.getElementById("kilitUyari").style.display = gitti ? "none" : "block";

  document.getElementById("panel").classList.remove("acik");
  document.getElementById("sehirDetayPanel").classList.add("acik");
  document.getElementById("harita").classList.add("itili");
}


/* =====================================================================
   GEZGIN FOTOGRAFLARI
   Dosya Storage kovasinda, kayit sehir_fotolari tablosunda. Kova kapali
   oldugu icin gostermek icin sureli "imzali adres" aliyoruz — boylece
   "gizli" gercekten gizli, adresi bilen bile goremiyor.
   ===================================================================== */
const KOVA = "sehir-fotolari";
const FOTO_SINIR = 3;
let fotoMesgul = false;

/* Telefon fotografi 4-8 MB olabiliyor. Yuklemeden once tarayicida
   kucultuyoruz: uzun kenar 1600 px, JPEG. Sonuc ~300 KB. */
function fotoKucult(dosya) {
  return new Promise(function (coz, hata) {
    const oku = new FileReader();
    oku.onerror = function () { hata(new Error("Dosya okunamadi")); };
    oku.onload = function (e) {
      const im = new Image();
      im.onerror = function () { hata(new Error("Gorsel acilamadi")); };
      im.onload = function () {
        const EN_BUYUK = 1600;
        let g = im.width, y = im.height;
        if (Math.max(g, y) > EN_BUYUK) {
          const k = EN_BUYUK / Math.max(g, y);
          g = Math.round(g * k); y = Math.round(y * k);
        }
        const tuval = document.createElement("canvas");
        tuval.width = g; tuval.height = y;
        tuval.getContext("2d").drawImage(im, 0, 0, g, y);
        tuval.toBlob(function (blob) {
          if (blob) coz(blob); else hata(new Error("Donusturulemedi"));
        }, "image/jpeg", 0.82);
      };
      im.src = e.target.result;
    };
    oku.readAsDataURL(dosya);
  });
}

function fotoDurum(metin) {
  const el = document.getElementById("fotoDurum");
  if (el) el.textContent = metin || "";
}

async function fotoEkle(dosya) {
  if (fotoMesgul) return;
  const { data: oturum } = await db.auth.getSession();
  if (!oturum.session) { fotoDurum("Once giris yapmalisin."); return; }
  const ulke = aktifDetay.ulke, sehir = aktifDetay.sehir;

  fotoMesgul = true;
  fotoDurum("Fotograf hazirlaniyor…");
  let blob;
  try { blob = await fotoKucult(dosya); }
  catch (e) { fotoMesgul = false; fotoDurum("Bu dosya acilamadi."); return; }

  const yol = oturum.session.user.id + "/" +
              (crypto.randomUUID ? crypto.randomUUID() : Date.now() + "-" + Math.random().toString(36).slice(2)) +
              ".jpg";

  fotoDurum("Yukleniyor…");
  const { error: yuklemeHatasi } = await db.storage.from(KOVA)
    .upload(yol, blob, { contentType: "image/jpeg", upsert: false });
  if (yuklemeHatasi) {
    fotoMesgul = false; fotoDurum("Yuklenemedi: " + yuklemeHatasi.message); return;
  }

  const { error: kayitHatasi } = await db.from("sehir_fotolari")
    .insert({ user_id: oturum.session.user.id, ulke: ulke, sehir: sehir, yol: yol });
  if (kayitHatasi) {
    // Kayit tutmadiysa (ornegin 3 sinirina takildiysa) dosyayi geri al,
    // yoksa kovada sahipsiz dosya kalir.
    await db.storage.from(KOVA).remove([yol]);
    fotoMesgul = false;
    fotoDurum(/en fazla 3/i.test(kayitHatasi.message)
      ? "Bir sehre en fazla 3 fotograf ekleyebilirsin."
      : "Kaydedilemedi: " + kayitHatasi.message);
    return;
  }

  fotoMesgul = false; fotoDurum("");
  if (aktifDetay.ulke === ulke && aktifDetay.sehir === sehir) fotolariGoster();
}

async function fotoSil(id, yol) {
  if (!confirm("Bu fotograf silinsin mi?")) return;
  // Once kaydi siliyoruz: kullanici aninda kaybolmus gormeli. Dosya
  // silinemezse kovada sahipsiz kalir, zararsiz; temizlik sorgusu var.
  const { error } = await db.from("sehir_fotolari").delete().eq("id", id);
  if (error) { fotoDurum("Silinemedi: " + error.message); return; }
  await db.storage.from(KOVA).remove([yol]);
  fotolariGoster();
}

async function fotoGorunurluk(id, yeni) {
  const { error } = await db.from("sehir_fotolari")
    .update({ gorunurluk: yeni }).eq("id", id);
  if (error) { fotoDurum("Degistirilemedi: " + error.message); return; }
  fotolariGoster();
}

/* Kapali kovadaki dosyalar icin toplu imzali adres. Tek istek, hepsi
   birden — fotograf basina ayri istek atmiyoruz. */
async function imzaliAdresler(yollar) {
  const harita = {};
  if (!yollar.length) return harita;
  const { data, error } = await db.storage.from(KOVA).createSignedUrls(yollar, 3600);
  if (error || !data) return harita;
  for (let i = 0; i < data.length; i++) {
    if (data[i].signedUrl) harita[data[i].path] = data[i].signedUrl;
  }
  return harita;
}

async function fotolariGoster() {
  const ulke = aktifDetay.ulke, sehir = aktifDetay.sehir;
  const kutu = document.getElementById("sehirFotoOnizle");
  const digerKutu = document.getElementById("digerFotolar");
  if (!kutu) return;

  const { data, error } = await db.rpc("sehir_fotograflari", { p_ulke: ulke, p_sehir: sehir });
  if (aktifDetay.ulke !== ulke || aktifDetay.sehir !== sehir) return;   // baska sehre gecti
  if (error) { fotoDurum("Fotograflar yuklenemedi."); return; }

  const benim  = data.filter(function (f) { return f.benim; });
  const diger  = data.filter(function (f) { return !f.benim; });
  const adres  = await imzaliAdresler(data.map(function (f) { return f.yol; }));
  if (aktifDetay.ulke !== ulke || aktifDetay.sehir !== sehir) return;

  kutu.innerHTML = "";
  for (let i = 0; i < benim.length; i++) kutu.appendChild(fotoKarti(benim[i], adres, true));
  const ekleEtiketi = document.getElementById("sehirFotoLabel");
  if (ekleEtiketi) {
    ekleEtiketi.style.display = benim.length >= FOTO_SINIR ? "none" : "";
  }
  const sayac = document.getElementById("fotoSayac");
  if (sayac) sayac.textContent = benim.length + "/" + FOTO_SINIR;

  if (digerKutu) {
    digerKutu.innerHTML = "";
    if (diger.length) {
      const bas = document.createElement("label");
      bas.textContent = "DİĞER GEZGİNLER";
      digerKutu.appendChild(bas);
      const izgara = document.createElement("div");
      izgara.className = "foto-izgara";
      for (let i = 0; i < diger.length; i++) izgara.appendChild(fotoKarti(diger[i], adres, false));
      digerKutu.appendChild(izgara);
    }
  }
}

function fotoKarti(f, adres, benimMi) {
  const kart = document.createElement("div");
  kart.className = "foto-kart";

  const im = document.createElement("img");
  im.loading = "lazy";
  im.alt = "";
  if (adres[f.yol]) im.src = adres[f.yol];
  kart.appendChild(im);

  if (benimMi) {
    const sil = document.createElement("button");
    sil.className = "foto-sil";
    sil.title = "Sil";
    sil.textContent = "×";
    sil.addEventListener("click", function () { fotoSil(f.id, f.yol); });
    kart.appendChild(sil);

    const acik = f.gorunurluk === "herkes";
    const dgm = document.createElement("button");
    dgm.className = "foto-paylas" + (acik ? " acik" : "");
    dgm.textContent = acik ? "herkese açık" : "gizli";
    dgm.title = acik ? "Herkese açık — gizlemek için tıkla"
                     : "Sadece sen görüyorsun — paylaşmak için tıkla";
    dgm.addEventListener("click", function () {
      fotoGorunurluk(f.id, acik ? "gizli" : "herkes");
    });
    kart.appendChild(dgm);
  } else {
    const ad = document.createElement("span");
    ad.className = "foto-sahip";
    ad.textContent = f.sahip;
    // Kullanici adi olmayan biri profil sayfasina sahip degil; sadece
    // adi olanlar tiklanabilir olsun, yoksa tiklayip hicbir sey olmuyor.
    if (f.kullanici_adi) {
      ad.classList.add("tiklanir");
      ad.title = "@" + f.kullanici_adi + " haritasına git";
      ad.addEventListener("click", function (e) {
        e.stopPropagation();
        hepsiniKapat();
        gezginiAc(f.kullanici_adi);
      });
    }
    kart.appendChild(ad);
  }
  return kart;
}

function yildizGoster(puan) {
  seciliPuan = puan;
  const y = document.querySelectorAll("#yildizlar .yildiz");
  for (let i = 0; i < y.length; i++) y[i].classList.toggle("dolu", i < puan);
}
function sehirDetayKapat() {
  document.getElementById("sehirDetayPanel").classList.remove("acik");
  if (aktifDetay && aktifDetay.ulke) panelAc(aktifDetay.ulke);
  else document.getElementById("harita").classList.remove("itili");
}

/* =====================================================================
   WIKIPEDIA FOTOĞRAF
   ===================================================================== */
/* Sehir fotografi. Tek bir denemede cok sehir bos donuyordu: sehir adlari
   GeoNames'ten geliyor (Xi'an, Québec, Adapazari gibi) ve Turkce Vikipedi'de
   o baslik olmayabiliyor. Sirayla deniyoruz; ilk bulan kazaniyor. */
function wikiFotoBul(sehir, ulke, geri) {
  const denemeler = [
    ["tr", sehir],
    ["en", sehir],
    ["tr", sehir + ", " + ulke],
    ["en", sehir + ", " + ulke]
  ];

  function sor(dil, baslik, sonra) {
    const u = "https://" + dil + ".wikipedia.org/w/api.php?action=query&format=json" +
              "&origin=*&prop=pageimages&piprop=thumbnail&pithumbsize=600" +
              "&redirects=1&titles=" + encodeURIComponent(baslik);
    fetch(u).then(function (c) { return c.json(); }).then(function (v) {
      let foto = null;
      const sayfalar = v && v.query && v.query.pages;
      for (const id in sayfalar) {
        const t = sayfalar[id].thumbnail;
        // Bayrak, arma, konum haritasi gibi gorseller sehri anlatmiyor
        if (t && t.source && !/Flag_|Coat_of_arms|_map|Locator|\.svg$/i.test(t.source)) {
          foto = t.source; break;
        }
      }
      sonra(foto);
    }).catch(function () { sonra(null); });
  }

  (function sirayla(i) {
    if (i >= denemeler.length) return geri(null);
    sor(denemeler[i][0], denemeler[i][1], function (f) {
      if (f) return geri(f);
      sirayla(i + 1);
    });
  })(0);
}

/* =====================================================================
   PROFİL
   ===================================================================== */
function profilAc() {
  profilDuzenleme = false;
  profilDoldur();
  profilKilitle(true);
  document.getElementById("profilKart").classList.add("acik");
  document.getElementById("harita").classList.add("itili");
}
function profilKapat() {
  document.getElementById("profilKart").classList.remove("acik");
  document.getElementById("harita").classList.remove("itili");
}
function profilDoldur() {
  kullaniciAdiAlani();
  arkadasBolumu();
  document.getElementById("profilIsim").value = profilVeri.isim || "";
  document.getElementById("profilKonum").value = profilVeri.konum || "";
  const liste = document.getElementById("profilFotoListe");
  liste.innerHTML = "";
  const fotolar = profilVeri.fotolar || [];
  for (let i = 0; i < fotolar.length; i++) {
    (function (indeks) {
      const kutu = document.createElement("div");
      kutu.className = "profil-foto-kutu";
      const im = document.createElement("img"); im.src = fotolar[indeks];
      kutu.appendChild(im);
      const sil = document.createElement("button");
      sil.className = "profil-foto-sil"; sil.textContent = "×";
      sil.addEventListener("click", function () {
        if (!profilDuzenleme) return;
        profilVeri.fotolar.splice(indeks, 1);
        profilDoldur(); profilButonFotoGuncelle();
      });
      kutu.appendChild(sil);
      liste.appendChild(kutu);
    })(i);
  }
  const son = document.getElementById("profilSonGezilen");
  son.innerHTML = "";
  const sonlar = gezilenler.slice(-6).reverse();
  for (let i = 0; i < sonlar.length; i++) {
    const s = document.createElement("div");
    s.className = "gecmis-sehir";
    s.textContent = sonlar[i].sehir + " — " + sonlar[i].ulke;
    son.appendChild(s);
  }
  profilButonFotoGuncelle();
}

/* Kullanici adi bolumu. Bir kez alindiktan sonra degistirilmiyor —
   baskalari o adla profiline gidiyor. index.html'e dokunmamak icin
   alani buradan olusturuyoruz. */
function kullaniciAdiAlani() {
  const kart = document.getElementById("profilKart");
  let bolum = document.getElementById("kullaniciAdiBolum");
  if (!bolum) {
    bolum = document.createElement("div");
    bolum.id = "kullaniciAdiBolum";
    bolum.className = "profil-bolum";
    const ilk = kart.querySelector(".profil-bolum");
    kart.insertBefore(bolum, ilk);
  }
  bolum.innerHTML = "";
  const et = document.createElement("label");
  et.textContent = "KULLANICI ADI";
  bolum.appendChild(et);

  if (profilVeri.kullanici_adi) {
    const ad = document.createElement("div");
    ad.className = "kullanici-adi";
    ad.textContent = "@" + profilVeri.kullanici_adi;
    bolum.appendChild(ad);
    return;
  }

  const not = document.createElement("div");
  not.className = "kullanici-adi-not";
  not.textContent = "Diğer gezginlerin seni bulabilmesi için bir kullanıcı adı seç. Sonradan değiştirilemiyor.";
  bolum.appendChild(not);

  const satir = document.createElement("div");
  satir.className = "kullanici-adi-satir";
  const gir = document.createElement("input");
  gir.type = "text"; gir.placeholder = "cihan"; gir.maxLength = 20;
  const dgm = document.createElement("button");
  dgm.textContent = "AL";
  const uyari = document.createElement("div");
  uyari.className = "kullanici-adi-uyari";

  dgm.addEventListener("click", async function () {
    dgm.disabled = true; uyari.textContent = "";
    const { data, error } = await db.rpc("kullanici_adi_al", { p_ad: gir.value });
    dgm.disabled = false;
    if (error) { uyari.textContent = error.message; return; }
    profilVeri.kullanici_adi = data;
    yerelYaz("profilVeri", profilVeri);
    profilDoldur();
  });
  satir.appendChild(gir); satir.appendChild(dgm);
  bolum.appendChild(satir); bolum.appendChild(uyari);
}


/* =====================================================================
   ARKADASLIK
   Karsilikli: istek gonderilir, karsi taraf kabul edene kadar
   arkadaslik kurulmaz.
   ===================================================================== */
let arkadasListesi = [];
let gelenIstekler  = [];

/* Gezginin panelindeki dugme. Dort durum var, dordu de farkli davraniyor. */
function arkadaslikDugmesi() {
  const kutu = document.createElement("div");
  kutu.className = "arkadas-kutu";
  const d = misafir.arkadaslik;
  const ad = misafir.kullanici_adi;

  function dugme(yazi, sinif, isle) {
    const b = document.createElement("button");
    b.className = "arkadas-dugme " + sinif;
    b.textContent = yazi;
    b.addEventListener("click", async function () {
      b.disabled = true;
      const { data, error } = await isle();
      b.disabled = false;
      if (error) { kutu.querySelector(".arkadas-uyari").textContent = error.message; return; }
      misafir.arkadaslik = data;
      arkadasVeriTazele();
      gezginPaneli();
    });
    return b;
  }

  if (d === "arkadas") {
    const et = document.createElement("span");
    et.className = "arkadas-etiket";
    et.textContent = "✓ arkadaşsınız";
    kutu.appendChild(et);
    kutu.appendChild(dugme("çıkar", "sade", function () {
      return db.rpc("arkadaslikten_cik", { p_kullanici_adi: ad });
    }));
  } else if (d === "bekliyor_ben") {
    const et = document.createElement("span");
    et.className = "arkadas-etiket";
    et.textContent = "istek gönderildi";
    kutu.appendChild(et);
    kutu.appendChild(dugme("geri al", "sade", function () {
      return db.rpc("arkadaslikten_cik", { p_kullanici_adi: ad });
    }));
  } else if (d === "bekliyor_o") {
    const et = document.createElement("span");
    et.className = "arkadas-etiket";
    et.textContent = "sana istek gönderdi";
    kutu.appendChild(et);
    kutu.appendChild(dugme("kabul et", "onay", function () {
      return db.rpc("arkadas_istegi_yanitla", { p_kullanici_adi: ad, p_kabul: true });
    }));
    kutu.appendChild(dugme("reddet", "sade", function () {
      return db.rpc("arkadas_istegi_yanitla", { p_kullanici_adi: ad, p_kabul: false });
    }));
  } else {
    kutu.appendChild(dugme("arkadaş ekle", "onay", function () {
      return db.rpc("arkadas_istegi_gonder", { p_kullanici_adi: ad });
    }));
  }
  const uyari = document.createElement("div");
  uyari.className = "arkadas-uyari";
  kutu.appendChild(uyari);
  return kutu;
}

async function arkadasVeriTazele() {
  const { data: oturum } = await db.auth.getSession();
  if (!oturum.session) { arkadasListesi = []; gelenIstekler = []; return; }
  const [a, i] = await Promise.all([
    db.rpc("arkadaslarim"),
    db.rpc("arkadas_istekleri")
  ]);
  arkadasListesi = (a && a.data) || [];
  gelenIstekler  = (i && i.data) || [];
  arkadasRozeti();
  if (document.getElementById("profilKart").classList.contains("acik")) profilDoldur();
}

/* Profil dugmesinde bekleyen istek sayisi */
function arkadasRozeti() {
  const btn = document.getElementById("profilBtn");
  if (!btn) return;
  let r = document.getElementById("arkadasRozet");
  if (!gelenIstekler.length) { if (r) r.remove(); return; }
  if (!r) {
    r = document.createElement("span");
    r.id = "arkadasRozet";
    btn.appendChild(r);
  }
  r.textContent = gelenIstekler.length;
}

/* Profil kartindaki arkadas bolumu: once gelen istekler, sonra liste. */
function arkadasBolumu() {
  const kart = document.getElementById("profilKart");
  let bolum = document.getElementById("arkadasBolum");
  if (!bolum) {
    bolum = document.createElement("div");
    bolum.id = "arkadasBolum";
    bolum.className = "profil-bolum";
    const btnlar = document.getElementById("profilButonlar");
    kart.insertBefore(bolum, btnlar);
  }
  bolum.innerHTML = "";

  if (gelenIstekler.length) {
    const et = document.createElement("label");
    et.textContent = "GELEN İSTEKLER";
    bolum.appendChild(et);
    for (let i = 0; i < gelenIstekler.length; i++) {
      (function (g) {
        const sat = document.createElement("div");
        sat.className = "arkadas-satir istek";
        const ad = document.createElement("span");
        ad.className = "arkadas-ad";
        ad.textContent = "@" + g.kullanici_adi;
        ad.title = g.isim || "";
        sat.appendChild(ad);
        function yanit(kabul) {
          return async function (e) {
            e.stopPropagation();
            await db.rpc("arkadas_istegi_yanitla",
              { p_kullanici_adi: g.kullanici_adi, p_kabul: kabul });
            arkadasVeriTazele();
          };
        }
        const kab = document.createElement("button");
        kab.className = "arkadas-mini onay"; kab.textContent = "kabul";
        kab.addEventListener("click", yanit(true));
        const red = document.createElement("button");
        red.className = "arkadas-mini"; red.textContent = "reddet";
        red.addEventListener("click", yanit(false));
        sat.appendChild(kab); sat.appendChild(red);
        bolum.appendChild(sat);
      })(gelenIstekler[i]);
    }
  }

  const et2 = document.createElement("label");
  et2.textContent = "ARKADAŞLARIN" +
    (arkadasListesi.length ? " (" + arkadasListesi.length + ")" : "");
  bolum.appendChild(et2);

  if (!arkadasListesi.length) {
    const bos = document.createElement("div");
    bos.className = "arkadas-bos";
    bos.textContent = "Henüz arkadaşın yok. Arama kutusundan gezgin bulup ekleyebilirsin.";
    bolum.appendChild(bos);
    return;
  }
  for (let i = 0; i < arkadasListesi.length; i++) {
    (function (g) {
      const sat = document.createElement("div");
      sat.className = "arkadas-satir";
      sat.innerHTML = "<span class='arkadas-ad'>@" + kacisla(g.kullanici_adi) + "</span>" +
                      "<span class='arkadas-sag'>" + g.ulke_sayisi + " ülke</span>";
      sat.title = g.isim || "";
      sat.addEventListener("click", function () {
        profilKapat();
        gezginiAc(g.kullanici_adi);
      });
      bolum.appendChild(sat);
    })(arkadasListesi[i]);
  }
}

function profilKilitle(kilitli) {
  document.getElementById("profilIsim").disabled = kilitli;
  document.getElementById("profilKonum").disabled = kilitli;
  document.getElementById("profilKaydet").style.display = kilitli ? "none" : "block";
  document.getElementById("profilDegistir").style.display = kilitli ? "block" : "none";
  document.getElementById("profilFotoEkle").style.display = kilitli ? "none" : "flex";
}
function profilButonFotoGuncelle() {
  const el = document.getElementById("profilFoto");
  const f = (profilVeri.fotolar || [])[0];
  if (f) {
    el.style.backgroundImage = "url(" + f + ")";
    el.style.backgroundSize = "cover";
    el.style.backgroundPosition = "center";
    el.textContent = "";
  } else {
    el.style.backgroundImage = "";
    el.textContent = (profilVeri.isim || "?").charAt(0).toUpperCase();
  }
}

/* =====================================================================
   ARAMA (üst kutu)
   ===================================================================== */
const aramaKutu   = document.getElementById("aramaKutu");
const aramaInput  = document.getElementById("aramaInput");
const aramaSonuc  = document.getElementById("aramaSonuc");
let aramaBekle = null;

function aramaAc()   { aramaKutu.classList.add("acik"); aramaInput.focus(); }
function aramaKapat() { aramaKutu.classList.remove("acik"); aramaInput.value = ""; aramaSonuc.innerHTML = ""; }

aramaInput.addEventListener("input", function () {
  clearTimeout(aramaBekle);
  const metin = aramaInput.value.trim();
  if (metin.length < 2) { aramaSonuc.innerHTML = ""; return; }
  aramaBekle = setTimeout(async function () {
    const [sehirler, gezginler] = await Promise.all([
      db.rpc("sehir_ara",  { p_metin: metin, p_limit: 15 }),
      db.rpc("gezgin_ara", { p_metin: metin, p_limit: 6 })
    ]);
    aramaSonuc.innerHTML = "";
    const parca = document.createDocumentFragment();

    const kisiler = (gezginler && gezginler.data) || [];
    if (kisiler.length) {
      const bas = document.createElement("div");
      bas.className = "arama-baslik"; bas.textContent = "GEZGİNLER";
      parca.appendChild(bas);
      for (let i = 0; i < kisiler.length; i++) {
        (function (g) {
          const sat = document.createElement("div");
          sat.className = "arama-satir";
          sat.innerHTML = "<b>@" + kacisla(g.kullanici_adi) + "</b> " +
            "<span style='opacity:.6'>" + kacisla(g.isim || "") + "</span>" +
            "<span class='arama-sag'>" + g.ulke_sayisi + " ülke</span>";
          sat.addEventListener("click", function () {
            aramaKapat();
            gezginiAc(g.kullanici_adi);
          });
          parca.appendChild(sat);
        })(kisiler[i]);
      }
    }

    const yerler = (sehirler && sehirler.data) || [];
    if (yerler.length) {
      if (kisiler.length) {
        const bas = document.createElement("div");
        bas.className = "arama-baslik"; bas.textContent = "YERLER";
        parca.appendChild(bas);
      }
      for (let i = 0; i < yerler.length; i++) {
        (function (r) {
          const sat = document.createElement("div");
          sat.className = "arama-satir";
          sat.innerHTML = "<b>" + kacisla(r.ad) + "</b> <span style='opacity:.6'>" + kacisla(r.ulke) + "</span>";
          sat.addEventListener("click", function () {
            aramaKapat();
            kureyeGit(r.enlem, r.boylam, true);
            panelAc(r.ulke);
          });
          parca.appendChild(sat);
        })(yerler[i]);
      }
    }

    if (!kisiler.length && !yerler.length) {
      aramaSonuc.innerHTML = "<div class='arama-satir' style='opacity:.6'>Sonuç yok</div>";
      return;
    }
    aramaSonuc.appendChild(parca);
  }, 250);
});

/* Escape'in iki kademesi var:
   1) Acik panel varsa onu kapatir. Burada sehirDetayKapat() KULLANILMIYOR,
      cunku o fonksiyon kapatinca ulke listesini geri aciyor (X dugmesi
      icin dogru davranis). Escape'te kullanilinca panel kapanip aninda
      yeniden aciliyordu.
   2) Hicbir sey acik degilse kureyi acilis konumuna geri goturur —
      cat diye degil, donerek ve uzaklasarak. */
function acikPanelVarMi() {
  const idler = ["panel", "sehirDetayPanel", "profilKart", "istatistikPanel"];
  for (let i = 0; i < idler.length; i++) {
    const el = document.getElementById(idler[i]);
    if (el && el.classList.contains("acik")) return true;
  }
  return aramaKutu.classList.contains("acik");
}

function hepsiniKapat() {
  aramaKapat();
  document.getElementById("panel").classList.remove("acik");
  document.getElementById("sehirDetayPanel").classList.remove("acik");
  document.getElementById("profilKart").classList.remove("acik");
  document.getElementById("istatistikPanel").classList.remove("acik");
  document.getElementById("harita").classList.remove("itili");
  aktifDetay = { ulke: "", sehir: "" };
  aktifUlke = "";
  fotoKuyruk = [];
}

/* Escape misafir modundayken once kendi haritana dondursun. */
function misafirdeysemCik() {
  if (!misafir) return false;
  misafirdenCik();
  return true;
}

function kureyiSifirla() {
  if (!kure) return;
  const g = kure.pointOfView();
  // Zaten baslangictaysak bosuna animasyon oynatma
  const uzak = Math.abs(g.altitude - ILK_GORUS.altitude) < 0.05 &&
               Math.abs(g.lat - ILK_GORUS.lat) < 1;
  if (uzak) { kure.controls().autoRotate = true; return; }
  kure.controls().autoRotate = false;
  kure.pointOfView(ILK_GORUS, 1600);
  setTimeout(function () { kure.controls().autoRotate = true; }, 1700);
}

document.addEventListener("keydown", function (e) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault(); aramaAc(); return;
  }
  if (e.key === "Escape") {
    if (acikPanelVarMi()) hepsiniKapat();
    else if (misafirdeysemCik()) { /* kendi haritana donuldu */ }
    else kureyiSifirla();
    return;
  }

  /* Bir harfe basinca arama kendiliginden acilsin — kutuyu aramaya
     gerek kalmasin. Basilan harf kaybolmuyor, kutuya yaziliyor. */
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const h = e.target;
  if (h && (h.tagName === "INPUT" || h.tagName === "TEXTAREA" || h.isContentEditable)) return;
  if (e.key.length !== 1 || !/\S/.test(e.key)) return;   // Shift, oklar, bosluk...
  e.preventDefault();
  aramaAc();
  aramaInput.value = e.key;
  aramaInput.dispatchEvent(new Event("input"));
});

/* =====================================================================
   SUPABASE'DEN KULLANICI VERİSİ
   ===================================================================== */
async function gezileriYukle() {
  const { data: oturum } = await db.auth.getSession();
  if (!oturum.session) { gezilenler = yerelOku("gezilenler", []); return; }
  const { data, error } = await db.from("gezilenler")
    .select("ulke,sehir").eq("user_id", oturum.session.user.id);
  if (error) { gezilenler = yerelOku("gezilenler", []); return; }
  gezilenler = data.map(function (r) { return { ulke: r.ulke, sehir: r.sehir }; });
  yerelYaz("gezilenler", gezilenler);
}

/* Gezilen sehirlerin koordinatlarini tek sorguda al.
   Eskiden her sehir icin Nominatim'e 2 saniye arayla soruluyordu. */
async function koordinatlariYukle() {
  gezilenKoord = {};
  if (!gezilenler.length) return;
  const ulkeler = [], adlar = [];
  for (let i = 0; i < gezilenler.length; i++) {
    if (ulkeler.indexOf(gezilenler[i].ulke) === -1) ulkeler.push(gezilenler[i].ulke);
    if (adlar.indexOf(gezilenler[i].sehir) === -1) adlar.push(gezilenler[i].sehir);
  }
  const { data, error } = await db.from("sehirler")
    .select("ulke,ad,enlem,boylam,nufus")
    .in("ulke", ulkeler).in("ad", adlar);
  if (error || !data) return;
  const harita = {};
  for (let i = 0; i < data.length; i++) {
    harita[anahtar(data[i].ulke, data[i].ad)] =
      { lat: data[i].enlem, lng: data[i].boylam, nufus: data[i].nufus || 0 };
  }
  const eslesmeyen = [];
  for (let i = 0; i < gezilenler.length; i++) {
    const a = anahtar(gezilenler[i].ulke, gezilenler[i].sehir);
    if (harita[a]) gezilenKoord[a] = harita[a];
    else eslesmeyen.push(a);
  }
  if (eslesmeyen.length) {
    console.log("Şehir tablosunda karşılığı bulunamayan kayıtlar:", eslesmeyen);
  }
}

async function detaylariYukle() {
  const { data: oturum } = await db.auth.getSession();
  if (!oturum.session) { sehirDetaylari = yerelOku("sehirDetaylari", {}); return; }
  const { data, error } = await db.from("sehir_detaylari")
    .select("ulke,sehir,puan,notlar").eq("user_id", oturum.session.user.id);
  if (error) { sehirDetaylari = yerelOku("sehirDetaylari", {}); return; }
  sehirDetaylari = {};
  for (let i = 0; i < data.length; i++) {
    sehirDetaylari[anahtar(data[i].ulke, data[i].sehir)] =
      { puan: data[i].puan || 0, not: data[i].notlar || "" };
  }
  yerelYaz("sehirDetaylari", sehirDetaylari);
}

async function profilYukle() {
  const { data: oturum } = await db.auth.getSession();
  if (!oturum.session) { profilVeri = yerelOku("profilVeri", profilVeri); return; }
  const yerel = yerelOku("profilVeri", { isim: "", konum: "", fotolar: [], kullanici_adi: "" });
  const { data, error } = await db.from("profil")
    .select("isim,konum,kullanici_adi").eq("user_id", oturum.session.user.id).maybeSingle();
  if (error || !data) { profilVeri = yerel; return; }
  // Profil fotograflari sunucuda degil, tarayicida duruyor; onlari
  // yerelden koruyoruz. Kullanici adi ise sunucudan geliyor.
  profilVeri = { isim: data.isim || "", konum: data.konum || "",
                 kullanici_adi: data.kullanici_adi || "",
                 fotolar: yerel.fotolar || [] };
  yerelYaz("profilVeri", profilVeri);
}

/* =====================================================================
   OLAYLAR
   ===================================================================== */
document.getElementById("kapat").addEventListener("click", paneliKapat);
document.getElementById("ortu").addEventListener("click", hepsiniKapat);
document.getElementById("sehirDetayKapat").addEventListener("click", sehirDetayKapat);
document.getElementById("kitaChart").addEventListener("click", istatistikPaneliAc);
document.getElementById("istatistikKapat").addEventListener("click", istatistikPaneliKapat);
document.getElementById("profilBtn").addEventListener("click", profilAc);
document.getElementById("profilKapat").addEventListener("click", profilKapat);
document.getElementById("profilDegistir").addEventListener("click", function () {
  profilDuzenleme = true; profilKilitle(false);
});

// Nisangah: fare olayi saniyede yuzlerce kez gelebiliyor, ama ekran
// zaten kare basina bir kez ciziliyor. Konumu kareye baglayip
// gereksiz yerlesim hesabini onluyoruz.
(function () {
  let x = 0, y = 0, bekleyen = false;
  document.addEventListener("mousemove", function (e) {
    x = e.clientX; y = e.clientY;
    if (bekleyen) return;
    bekleyen = true;
    requestAnimationFrame(function () {
      bekleyen = false;
      document.getElementById("crosshairX").style.top = y + "px";
      document.getElementById("crosshairY").style.left = x + "px";
    });
  });
})();

const yildizlar = document.querySelectorAll("#yildizlar .yildiz");
for (let i = 0; i < yildizlar.length; i++) {
  yildizlar[i].addEventListener("click", function () {
    yildizGoster(parseInt(this.dataset.puan, 10));
  });
}

document.getElementById("sehirFotoInput").addEventListener("change", function (e) {
  const dosya = e.target.files[0];
  e.target.value = "";                 // ayni dosya tekrar secilebilsin
  if (dosya) fotoEkle(dosya);
});

/* Fotograf bolumune sayac, durum satiri ve "diger gezginler" kutusunu
   bir kez ekliyoruz; index.html'e dokunmaya gerek kalmiyor. */
function fotoAlaniHazirla() {
  const etiket = document.getElementById("sehirFotoLabel");
  if (!etiket || document.getElementById("fotoSayac")) return;
  const bolum = etiket.parentElement;
  const baslik = bolum.querySelector("label");
  if (baslik) {
    const sayac = document.createElement("span");
    sayac.id = "fotoSayac";
    baslik.appendChild(sayac);
  }
  const durum = document.createElement("div");
  durum.id = "fotoDurum";
  bolum.appendChild(durum);
  const diger = document.createElement("div");
  diger.id = "digerFotolar";
  bolum.parentElement.insertBefore(diger, bolum.nextSibling);
}

document.getElementById("sehirDetayKaydet").addEventListener("click", async function () {
  const btn = this;
  btn.disabled = true;
  const not = document.getElementById("sehirNot").value;
  const a = anahtar(aktifDetay.ulke, aktifDetay.sehir);
  // Fotograflar artik burada degil, sehir_fotolari tablosunda.
  sehirDetaylari[a] = { puan: seciliPuan, not: not };
  yerelYaz("sehirDetaylari", sehirDetaylari);
  const { data: oturum } = await db.auth.getSession();
  if (oturum.session) {
    const { error } = await db.from("sehir_detaylari").upsert({
      user_id: oturum.session.user.id, ulke: aktifDetay.ulke,
      sehir: aktifDetay.sehir, puan: seciliPuan, notlar: not
    }, { onConflict: "user_id,ulke,sehir" });
    if (error) console.log("detay kaydedilemedi:", error.message);
  }
  btn.disabled = false;
  sehirDetayKapat();
});

document.getElementById("profilFotoInput").addEventListener("change", function (e) {
  const dosya = e.target.files[0];
  if (!dosya) return;
  const oku = new FileReader();
  oku.onload = function (ev) {
    profilVeri.fotolar = profilVeri.fotolar || [];
    profilVeri.fotolar.push(ev.target.result);
    profilDoldur();
  };
  oku.readAsDataURL(dosya);
});

document.getElementById("profilKaydet").addEventListener("click", async function () {
  const btn = this; btn.disabled = true;
  profilVeri.isim  = document.getElementById("profilIsim").value;
  profilVeri.konum = document.getElementById("profilKonum").value;
  yerelYaz("profilVeri", profilVeri);
  const { data: oturum } = await db.auth.getSession();
  if (oturum.session) {
    const { error } = await db.from("profil").upsert({
      user_id: oturum.session.user.id, isim: profilVeri.isim,
      konum: profilVeri.konum
    }, { onConflict: "user_id" });
    if (error) console.log("profil kaydedilemedi:", error.message);
  }
  profilDuzenleme = false; profilKilitle(true);
  profilButonFotoGuncelle();
  btn.disabled = false;
});

/* =====================================================================
   GİRİŞ / OTURUM
   ===================================================================== */
const girisEkran = document.getElementById("girisEkran");
const girisMesaj = document.getElementById("girisMesaj");

document.getElementById("kayitBtn").addEventListener("click", async function () {
  const e = document.getElementById("girisEmail").value.trim();
  const s = document.getElementById("girisSifre").value;
  if (!e || !s) { girisMesaj.textContent = "E-posta ve şifre gerekli."; return; }
  this.disabled = true;
  const { error } = await db.auth.signUp({ email: e, password: s });
  this.disabled = false;
  girisMesaj.textContent = error ? error.message : "Kayıt tamam, e-postanı doğrula.";
});

document.getElementById("girisBtn").addEventListener("click", async function () {
  const e = document.getElementById("girisEmail").value.trim();
  const s = document.getElementById("girisSifre").value;
  if (!e || !s) { girisMesaj.textContent = "E-posta ve şifre gerekli."; return; }
  this.disabled = true;
  const { error } = await db.auth.signInWithPassword({ email: e, password: s });
  this.disabled = false;
  if (error) { girisMesaj.textContent = error.message; return; }
  girisEkran.style.display = "none";
  await veriYukle();
});

async function cikisYap() {
  await db.auth.signOut();
  location.reload();
}
document.getElementById("cikisBtn").addEventListener("click", cikisYap);
document.getElementById("profilCikis").addEventListener("click", cikisYap);

document.getElementById("profilSifirla").addEventListener("click", async function () {
  if (!confirm("Bütün gezdiklerin silinecek. Emin misin?")) return;
  const { data: oturum } = await db.auth.getSession();
  if (oturum.session) {
    await db.from("gezilenler").delete().eq("user_id", oturum.session.user.id);
    await db.from("sehir_detaylari").delete().eq("user_id", oturum.session.user.id);
  }
  gezilenler = []; gezilenKoord = {}; sehirDetaylari = {};
  yerelYaz("gezilenler", []); yerelYaz("sehirDetaylari", {});
  istatistikGuncelle(); gecmisGuncelle(); kitaChartCiz();
  kureRenkTazele(); pinleriTazele();
});
document.getElementById("sifirlaBtn").addEventListener("click", function () {
  document.getElementById("profilSifirla").click();
});

/* =====================================================================
   BAŞLANGIÇ
   ===================================================================== */
async function veriYukle() {
  await ulkeleriYukle();
  await gezileriYukle();
  await Promise.all([koordinatlariYukle(), detaylariYukle(), profilYukle(),
                     arkadasVeriTazele()]);
  istatistikGuncelle();
  gecmisGuncelle();
  kitaChartCiz();
  kureRenkTazele();
  pinleriTazele();
}

(async function baslat() {
  kureKur();
  const { data: oturum } = await db.auth.getSession();
  if (oturum.session) {
    girisEkran.style.display = "none";
    await veriYukle();
  } else {
    girisEkran.style.display = "flex";
    await ulkeleriYukle();
    kitaChartCiz();
    istatistikGuncelle();
  }
})();
