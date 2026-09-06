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
const RENK_GEZILDI  = "#E67E22";
const RENK_BOS      = "#1e2a3a";
const RENK_HOVER    = "#FF8C1A";
const RENK_KENAR    = "#e8e0d0";
const PIN_RENK      = "#0f1620";   // gezilen ulkeler turuncu; pin lacivert olunca beliriyor

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
let profilVeri = { isim: "", konum: "", fotolar: [] };
let profilDuzenleme = false;
let aktifDetay = { ulke: "", sehir: "" };
let aktifUlke  = "";
let panelDurum = { ulke: "", offset: 0, arama: "", toplam: 0 };

const kitaRenk = {
  "Avrupa": "#E67E22", "Asya": "#FF8C1A", "Afrika": "#C0562A",
  "Kuzey Amerika": "#8B4513", "Güney Amerika": "#D2691E",
  "Okyanusya": "#A0522D", "Antarktika": "#6b7a8f"
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
  kure = Globe()(document.getElementById("harita"))
    .backgroundColor("#070b11")
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
      return ulkeGezildiMi(d.properties.name) ? RENK_GEZILDI : RENK_BOS;
    })
    .polygonSideColor(function () { return "#141c28"; })
    .polygonStrokeColor(function () { return RENK_KENAR; })
    .polygonLabel(function (d) {
      const ad = d.properties.name;
      const say = gezilenler.filter(function (g) { return g.ulke === ad; }).length;
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
    .pointAltitude(0.045)
    .pointRadius(0.13)
    .pointResolution(6)
    .pointLabel(function (d) { return "<div class='kure-etiket'>" + kacisla(d.sehir) + "</div>"; })
    .onPointClick(function (d) { sehirDetayAc(d.ulke, d.sehir); })
    .ringsData([])
    .ringLat("lat").ringLng("lng")
    .ringColor(function () { return function (t) { return "rgba(15,22,32," + (1 - t) * 0.6 + ")"; }; })
    .ringMaxRadius(2.2)
    .ringPropagationSpeed(0.9)
    .ringRepeatPeriod(1600);

  const m = kure.globeMaterial();
  if (m && m.color) { m.color.set("#0b1119"); m.shininess = 4; }

  kure.pointOfView({ lat: 30, lng: 15, altitude: 2.5 });

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
    clearTimeout(zamanlayici);
    zamanlayici = setTimeout(yogunlukGuncelle, 120);
  });

  window.addEventListener("resize", function () {
    kure.width(window.innerWidth).height(window.innerHeight);
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

function ulkeGezildiMi(ad) {
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
  for (let i = 0; i < gezilenler.length; i++) {
    const g = gezilenler[i];
    const k = gezilenKoord[anahtar(g.ulke, g.sehir)];
    if (k) tum.push({ ulke: g.ulke, sehir: g.sehir, lat: k.lat, lng: k.lng, nufus: k.nufus });
  }
  let secim = tum.filter(function (p) { return p.nufus >= esik; });
  // Cok az kaldiysa yine de en buyuk 12 tanesini goster
  if (secim.length < 12) {
    secim = tum.slice().sort(function (a, b) { return b.nufus - a.nufus; }).slice(0, 12);
  }
  pinListesi = secim;
  kure.pointsData(secim);
  kure.ringsData(secim.slice(0, 40));
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
function panelAc(ulkeAdi) {
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
  const secili = gezildiMi(ulkeAdi, s.ad);
  const kart = document.createElement("div");
  kart.className = "sehir-kart" + (secili ? " secili" : "");
  kart.addEventListener("click", function () { sehirDetayAc(ulkeAdi, s.ad); });

  const btn = document.createElement("button");
  btn.className = "gittim-btn" + (secili ? " aktif" : "");
  btn.textContent = secili ? "✓" : "+";
  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    sehirSec(btn, ulkeAdi, s);
  });
  kart.appendChild(btn);

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
  const kitalar = Object.keys(sayim).sort(function (a, b) { return sayim[b] - sayim[a]; });
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
  const kitalar = Object.keys(kitaToplam).sort();
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
let seciliFoto = "";

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

  const d = sehirDetaylari[anahtar(ulke, sehir)] || { puan: 0, foto: "", not: "" };
  yildizGoster(d.puan || 0);
  seciliFoto = d.foto || "";
  const onizle = document.getElementById("sehirFotoOnizle");
  onizle.innerHTML = "";
  if (d.foto) { const i = document.createElement("img"); i.src = d.foto; onizle.appendChild(i); }
  document.getElementById("sehirNot").value = d.not || "";

  const gitti = gezildiMi(ulke, sehir);
  document.getElementById("detayGovde").style.display = gitti ? "block" : "none";
  document.getElementById("kilitUyari").style.display = gitti ? "none" : "block";

  document.getElementById("panel").classList.remove("acik");
  document.getElementById("sehirDetayPanel").classList.add("acik");
  document.getElementById("harita").classList.add("itili");
}

function yildizGoster(puan) {
  seciliPuan = puan;
  const y = document.querySelectorAll("#yildizlar .yildiz");
  for (let i = 0; i < y.length; i++) y[i].classList.toggle("dolu", i < puan);
}
function sehirDetayKapat() {
  document.getElementById("sehirDetayPanel").classList.remove("acik");
  seciliFoto = "";
  if (aktifDetay && aktifDetay.ulke) panelAc(aktifDetay.ulke);
  else document.getElementById("harita").classList.remove("itili");
}

/* =====================================================================
   WIKIPEDIA FOTOĞRAF
   ===================================================================== */
function wikiFotoBul(sehir, ulke, geri) {
  const dene = function (baslik, sonra) {
    const u = "https://tr.wikipedia.org/w/api.php?action=query&format=json&origin=*" +
              "&prop=pageimages&piprop=thumbnail&pithumbsize=600&redirects=1&titles=" +
              encodeURIComponent(baslik);
    fetch(u).then(function (c) { return c.json(); }).then(function (v) {
      let foto = null;
      const sy = v && v.query && v.query.pages;
      for (const id in sy) {
        if (sy[id].thumbnail && sy[id].thumbnail.source) { foto = sy[id].thumbnail.source; break; }
      }
      sonra(foto);
    }).catch(function () { sonra(null); });
  };
  dene(sehir, function (f) {
    if (f) return geri(f);
    dene(sehir + ", " + ulke, function (f2) { geri(f2 || null); });
  });
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
    const { data, error } = await db.rpc("sehir_ara", { p_metin: metin, p_limit: 20 });
    aramaSonuc.innerHTML = "";
    if (error || !data || !data.length) {
      aramaSonuc.innerHTML = "<div class='arama-satir' style='opacity:.6'>Sonuç yok</div>";
      return;
    }
    const parca = document.createDocumentFragment();
    for (let i = 0; i < data.length; i++) {
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
      })(data[i]);
    }
    aramaSonuc.appendChild(parca);
  }, 250);
});

document.addEventListener("keydown", function (e) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); aramaAc(); }
  if (e.key === "Escape") {
    aramaKapat(); paneliKapat(); sehirDetayKapat();
    profilKapat(); istatistikPaneliKapat();
  }
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
  // Fotograf sunucuda tutulmuyor, tarayicida duruyor; puan ve notu
  // sunucudan alip fotografi yerelden koruyoruz.
  const yerel = yerelOku("sehirDetaylari", {});
  sehirDetaylari = {};
  for (let i = 0; i < data.length; i++) {
    const a = anahtar(data[i].ulke, data[i].sehir);
    sehirDetaylari[a] = {
      puan: data[i].puan || 0,
      foto: (yerel[a] && yerel[a].foto) || "",
      not:  data[i].notlar || ""
    };
  }
  yerelYaz("sehirDetaylari", sehirDetaylari);
}

async function profilYukle() {
  const { data: oturum } = await db.auth.getSession();
  if (!oturum.session) { profilVeri = yerelOku("profilVeri", profilVeri); return; }
  const yerel = yerelOku("profilVeri", { isim: "", konum: "", fotolar: [] });
  const { data, error } = await db.from("profil")
    .select("isim,konum").eq("user_id", oturum.session.user.id).maybeSingle();
  if (error || !data) { profilVeri = yerel; return; }
  // Profil fotograflari sunucuda degil, tarayicida duruyor.
  profilVeri = { isim: data.isim || "", konum: data.konum || "", fotolar: yerel.fotolar || [] };
  yerelYaz("profilVeri", profilVeri);
}

/* =====================================================================
   OLAYLAR
   ===================================================================== */
document.getElementById("kapat").addEventListener("click", paneliKapat);
document.getElementById("ortu").addEventListener("click", function () {
  paneliKapat(); istatistikPaneliKapat(); sehirDetayKapat(); profilKapat();
});
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
  if (!dosya) return;
  const oku = new FileReader();
  oku.onload = function (ev) {
    seciliFoto = ev.target.result;
    const o = document.getElementById("sehirFotoOnizle");
    o.innerHTML = "";
    const im = document.createElement("img"); im.src = seciliFoto; o.appendChild(im);
  };
  oku.readAsDataURL(dosya);
});

document.getElementById("sehirDetayKaydet").addEventListener("click", async function () {
  const btn = this;
  btn.disabled = true;
  const not = document.getElementById("sehirNot").value;
  const a = anahtar(aktifDetay.ulke, aktifDetay.sehir);
  sehirDetaylari[a] = { puan: seciliPuan, foto: seciliFoto, not: not };
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
  await Promise.all([koordinatlariYukle(), detaylariYukle(), profilYukle()]);
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
