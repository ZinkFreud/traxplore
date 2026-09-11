/* =====================================================================
   TRAXPLORE
   Sehir verisi artik bu dosyanin icinde degil, Supabase'de.
   Harita Leaflet degil, WebGL kure (globe.gl).
   ===================================================================== */

const SUPABASE_URL = "https://nfmbutrdhdomgaltneuq.supabase.co";
const SUPABASE_KEY = "sb_publishable_VHpyi0vznoFhj2RaXewyig_Rk0v07tG";
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* Sifre sifirlama baglantisi adresin # kismindan geliyor
   (…#access_token=…&type=recovery). supabase-js baglantiyi isleyip o
   kismi TEMIZLIYOR, o yuzden bayragi burada, betigin ilk satirlarinda
   yakaliyoruz. Sonra bakarsak gec kalmis oluyoruz. */
const SIFRE_KURTARMA = /type=recovery/.test(location.hash);

const GEOJSON_URL =
  "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";

const SAYFA = 60;            // panelde bir seferde kac sehir
const ILK_GORUS = { lat: 30, lng: 15, altitude: 2.5 };   // kurenin acilis konumu

/* Kameranin gorus acisi DIKEY olcduluyor. Genis bir ekranda kure rahat
   siginiyor, ama telefon dikey tutuldugunda ekran dar ve uzun: kure
   ekran yuksekliginin belli bir oranini kaplayacak sekilde ayarlaninca
   genisligi asiyor ve yanlardan kesiliyor. Bu yuzden acilis mesafesini
   sabit vermek yerine en-boy oranindan hesapliyoruz; dar ekranda kamera
   kendiliginden geri cekiliyor. Genis ekranda hesap 2.5'in altinda
   ciktigi icin masaustunde hicbir sey degismiyor. */
function sigacakYukseklik(temel) {
  const R = 100;
  const dikeyYari = (50 / 2) * Math.PI / 180;
  const oran = Math.max(0.2, window.innerWidth / window.innerHeight);
  const yatayYari = Math.atan(Math.tan(dikeyYari) * oran);
  const dar = Math.min(dikeyYari, yatayYari) * 0.80;   // kenar payi
  const gerekli = R / Math.sin(dar);
  return Math.max(temel, gerekli / R - 1);
}

function acilisGorusu() {
  return { lat: ILK_GORUS.lat, lng: ILK_GORUS.lng,
           altitude: sigacakYukseklik(ILK_GORUS.altitude) };
}
/* Meridyenler kutuplarda birbirine girmesin diye 88 derecede kesiliyor;
   zaten oradan otesi ekranda birkac piksel. */
function izgaraYollari() {
  const yollar = [];
  for (let lo = -180; lo < 180; lo += IZGARA_ARALIK) {
    const p = [];
    for (let la = -88; la <= 88; la += 2) p.push([la, lo]);
    yollar.push({ nokta: p, ana: false });
  }
  for (let la = -90 + IZGARA_ARALIK; la < 90; la += IZGARA_ARALIK) {
    const p = [];
    for (let lo = -180; lo <= 180; lo += 3) p.push([la, lo]);
    yollar.push({ nokta: p, ana: (la === 0) });     // ana = ekvator
  }
  return yollar;
}

/* --- Kure temasi ------------------------------------------------------- */
/* Kure artik DOKU degil GEOMETRI. Noktali dunya bir resimdi: 4096x2048
   bir tuvali kureye sariyorduk, yaklasinca o resmin pikselleri buyuyup
   bulaniklasiyordu ve yakinlasma sinirini o yuzden koymak zorundaydik.
   Ulkeler vektor poligon olarak cizilince ortada resim kalmiyor --
   ne kadar yaklasirsan yaklas kenar keskin.

   Gezdigin ulke DOLU, gezmedigin sadece cizgi. Once "hicbir ulkeyi
   isaretleme" diye karar vermistik; o zaman gezdigin yer ile gezmedigin
   arasinda hicbir fark yoktu, sadece sehir isiklari vardi. Dolgu cok
   sonuk: kitalari bogmadan "buraya gittim" demeye yetiyor. */
/* Kara dolgulari OPAK ve bunun bir isi var.
   Renkler yari saydam hallerinin koyu okyanus uzerindeki tam
   karsiligi: rgba(190,212,218,0.14) + #060a11 = #20262d. Ekranda
   birebir ayni gorunuyor. Ama opak olduklari icin ALTLARINDAKINI
   ORTUYORLAR -- ekvator ve izgara cizgilerini kurenin yuzeyine,
   dolgunun altina ciziyoruz; cizgiler boylece sadece denizde kaliyor.
   Karada gizlemek icin ayri bir kara maskesi cikarmaya gerek yok. */
const OKYANUS       = "#060a11";                 // deniz ve bosluk
/* Uc ton: okyanus en koyu, gezmedigin kara ortada, gezdigin en acik.
   Onceki halde gezmedigin ulkelerin dolgusu HIC yoktu, sadece cizgisi
   vardi. Masaustunde okunuyordu ama telefonda kara ile deniz ayni
   karanliga dusuyor, harita bombos gorunuyordu. Sicak/soguk ayrim da
   denendi (gezdigin yerler kehribara calan bir ton) -- kitalar kahve
   rengi bir lekeye donuyor, begenilmedi. Ayrimi renkle degil
   PARLAKLIKLA yapiyoruz, tema tek renk ailesinde kaliyor. */
const RENK_GEZILDI  = "#4c575d";   // gezilen ulke  (= 190,212,218 %38)
const RENK_BOS      = "#20262d";   // gezilmeyen kara (= %14)
/* Hover vurgusu kara renginin acik tonu. Once kehribardi ama kehribar
   bu haritada "senin gittigin sehir" demek; fareyi gezdirirken ayni
   rengin cikmasi yaniltiyordu. */
const RENK_HOVER    = "#788289";   // uzerine gelinen ulke (= %52)
const RENK_MIS_ULKE = "#3d5864";   // baskasinin haritasi (= %38 mavi)
/* Ulke cizgileri. Eskiden uzaktayken tamamen kapaliydilar cunku nokta
   dokusu karayi zaten gosteriyordu. Artik kara BU cizgilerden ibaret,
   o yuzden hic kapanmiyorlar; sadece yaklasinca netlesiyorlar. */
const SINIR_RENK    = "190,212,218";
const SINIR_UZAK    = 0.26;   // acilis gorunumunde
const SINIR_YAKIN   = 0.55;   // yaklasinca
const SINIR_BASLA   = 2.2;    // bu yukseklikten yukarida SINIR_UZAK
const SINIR_TAM     = 0.5;    // bu yukseklikte SINIR_YAKIN
/* Ekvator, meridyenler (boylam) ve paraleller (enlem).
   Sadece denizde gorunuyorlar; karayi yukaridaki opak dolgu ortuyor.
   15 derecede bir, cok silik -- amac bilgi vermek degil, bos denize
   bir olcek duygusu katmak. Ekvator digerlerinden biraz belirgin. */
const IZGARA_ARALIK = 15;
const IZGARA_ALFA   = 0.09;

const PIN_RENK      = "#FFF1D6";                 // isigin parlak cekirdegi
const RENK_MISAFIR  = "#DFF7FF";                 // baska bir gezginin haritasi

/* Telefon mu? Dar ekran, basik ekran ya da dokunmatik. Kure WebGL ile
   ciziliyor ve telefon GPU'lari masaustununkinin yaninda cok zayif;
   asagida birkac seyi buna gore kisiyoruz. */
const MOBIL = window.matchMedia(
  "(max-width: 720px), (max-height: 520px), (pointer: coarse)").matches;

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
let profilVeri = { isim: "", konum: "", foto: "", kullanici_adi: "", profil_acik: true, hareket_acik: false };
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

/* Yerel kopya KIME ait?
   Bu olmadan su oluyordu: bir kullanici cikis yapiyor, ayni tarayicidan
   baskasi giriyor, ve yeni kullanici oncekinin haritasini, ismini,
   kullanici adini goruyordu. Yeni bir hesapta sunucuda profil satiri
   olmadigi icin kod yerel kopyaya dusuyor, o kopya da bir oncekinin.
   Sonucu iki tarafli kotu: internet kafede ayni makineyi kullanan iki
   kisi birbirinin verisini goruyor; ve yeni hesap "kullanici adin var"
   sanildigi icin ad secme ekranini hic gormuyor, adsiz kaliyor.
   Cozum: yerel kopyayi kullanici kimligiyle muhurluyoruz. Kimlik
   degistiyse kopya bize ait degildir, siliyoruz. */
const YEREL_ANAHTARLAR = ["gezilenler", "sehirDetaylari", "profilVeri",
                          "bekleyenKullaniciAdi"];

function yerelTemizle() {
  for (let i = 0; i < YEREL_ANAHTARLAR.length; i++) {
    try { localStorage.removeItem(YEREL_ANAHTARLAR[i]); } catch (e) {}
  }
}

function yerelSahibiniAyarla(uid) {
  const sahip = yerelOku("oturumSahibi", "");
  if (sahip === uid) return false;
  yerelTemizle();
  yerelYaz("oturumSahibi", uid || "");
  return true;                       // temizlik yapildi
}
function anahtar(ulke, sehir) { return ulke + "|" + sehir; }

/* =====================================================================
   LISTELER — gitmek istediklerim ve favorilerim
   Ikisi de acilista bir kez cekiliyor; sehir kartinda ve profilde
   buradan okunuyor. Kurallar (6 sinir, "once gitmis olmalisin",
   isaretleyince istek listesinden dusme) SUNUCUDA; burasi sadece
   ekrani ona uyduruyor.
   ===================================================================== */
let istekListesi  = [];
let favoriListesi = [];

function listedeMi(liste, ulke, sehir) {
  for (let i = 0; i < liste.length; i++)
    if (liste[i].ulke === ulke && liste[i].sehir === sehir) return true;
  return false;
}
function listedenCikar(liste, ulke, sehir) {
  return liste.filter(function (x) {
    return !(x.ulke === ulke && x.sehir === sehir); });
}

async function listeleriYukle() {
  const { data: oturum } = await db.auth.getSession();
  if (!oturum.session) { istekListesi = []; favoriListesi = []; return; }
  const { data, error } = await db.rpc("listelerim");
  if (error) { console.log("listeler alinamadi:", error.message); return; }
  istekListesi  = (data || []).filter(function (r) { return r.tur === "istek"; });
  favoriListesi = (data || []).filter(function (r) { return r.tur === "favori"; });
}
function gezildiMi(ulke, sehir) {
  return gezilenler.some(function (g) { return g.ulke === ulke && g.sehir === sehir; });
}

/* =====================================================================
   KÜRE
   ===================================================================== */
let kure = null;
let ulkeOzellikleri = [];        // GeoJSON feature listesi
let hoverUlke = null;
let hoverSehir = null;          // dokunma anında parmağın altındaki pin
let sonAcilanUlke = "";         // aynı ülkeyi iki kez açmayalım
let sonAcilanAn   = 0;
let kureDurdu     = false;      // çizim duraklatıldı mı
let kureUykuda    = false;      // 30 sn dokunulmadı
let kameraBitis   = 0;          // kamera animasyonu bitiş anı
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
    /* Kurenin cevresindeki mavi hale. Onceki ton (#7FA8D0, 0.14) hem
       soluk hem grimsiydi, uzaydan bakinca neredeyse fark edilmiyordu.
       Canli sitede dort kademe denendi; bu ikisi en iyisi:
         #5EA9E8 / 0.18  -> ince, kureye yapisik  (secilen)
         #4A90D9 / 0.26  -> daha genis, daha yayvan
       Kalinligi buyutmek haleyi genisletiyor, yaklasinca yikamiyor.
       Daha genis bir hale istersen tek yapman gereken 0.18'i 0.22-0.26
       arasina cekmek. */
    .atmosphereColor("#5EA9E8")
    .atmosphereAltitude(0.18)
    // Yukseklik SABIT. Fareyle uzerine gelince yukseltmek cazip ama
    // pahali: globe.gl yukseklik degisince 180 ulkenin geometrisini
    // bastan kuruyor ve bu her ulke gecisinde tekrarlaniyor. Vurgu icin
    // sadece rengi degistiriyoruz, o geometriye dokunmuyor.
    .polygonsTransitionDuration(0)
    /* 0.013'te poligon katmani kurenin epey ustunde duruyordu. Kapaklar
       saydamken bu gorunmuyor ama sinir cizgileri acilinca kenarlarda
       kureden ayrilip bosluga tasiyorlardi. 0.003'te cizgiler yuzeye
       yapisiyor. */
    .polygonAltitude(0.003)
    // Kapaklar artik saydam. Tamamen saydam bir kapak da fare isinini
    // yakaliyor -- olculdu: hover ve tiklama calismaya devam ediyor,
    // altindaki nokta dokusunu de kapatmiyor.
    .polygonCapColor(function (d) {
      if (d === hoverUlke) return RENK_HOVER;
      if (!ulkeGezildiMi(d.properties.name)) return RENK_BOS;
      return misafir ? RENK_MIS_ULKE : RENK_GEZILDI;
    })
    .polygonSideColor(function () { return "rgba(0,0,0,0)"; })
    .polygonStrokeColor(function () { return sinirRengi; })
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
      etiketiTazele();
    })
    .onPolygonClick(function (d) { panelAc(d.properties.name); })
    /* Izgara kurenin yuzeyinde (0.0006), ulke dolgulari 0.003'te.
       Yani cizgiler dolgunun altinda kaliyor ve karada gorunmuyor. */
    .pathsData(izgaraYollari())
    .pathPoints(function (d) { return d.nokta; })
    .pathPointLat(function (p) { return p[0]; })
    .pathPointLng(function (p) { return p[1]; })
    .pathPointAlt(0.0006)
    .pathColor(function (d) {
      return "rgba(190,212,218," +
             (d.ana ? IZGARA_ALFA * 1.7 : IZGARA_ALFA) + ")";
    })
    .pathStroke(null)
    .pathTransitionDuration(0)
    .pointsData([])
    .pointLat("lat").pointLng("lng")
    /* Nokta katmani artik GORUNMUYOR ama duruyor. Sebebi: sehir adini
       gosteren ve tiklamayi yakalayan katman bu. Gorunen sey altindaki
       html isigi; ondan cikan kucuk cubuk hos degildi, kaldirildi.
       Saydam bir cismin fare isinini yakalamaya devam ettigi canli
       sitede olculdu -- saydamken de sehir adi cikiyor. */
    .pointColor(function () { return "rgba(0,0,0,0)"; })
    // Yaricap pinBoyutu() tarafindan yakinliga gore ayarlaniyor.
    .pointAltitude(0.0141)
    .pointResolution(MOBIL ? 8 : 14)
    .pointLabel(function (d) { return "<div class='kure-etiket'>" + kacisla(d.sehir) + "</div>"; })
    .onPointHover(function (d) { hoverSehir = d || null; etiketiTazele(); })
    .onPointClick(function (d) { sehirDetayAc(d.ulke, d.sehir); });

  /* Kapak ucgenlerinin kureyi kac derecede bir takip edecegi.
     globe.gl'in varsayilani 5 ve Gronland'i yirtiyordu: earcut ulkeyi
     ucgenlere bolerken kuzey ucundan guney ucuna uzanan bir ucgen
     uretiyor, o ucgenin duz yuzeyi kurenin ICINE dusuyor ve kure
     dolgunun icinden gecip uzun siyah dilimler aciyor. Noktali
     haldeyken kapaklar saydam oldugu icin bu hic gorunmuyordu.
     Canli sitede olculdu: 5'te yirtik, 2'de ve 1'de duzgun. Bedeli
     kucuk -- ucgen sayisi 83 binden 111 bine cikiyor ama cizim
     cagrisi sayisi ayni (328), yani ekran kartina yuku degismiyor.
     Telefonda 2: geometriyi kuran CPU, cizen GPU degil. */
  if (typeof kure.polygonCapCurvatureResolution === "function") {
    kure.polygonCapCurvatureResolution(MOBIL ? 2 : 1);
  }

  /* Sehir isiklari. Kure uzerine cizilen bir doku olsalardi cografi
     olarak sabit kalir, uzaklasinca gorunmez olurlardi. Bunun yerine
     kurenin uzerinde duran kucuk DOM parcalari: boyutlari ekranda
     sabit, kurenin arka yuzune dusenleri globe.gl kendisi gizliyor.
     Tiklama ve etiket isi hala nokta katmaninda -- bu katman
     pointer-events almiyor. */
  kure.htmlElementsData([])
      .htmlLat("lat").htmlLng("lng")
      .htmlAltitude(0.001)          // yuzeye yapisik; 0.02'de havada duruyordu
      .htmlTransitionDuration(0)
      .htmlElement(function (d) {
        const dis = document.createElement("div");
        dis.className = "sehir-isik" + (misafir ? " misafir" : "");
        dis.appendChild(document.createElement("i"));
        return dis;
      });

  /* Kureyi isiga tepki vermeyen duz bir yuzey yapiyoruz. Varsayilan
     Phong malzemesinde yonlu isik yuzunden bir tarafi aydinlik bir
     tarafi karanlik kaliyor; nokta haritasinda bu, dunyanin yarisini
     okunmaz hale getiriyor. Dokuyu emissive olarak verince her yer
     esit parlaklikta. */
  /* Telefonun ekran yogunlugu 2.5-3 kat; kure tum ekrani kapladigi icin
     her karede milyonlarca piksel boyaniyor. Orani kisiyoruz. Noktali
     dokudayken 1.5 yetiyordu cunku goruntu zaten yumusakti; ulke
     cizgileri ince ve keskin oldugu icin 1.5'te tirtikli goruniyorlar,
     o yuzden 2'ye cikardik. Doku ortadan kalktigi icin piksel basina
     is de azaldi, hesap denk geliyor. */
  if (MOBIL && typeof kure.renderer === "function") {
    try {
      const r = kure.renderer();
      if (r && r.setPixelRatio) {
        r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      }
    } catch (e) { console.log("Piksel orani ayarlanamadi:", e.message); }
  }

  const m = kure.globeMaterial();
  if (m) {
    try {
      if (m.color) m.color.set(OKYANUS);
      if (m.opacity !== undefined) m.opacity = 1;
      m.shininess = 0;
      m.needsUpdate = true;
    } catch (e) { console.log("Kure malzemesi ayarlanamadi:", e.message); }
  }

  /* Butun isigi ORTAM isigina ceviriyoruz. Varsayilanda bir de yonlu
     isik var; poligon dolgusu isiktan etkilenen bir malzeme oldugu icin
     onunla dunyanin bir yani aydinlik bir yani karanlik kaliyor ve ayni
     ulke dondukce ton degistiriyor. Ortam isigi tek basinayken her ulke
     her acida ayni tonda. Math.PI, three.js'te "rengi oldugu gibi
     goster" degeri. */
  try {
    const isiklar = kure.lights();
    for (let i = 0; i < isiklar.length; i++) {
      const l = isiklar[i];
      if (l.isAmbientLight) { l.intensity = Math.PI; if (l.color) l.color.set("#ffffff"); }
      else l.intensity = 0;
    }
    kure.lights(isiklar);
  } catch (e) { console.log("Isiklar ayarlanamadi:", e.message); }

  /* Derinlik tamponu hassasiyeti. globe.gl kamerayi near=0.05,
     far=125000 ile kuruyor; bu ikisinin orani 2.5 milyon ve derinlik
     hassasiyetini yiyor. Kureye en fazla 106 birime yaklastigimiz icin
     hicbir sey kameraya 4 birimden yakin olamiyor, dolayisiyla near'i
     rahatca buyutebiliyoruz. Gorunur bir sorunu bunun yuzunden
     olctugum yok -- ucgen yirtilmasinin sebebi bu degildi -- ama
     yuzeye yapisik cizgilerin oldugu bir sahnede 100 kat daha iyi
     derinlik ucuz bir sigorta. */
  try {
    const kam = kure.camera();
    kam.near = 0.5; kam.far = 3000; kam.updateProjectionMatrix();
  } catch (e) { console.log("Kamera derinligi ayarlanamadi:", e.message); }

  kure.pointOfView(acilisGorusu());

  const kontrol = kure.controls();
  kontrol.autoRotate = true;
  kontrol.autoRotateSpeed = 0.28;
  kontrol.enableDamping = true;
  /* Doku gitti, cozunurluk sorunu da gitti: artik yakinlasmayi
     kisitlayan tek sey kurenin kendisi. 106 birim = 0.06 yukseklik,
     yani neredeyse yuzeye deger. Eskiden 150'de (0.5) duruyorduk. */
  kontrol.minDistance = MOBIL ? 108 : 106;
  /* Uzaklasmanin da bir siniri olmali. Iki sebep:
     1. Kure 1.37 yukseklikte ekrani zaten tam dolduruyor; ondan sonrasi
        bilgi katmiyor, sadece bosluk ekliyor.
     2. Kure kucculdukce komsu noktalar ayni piksele dusuyor ve donerken
        titrek bir tarama deseni (moire) cikiyor. Kucuk degil, bozuk
        gorunuyor.
     450 birim = 3.5 yukseklik: kure ekran yuksekliginin yarisi kadar.
     Acilis gorunumu 2.5, yani geri cekilecek yer hala var. */
  kontrol.maxDistance = Math.max(450, 100 * (1 + sigacakYukseklik(ILK_GORUS.altitude)) * 1.15);

  // Kullanici kureye dokununca kendiliginden donmeyi durdur
  const durdur = function () { kontrol.autoRotate = false; };
  document.getElementById("harita").addEventListener("pointerdown", durdur);
  document.getElementById("harita").addEventListener("wheel", durdur, { passive: true });

  let zamanlayici = null;
  kontrol.addEventListener("change", function () {
    pinBoyutu();
    isikBoyutu();
    sinirSeviyesiniSec();
    clearTimeout(zamanlayici);
    zamanlayici = setTimeout(yogunlukGuncelle, 120);
  });

  window.addEventListener("resize", function () {
    kure.width(window.innerWidth).height(window.innerHeight);
    uzayCiz();
    // Telefon yan cevrilince en-boy orani degisiyor, siniri tazeleyelim
    kure.controls().maxDistance =
      Math.max(450, 100 * (1 + sigacakYukseklik(ILK_GORUS.altitude)) * 1.15);
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
      isikBoyutu();
      sinirGuncelle(kure.pointOfView().altitude);
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


/* =====================================================================
   ULKE CIZGILERI
   Uzakta soluk, yakinda net. Tamamen kapanmiyorlar: kara zemini artik
   bu cizgilerden okunuyor.
   ===================================================================== */
let sinirRengi = "rgba(" + SINIR_RENK + "," + SINIR_UZAK + ")";
let sinirSonAlfa = -1;

function sinirGuncelle(h) {
  let a;
  if (h >= SINIR_BASLA) a = SINIR_UZAK;
  else if (h <= SINIR_TAM) a = SINIR_YAKIN;
  else a = SINIR_UZAK + (SINIR_YAKIN - SINIR_UZAK) *
           (SINIR_BASLA - h) / (SINIR_BASLA - SINIR_TAM);
  a = Math.round(a * 50) / 50;          // 0.02'lik adimlar: gereksiz guncelleme olmasin
  if (a === sinirSonAlfa) return;
  sinirSonAlfa = a;
  sinirRengi = "rgba(" + SINIR_RENK + "," + a + ")";
  kure.polygonStrokeColor(kure.polygonStrokeColor());
}

/* Kamera dururken degil, hareket ederken de cagriliyor; ama cizgi rengi
   0.02'lik adimlarla degistigi icin gercek guncelleme seyrek. */
let sinirZaman = null;
function sinirSeviyesiniSec() {
  if (!kure) return;
  clearTimeout(sinirZaman);
  sinirZaman = setTimeout(function () {
    sinirGuncelle(kure.pointOfView().altitude);
  }, 90);
}

/* Isiklar ekranda sabit boyutta durursa, uzaklasinca 85 il tek bir
   lekeye donuyor. Kamera yuksekligine baglayinca uzakta kucucuk,
   yaklasinca genis oluyorlar -- kurenin ekrandaki buyuklugu ile ayni
   oranda. */
function isikBoyutu() {
  if (!kure) return;
  const h = kure.pointOfView().altitude;
  const boy = Math.max(14, Math.min(90, 46 / Math.max(0.4, h)));
  document.documentElement.style.setProperty("--isik-boy", boy.toFixed(1) + "px");
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
  /* Isik katmanina AYRI nesneler veriyoruz. globe.gl her katman icin
     veri nesnesinin uzerine kendi ic isaretini yaziyor; ayni nesneyi
     iki katmana verirsek biri digerininkini eziyor. */
  kure.htmlElementsData(secim.map(function (p) {
    return { lat: p.lat, lng: p.lng };
  }));
  pinBoyutu();
  isikBoyutu();
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
  kure.pointRadius(Math.max(0.008, Math.min(0.22, 0.045 * h)));
}

function pinleriTazele() { yogunlukGuncelle(true); }

function kureyeGit(lat, lng, yakin) {
  /* Kamera hareket ederken cizimi duraklatmayalim, yoksa animasyon
     gorunmuyor. Bittikten sonra karar yeniden veriliyor. */
  kameraBitis = Date.now() + 1800;
  kureyiUyandir();
  setTimeout(kureAnimasyonTazele, 1850);
  if (!kure) return;
  kure.controls().autoRotate = false;
  kure.pointOfView({ lat: lat, lng: lng, altitude: yakin ? 0.28 : 1.7 }, 900);
}

/* =====================================================================
   YARDIMCI
   ===================================================================== */
const AYLAR = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran",
               "Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];

/* Tarih ay hassasiyetinde: veritabaninda ayin ilk gunu duruyor, ekranda
   sadece ay ve yil gosteriliyor. Gun hicbir yerde sorulmuyor. */
function tarihYaz(gidilen) {
  if (!gidilen) return "";
  const p = String(gidilen).split("-");
  const ay = parseInt(p[1], 10);
  if (!p[0] || !ay) return "";
  return AYLAR[ay - 1] + " " + p[0];
}

/* Siralama: tarihi olanlar once, en yenisi ustte. Tarihi olmayanlar
   altta, eklenme sirasina gore (yeni eklenen ustte). Eklenme sirasi
   kullaniciya gosterilmiyor, sadece siralamada kullaniliyor. */
function gezileriSirala(liste) {
  return liste.slice().sort(function (a, b) {
    const at = a.gidilen || "", bt = b.gidilen || "";
    if (at && bt) return at < bt ? 1 : (at > bt ? -1 : 0);
    if (at) return -1;
    if (bt) return 1;
    const ae = a.eklendi || "", be = b.eklendi || "";
    return ae < be ? 1 : (ae > be ? -1 : 0);
  });
}

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
         { data: fotolar },
         { data: kayit },
         { data: listeler },
         { data: yorumlar }] = await Promise.all([
    db.rpc("gezgin_profil",      { p_kullanici_adi: kullaniciAdi }),
    db.rpc("gezgin_haritasi",    { p_kullanici_adi: kullaniciAdi }),
    db.rpc("gezgin_fotograflari",{ p_kullanici_adi: kullaniciAdi }),
    db.rpc("gezgin_gezi_kaydi",  { p_kullanici_adi: kullaniciAdi }),
    db.rpc("gezgin_listeleri",   { p_kullanici_adi: kullaniciAdi }),
    db.rpc("gezgin_yorumlari",   { p_kullanici_adi: kullaniciAdi })
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
    foto: p.foto || "",
    kita: p.kita_sayisi, ulke: p.ulke_sayisi, sehirSayisi: p.sehir_sayisi,
    benim: p.benim,
    arkadaslik: p.arkadaslik || "yok",
    gorebilir: p.gorebilir !== false,
    hareketAcik: p.hareket_acik === true,
    kayit: kayit || [],
    sehirler: harita || [],
    ulkeler: new Set((harita || []).map(function (r) { return r.ulke; })),
    fotolar: fotolar || [],
    istekler:  (listeler || []).filter(function (r) { return r.tur === "istek"; }),
    favoriler: (listeler || []).filter(function (r) { return r.tur === "favori"; }),
    yorumlar:  yorumlar || []
  };
  misafirBariGoster();
  kureRenkTazele();
  pinleriTazele();
  profilAc();
}

function misafirdenCik() {
  if (!misafir) return;
  misafir = null;
  document.body.classList.remove("misafirde");
  const bar = document.getElementById("misafirBar");
  if (bar) bar.remove();
  hepsiniKapat();
  kureRenkTazele();
  pinleriTazele();
  kureyiSifirla();
}

/* Bar ustte duruyor ve telefonda #mobilUst seridiyle ayni yere
   dusuyordu: logo ve sayac barin altinda kaliyordu. Ustelik o sayac
   SENIN sayilarini gosteriyor -- baskasinin haritasina bakarken
   yaniltici. Misafir kipinde ustteki serit tamamen barin yerini
   aliyor; masaustunde de ayni sebeple istatistik seridi gizleniyor. */
function misafirBariGoster() {
  document.body.classList.add("misafirde");
  let bar = document.getElementById("misafirBar");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "misafirBar";
    document.body.appendChild(bar);
  }
  bar.innerHTML = "";
  const yazi = document.createElement("span");
  yazi.className = "misafir-yazi";
  yazi.textContent = "@" + misafir.kullanici_adi + " haritasına bakıyorsun";
  const cik = document.createElement("button");
  cik.textContent = "kendi haritama dön";
  cik.addEventListener("click", misafirdenCik);
  bar.appendChild(yazi); bar.appendChild(cik);
}

function panelAc(ulkeAdi) {
  sonAcilanUlke = ulkeAdi; sonAcilanAn = Date.now();
  const arama = document.getElementById("panelArama");
  if (arama) arama.style.display = "";
  document.getElementById("sehirListe").style.display = "";
  aktifUlke = ulkeAdi;
  panelDurum = { ulke: ulkeAdi, offset: 0, arama: "", toplam: 0 };
  document.getElementById("panelBaslik").textContent = ulkeAdi;
  const liste = document.getElementById("sehirListe");
  liste.innerHTML = "<p class='panel-durum'>Yükleniyor…</p>";
  panelAramaKutusu();
  sadeceBuPanel("panel", true);
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
  kart.dataset.sehir = s.ad;        // detay ekranindan tazelemek icin
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
/* btn NULL olabilir: sehir kartindan degil, sehir detay ekranindaki
   "Buraya gittim" dugmesinden de cagriliyor. */
async function sehirSec(btn, ulke, s) {
  const kart = btn ? btn.closest(".sehir-kart") : null;
  const varMi = gezildiMi(ulke, s.ad);
  const { data: oturum } = await db.auth.getSession();
  const kul = oturum.session ? oturum.session.user.id : null;

  if (!varMi) {
    gezilenler.push({ ulke: ulke, sehir: s.ad });
    gezilenKoord[anahtar(ulke, s.ad)] = { lat: s.enlem, lng: s.boylam, nufus: s.nufus || 0 };
    if (kart) kart.classList.add("secili");
    if (btn) { btn.classList.add("aktif"); btn.textContent = "✓"; }
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
    if (btn) { btn.classList.remove("aktif"); btn.textContent = "+"; }
    if (kul) {
      const { error } = await db.from("gezilenler").delete()
        .eq("user_id", kul).eq("ulke", ulke).eq("sehir", s.ad);
      if (error) console.log("silme hatası:", error.message);
    }
  }
  /* Sunucuda tetikleyici var: isaretleyince istek listesinden, isareti
     kaldirinca favorilerden dusuyor. Ayni seyi burada da yapiyoruz ki
     ekran sayfa yenilenmeden dogru gorunsun. */
  if (!varMi) istekListesi  = listedenCikar(istekListesi,  ulke, s.ad);
  else        favoriListesi = listedenCikar(favoriListesi, ulke, s.ad);

  yerelYaz("gezilenler", gezilenler);
  istatistikGuncelle();
  gecmisGuncelle();
  kitaChartCiz();
  kureRenkTazele();
  pinleriTazele();
  if (document.getElementById("profilKart").classList.contains("acik") && !misafir)
    profilEkraniCiz();
}

/* =====================================================================
   İSTATİSTİK
   ===================================================================== */
/* Telefondaki buyuk sayac: kurenin altinda, ortada. Sag ust kosedeki
   kucuk yazi uygulamanin verdigi tek "puani" gomuyordu. Sayi ARTINCA
   bir an parliyor -- odul o sayi, arttigini gormek gerekiyor. */
let sonSehirSayisi = null;

function sayacParcasi(sayi, ad) {
  const s = document.createElement("span");
  s.className = "kure-sayac-parca";
  const b = document.createElement("b");
  b.textContent = sayi;
  s.appendChild(b);
  s.appendChild(document.createTextNode(" " + ad));
  return s;
}

function istatistikGuncelle() {
  const ulkeler = [], kitalar = [];
  for (let i = 0; i < gezilenler.length; i++) {
    if (ulkeler.indexOf(gezilenler[i].ulke) === -1) ulkeler.push(gezilenler[i].ulke);
    const k = ulkeKita[gezilenler[i].ulke];
    if (k && kitalar.indexOf(k) === -1) kitalar.push(k);
  }
  document.getElementById("istatistik").textContent =
    kitalar.length + " Kıta — " + ulkeler.length + " Ülke — " + gezilenler.length + " Şehir gezdin";
  const kisa = document.getElementById("mobilSayac");
  if (kisa) kisa.textContent = ulkeler.length + " ülke · " + gezilenler.length + " şehir";

  const buyuk = document.getElementById("kureSayac");
  if (buyuk) {
    buyuk.innerHTML = "";
    buyuk.appendChild(sayacParcasi(kitalar.length, "kıta"));
    buyuk.appendChild(sayacParcasi(ulkeler.length, "ülke"));
    buyuk.appendChild(sayacParcasi(gezilenler.length, "şehir"));
    /* Ilk yukleme parlamasin; sadece SONRADAN artinca. */
    if (sonSehirSayisi !== null && gezilenler.length > sonSehirSayisi) {
      buyuk.classList.remove("parla");
      void buyuk.offsetWidth;               // animasyonu bastan baslat
      buyuk.classList.add("parla");
      setTimeout(function () { buyuk.classList.remove("parla"); }, 900);
    }
    sonSehirSayisi = gezilenler.length;
  }
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
  /* Dolu pasta yerine ince halka. Renkler ayni -- onlar renk korlugu
     icin olculup secilmisti, degistirmek o dogrulamayi bozardi. Degisen
     tek sey kapladiklari ALAN: dolu daire panelin en gurultulu ogesiydi,
     halka ayni bilgiyi ucte bir murekkeple veriyor. Ortadaki bosluga da
     toplam ulke sayisi giriyor. */
  const MERKEZ = 100, HALKA = 70, KALINLIK = 20;

  function yay(baslangic, bitis, renk) {
    const x1 = MERKEZ + HALKA * Math.cos(baslangic), y1 = MERKEZ + HALKA * Math.sin(baslangic);
    const x2 = MERKEZ + HALKA * Math.cos(bitis),     y2 = MERKEZ + HALKA * Math.sin(bitis);
    const buyuk = (bitis - baslangic) > Math.PI ? 1 : 0;
    const p = document.createElementNS(ns, "path");
    p.setAttribute("d", "M " + x1.toFixed(2) + " " + y1.toFixed(2) +
                        " A " + HALKA + " " + HALKA + " 0 " + buyuk + " 1 " +
                        x2.toFixed(2) + " " + y2.toFixed(2));
    p.setAttribute("fill", "none");
    p.setAttribute("stroke", renk);
    p.setAttribute("stroke-width", KALINLIK);
    svg.appendChild(p);
  }

  function ortaYazi(metin, altMetin) {
    const t = document.createElementNS(ns, "text");
    t.setAttribute("x", MERKEZ); t.setAttribute("y", MERKEZ + 4);
    t.setAttribute("text-anchor", "middle");
    t.setAttribute("class", "halka-sayi");
    t.textContent = metin;
    svg.appendChild(t);
    if (altMetin) {
      const a = document.createElementNS(ns, "text");
      a.setAttribute("x", MERKEZ); a.setAttribute("y", MERKEZ + 24);
      a.setAttribute("text-anchor", "middle");
      a.setAttribute("class", "halka-alt");
      a.textContent = altMetin;
      svg.appendChild(a);
    }
  }

  if (!toplam) {
    const bos = document.createElementNS(ns, "circle");
    bos.setAttribute("cx", MERKEZ); bos.setAttribute("cy", MERKEZ);
    bos.setAttribute("r", HALKA);
    bos.setAttribute("fill", "none");
    bos.setAttribute("stroke", "#151C24");
    bos.setAttribute("stroke-width", KALINLIK);
    svg.appendChild(bos);
    lejant.innerHTML = "<div class='lejant-satir' style='opacity:.6'>Henüz gezilen yok</div>";
    return;
  }

  if (kitalar.length === 1) {
    // Tek kita: yay komutuyla tam cember cizilemez, dolu halka ciziyoruz
    const d = document.createElementNS(ns, "circle");
    d.setAttribute("cx", MERKEZ); d.setAttribute("cy", MERKEZ);
    d.setAttribute("r", HALKA);
    d.setAttribute("fill", "none");
    d.setAttribute("stroke", kitaRenk[kitalar[0]] || "#888");
    d.setAttribute("stroke-width", KALINLIK);
    svg.appendChild(d);
  } else {
    let aci = -Math.PI / 2;                       // saat 12'den basla
    const bosluk = 0.028;                         // dilimler arasi ince ayirac
    for (let i = 0; i < kitalar.length; i++) {
      const pay = sayim[kitalar[i]] / toplam;
      const bitis = aci + pay * Math.PI * 2;
      yay(aci + bosluk / 2, bitis - bosluk / 2, kitaRenk[kitalar[i]] || "#888");
      aci = bitis;
    }
  }
  ortaYazi(String(toplam), toplam === 1 ? "ÜLKE" : "ÜLKE");

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
  sadeceBuPanel("istatistikPanel", false);
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
  const sar = document.getElementById("sehirKapakSar");
  kapak.style.display = "none";
  sar.classList.add("kapaksiz");
  /* Isaretlemek icin sehrin koordinati lazim; o da bu sorgudan geliyor.
     Gelene kadar dugme kapali duruyor -- koordinatsiz isaretlersek
     kurede pin dusmez. */
  aktifDetay.kayit = null;
  gittimDugmesi(false);
  db.rpc("ulke_sehirleri", { p_ulke: ulke, p_limit: 1, p_offset: 0, p_arama: sehir })
    .then(function (r) {
      const s = r.data && r.data[0];
      if (!s || aktifDetay.sehir !== sehir) return;
      if (s.ad === sehir) { aktifDetay.kayit = s; gittimDugmesi(true); }
      if (s.foto) {
        kapak.src = s.foto; kapak.style.display = "block";
        sar.classList.remove("kapaksiz");
      }
    });

  const d = sehirDetaylari[anahtar(ulke, sehir)] || { puan: 0, not: "", acik: false };
  yildizGoster(d.puan || 0);
  document.getElementById("sehirNot").value = d.not || "";
  document.getElementById("notAcikAnahtar").checked = d.acik === true;
  notAnahtariniCiz();
  yorumlariGoster();
  tarihKutulariniDoldur();
  tarihiGoster(ulke, sehir);
  /* Suzgec her sehirde bastan basliyor. Yapismis birakinca kullanici
     yeni bir sehir aciyor, listeyi bos goruyor ve suzgecin acik
     oldugunu fark etmiyor. */
  gezenSuzgeciSifirla();
  gezenleriYukle();
  fotoAlaniHazirla();
  document.getElementById("sehirFotoOnizle").innerHTML = "";
  const dk = document.getElementById("digerFotolar");
  if (dk) dk.innerHTML = "";
  fotoDurum("");
  fotolariGoster();

  listeDurumu("");
  detayKilidiTazele();
  sadeceBuPanel("sehirDetayPanel", true);
}

/* Gittim mi gitmedim mi -- panelin govdesi ve dugmenin yazisi buna bagli */
function detayKilidiTazele() {
  const gitti = gezildiMi(aktifDetay.ulke, aktifDetay.sehir);
  document.getElementById("detayGovde").style.display = gitti ? "block" : "none";
  document.getElementById("kilitUyari").style.display = gitti ? "none" : "block";
  const btn = document.getElementById("gittimBtn");
  btn.textContent = gitti ? "✓ Gittim" : "Buraya gittim";
  btn.classList.toggle("gidildi", gitti);
  listeDugmeleriniTazele();
}

function gittimDugmesi(acik) {
  const btn = document.getElementById("gittimBtn");
  if (btn) btn.disabled = !acik;
  detayKilidiTazele();
}

/* Ulke paneli arkada aciksa oradaki kart da guncellensin; yoksa
   kullanici geri dondugunde eski hali goruyor. */
function ulkeKartiTazele(ulke, sehirAd) {
  if (aktifUlke !== ulke) return;
  const kartlar = document.querySelectorAll("#sehirListe .sehir-kart");
  for (let i = 0; i < kartlar.length; i++) {
    if (kartlar[i].dataset.sehir !== sehirAd) continue;
    const secili = gezildiMi(ulke, sehirAd);
    kartlar[i].classList.toggle("secili", secili);
    const d = kartlar[i].querySelector(".gittim-btn");
    if (d) { d.classList.toggle("aktif", secili); d.textContent = secili ? "✓" : "+"; }
  }
}

document.getElementById("gittimBtn").addEventListener("click", async function () {
  const k = aktifDetay.kayit;
  if (!k) return;
  this.disabled = true;
  await sehirSec(null, aktifDetay.ulke, k);
  this.disabled = false;
  detayKilidiTazele();
  ulkeKartiTazele(aktifDetay.ulke, k.ad);
  if (gezildiMi(aktifDetay.ulke, aktifDetay.sehir)) { tarihiGoster(aktifDetay.ulke, aktifDetay.sehir); }
});

/* --- Gitmek istiyorum / Favori --------------------------------------
   Iki dugme de "vardiysa cikar, yoksa ekle". Favori gitmedigin sehirde
   kapali: gitmedigin bir yeri favorileyebilseydin o zaten "gitmek
   istediklerim" olurdu. Ayni kural sunucuda da var, buradaki sadece
   kullaniciya sebebini soyluyor. */
function listeDurumu(metin) {
  const el = document.getElementById("listeDurum");
  if (el) el.textContent = metin || "";
}

function listeDugmeleriniTazele() {
  const ist = document.getElementById("istekBtn");
  const fav = document.getElementById("favoriBtn");
  if (!ist || !fav) return;
  const u = aktifDetay.ulke, s = aktifDetay.sehir;
  const gitti   = gezildiMi(u, s);
  const istekte = listedeMi(istekListesi, u, s);
  const favoride= listedeMi(favoriListesi, u, s);

  /* Gittigin yer artik "gitmek istedigim" degil; dugme de kalmasin. */
  ist.hidden = gitti;
  ist.textContent = istekte ? "✓ Gitmek istiyorum" : "Gitmek istiyorum";
  ist.classList.toggle("aktif", istekte);

  fav.disabled = !gitti;
  fav.textContent = favoride ? "★ Favorin" : "☆ Favori";
  fav.classList.toggle("aktif", favoride);
  fav.title = !gitti
    ? "Favorilere eklemek için önce buraya gittiğini işaretle"
    : (favoride ? "Favorilerinden çıkar"
                : "Favorilerine ekle (en fazla " + FAVORI_SINIR + ")");
}

function listeSonrasiTazele() {
  listeDugmeleriniTazele();
  if (document.getElementById("profilKart").classList.contains("acik") && !misafir)
    profilEkraniCiz();
}

bagla("istekBtn", "click", async function () {
  const u = aktifDetay.ulke, s = aktifDetay.sehir, k = aktifDetay.kayit;
  this.disabled = true; listeDurumu("");
  const { data, error } = await db.rpc("gitmek_istiyorum", { p_ulke: u, p_sehir: s });
  this.disabled = false;
  if (error) { listeDurumu(hataYaz(error.message)); return; }
  if (data) istekListesi = istekListesi.concat([{ ulke:u, sehir:s,
              enlem: k ? k.enlem : null, boylam: k ? k.boylam : null }]);
  else      istekListesi = listedenCikar(istekListesi, u, s);
  listeSonrasiTazele();
});

bagla("favoriBtn", "click", async function () {
  const u = aktifDetay.ulke, s = aktifDetay.sehir, k = aktifDetay.kayit;
  this.disabled = true; listeDurumu("");
  const { data, error } = await db.rpc("favori_degistir", { p_ulke: u, p_sehir: s });
  this.disabled = false;
  if (error) { listeDurumu(hataYaz(error.message)); listeDugmeleriniTazele(); return; }
  if (data) favoriListesi = favoriListesi.concat([{ ulke:u, sehir:s,
              enlem: k ? k.enlem : null, boylam: k ? k.boylam : null }]);
  else      favoriListesi = listedenCikar(favoriListesi, u, s);
  listeSonrasiTazele();
});


/* =====================================================================
   GEZGIN FOTOGRAFLARI
   Dosya Storage kovasinda, kayit sehir_fotolari tablosunda. Kova kapali
   oldugu icin gostermek icin sureli "imzali adres" aliyoruz — boylece
   "gizli" gercekten gizli, adresi bilen bile goremiyor.
   ===================================================================== */
const KOVA = "sehir-fotolari";

/* Profil fotografi ayri bir kovada ve o kova ACIK. Sehir fotograflari
   gizli olabildigi icin her gosterimde imzali adres uretiliyor; profil
   fotografi ise zaten her yerde gorunsun diye var (aramada, arkadas
   listesinde, fotografin altinda). Her avatar icin imza uretmek hem
   yavas olurdu hem anlamsiz. */
const PROFIL_KOVA = "profil-fotolari";

function profilFotoAdresi(yol) {
  if (!yol) return "";
  try {
    const { data } = db.storage.from(PROFIL_KOVA).getPublicUrl(yol);
    return (data && data.publicUrl) || "";
  } catch (e) { return ""; }
}

/* Tek yerden avatar kuruyoruz. Fotograf yoksa "dolu" sinifi konmuyor,
   CSS silueti gosteriyor. */
function avatarKur(el, yol) {
  if (!el) return;
  const adres = profilFotoAdresi(yol);
  if (adres) {
    el.style.backgroundImage = "url(" + adres + ")";
    el.classList.add("dolu");
  } else {
    el.style.backgroundImage = "";
    el.classList.remove("dolu");
  }
}

function avatarYap(yol, boy) {
  const d = document.createElement("div");
  d.className = "avatar avatar-" + (boy || "kucuk");
  avatarKur(d, yol);
  return d;
}

/* Avatar icin kare kirpip 256 piksele indiriyoruz. Sehir fotografinin
   kucultmesinden farkli: orada oran korunuyor, burada kare lazim. */
function avatarKucult(dosya) {
  return new Promise(function (coz, hata) {
    const oku = new FileReader();
    oku.onerror = function () { hata(new Error("Dosya okunamadi")); };
    oku.onload = function (e) {
      const im = new Image();
      im.onerror = function () { hata(new Error("Gorsel acilamadi")); };
      im.onload = function () {
        const B = 256;
        const kenar = Math.min(im.width, im.height);
        const sx = (im.width - kenar) / 2, sy = (im.height - kenar) / 2;
        const tuval = document.createElement("canvas");
        tuval.width = B; tuval.height = B;
        tuval.getContext("2d").drawImage(im, sx, sy, kenar, kenar, 0, 0, B, B);
        tuval.toBlob(function (blob) {
          if (blob) coz(blob); else hata(new Error("Donusturulemedi"));
        }, "image/jpeg", 0.85);
      };
      im.src = e.target.result;
    };
    oku.readAsDataURL(dosya);
  });
}
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
    const sik = document.createElement("button");
    sik.className = "foto-sikayet";
    sik.textContent = "şikayet";
    sik.title = "Bu fotoğrafı şikayet et";
    sik.addEventListener("click", function (e) {
      e.stopPropagation();
      sikayetAc("fotograf", f.id, f.kullanici_adi);
    });
    kart.appendChild(sik);

    const ad = document.createElement("span");
    ad.className = "foto-sahip";
    ad.appendChild(avatarYap(f.sahip_foto, "kucuk"));
    ad.appendChild(document.createTextNode(f.sahip));
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

/* Ay ve yil kutulari. Bir kez dolduruluyor; yil listesi bu yildan
   geriye 60 yil. Ileri tarih hic secilemiyor -- sunucu da reddediyor
   ama kullaniciya yanlis secenegi hic gostermemek daha iyi. */
let tarihKutulariHazir = false;
function tarihKutulariniDoldur() {
  if (tarihKutulariHazir) return;
  const ay = document.getElementById("sehirAy");
  const yil = document.getElementById("sehirYil");
  if (!ay || !yil) return;
  ay.innerHTML = "<option value=''>ay</option>";
  for (let i = 0; i < 12; i++) {
    const o = document.createElement("option");
    o.value = String(i + 1); o.textContent = AYLAR[i];
    ay.appendChild(o);
  }
  yil.innerHTML = "<option value=''>yıl</option>";
  const buYil = new Date().getFullYear();
  for (let y = buYil; y >= buYil - 60; y--) {
    const o = document.createElement("option");
    o.value = String(y); o.textContent = String(y);
    yil.appendChild(o);
  }
  tarihKutulariHazir = true;
}

function gezisiBul(ulke, sehir) {
  for (let i = 0; i < gezilenler.length; i++) {
    if (gezilenler[i].ulke === ulke && gezilenler[i].sehir === sehir) return gezilenler[i];
  }
  return null;
}

function tarihiGoster(ulke, sehir) {
  const g = gezisiBul(ulke, sehir);
  const ay = document.getElementById("sehirAy");
  const yil = document.getElementById("sehirYil");
  const tmz = document.getElementById("sehirTarihTemizle");
  if (!ay || !yil) return;
  if (g && g.gidilen) {
    const p = String(g.gidilen).split("-");
    yil.value = p[0]; ay.value = String(parseInt(p[1], 10));
  } else {
    yil.value = ""; ay.value = "";
  }
  if (tmz) tmz.style.display = (g && g.gidilen) ? "inline-block" : "none";
}

/* Iki kutudan biri bosken yazmiyoruz -- yarim tarih diye bir sey yok. */
async function tarihiKaydet() {
  const ulke = aktifDetay.ulke, sehir = aktifDetay.sehir;
  if (!ulke || !sehir) return;
  const ay = document.getElementById("sehirAy").value;
  const yil = document.getElementById("sehirYil").value;
  if ((ay && !yil) || (!ay && yil)) { fotoDurum("Hem ay hem yıl seçmelisin."); return; }

  const { data, error } = await db.rpc("sehir_tarihi_yaz", {
    p_ulke: ulke, p_sehir: sehir,
    p_yil: yil ? parseInt(yil, 10) : null,
    p_ay:  ay  ? parseInt(ay, 10)  : null
  });
  if (error) { fotoDurum(hataYaz(error.message)); return; }
  const g = gezisiBul(ulke, sehir);
  if (g) g.gidilen = data || null;
  yerelYaz("gezilenler", gezilenler);
  fotoDurum("");
  tarihiGoster(ulke, sehir);
  gezenleriYukle();
  if (document.getElementById("profilKart").classList.contains("acik")) profilDoldur();
}

/* =====================================================================
   YORUMLAR
   Sehir sayfasindaki not kutusu tek; uzerindeki anahtar acikken ayni
   metin bu sehrin sayfasinda herkese gorunuyor.

   Kisi basi sehir basina TEK yorum: sehir_detaylari'nda zaten
   (user_id, ulke, sehir) tek satir. Kimse kimseye cevap yazamiyor --
   sehir sayfasi sohbete donmesin diye.

   Yorum gizlilik anahtarindan ETKILENMIYOR. Kapali profilin yorumu da
   burada gorunuyor; acik bir sayfaya yazilmis bir seyi profilde
   gizlemek gostermelik olurdu.
   ===================================================================== */
function notDurumu(metin) {
  let el = document.getElementById("notDurum");
  if (!el) {
    const bolum = document.getElementById("notBolum");
    if (!bolum) return;
    el = document.createElement("div");
    el.id = "notDurum";
    bolum.appendChild(el);
  }
  el.textContent = metin || "";
}

function notAnahtariniCiz() {
  const kutu = document.getElementById("notAcikAnahtar");
  if (!kutu) return;
  const acik = kutu.checked;
  document.getElementById("notAcikBaslik").textContent =
    acik ? "Herkese açık yorum" : "Sadece sen görüyorsun";
  document.getElementById("notAcikNot").textContent = acik
    ? "Bu şehrin sayfasında adınla birlikte görünüyor."
    : "Açarsan bu şehrin sayfasında yorum olarak görünür.";
  const sayac = document.getElementById("notSayac");
  const uz = (document.getElementById("sehirNot").value || "").length;
  if (sayac) sayac.textContent = uz ? "(" + uz + "/600)" : "";
  notDurumu("");
}

async function yorumlariGoster() {
  const ulke = aktifDetay.ulke, sehir = aktifDetay.sehir;
  const bolum = document.getElementById("yorumBolum");
  const liste = document.getElementById("yorumListe");
  if (!liste) return;
  liste.innerHTML = "";
  const { data, error } = await db.rpc("sehir_yorumlari",
    { p_ulke: ulke, p_sehir: sehir });
  if (aktifDetay.ulke !== ulke || aktifDetay.sehir !== sehir) return;
  if (error) { console.log("yorumlar alinamadi:", error.message); }
  const satirlar = data || [];
  document.getElementById("yorumSayac").textContent =
    satirlar.length ? "(" + satirlar.length + ")" : "";
  /* Hic yorum yoksa bolumu hic gostermiyoruz: bos bir baslik, sehrin
     sayfasinda "burada bir sey olmali" hissi veriyor. */
  bolum.style.display = satirlar.length ? "block" : "none";
  for (let i = 0; i < satirlar.length; i++) liste.appendChild(yorumKarti(satirlar[i]));
}

function yorumKarti(y) {
  const kart = document.createElement("div");
  kart.className = "yorum-kart" + (y.benim ? " benim" : "");

  const ust = document.createElement("div");
  ust.className = "yorum-ust";
  ust.appendChild(avatarYap(y.sahip_foto, "kucuk"));

  const ad = document.createElement("span");
  ad.className = "yorum-ad";
  ad.textContent = y.benim ? "sen" : y.sahip;
  if (!y.benim && y.kullanici_adi) {
    ad.classList.add("tiklanir");
    ad.title = "@" + y.kullanici_adi + " haritasına git";
    ad.addEventListener("click", function () {
      hepsiniKapat(); gezginiAc(y.kullanici_adi);
    });
  }
  ust.appendChild(ad);

  if (y.puan) {
    const pu = document.createElement("span");
    pu.className = "yorum-puan";
    pu.textContent = "★".repeat(y.puan);
    pu.title = y.puan + "/5";
    ust.appendChild(pu);
  }

  const sag = document.createElement("span");
  sag.className = "yorum-sag";
  if (y.benim) {
    sag.textContent = "aşağıdan düzenle";
  } else {
    const sik = document.createElement("button");
    sik.className = "foto-sikayet";
    sik.textContent = "şikayet";
    sik.title = "Bu yorumu şikayet et";
    sik.addEventListener("click", function () {
      sikayetAc("yorum", null, y.kullanici_adi, aktifDetay.ulke, aktifDetay.sehir);
    });
    sag.appendChild(sik);
  }
  ust.appendChild(sag);
  kart.appendChild(ust);

  const metin = document.createElement("p");
  metin.className = "yorum-metin";
  metin.textContent = y.metin;
  kart.appendChild(metin);
  return kart;
}

/* Burayi gezenler. Sehir sayfasinin GOVDESININ DISINDA duruyor:
   gitmedigin bir sehirde de gorunmesi gerekiyor -- asil ise yaradigi
   yer orasi, "gidecegim, kimler gitmis" durumu. */
let gezenSuzgecAy = "";
function gezenSuzgeciSifirla() {
  gezenSuzgecAy = "";
  const dugmeler = document.querySelectorAll("#gezenSuzgec button");
  for (let i = 0; i < dugmeler.length; i++) {
    dugmeler[i].classList.toggle("secili", !dugmeler[i].dataset.ay);
  }
}
async function gezenleriYukle() {
  const kutu = document.getElementById("gezenListe");
  if (!kutu) return;
  const ulke = aktifDetay.ulke, sehir = aktifDetay.sehir;
  kutu.innerHTML = "<div class='gezen-bos'>Yükleniyor…</div>";

  const { data, error } = await db.rpc("sehir_gezenler", {
    p_ulke: ulke, p_sehir: sehir,
    p_ay: gezenSuzgecAy ? parseInt(gezenSuzgecAy, 10) : null,
    p_limit: 20
  });
  // Panel bu arada baska bir sehre gectiyse eski cevabi yazma
  if (aktifDetay.ulke !== ulke || aktifDetay.sehir !== sehir) return;
  if (error) { kutu.innerHTML = "<div class='gezen-bos'>Liste alınamadı.</div>"; return; }

  const liste = data || [];
  kutu.innerHTML = "";
  if (!liste.length) {
    const bos = document.createElement("div");
    bos.className = "gezen-bos";
    bos.textContent = gezenSuzgecAy
      ? "Bu aralıkta burayı gezen kimse görünmüyor."
      : "Burayı gezen kimse görünmüyor.";
    kutu.appendChild(bos);
    return;
  }
  for (let i = 0; i < liste.length; i++) {
    (function (g) {
      const sat = document.createElement("div");
      sat.className = "gezen-satir";
      sat.appendChild(avatarYap(g.foto, "kucuk"));
      const ad = document.createElement("span");
      ad.className = "gezen-ad";
      ad.innerHTML = "@" + kacisla(g.kullanici_adi) +
        (g.benim ? " <em>(sen)</em>" : (g.isim ? " <em>" + kacisla(g.isim) + "</em>" : ""));
      sat.appendChild(ad);
      if (g.gidilen) {
        const t = document.createElement("span");
        t.className = "gezen-tarih";
        t.textContent = tarihYaz(g.gidilen);
        sat.appendChild(t);
      }
      if (!g.benim) {
        sat.addEventListener("click", function () {
          hepsiniKapat();
          gezginiAc(g.kullanici_adi);
        });
      } else {
        sat.style.cursor = "default";
      }
      kutu.appendChild(sat);
    })(liste[i]);
  }
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
   PROFIL EKRANI
   Tek bir cizim yolu var: kendi profilim de, baskasinin profili de ayni
   #profilKart icine ciziliyor. Onceden iki ayri kod vardi -- kendi
   profilim kartta, baskasininki sag paneldeydi. Birinde duzelttigimiz
   sey otekinde duruyordu; ornegin avatar boyu iki yerde iki turluydu.
   Simdi once bir "kaynak" hazirlaniyor (kim, hangi sayilar, hangi
   sehirler, neyi gorebiliyorum), sonra ust kisim ve secili sekme o
   kaynaktan doluyor.

   Ust kisim SABIT: fotograf, kullanici adi, isim, konum, sayilar.
   Kayan tek yer sekme govdesi.
   ===================================================================== */
let acikSekme  = "gezdim";
let sonKaynak  = null;
let fotoSekmeDamgasi = 0;      // yavas gelen fotograf istegi eski sekmeye yazmasin

function profilKaynagi() {
  if (misafir) {
    return {
      benim:     false,
      benimHesabim: misafir.benim === true,   // kendi profilime disaridan bakiyorum
      ad:        misafir.kullanici_adi,
      isim:      misafir.isim  || "",
      konum:     misafir.konum || "",
      foto:      misafir.foto  || "",
      kita:      misafir.kita, ulke: misafir.ulke, sehir: misafir.sehirSayisi,
      gorebilir: misafir.gorebilir !== false,
      kayitAcik: misafir.hareketAcik === true,
      sehirler:  misafir.sehirler || [],
      kayit:     misafir.kayit || [],
      istekler:  misafir.istekler  || [],
      favoriler: misafir.favoriler || [],
      yorumlar:  misafir.yorumlar  || []
    };
  }
  const ulkeler = [], kitalar = [];
  for (let i = 0; i < gezilenler.length; i++) {
    if (ulkeler.indexOf(gezilenler[i].ulke) === -1) ulkeler.push(gezilenler[i].ulke);
    const k = ulkeKita[gezilenler[i].ulke];
    if (k && kitalar.indexOf(k) === -1) kitalar.push(k);
  }
  const sehirler = gezilenler.map(function (g) {
    const k = gezilenKoord[anahtar(g.ulke, g.sehir)];
    return { ulke: g.ulke, sehir: g.sehir,
             enlem: k ? k.lat : null, boylam: k ? k.lng : null };
  });
  return {
    benim: true, benimHesabim: true,
    ad:    profilVeri.kullanici_adi || "",
    isim:  profilVeri.isim  || "",
    konum: profilVeri.konum || "",
    foto:  profilVeri.foto  || "",
    kita: kitalar.length, ulke: ulkeler.length, sehir: gezilenler.length,
    gorebilir: true, kayitAcik: true,
    sehirler: sehirler,
    kayit: gezileriSirala(gezilenler),
    istekler:  istekListesi,
    favoriler: favoriListesi,
    yorumlar:  null            /* kendi yorumlarim sekme acilinca cekiliyor */
  };
}

function profilAc() {
  if (!misafir) arkadasNabiz(true);      // istek gelmis olabilir, bakalim
  profilEkraniCiz();
  sadeceBuPanel("profilKart", true);
}

/* Baskasinin haritasindayken "Profil"e basmak kendi profilimi acmali.
   Yoksa dugme hicbir sey yapmiyormus gibi gorunuyordu. */
function kendiProfilim() {
  if (misafir) misafirdenCik();          // hepsiniKapat() da cagiriyor
  profilAc();
}

function profilKapat() {
  document.getElementById("profilKart").classList.remove("acik");
  document.getElementById("harita").classList.remove("itili");
}

function profilEkraniCiz() {
  const k = profilKaynagi();
  sonKaynak = k;

  document.getElementById("profilAd").textContent =
    k.ad ? "@" + k.ad : (k.isim || "Profil");
  /* Isim ve konum ayni satirda: avatar 76 piksel, yanindaki yazi bloku
     uc satir olunca onunla hizalaniyor. */
  const alt = document.getElementById("profilAltSatir");
  const parcalar = [k.isim, k.konum].filter(Boolean);
  alt.textContent = parcalar.join(" · ");
  alt.hidden = !parcalar.length;
  avatarKur(document.getElementById("profilAvatar"), k.foto);

  sayilariYaz(k);
  favorileriCiz(k);

  /* Cark sadece kendi profilimde. */
  document.getElementById("ayarlarAc").hidden = !k.benim;

  ustEkiCiz(k);

  /* Gorunmeyen sekmelerin icini bosalt. Yoksa baskasinin profilinden
     kendi profilime gecerken, o an kapali olan sekmede ONUN icerigi
     duruyor; sekmeye basana kadar da yeniden cizilmiyor. */
  for (const s in SEKME_GOVDE) {
    const g = document.getElementById(SEKME_GOVDE[s]);
    if (g) g.innerHTML = "";
  }

  if (!k.benim && acikSekme === "arkadas") acikSekme = "gezdim";
  sekmeSec(acikSekme);
}

/* Sayilar tek cumle halinde. Arkadas sayisini saga yaslamiyoruz:
   telefonda avatarin yaninda ~250 piksel yer var, "6 kita · 84 ulke ·
   312 sehir" tek basina 175 piksel ediyor -- saga yaslanmis bir sayi
   orada sikisirdi. Cumlenin icinde olunca uzun sayilarda satir
   kendiliginden alta kayiyor. */
function sayiParcasi(sayi, ad) {
  const s = document.createElement("span");
  s.className = "sayi-parca";
  const b = document.createElement("b");
  b.textContent = sayi || 0;
  s.appendChild(b);
  s.appendChild(document.createTextNode(" " + ad));
  return s;
}

function sayilariYaz(k) {
  const kutu = document.getElementById("profilSayiYazi");
  kutu.innerHTML = "";
  kutu.appendChild(sayiParcasi(k.kita,  "kıta"));
  kutu.appendChild(sayiParcasi(k.ulke,  "ülke"));
  kutu.appendChild(sayiParcasi(k.sehir, "şehir"));
  if (!k.benim) return;          // baskasinin arkadas listesi sunucudan gelmiyor
  const dgm = document.createElement("button");
  dgm.type = "button";
  dgm.id = "arkadasSayiBtn";
  dgm.className = "sayi-parca sayi-baglanti" +
                  (acikSekme === "arkadas" ? " secili" : "") +
                  (gelenIstekler.length ? " bekleyen" : "");
  const b = document.createElement("b");
  b.textContent = arkadasListesi.length;
  dgm.appendChild(b);
  dgm.appendChild(document.createTextNode(" arkadaş"));
  dgm.addEventListener("click", function () { sekmeSec("arkadas"); });
  kutu.appendChild(dgm);
}

/* Favoriler: en fazla 6 sehir, profilin ust kisminda. Kapali profilde
   gosterilmiyor -- nereleri sevdigin de nereye gittigin bilgisi. */
const FAVORI_SINIR = 6;

function favorileriCiz(k) {
  const kutu = document.getElementById("profilFavoriler");
  const liste = (k.gorebilir ? (k.favoriler || []) : []).slice(0, FAVORI_SINIR);
  kutu.innerHTML = "";
  kutu.hidden = !liste.length;
  if (!liste.length) return;
  const yildiz = document.createElement("span");
  yildiz.className = "favori-yildiz";
  yildiz.textContent = "★";
  kutu.appendChild(yildiz);
  for (let i = 0; i < liste.length; i++) {
    (function (f) {
      const e = document.createElement("button");
      e.type = "button";
      e.className = "favori-etiket";
      e.textContent = f.sehir;
      e.title = f.sehir + " — " + f.ulke;
      e.addEventListener("click", function () {
        if (f.enlem != null) kureyeGit(f.enlem, f.boylam, true);
        if (k.benim) sehirDetayAc(f.ulke, f.sehir);
      });
      kutu.appendChild(e);
    })(liste[i]);
  }
}

/* Ust kismin altindaki degisken satir: kendi profilimde kullanici adi
   alma kutusu (adim yoksa), baskasinin profilinde arkadaslik ve
   engelle/sikayet dugmeleri. */
function ustEkiCiz(k) {
  const ek = document.getElementById("profilUstEk");
  ek.innerHTML = "";
  if (k.benim) {
    if (!k.ad) ek.appendChild(kullaniciAdiKutusu());
    return;
  }
  if (!k.benimHesabim) {
    ek.appendChild(arkadaslikDugmesi());
    ek.appendChild(gezginIslemleri());
  }
}

const SEKME_GOVDE = { gezdim: "sekmeGezdim", istek: "sekmeIstek",
                      foto: "sekmeFoto", yorum: "sekmeYorum",
                      arkadas: "sekmeArkadas" };

function sekmeSec(ad) {
  if (!SEKME_GOVDE[ad]) ad = "gezdim";
  acikSekme = ad;
  const dgm = document.querySelectorAll("#profilSekmeler .sekme-btn");
  for (let i = 0; i < dgm.length; i++)
    dgm[i].classList.toggle("secili", dgm[i].dataset.sekme === ad);
  const arkDgm = document.getElementById("arkadasSayiBtn");
  if (arkDgm) arkDgm.classList.toggle("secili", ad === "arkadas");
  for (const s in SEKME_GOVDE)
    document.getElementById(SEKME_GOVDE[s]).hidden = (s !== ad);
  const govde = document.getElementById("profilIcerik");
  if (govde) govde.scrollTop = 0;

  const k = sonKaynak || profilKaynagi();
  if (ad === "gezdim")       sekmeGezdimCiz(k);
  else if (ad === "foto")    sekmeFotoCiz(k);
  else if (ad === "arkadas") arkadasBolumu();
  else if (ad === "istek")   sekmeIstekCiz(k);
  else if (ad === "yorum")   sekmeYorumCiz(k);
}

/* --- kucuk yapi taslari ------------------------------------------- */
function sekmeBasligi(metin) {
  const b = document.createElement("div");
  b.className = "sekme-baslik";
  b.textContent = metin;
  return b;
}
function bosYazi(metin) {
  const b = document.createElement("div");
  b.className = "arkadas-bos";
  b.textContent = metin;
  return b;
}
function yerTutucu(id, k, benimMetin, onunMetni) {
  const kutu = document.getElementById(id);
  kutu.innerHTML = "";
  kutu.appendChild(bosYazi(k.benim ? benimMetin : onunMetni));
}
/* Kapali profil GIZLI degil: kimlik ve sayilar duruyor, harita ve
   fotograflar yok. Sunucu zaten bos donuyor; burasi kullaniciya NEDEN
   bos oldugunu soyluyor, yoksa "veri gelmedi" saniyor. */
function kilitYazisi(k) {
  const kilit = document.createElement("div");
  kilit.className = "gezgin-kilit";
  kilit.textContent = "@" + k.ad + " haritasını sadece arkadaşlarına gösteriyor. " +
    "Arkadaş olduğunuzda gezdiği yerleri ve fotoğraflarını görebilirsin.";
  return kilit;
}

/* --- GEZDIKLERIM: once ulkeler, sonra gezi kaydi ------------------- */
function sekmeGezdimCiz(k) {
  const kutu = document.getElementById("sekmeGezdim");
  kutu.innerHTML = "";
  if (!k.gorebilir) { kutu.appendChild(kilitYazisi(k)); return; }
  if (!k.sehirler.length) {
    kutu.appendChild(bosYazi(k.benim
      ? "Henüz gezdiğin yer yok. Küreden bir ülkeye tıklayarak başla."
      : "Henüz gezdiği bir yer görünmüyor."));
    return;
  }

  const sayim = {};
  for (let i = 0; i < k.sehirler.length; i++) {
    const u = k.sehirler[i].ulke;
    sayim[u] = (sayim[u] || 0) + 1;
  }
  const adlar = Object.keys(sayim).sort(function (a, b) { return sayim[b] - sayim[a]; });
  kutu.appendChild(sekmeBasligi("ÜLKELER (" + adlar.length + ")"));

  const ulkeKutu = document.createElement("div");
  ulkeKutu.className = "gezgin-ulkeler";
  adlar.forEach(function (u) {
    const sat = document.createElement("div");
    sat.className = "gezgin-ulke";
    sat.innerHTML = "<span>" + kacisla(u) + "</span><b>" + sayim[u] + "</b>";
    sat.addEventListener("click", function () {
      const s = k.sehirler.find(function (x) { return x.ulke === u && x.enlem != null; });
      if (s) kureyeGit(s.enlem, s.boylam, false);
      panelAc(u);
    });
    ulkeKutu.appendChild(sat);
  });
  kutu.appendChild(ulkeKutu);

  if (k.kayitAcik && k.kayit.length) {
    kutu.appendChild(sekmeBasligi("GEZİ KAYDI"));
    const kayitKutu = document.createElement("div");
    for (let i = 0; i < k.kayit.length && i < 30; i++) {
      const g = k.kayit[i];
      const sat = document.createElement("div");
      sat.className = "kayit-satir";
      const yer = document.createElement("span");
      yer.className = "kayit-yer";
      yer.innerHTML = kacisla(g.sehir) + " <em>— " + kacisla(g.ulke) + "</em>";
      const tar = document.createElement("span");
      tar.className = "kayit-tarih" + (g.gidilen ? "" : " yok");
      tar.textContent = g.gidilen ? tarihYaz(g.gidilen) : "tarih yok";
      sat.appendChild(yer); sat.appendChild(tar);
      if (k.benim) {
        sat.classList.add("tiklanir");
        sat.addEventListener("click", function () { sehirDetayAc(g.ulke, g.sehir); });
      }
      kayitKutu.appendChild(sat);
    }
    kutu.appendChild(kayitKutu);
  } else if (!k.benim && !k.kayitAcik) {
    kutu.appendChild(sekmeBasligi("GEZİ KAYDI"));
    kutu.appendChild(bosYazi("Nereye ne zaman gittiğini paylaşmıyor."));
  }
}

/* --- GITMEK ISTEDIKLERIM ------------------------------------------
   Kurede gosterilmiyor: gezdiklerinle ayni kurede iki farkli anlam
   tasiyan isaret olurdu, karisirdi. Liste olarak duruyor. */
function sekmeIstekCiz(k) {
  const kutu = document.getElementById("sekmeIstek");
  kutu.innerHTML = "";
  if (!k.gorebilir) { kutu.appendChild(kilitYazisi(k)); return; }
  const liste = k.istekler || [];
  if (!liste.length) {
    kutu.appendChild(bosYazi(k.benim
      ? "Henüz bir yer eklemedin. Bir şehrin sayfasını açıp \u201cGitmek istiyorum\u201d de."
      : "Gitmek istediği bir yer görünmüyor."));
    return;
  }
  kutu.appendChild(sekmeBasligi("GİTMEK İSTEDİKLERİ" + (k.benim ? "M" : "") +
                                " (" + liste.length + ")"));
  const kutu2 = document.createElement("div");
  kutu2.className = "gezgin-ulkeler";
  for (let i = 0; i < liste.length; i++) {
    (function (r) {
      const sat = document.createElement("div");
      sat.className = "gezgin-ulke";
      sat.innerHTML = "<span>" + kacisla(r.sehir) +
                      " <em>— " + kacisla(r.ulke) + "</em></span>";
      sat.addEventListener("click", function () {
        if (r.enlem != null) kureyeGit(r.enlem, r.boylam, true);
        if (k.benim) sehirDetayAc(r.ulke, r.sehir);
      });
      kutu2.appendChild(sat);
    })(liste[i]);
  }
  kutu.appendChild(kutu2);
}

/* --- YORUMLAR ------------------------------------------------------
   Gizlilik anahtarina bagli DEGIL: yorum sehir sayfasinda zaten acik
   duruyor, profilde gizlemek gostermelik olurdu. Fotograflarda da
   ayni mantik var. */
let yorumSekmeDamgasi = 0;

async function sekmeYorumCiz(k) {
  const kutu = document.getElementById("sekmeYorum");
  const damga = ++yorumSekmeDamgasi;
  kutu.innerHTML = "<p class='panel-durum'>Yükleniyor…</p>";
  let liste = k.yorumlar;
  if (liste === null || liste === undefined) {
    const { data, error } = await db.rpc("yorumlarim");
    if (damga !== yorumSekmeDamgasi) return;
    if (error) { console.log("yorumlar alinamadi:", error.message); liste = []; }
    else liste = data || [];
  }
  if (damga !== yorumSekmeDamgasi) return;

  kutu.innerHTML = "";
  if (!liste.length) {
    kutu.appendChild(bosYazi(k.benim
      ? "Henüz yorum yazmadın. Gittiğin bir şehrin sayfasını aç, notunu yaz ve “herkese açık” yap."
      : "Yazdığı bir yorum yok."));
    return;
  }
  kutu.appendChild(sekmeBasligi("YORUMLAR (" + liste.length + ")"));
  for (let i = 0; i < liste.length; i++) {
    (function (y) {
      const kart = document.createElement("div");
      kart.className = "yorum-kart tiklanir";
      const ust = document.createElement("div");
      ust.className = "yorum-ust";
      const yer = document.createElement("span");
      yer.className = "yorum-ad";
      yer.innerHTML = kacisla(y.sehir) + " <em>— " + kacisla(y.ulke) + "</em>";
      ust.appendChild(yer);
      if (y.puan) {
        const pu = document.createElement("span");
        pu.className = "yorum-puan";
        pu.textContent = "★".repeat(y.puan);
        ust.appendChild(pu);
      }
      kart.appendChild(ust);
      const metin = document.createElement("p");
      metin.className = "yorum-metin";
      metin.textContent = y.metin;
      kart.appendChild(metin);
      kart.addEventListener("click", function () { sehirDetayAc(y.ulke, y.sehir); });
      kutu.appendChild(kart);
    })(liste[i]);
  }
}

/* --- FOTOGRAFLAR --------------------------------------------------- */
/* Kendi fotograflarim icin ayri bir sunucu fonksiyonuna gerek yok:
   sehir_fotolari'nin okuma kurali zaten "benimse ya da herkese acikssa"
   diyor, yani kendi satirlarimi dogrudan cekebiliyorum. */
async function kendiFotolarim() {
  const { data: oturum } = await db.auth.getSession();
  if (!oturum.session) return [];
  const { data, error } = await db.from("sehir_fotolari")
    .select("id,ulke,sehir,yol,gorunurluk,created_at")
    .eq("user_id", oturum.session.user.id)
    .order("created_at", { ascending: false });
  if (error) { console.log("fotograflar alinamadi:", error.message); return []; }
  return data || [];
}

async function sekmeFotoCiz(k) {
  const kutu = document.getElementById("sekmeFoto");
  kutu.innerHTML = "";
  if (!k.gorebilir) { kutu.appendChild(kilitYazisi(k)); return; }

  const damga = ++fotoSekmeDamgasi;
  kutu.innerHTML = "<p class='panel-durum'>Yükleniyor…</p>";
  const liste = k.benim ? await kendiFotolarim()
                        : ((misafir && misafir.fotolar) || []);
  if (damga !== fotoSekmeDamgasi) return;          // baska sekmeye gecildi
  const adres = await imzaliAdresler(liste.map(function (f) { return f.yol; }));
  if (damga !== fotoSekmeDamgasi) return;

  kutu.innerHTML = "";
  if (!liste.length) {
    kutu.appendChild(bosYazi(k.benim
      ? "Henüz fotoğraf eklemedin. Bir şehrin sayfasını açıp ekleyebilirsin."
      : "Paylaştığı bir fotoğraf yok."));
    return;
  }
  kutu.appendChild(sekmeBasligi("FOTOĞRAFLAR (" + liste.length + ")"));
  if (k.benim) {
    const not = document.createElement("div");
    not.className = "sekme-not";
    not.textContent = "Silmek ya da gizlemek için fotoğrafa dokun; şehrin sayfası açılır.";
    kutu.appendChild(not);
  }

  const izgara = document.createElement("div");
  izgara.className = "foto-izgara";
  for (let i = 0; i < liste.length; i++) {
    (function (f) {
      const kart = document.createElement("div");
      kart.className = "foto-kart tiklanir";
      const im = document.createElement("img");
      im.loading = "lazy"; im.alt = "";
      if (adres[f.yol]) im.src = adres[f.yol];
      kart.appendChild(im);
      const yer = document.createElement("span");
      yer.className = "foto-sahip";
      yer.textContent = f.sehir;
      kart.appendChild(yer);
      /* Kendi fotografimda "gizli/acik" rozeti ise yariyor: profilde
         hangisinin herkese acik oldugunu yoksa goremiyorum. */
      if (k.benim && f.gorunurluk !== "herkes") {
        const rz = document.createElement("span");
        rz.className = "foto-rozet";
        rz.textContent = "gizli";
        kart.appendChild(rz);
      }
      kart.addEventListener("click", function () {
        const s = k.sehirler.find(function (x) {
          return x.ulke === f.ulke && x.sehir === f.sehir; });
        if (s && s.enlem != null) kureyeGit(s.enlem, s.boylam, true);
        if (k.benim) sehirDetayAc(f.ulke, f.sehir);
      });
      izgara.appendChild(kart);
    })(liste[i]);
  }
  kutu.appendChild(izgara);
}

/* Eski adiyla duruyor: bircok yerden cagriliyor. Isim/konum/fotograf
   artik Ayarlar'da, o yuzden iki yeri birden tazeliyor. */
function profilDoldur() {
  ayarProfilDoldur();
  if (document.getElementById("profilKart").classList.contains("acik")) profilEkraniCiz();
}

function ayarProfilDoldur() {
  const isim = document.getElementById("profilIsim");
  if (!isim) return;
  isim.value = profilVeri.isim || "";
  document.getElementById("profilKonum").value = profilVeri.konum || "";
  avatarKur(document.getElementById("ayarAvatar"), profilVeri.foto);
  document.getElementById("profilFotoKaldir").style.display =
    profilVeri.foto ? "inline-block" : "none";
  profilButonFotoGuncelle();
}

/* Kullanici adi. Bir kez alindiktan sonra degistirilmiyor -- baskalari
   o adla profiline gidiyor. Adi olmayan hesap zaten giriste kapiya
   takiliyor; bu kutu eski hesaplar icin duruyor. */
function kullaniciAdiKutusu() {
  const bolum = document.createElement("div");
  bolum.id = "kullaniciAdiBolum";

  const not = document.createElement("div");
  not.className = "kullanici-adi-not";
  not.textContent = "Diğer gezginlerin seni bulabilmesi için bir kullanıcı adı seç. " +
                    "Küçük harf, rakam ve alt çizgi; 3-20 karakter. Sonradan değiştirilemiyor.";
  bolum.appendChild(not);

  const satir = document.createElement("div");
  satir.className = "kullanici-adi-satir";
  const gir = document.createElement("input");
  gir.type = "text"; gir.placeholder = "kullanıcı adı"; gir.maxLength = 20;
  gir.autocapitalize = "none"; gir.spellcheck = false; gir.autocomplete = "off";
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
    profilEkraniCiz();
  });
  satir.appendChild(gir); satir.appendChild(dgm);
  bolum.appendChild(satir); bolum.appendChild(uyari);
  return bolum;
}

/* Sekme dugmeleri */
(function sekmeleriBagla() {
  const dgm = document.querySelectorAll("#profilSekmeler .sekme-btn");
  for (let i = 0; i < dgm.length; i++) {
    dgm[i].addEventListener("click", function () { sekmeSec(this.dataset.sekme); });
  }
})();


/* =====================================================================
   ARKADASLIK
   Karsilikli: istek gonderilir, karsi taraf kabul edene kadar
   arkadaslik kurulmaz.
   ===================================================================== */
let arkadasListesi = [];
let gelenIstekler  = [];

/* Gezginin panelindeki dugme. Dort durum var, dordu de farkli davraniyor. */
/* Engelle ve sikayet et. Mesajlasma olmayan bir uygulamada engellemenin
   anlami: bu kisi profilime, harita ve fotograflarima erisemesin, ben de
   onu aramada ve "burayi gezenler" listesinde gormeyeyim. Iki yonlu. */
/* =====================================================================
   SIKAYET
   Iki hedef var: bir fotograf, ya da bir kullanici. Sebep sabit bir
   listeden; aciklama istege bagli. Kayit sadece yoneticiye gorunuyor,
   kimse baskasinin sikayetini goremiyor.
   ===================================================================== */
const SIKAYET_SEBEPLERI = [
  ["uygunsuz", "Uygunsuz ya da rahatsız edici içerik"],
  ["taciz",    "Taciz, hakaret ya da tehdit"],
  ["spam",     "Spam ya da sahte hesap"],
  ["telif",    "Bana ait bir içerik izinsiz kullanılmış"],
  ["diger",    "Diğer"]
];
let sikayetHedef = null;

function sikayetAc(tur, fotoId, kullaniciAdi, ulke, sehir) {
  sikayetHedef = { tur: tur, foto: fotoId || null, ad: kullaniciAdi || null,
                   ulke: ulke || null, sehir: sehir || null };
  /* Basliga kullanici adini ek alarak koymuyoruz: Turkce'de ek sesli
     harfe gore degisiyor (@mert'i ama @ayse'yi) ve kullanici adi ne
     olacagi belli degil. Adi ayri satirda yaziyoruz. */
  document.getElementById("sikayetBaslik").textContent =
    tur === "fotograf" ? "Fotoğrafı şikayet et"
  : tur === "yorum"    ? "Yorumu şikayet et"
                       : "Kullanıcıyı şikayet et";
  document.querySelector("#sikayetKutu .sikayet-not").textContent =
    (kullaniciAdi ? "@" + kullaniciAdi + " — " : "") + "ne oldu?";
  const kutu = document.getElementById("sikayetSebepler");
  kutu.innerHTML = "";
  for (let i = 0; i < SIKAYET_SEBEPLERI.length; i++) {
    (function (kod, yazi) {
      const b = document.createElement("button");
      b.textContent = yazi;
      b.dataset.sebep = kod;
      b.addEventListener("click", function () {
        const hepsi = kutu.querySelectorAll("button");
        for (let j = 0; j < hepsi.length; j++) hepsi[j].classList.toggle("secili", hepsi[j] === b);
      });
      kutu.appendChild(b);
    })(SIKAYET_SEBEPLERI[i][0], SIKAYET_SEBEPLERI[i][1]);
  }
  document.getElementById("sikayetAciklama").value = "";
  document.getElementById("sikayetDurum").textContent = "";
  document.getElementById("sikayetKutu").classList.add("acik");
}

function sikayetKapat() {
  document.getElementById("sikayetKutu").classList.remove("acik");
  sikayetHedef = null;
}

document.getElementById("sikayetVazgec").addEventListener("click", sikayetKapat);
document.getElementById("sikayetKutu").addEventListener("click", function (e) {
  if (e.target === this) sikayetKapat();      // disina tiklayinca kapansin
});

document.getElementById("sikayetGonder").addEventListener("click", async function () {
  if (!sikayetHedef) return;
  const secili = document.querySelector("#sikayetSebepler button.secili");
  const durum = document.getElementById("sikayetDurum");
  if (!secili) { durum.textContent = "Bir sebep seç."; return; }
  this.disabled = true;
  durum.textContent = "Gönderiliyor…";
  const { error } = await db.rpc("sikayet_et", {
    p_tur: sikayetHedef.tur,
    p_foto_id: sikayetHedef.foto,
    p_kullanici_adi: sikayetHedef.ad,
    p_sebep: secili.dataset.sebep,
    p_aciklama: document.getElementById("sikayetAciklama").value,
    p_ulke: sikayetHedef.ulke,
    p_sehir: sikayetHedef.sehir
  });
  this.disabled = false;
  if (error) { durum.textContent = hataYaz(error.message); return; }
  durum.textContent = "Gönderildi. Teşekkürler, en kısa sürede bakılacak.";
  setTimeout(sikayetKapat, 1400);
});

function gezginIslemleri() {
  const kutu = document.createElement("div");
  kutu.className = "gezgin-islem";

  const eng = document.createElement("button");
  eng.className = "metin-btn";
  eng.textContent = "engelle";
  eng.addEventListener("click", async function () {
    const ad = misafir.kullanici_adi;
    if (!confirm("@" + ad + " engellensin mi?\n\n" +
                 "Haritanı ve fotoğraflarını göremez, sen de onu görmezsin. " +
                 "Arkadaşsanız arkadaşlığınız kalkar.")) return;
    eng.disabled = true;
    const { error } = await db.rpc("engelle", { p_kullanici_adi: ad });
    eng.disabled = false;
    if (error) { alert(hataYaz(error.message)); return; }
    misafirdenCik();
    arkadasVeriTazele();
    /* Engel listesi kendiliginden tazelenmiyordu: birini engelledikten
       sonra Ayarlar'a girince liste bos gorunuyor, ancak sayfa
       yenilenince beliriyordu. */
    engelListesiniYukle();
  });

  const sik = document.createElement("button");
  sik.className = "metin-btn";
  sik.textContent = "şikayet et";
  sik.addEventListener("click", function () {
    sikayetAc("kullanici", null, misafir.kullanici_adi);
  });

  kutu.appendChild(eng);
  kutu.appendChild(sik);
  return kutu;
}

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
      profilEkraniCiz();
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

/* Arkadaslik verisi acilista bir kez yukleniyordu. Yani sen sayfayi
   acikken sana istek gelirse hicbir sey degismiyor: rozet cikmiyor,
   liste guncellenmiyor, karsi taraf "gonderdim" diyor ama sen
   goremiyorsun. Olan tam olarak buydu.

   Uc yerden tazeliyoruz:
     1. Dakikada bir (sekme onde degilse atlanıyor, bosuna istek yok)
     2. Sekmeye geri donuldugunde -- telefonda asil ise yarayan bu
     3. Profil karti acilirken
   Gercek zamanli bir baglanti kurmak da mumkun ama bu kadar seyrek bir
   olay icin surekli acik bir baglanti tasimaya degmez. */
let sonTazeleme = 0;
async function arkadasNabiz(zorla) {
  const simdi = Date.now();
  if (!zorla && simdi - sonTazeleme < 20000) return;   // ust uste cagirmayi engelle
  sonTazeleme = simdi;
  try { await arkadasVeriTazele(); } catch (e) {}
}

setInterval(function () {
  if (!document.hidden) arkadasNabiz(false);
}, 60000);

document.addEventListener("visibilitychange", function () {
  if (!document.hidden) arkadasNabiz(false);
});

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
  mobilRozetTazele();
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

/* Mobilde profil dugmesi alt seritte; rozet de oraya tasiniyor.
   arkadasRozeti() masaustundeki dugmeye yaziyor, o dugme telefonda
   gizli oldugu icin rozet gorunmez kaliyordu. */
function mobilRozetTazele() {
  const btn = document.getElementById("mobilProfil");
  if (!btn) return;
  btn.classList.toggle("rozetli", gelenIstekler.length > 0);
}

/* Profil kartindaki arkadas bolumu: once gelen istekler, sonra liste. */
function arkadasBolumu() {
  const bolum = document.getElementById("sekmeArkadas");
  if (!bolum) return;
  bolum.innerHTML = "";

  if (gelenIstekler.length) {
    bolum.appendChild(sekmeBasligi("GELEN İSTEKLER"));
    for (let i = 0; i < gelenIstekler.length; i++) {
      (function (g) {
        const sat = document.createElement("div");
        sat.className = "arkadas-satir istek";
        sat.appendChild(avatarYap(g.foto, "kucuk"));
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

  bolum.appendChild(sekmeBasligi("ARKADAŞLARIN" +
    (arkadasListesi.length ? " (" + arkadasListesi.length + ")" : "")));

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
      sat.appendChild(avatarYap(g.foto, "kucuk"));
      const ad2 = document.createElement("span");
      ad2.className = "arkadas-ad";
      ad2.textContent = "@" + g.kullanici_adi;
      sat.appendChild(ad2);
      const sag2 = document.createElement("span");
      sag2.className = "arkadas-sag";
      sag2.textContent = g.ulke_sayisi + " ülke";
      sat.appendChild(sag2);
      sat.title = g.isim || "";
      sat.addEventListener("click", function () {
        gezginiAc(g.kullanici_adi);
      });
      bolum.appendChild(sat);
    })(arkadasListesi[i]);
  }
}

/* =====================================================================
   AYARLAR
   Profilden ayri bir ekran. "Haritayi Sifirla" ve "Hesabimi Sil" her
   acilista goz onunde durmasin diye; ayrica profil kartini kisaltiyor.
   ===================================================================== */
async function ayarlariAc() {
  sadeceBuPanel("ayarlarPanel", true);
  profilDuzenleme = false;
  ayarProfilDoldur();
  profilKilitle(true);
  gizlilikAnahtariniCiz();
  hareketAnahtariniCiz();
  engelListesiniYukle();
  sifreDurumu("");
  const { data: oturum } = await db.auth.getSession();
  document.getElementById("ayarEposta").textContent =
    (oturum.session && oturum.session.user && oturum.session.user.email) || "—";
}

function sifreDurumu(metin, hata) {
  const d = document.getElementById("sifreDurum");
  if (!d) return;
  d.className = "ayar-durum" + (hata ? " hata" : "");
  d.textContent = metin || "";
}

bagla("ayarlarAc", "click", ayarlariAc);
bagla("ayarlarKapat", "click", hepsiniKapat);
bagla("ayarlarGeri", "click", function () { profilAc(); });

/* Sifre degistirme. Supabase'de "guvenli sifre degisikligi" ayari aciksa
   yakin zamanda giris yapmis olmak gerekiyor; o durumda anlasilir bir
   mesaj veriyoruz, ham hatayi degil. */
document.getElementById("sifreDegistir").addEventListener("click", async function () {
  const a = document.getElementById("yeniSifre1").value;
  const b = document.getElementById("yeniSifre2").value;
  if (a.length < 6) { sifreDurumu("Şifre en az 6 karakter olmalı.", true); return; }
  if (a !== b)      { sifreDurumu("İki şifre aynı değil.", true); return; }
  this.disabled = true;
  sifreDurumu("Değiştiriliyor…");
  const { error } = await db.auth.updateUser({ password: a });
  this.disabled = false;
  if (error) {
    sifreDurumu(/reauth|recent|session|login/i.test(error.message)
      ? "Güvenlik için yeniden giriş yapman gerekiyor. Çıkış yapıp tekrar gir, sonra dene."
      : hataYaz(error.message), true);
    return;
  }
  document.getElementById("yeniSifre1").value = "";
  document.getElementById("yeniSifre2").value = "";
  sifreDurumu("Şifren değişti.");
});

function profilKilitle(kilitli) {
  document.getElementById("profilIsim").disabled = kilitli;
  document.getElementById("profilKonum").disabled = kilitli;
  document.getElementById("profilKaydet").style.display = kilitli ? "none" : "block";
  document.getElementById("profilDegistir").style.display = kilitli ? "block" : "none";
  document.getElementById("profilFotoIsler").style.display = kilitli ? "none" : "flex";
  const cerceve = document.getElementById("profilDuzenle");
  if (cerceve) cerceve.classList.toggle("duzenlenir", !kilitli);
  /* Gorunurluk anahtarlari artik Ayarlar ekraninda; profil duzenleme
     kilidiyle iliskileri kalmadi. */
}
/* Profil acik mi kapali mi. Kapali profil GIZLI degil: aramada cikiyor,
   kullanici adi, avatar ve sayilar gorunuyor. Sadece harita ve
   fotograflar arkadaslara ozel oluyor. Yoksa kimse ona istek
   gonderemezdi. */
function gizlilikAnahtariniCiz() {
  const kutu = document.getElementById("profilAcikAnahtar");
  if (!kutu) return;
  const acik = profilVeri.profil_acik !== false;
  kutu.checked = acik;
  document.getElementById("profilAcikBaslik").textContent =
    acik ? "Herkese açık" : "Sadece arkadaşlarım";
  document.getElementById("profilAcikNot").textContent = acik
    ? "Haritanı ve fotoğraflarını herkes görebilir."
    : "Haritanı ve fotoğraflarını sadece arkadaşların görebilir. " +
      "Kullanıcı adın, fotoğrafın ve sayıların herkese görünmeye devam eder.";
}

/* Gezi kaydinin AYRI anahtari. Kapaliysa arkadaslar bile goremez --
   profil anahtarindan bagimsiz, ust uste biniyorlar: kayit gorunmesi
   icin ikisinin de izin vermesi gerekiyor. */
/* Engellediklerin. Bolum sadece liste bos degilse gorunuyor -- kimseyi
   engellememis birine bos bir baslik gostermenin anlami yok. */
let engelListesi = [];
async function engelListesiniYukle() {
  const { data } = await db.rpc("engellilerim");
  engelListesi = data || [];
  engelListesiniCiz();
}

function engelListesiniCiz() {
  const bolum = document.getElementById("engelBolum");
  const kutu  = document.getElementById("engelListe");
  if (!bolum || !kutu) return;
  /* Kimseyi engellememis birine bos bir baslik gostermenin anlami yok */
  bolum.style.display = engelListesi.length ? "block" : "none";
  document.getElementById("engelBaslik").textContent =
    "ENGELLEDİKLERİN (" + engelListesi.length + ")";
  kutu.innerHTML = "";
  for (let i = 0; i < engelListesi.length; i++) {
    (function (g) {
      const sat = document.createElement("div");
      sat.className = "engel-satir";
      sat.appendChild(avatarYap(g.foto, "kucuk"));
      const ad = document.createElement("span");
      ad.className = "engel-ad";
      ad.textContent = "@" + g.kullanici_adi;
      sat.appendChild(ad);
      const kaldir = document.createElement("button");
      kaldir.className = "arkadas-mini";
      kaldir.textContent = "engeli kaldır";
      kaldir.addEventListener("click", async function () {
        kaldir.disabled = true;
        const { error } = await db.rpc("engeli_kaldir", { p_kullanici_adi: g.kullanici_adi });
        kaldir.disabled = false;
        if (error) { alert(hataYaz(error.message)); return; }
        engelListesiniYukle();
      });
      sat.appendChild(kaldir);
      kutu.appendChild(sat);
    })(engelListesi[i]);
  }
}

function hareketAnahtariniCiz() {
  const kutu = document.getElementById("hareketAnahtar");
  if (!kutu) return;
  const acik = profilVeri.hareket_acik === true;
  kutu.checked = acik;
  document.getElementById("hareketBaslik").textContent = acik ? "Açık" : "Kapalı";
  document.getElementById("hareketNot").textContent = acik
    ? (profilVeri.profil_acik === false
        ? "Nereye ne zaman gittiğini sadece arkadaşların görebilir."
        : "Nereye ne zaman gittiğini herkes görebilir.")
    : "Gezi kaydını kimse göremez, arkadaşların bile.";
}

function profilButonFotoGuncelle() {
  avatarKur(document.getElementById("profilFoto"), profilVeri.foto);
}

/* =====================================================================
   ARAMA (üst kutu)
   ===================================================================== */
const aramaKutu   = document.getElementById("aramaKutu");
const aramaInput  = document.getElementById("aramaInput");
const aramaSonuc  = document.getElementById("aramaSonuc");
let aramaBekle = null;

function aramaAc()   { aramaKutu.classList.add("acik"); aramaInput.focus(); mobilSeritTazele(); }
function aramaKapat() { aramaKutu.classList.remove("acik"); aramaInput.value = ""; aramaSonuc.innerHTML = ""; mobilSeritTazele(); }

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
          sat.className = "arama-satir kisi";
          sat.appendChild(avatarYap(g.foto, "kucuk"));
          const metin = document.createElement("span");
          metin.className = "arama-metin";
          metin.innerHTML = "<b>@" + kacisla(g.kullanici_adi) + "</b> " +
            "<span style='opacity:.6'>" + kacisla(g.isim || "") + "</span>";
          sat.appendChild(metin);
          const sag = document.createElement("span");
          sag.className = "arama-sag";
          sag.textContent = g.ulke_sayisi + " ülke";
          sat.appendChild(sag);
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

/* Sagdan acilan dort panel ayni yerde duruyor: ulke listesi, sehir
   detayi, profil karti ve istatistikler. Ikisi ayni anda acik olursa
   alttaki tamamen gizli kaliyor -- profil acikken kureden bir ulkeye
   tiklayinca ulke paneli profilin ALTINA aciliyordu ve hicbir sey
   olmamis gibi gorunuyordu. Her acilista otekileri kapatiyoruz.
   "itili" haritayi sola kaydiran sinif; istatistik paneli haritayi
   itmiyor, digerleri itiyor. */
/* gecmisPanel masaustunde sag ustte hep duran bir pencere; "acik"
   sinifinin orada bir karsiligi yok. Mobilde ise alttan acilan bir
   sayfaya donusuyor, o yuzden listeye onu da katiyoruz. */
const SAG_PANELLER = ["panel", "sehirDetayPanel", "profilKart", "ayarlarPanel",
                      "istatistikPanel", "gecmisPanel"];
/* Alt seritteki uc dugme. Acik olana tekrar basinca kapaniyor --
   gecmis panelinin kapatma dugmesi yok, kapanmanin baska yolu olmali. */
function mobilBolumAc(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (el.classList.contains("acik")) { hepsiniKapat(); return; }
  /* Masaustunde aramayi herhangi bir harfe basarak aciyoruz; telefonda
     klavye yok, bir dugme gerekiyor. */
  if (id === "aramaKutu") { hepsiniKapat(); aramaAc(); mobilSeritTazele(); return; }
  if (id === "profilKart") { kendiProfilim(); return; }
  if (id === "istatistikPanel") { istatistikPaneliAc(); return; }
  sadeceBuPanel(id, false);
}

function mobilSeritTazele() {
  const dugmeler = document.querySelectorAll("#mobilAlt button");
  for (let i = 0; i < dugmeler.length; i++) {
    const hedef = document.getElementById(dugmeler[i].dataset.bolum);
    dugmeler[i].classList.toggle("secili",
      !!(hedef && hedef.classList.contains("acik")));
  }
}

/* Telefonda acik bir panelin ustunde kalan harita alani "kapat" alani.
   #ortu zaten vardi ama hicbir yerde acilmiyordu; artik kullaniliyor.
   Hangi fonksiyonun hangi paneli kapattigini tek tek kovalamak yerine
   sinif degisikliklerini izliyoruz -- ileride yeni bir panel eklenirse
   kendiliginden calisir. Masaustunde kapali: orada paneller yanda
   duruyor ve kure kullanilabilir kalmali. */
const ORTU_IZLENEN = ["panel", "sehirDetayPanel", "profilKart", "ayarlarPanel",
                      "istatistikPanel", "gecmisPanel", "aramaKutu"];

/* =====================================================================
   KURENIN CIZIMINI DURDURMA
   Kure durmadan ciziliyor: kimse dokunmasa da saniyede 60 kare. Telefon
   isiniyor, isininca islemciyi kendisi yavaslatiyor, yavaslayinca da
   dokunuslar kaciyor. Iki yerde duruyoruz:

     1. Telefonda bir panel acikken. Panel ekranin %82'sini kapliyor,
        arkasindaki kureyi cizmenin kimseye faydasi yok.
     2. 30 saniye hic dokunulmayinca. Telefon masada acik dururken bile
        kure donuyordu.

   Ikisi de sadece TELEFONDA. Masaustunde kure ekranin yarisinda duruyor
   ve donmesi uygulamanin ilk izlenimi; orada durdurmuyoruz.
   ===================================================================== */
const UYKU_SURESI = 30000;
let uykuSayaci = null;

function kureAnimasyonTazele() {
  if (!kure || typeof kure.pauseAnimation !== "function") return;
  const panelAcik = MOBIL && ORTU_IZLENEN.some(function (id) {
    const el = document.getElementById(id);
    return el && el.classList.contains("acik");
  });
  const kameraOynuyor = Date.now() < kameraBitis;
  const dursun = !kameraOynuyor && (kureUykuda || panelAcik);
  if (dursun === kureDurdu) return;
  kureDurdu = dursun;
  try {
    if (dursun) kure.pauseAnimation();
    else        kure.resumeAnimation();
  } catch (e) { kureDurdu = false; }
}

/* Uyku SADECE cizimi durduruyor, autoRotate'e dokunmuyor. Sebebi:
   cizim dururken kontroller de guncellenmiyor, yani kure oldugu yerde
   kaliyor ve uyaninca kaldigi yerden devam ediyor -- sicrama olmuyor.
   autoRotate'i kapatip acsaydik, kullanicinin bir sehre yaklasip
   birakmis oldugu duruma dokunmus olurduk: ekrana her dokunusunda kure
   yeniden donmeye baslardi. */
function kureyiUyandir() {
  if (!MOBIL) return;
  kureUykuda = false;
  clearTimeout(uykuSayaci);
  uykuSayaci = setTimeout(function () {
    kureUykuda = true;
    kureAnimasyonTazele();
  }, UYKU_SURESI);
  kureAnimasyonTazele();
}

if (MOBIL) {
  ["touchstart", "pointerdown", "wheel", "keydown"].forEach(function (o) {
    document.addEventListener(o, kureyiUyandir, { passive: true });
  });
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) kureyiUyandir();
  });
  kureyiUyandir();               // sayaci baslat
}

/* =====================================================================
   PARMAGIN ALTINDAKININ ADI
   Masaustunde imleci ulkenin uzerine getirince adi cikiyor. Telefonda
   "uzerine getirmek" diye bir sey yok, o yuzden telefonda bir ulkenin
   adini ogrenmenin hicbir yolu yoktu -- sekilden tanimak zorundaydin.

   Cozum: parmak kurenin uzerindeyken altindakinin adi kurenin uzerinde
   yaziyor. Parmagi kaydirinca isim degisiyor, yani parmagini gezdirerek
   haritayi okuyabiliyorsun. Kalici bir yazi katmani KOYMUYORUZ: kurenin
   sadeligi ve gezilen sehirlerin sari isiklari en onemli goruntu, yazi
   onlarla yarisiyor. Bir seferde tek isim, o da sadece parmak ustundeyken.
   ===================================================================== */
let etiketEl = null, etiketSayaci = null;
let sonDokunusNoktasi = null;

function kureEtiketiGoster(metin, ek) {
  if (!MOBIL || !metin) return;
  if (!etiketEl) {
    etiketEl = document.createElement("div");
    etiketEl.id = "kureEtiket";
    etiketEl.className = "kure-etiket";
    document.body.appendChild(etiketEl);
  }
  etiketEl.innerHTML = "";
  etiketEl.appendChild(document.createTextNode(metin));
  if (ek) {
    const s = document.createElement("span");
    s.textContent = ek;
    etiketEl.appendChild(s);
  }
  const n = sonDokunusNoktasi;
  if (n) {
    /* Parmagin 56 piksel USTUNDE: yoksa basparmagin altinda kalir. */
    etiketEl.style.left = Math.round(n.x) + "px";
    etiketEl.style.top  = Math.round(n.y - 56) + "px";
  }
  etiketEl.classList.add("acik");
  clearTimeout(etiketSayaci);
}

function kureEtiketiGizle(gecikme) {
  if (!etiketEl) return;
  clearTimeout(etiketSayaci);
  etiketSayaci = setTimeout(function () {
    if (etiketEl) etiketEl.classList.remove("acik");
  }, gecikme || 0);
}

/* Hover degisince etiketi tazele. Kure kutuphanesi dokunmada da hover
   uretiyor -- ulke renginin degismesi bunun kaniti. */
function etiketiTazele() {
  if (!MOBIL) return;
  if (document.body.classList.contains("panelde")) { kureEtiketiGizle(0); return; }
  if (hoverSehir) {
    kureEtiketiGoster(hoverSehir.sehir, hoverSehir.ulke);
    return;
  }
  if (hoverUlke && hoverUlke.properties) {
    const ad = hoverUlke.properties.name;
    const say = misafir
      ? misafir.sehirler.filter(function (g) { return g.ulke === ad; }).length
      : gezilenler.filter(function (g) { return g.ulke === ad; }).length;
    kureEtiketiGoster(ad, say ? say + " şehir" : "");
    return;
  }
  kureEtiketiGizle(0);
}

/* =====================================================================
   DOKUNMAYLA ULKE / SEHIR ACMA
   Kure kutuphanesi dokunmada tiklamayi guvenilir uretmiyor: parmak
   basinca ulke rengi degisiyor (yani kutuphane parmagin altindakini
   BILIYOR) ama tiklama gelmiyor. Telefonda "bazi ulkeler aciliyor,
   bazilari acmiyor" bundan.

   Cozum: parmak kalkarken kaydirma degil de dokunussa (12 pikselden az
   hareket, yarim saniyeden kisa), parmagin altindaki neyse onu biz
   aciyoruz. Kutuphanenin tiklamasi da gelirse ayni sey iki kez
   acilmasin diye kisa bir koruma var.
   ===================================================================== */
(function dokunmayiBagla() {
  const harita = document.getElementById("harita");
  if (!harita) return;
  let bas = null;

  harita.addEventListener("touchstart", function (e) {
    if (e.touches.length !== 1) { bas = null; sonDokunusNoktasi = null; return; }
    const t = e.touches[0];
    bas = { x: t.clientX, y: t.clientY, an: Date.now() };
    sonDokunusNoktasi = { x: t.clientX, y: t.clientY };
  }, { passive: true });

  harita.addEventListener("touchmove", function (e) {
    const t = e.touches && e.touches[0];
    if (!t) return;
    sonDokunusNoktasi = { x: t.clientX, y: t.clientY };
    if (etiketEl && etiketEl.classList.contains("acik")) {
      etiketEl.style.left = Math.round(t.clientX) + "px";
      etiketEl.style.top  = Math.round(t.clientY - 56) + "px";
    }
  }, { passive: true });

  harita.addEventListener("touchend", function (e) {
    const b = bas; bas = null;
    /* Parmak kalkinca isim biraz daha dursun: hizli bir dokunusta
       okumaya vakit kalsin. */
    kureEtiketiGizle(900);
    if (!b) return;
    const t = e.changedTouches && e.changedTouches[0];
    if (!t) return;
    const dx = t.clientX - b.x, dy = t.clientY - b.y;
    if (Math.sqrt(dx * dx + dy * dy) > 12) return;      // kureyi cevirmis
    if (Date.now() - b.an > 500) return;                // basili tutmus

    /* Pin, ulkenin ustunde duruyor: parmak pinin uzerindeyse sehri ac. */
    if (hoverSehir) {
      const s = hoverSehir;
      if (aktifDetay.ulke === s.ulke && aktifDetay.sehir === s.sehir &&
          document.getElementById("sehirDetayPanel").classList.contains("acik")) return;
      sehirDetayAc(s.ulke, s.sehir);
      return;
    }
    if (!hoverUlke || !hoverUlke.properties) return;
    const ad = hoverUlke.properties.name;
    if (!ad) return;
    if (ad === sonAcilanUlke && Date.now() - sonAcilanAn < 700) return;  // zaten acildi
    panelAc(ad);
  }, { passive: true });
})();

function ortuTazele() {
  const ortu = document.getElementById("ortu");
  if (!ortu) return;
  const acik = MOBIL && ORTU_IZLENEN.some(function (id) {
    const el = document.getElementById(id);
    return el && el.classList.contains("acik");
  });
  ortu.classList.toggle("acik", acik);
  /* Harita ustundeki mobilya (buyuk sayac, yasal baglanti) panel
     acikken gorunmesin. Ikisi de z-index 900'de; "Son Gezdiklerin"
     paneli de 900'deydi ve esitlikte HTML sirasi kazandigi icin sayac
     panelin ONUNDE cikip yaziya karisiyordu. */
  document.body.classList.toggle("panelde", acik);
  /* Panel acilirken parmagin altindaki isim ekranda asili kalmasin. */
  if (acik) kureEtiketiGizle(0);
  kureAnimasyonTazele();
}

(function ortuyuIzle() {
  if (typeof MutationObserver !== "function") return;
  const g = new MutationObserver(ortuTazele);
  for (let i = 0; i < ORTU_IZLENEN.length; i++) {
    const el = document.getElementById(ORTU_IZLENEN[i]);
    if (el) g.observe(el, { attributes: true, attributeFilter: ["class"] });
  }
})();

function sadeceBuPanel(id, itsin) {
  /* Arama kutusu SAG_PANELLER'de degil -- ayri bir katman. O yuzden bir
     panel acilirken kendiliginden kapanmiyordu: telefonda "Ara"ya basip
     hicbir sey yazmadan "Istatistikler"e gecince arama serit uzerinde
     acik kaliyordu. Panel acmak, aramayi bitirmek demektir. */
  aramaKapat();
  for (let i = 0; i < SAG_PANELLER.length; i++) {
    const el = document.getElementById(SAG_PANELLER[i]);
    if (!el) continue;
    if (SAG_PANELLER[i] === id) el.classList.add("acik");
    else el.classList.remove("acik");
  }
  document.getElementById("harita").classList.toggle("itili", !!itsin);
  mobilSeritTazele();
}

function hepsiniKapat() {
  aramaKapat();
  document.getElementById("panel").classList.remove("acik");
  document.getElementById("sehirDetayPanel").classList.remove("acik");
  document.getElementById("profilKart").classList.remove("acik");
  document.getElementById("ayarlarPanel").classList.remove("acik");
  document.getElementById("istatistikPanel").classList.remove("acik");
  document.getElementById("harita").classList.remove("itili");
  document.getElementById("gecmisPanel").classList.remove("acik");
  aktifDetay = { ulke: "", sehir: "" };
  aktifUlke = "";
  fotoKuyruk = [];
  mobilSeritTazele();
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
  const hedef = acilisGorusu();
  // Zaten baslangictaysak bosuna animasyon oynatma
  const uzak = Math.abs(g.altitude - hedef.altitude) < 0.05 &&
               Math.abs(g.lat - hedef.lat) < 1;
  if (uzak) { kure.controls().autoRotate = true; return; }
  kure.controls().autoRotate = false;
  kure.pointOfView(hedef, 1600);
  setTimeout(function () { kure.controls().autoRotate = true; }, 1700);
}

document.addEventListener("keydown", function (e) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault(); aramaAc(); return;
  }
  if (e.key === "Escape") {
    /* Ayarlar profilin ALTINDAN acilan bir ekran; Esc once bir kademe
       geri gitmeli. Eskiden hepsini kapatiyordu, hatta ayarlar
       acikPanelVarMi listesinde olmadigi icin kapanmiyor, sadece kure
       basa donuyordu. */
    if (document.getElementById("ayarlarPanel").classList.contains("acik")) {
      profilAc(); return;
    }
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
    .select("ulke,sehir,gidilen,created_at").eq("user_id", oturum.session.user.id);
  if (error) { gezilenler = yerelOku("gezilenler", []); return; }
  gezilenler = data.map(function (r) {
    return { ulke: r.ulke, sehir: r.sehir,
             gidilen: r.gidilen || null, eklendi: r.created_at || null };
  });
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
    .select("ulke,sehir,puan,notlar,not_acik").eq("user_id", oturum.session.user.id);
  if (error) { sehirDetaylari = yerelOku("sehirDetaylari", {}); return; }
  sehirDetaylari = {};
  for (let i = 0; i < data.length; i++) {
    sehirDetaylari[anahtar(data[i].ulke, data[i].sehir)] =
      { puan: data[i].puan || 0, not: data[i].notlar || "",
        acik: data[i].not_acik === true };
  }
  yerelYaz("sehirDetaylari", sehirDetaylari);
}

async function profilYukle() {
  const { data: oturum } = await db.auth.getSession();
  if (!oturum.session) { profilVeri = yerelOku("profilVeri", profilVeri); return; }
  const yerel = yerelOku("profilVeri",
    { isim: "", konum: "", foto: "", kullanici_adi: "",
      profil_acik: true, hareket_acik: false });
  const { data, error } = await db.from("profil")
    .select("isim,konum,kullanici_adi,foto,profil_acik,hareket_acik")
    .eq("user_id", oturum.session.user.id).maybeSingle();
  /* HATA ile "satir yok" ayni sey degil. Hata varsa sunucuya
     ulasamadik demektir, yerel kopya ise yarar. Ama satir yoksa hesap
     gercekten bos: yerel kopyaya dusersek bir onceki kullanicinin
     profilini bu hesaba giydirmis oluruz. Bir kez oldu. */
  if (error) { profilVeri = yerel; return; }
  if (!data) {
    profilVeri = { isim: "", konum: "", kullanici_adi: "",
                   foto: "", profil_acik: true, hareket_acik: false };
    yerelYaz("profilVeri", profilVeri);
    return;
  }
  /* Eskiden profil fotograflari sadece tarayicida duruyordu; kimse
     goremiyordu. Artik sunucuda, tek fotograf. */
  profilVeri = { isim: data.isim || "", konum: data.konum || "",
                 kullanici_adi: data.kullanici_adi || "",
                 foto: data.foto || "",
                 profil_acik: data.profil_acik !== false,
                 hareket_acik: data.hareket_acik === true };
  yerelYaz("profilVeri", profilVeri);
}

/* =====================================================================
   OLAYLAR

   bagla(): olmayan bir ogeye baglanmaya calisirsak uygulama olmesin.
   Neden onemli: index.html ile script.js AYRI dosyalar ve tarayici
   (ya da servis iscisi, ya da GitHub Pages) birini yenileyip otekini
   eski birakabiliyor. Eski index.html + yeni script.js oldugunda
   "document.getElementById(yeni_oge).addEventListener" satiri hata
   firlatiyor, betik ORADA duruyor ve uygulama giris ekraninda kalip
   hicbir seye cevap vermiyor. Boyle bir sey bir kez yasandi; artik
   eksik oge sadece konsola yaziliyor, gerisi calismaya devam ediyor. */
function bagla(id, olay, islev) {
  const el = document.getElementById(id);
  if (!el) { console.log("Oge bulunamadi, atlandi:", id); return null; }
  el.addEventListener(olay, islev);
  return el;
}
document.getElementById("kapat").addEventListener("click", paneliKapat);
document.getElementById("ortu").addEventListener("click", hepsiniKapat);
document.getElementById("sehirDetayKapat").addEventListener("click", sehirDetayKapat);
document.getElementById("kitaChart").addEventListener("click", istatistikPaneliAc);
bagla("kureSayac", "click", istatistikPaneliAc);
document.getElementById("istatistikKapat").addEventListener("click", istatistikPaneliKapat);
document.getElementById("profilBtn").addEventListener("click", kendiProfilim);
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

bagla("notAcikAnahtar", "change", notAnahtariniCiz);
bagla("sehirNot", "input", notAnahtariniCiz);

document.getElementById("sehirDetayKaydet").addEventListener("click", async function () {
  const btn = this;
  btn.disabled = true;
  const not = document.getElementById("sehirNot").value;
  const acik = document.getElementById("notAcikAnahtar").checked &&
               not.trim() !== "";
  const a = anahtar(aktifDetay.ulke, aktifDetay.sehir);
  // Fotograflar artik burada degil, sehir_fotolari tablosunda.
  const { data: oturum } = await db.auth.getSession();
  if (oturum.session) {
    const { error } = await db.from("sehir_detaylari").upsert({
      user_id: oturum.session.user.id, ulke: aktifDetay.ulke,
      sehir: aktifDetay.sehir, puan: seciliPuan, notlar: not,
      not_acik: acik
    }, { onConflict: "user_id,ulke,sehir" });
    /* Sunucu reddedebilir (susturulmus hesap, gidilmemis sehir).
       Once yerele yazip sonra kaydetseydik ekranda kaydedilmis gibi
       gorunurdu; o yuzden sira boyle. */
    if (error) {
      btn.disabled = false;
      notDurumu(hataYaz(error.message));
      return;
    }
  }
  sehirDetaylari[a] = { puan: seciliPuan, not: not, acik: acik };
  yerelYaz("sehirDetaylari", sehirDetaylari);
  btn.disabled = false;
  sehirDetayKapat();
});

function profilFotoDurum(metin) {
  const el = document.getElementById("profilFotoDurum");
  if (el) el.textContent = metin || "";
}

/* Fotograf once kovaya yukleniyor, sonra yolu fonksiyona yazdiriliyor.
   Sira onemli: once kayit yazip sonra yukleme yapsaydik ve yukleme
   basarisiz olsaydi, profilde olmayan bir dosyaya isaret eden bir yol
   kalirdi. */
document.getElementById("profilFotoInput").addEventListener("change", async function (e) {
  const dosya = e.target.files[0];
  this.value = "";                    // ayni dosya tekrar secilebilsin
  if (!dosya) return;
  const { data: oturum } = await db.auth.getSession();
  if (!oturum.session) { profilFotoDurum("Önce giriş yapmalısın."); return; }

  profilFotoDurum("Yükleniyor…");
  let blob;
  try { blob = await avatarKucult(dosya); }
  catch (h) { profilFotoDurum(h.message); return; }

  const eskiYol = profilVeri.foto;
  const yol = oturum.session.user.id + "/" +
              (crypto.randomUUID ? crypto.randomUUID() : Date.now()) + ".jpg";

  const { error: yuklemeHatasi } = await db.storage.from(PROFIL_KOVA)
    .upload(yol, blob, { contentType: "image/jpeg" });
  if (yuklemeHatasi) { profilFotoDurum("Yüklenemedi: " + yuklemeHatasi.message); return; }

  const { data, error } = await db.rpc("profil_foto_yaz", { p_yol: yol });
  if (error) {
    await db.storage.from(PROFIL_KOVA).remove([yol]);   // yarim is birakma
    profilFotoDurum(hataYaz(error.message));
    return;
  }

  profilVeri.foto = data || yol;
  yerelYaz("profilVeri", profilVeri);
  if (eskiYol && eskiYol !== profilVeri.foto) {
    await db.storage.from(PROFIL_KOVA).remove([eskiYol]);
  }
  profilFotoDurum("");
  profilDoldur();
  profilButonFotoGuncelle();
});

(function gezenSuzgeciBagla() {
  const dugmeler = document.querySelectorAll("#gezenSuzgec button");
  for (let i = 0; i < dugmeler.length; i++) {
    dugmeler[i].addEventListener("click", function () {
      gezenSuzgecAy = this.dataset.ay || "";
      for (let j = 0; j < dugmeler.length; j++) {
        dugmeler[j].classList.toggle("secili", dugmeler[j] === this);
      }
      gezenleriYukle();
    });
  }
})();

document.getElementById("hareketAnahtar").addEventListener("change", async function () {
  const istenen = this.checked;
  this.disabled = true;
  const { data, error } = await db.rpc("hareket_gizlilik_yaz", { p_acik: istenen });
  this.disabled = false;
  if (error) { this.checked = !istenen; profilFotoDurum(hataYaz(error.message)); return; }
  profilVeri.hareket_acik = data === true;
  yerelYaz("profilVeri", profilVeri);
  hareketAnahtariniCiz();
});

document.getElementById("sehirAy").addEventListener("change", tarihiKaydet);
document.getElementById("sehirYil").addEventListener("change", tarihiKaydet);
document.getElementById("sehirTarihTemizle").addEventListener("click", function () {
  document.getElementById("sehirAy").value = "";
  document.getElementById("sehirYil").value = "";
  tarihiKaydet();
});

document.getElementById("profilAcikAnahtar").addEventListener("change", async function () {
  const istenen = this.checked;
  this.disabled = true;
  const { data, error } = await db.rpc("profil_gizlilik_yaz", { p_acik: istenen });
  this.disabled = false;
  if (error) {
    this.checked = !istenen;                 // sunucu kabul etmediyse geri al
    profilFotoDurum(hataYaz(error.message));
    return;
  }
  profilVeri.profil_acik = data !== false;
  yerelYaz("profilVeri", profilVeri);
  gizlilikAnahtariniCiz();
  hareketAnahtariniCiz();
});

document.getElementById("profilFotoKaldir").addEventListener("click", async function () {
  if (!profilVeri.foto) return;
  const eskiYol = profilVeri.foto;
  this.disabled = true;
  const { error } = await db.rpc("profil_foto_yaz", { p_yol: null });
  this.disabled = false;
  if (error) { profilFotoDurum(hataYaz(error.message)); return; }
  profilVeri.foto = "";
  yerelYaz("profilVeri", profilVeri);
  await db.storage.from(PROFIL_KOVA).remove([eskiYol]);
  profilDoldur();
  profilButonFotoGuncelle();
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

/* Supabase hatalari Ingilizce donuyor. Sik gorulenleri cevirip
   gerisini oldugu gibi birakiyoruz -- bilmedigimiz bir hatayi
   "bir sorun oldu" diye yutmak, sorunu bulmayi zorlastirir. */
function hataYaz(mesaj) {
  const cevap = {
    "Invalid login credentials": "E-posta ya da şifre yanlış.",
    "Email not confirmed": "Önce e-postandaki doğrulama bağlantısına tıkla.",
    "User already registered": "Bu e-posta zaten kayıtlı.",
    "Password should be at least 6 characters":
      "Şifre en az 6 karakter olmalı.",
    "For security purposes, you can only request this after 60 seconds.":
      "Güvenlik için 60 saniye bekleyip tekrar dene.",
    "Unable to validate email address: invalid format":
      "E-posta adresi geçersiz."
  };
  return cevap[mesaj] || mesaj;
}

/* --- Sifremi unuttum ---------------------------------------------------
   Iki adimli: once e-postaya baglanti gonderiliyor, sonra o baglantiyla
   donen kullaniciya yeni sifre sorulyor. Ikinci adim ayni ekranda
   aciliyor, ayri sayfa yok. */
document.getElementById("sifreUnuttum").addEventListener("click", async function () {
  const e = document.getElementById("girisEmail").value.trim();
  if (!e) {
    girisMesaj.textContent = "Önce e-posta adresini yaz, bağlantıyı oraya göndereyim.";
    document.getElementById("girisEmail").focus();
    return;
  }
  this.disabled = true;
  girisMesaj.textContent = "Gönderiliyor…";
  const { error } = await db.auth.resetPasswordForEmail(e, {
    redirectTo: location.origin + location.pathname
  });
  this.disabled = false;
  girisMesaj.textContent = error
    ? hataYaz(error.message)
    : "Bağlantı gönderildi. E-postanı kontrol et (spam klasörüne de bak).";
});

/* Kullanici adi olmadan haritaya birakmiyoruz. Sebep: profil satiri
   ancak ad alininca olusuyor; adsiz kullanici aramada cikmiyor,
   arkadas eklenemiyor, fotografinin altinda kimlik gorunmuyor.
   Kayitta ad sordugumuz icin yeni kullanicilar buraya hic dusmuyor;
   bu kapi eski adsiz hesaplar ve yarim kalmis kayitlar icin. */
function adSecimEkraniniAc(hazir) {
  document.querySelector(".giris-kutu").classList.add("adsecim");
  document.getElementById("adSecimGiris").value = hazir || "";
  girisEkran.style.display = "flex";
  girisMesaj.textContent = "Devam etmek için bir kullanıcı adı seç. " +
    "Küçük harf, rakam ve alt çizgi; 3-20 karakter. Sonradan değiştirilemiyor.";
  document.getElementById("adSecimGiris").focus();
}

function adSecimEkraniniKapat() {
  document.querySelector(".giris-kutu").classList.remove("adsecim");
  girisEkran.style.display = "none";
  girisMesaj.textContent = "";
}

document.getElementById("adSecimKaydet").addEventListener("click", async function () {
  const k = kullaniciAdiTemizle(document.getElementById("adSecimGiris").value);
  if (!/^[a-z0-9_]{3,20}$/.test(k)) {
    girisMesaj.textContent =
      "Kullanıcı adı 3-20 karakter olmalı; sadece küçük harf, rakam ve alt çizgi.";
    return;
  }
  this.disabled = true;
  const { data, error } = await db.rpc("kullanici_adi_al", { p_ad: k });
  this.disabled = false;
  if (error) { girisMesaj.textContent = hataYaz(error.message); return; }
  profilVeri.kullanici_adi = data;
  yerelYaz("profilVeri", profilVeri);
  yerelYaz("bekleyenKullaniciAdi", "");
  adSecimEkraniniKapat();
});

/* Girisden sonra cagriliyor. Adi varsa hicbir sey yapmiyor.
   Yoksa once kayitta secilen adi sessizce almayi deniyor; o ad bu arada
   baskasina gitmisse kullaniciya soruyor. */
async function kullaniciAdiKapisi() {
  if (profilVeri.kullanici_adi) return false;
  const bekleyen = kullaniciAdiTemizle(yerelOku("bekleyenKullaniciAdi", ""));
  if (/^[a-z0-9_]{3,20}$/.test(bekleyen)) {
    const { data, error } = await db.rpc("kullanici_adi_al", { p_ad: bekleyen });
    if (!error && data) {
      profilVeri.kullanici_adi = data;
      yerelYaz("profilVeri", profilVeri);
      yerelYaz("bekleyenKullaniciAdi", "");
      return false;
    }
  }
  adSecimEkraniniAc(bekleyen);
  return true;
}

function kurtarmaEkraniniAc() {
  document.querySelector(".giris-kutu").classList.add("kurtarma");
  document.getElementById("yeniSifreAlani").classList.add("acik");
  girisEkran.style.display = "flex";
  girisMesaj.textContent = "Yeni şifreni belirle.";
  document.getElementById("yeniSifre").focus();
}

document.getElementById("yeniSifreKaydet").addEventListener("click", async function () {
  const s = document.getElementById("yeniSifre").value;
  if (s.length < 6) { girisMesaj.textContent = "Şifre en az 6 karakter olmalı."; return; }
  this.disabled = true;
  const { error } = await db.auth.updateUser({ password: s });
  this.disabled = false;
  if (error) { girisMesaj.textContent = hataYaz(error.message); return; }
  document.querySelector(".giris-kutu").classList.remove("kurtarma");
  document.getElementById("yeniSifreAlani").classList.remove("acik");
  document.getElementById("yeniSifre").value = "";
  girisEkran.style.display = "none";
  history.replaceState(null, "", location.origin + location.pathname);
  await veriYukle();
});

/* Baglanti tiklanip donuldugunde supabase bu olayi tetikliyor. Yukaridaki
   adres bayragi yetmezse (tarayici # kismini erken temizlerse) burasi
   yakaliyor. */
if (typeof db.auth.onAuthStateChange === "function") {
  db.auth.onAuthStateChange(function (olay) {
    if (olay === "PASSWORD_RECOVERY") kurtarmaEkraniniAc();
  });
}

/* Giris / kayit kipi. Ayni kutu iki isi goruyor; kayit kipinde
   kullanici adi alani aciliyor. */
function kayitKipi(acik) {
  document.querySelector(".giris-kutu").classList.toggle("kayit", acik);
  document.getElementById("modDegistir").textContent = acik
    ? "Zaten hesabın var mı? Giriş yap"
    : "Hesabın yok mu? Kayıt ol";
  girisMesaj.textContent = "";
}
document.getElementById("modDegistir").addEventListener("click", function () {
  kayitKipi(!document.querySelector(".giris-kutu").classList.contains("kayit"));
});

function kullaniciAdiTemizle(ad) {
  return String(ad || "").trim().toLowerCase().replace(/\s+/g, "");
}

/* Kayitta kullanici adi ZORUNLU. Once boyleydi degildi: adsiz kayit
   olan kullanicinin profil satiri hic olusmuyordu, yani kimse onu
   arayamiyor, veritabaninda bile gorunmuyordu. */
document.getElementById("kayitBtn").addEventListener("click", async function () {
  const e = document.getElementById("girisEmail").value.trim();
  const s = document.getElementById("girisSifre").value;
  const k = kullaniciAdiTemizle(document.getElementById("girisKullanici").value);
  if (!e || !s) { girisMesaj.textContent = "E-posta ve şifre gerekli."; return; }
  if (!/^[a-z0-9_]{3,20}$/.test(k)) {
    girisMesaj.textContent =
      "Kullanıcı adı 3-20 karakter olmalı; sadece küçük harf, rakam ve alt çizgi.";
    return;
  }
  this.disabled = true;
  girisMesaj.textContent = "Kontrol ediliyor…";

  const musait = await db.rpc("kullanici_adi_musait", { p_ad: k });
  if (musait.error) {
    this.disabled = false;
    girisMesaj.textContent = hataYaz(musait.error.message); return;
  }
  if (musait.data === false) {
    this.disabled = false;
    girisMesaj.textContent = "Bu kullanıcı adı alınmış, başka bir tane dene."; return;
  }

  /* emailRedirectTo SART. Yazmazsak Supabase dogrulama baglantisini kendi
     "Site URL" ayarina yolluyor; o ayar bir kez yanlis girilmisse kullanici
     onay linkine tiklayip bambaska bir sayfada buluyor kendini. Yasandi:
     bir kayit, GitHub kok sayfasina dustu. Burada acikca yaziyoruz ki
     ayardan bagimsiz olarak Traxplore'a donsun. */
  const { error } = await db.auth.signUp({
    email: e, password: s,
    options: { data: { kullanici_adi: k },
               emailRedirectTo: location.origin + location.pathname }
  });
  this.disabled = false;
  if (error) { girisMesaj.textContent = hataYaz(error.message); return; }
  /* Adi burada yazamiyoruz: hesap daha dogrulanmadi, oturum yok.
     Ilk girisde otomatik almak icin saklıyoruz. */
  yerelYaz("bekleyenKullaniciAdi", k);
  girisMesaj.textContent =
    "Kayıt tamam. E-postana doğrulama bağlantısı gönderildi. " +
    "Doğrulayıp giriş yapınca @" + k + " adı hesabına bağlanacak.";
});

document.getElementById("girisBtn").addEventListener("click", async function () {
  const e = document.getElementById("girisEmail").value.trim();
  const s = document.getElementById("girisSifre").value;
  if (!e || !s) { girisMesaj.textContent = "E-posta ve şifre gerekli."; return; }
  this.disabled = true;
  const { error } = await db.auth.signInWithPassword({ email: e, password: s });
  this.disabled = false;
  if (error) { girisMesaj.textContent = hataYaz(error.message); return; }
  girisEkran.style.display = "none";
  await veriYukle();
  await kullaniciAdiKapisi();
});

async function cikisYap() {
  await db.auth.signOut();
  /* Cikinca yerel kopya kalmasin. Ortak kullanilan bir bilgisayarda
     sonraki kisi oncekinin haritasini gormemeli. */
  yerelTemizle();
  yerelYaz("oturumSahibi", "");
  location.reload();
}
(function mobilSeridiBagla() {
  const dugmeler = document.querySelectorAll("#mobilAlt button");
  for (let i = 0; i < dugmeler.length; i++) {
    dugmeler[i].addEventListener("click", function () {
      mobilBolumAc(this.dataset.bolum);
    });
  }
})();

document.getElementById("gecmisKapat").addEventListener("click", hepsiniKapat);

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
   HESAP SILME
   Magazalar hesabin uygulama icinden silinebilmesini sart kosuyor.

   Sira onemli: once kovadaki dosyalar, sonra veritabani ve giris
   hesabi. Ters sirada olsaydi kayit silinir, dosya kovada sahipsiz
   kalirdi -- silinmis birinin fotografi diskte durmaya devam ederdi.
   hesabimi_sil() de kovada dosya kaldiysa isi reddediyor; yani bu
   sira kural olarak da zorunlu, sadece niyet degil.

   Onay icin kullanici adini yazdiriyoruz. "Emin misin?" penceresi
   refleksle geciliyor; geri donusu olmayan bir iste bu yetmez.
   ===================================================================== */
function hesapSilAc() {
  const ad = profilVeri.kullanici_adi || "";
  document.getElementById("silAdNot").textContent = ad ? "@" + ad : "Kullanıcı";
  const onay = document.getElementById("silOnay");
  onay.value = "";
  onay.placeholder = ad || "kullanıcı adın";
  document.getElementById("silDurum").textContent = "";
  document.getElementById("silOnayla").disabled = true;
  document.getElementById("silKutu").classList.add("acik");
  onay.focus();
}

function hesapSilKapat() {
  document.getElementById("silKutu").classList.remove("acik");
}

document.getElementById("hesapSil").addEventListener("click", hesapSilAc);
document.getElementById("silVazgec").addEventListener("click", hesapSilKapat);
document.getElementById("silKutu").addEventListener("click", function (e) {
  if (e.target === this) hesapSilKapat();
});

document.getElementById("silOnay").addEventListener("input", function () {
  const ad = (profilVeri.kullanici_adi || "").toLowerCase();
  const yazilan = this.value.trim().toLowerCase().replace(/^@/, "");
  document.getElementById("silOnayla").disabled = !ad || yazilan !== ad;
});

/* Kovadaki kendi klasorunu bosalt. Yuz yuz listeleyip siliyoruz;
   liste tek seferde her seyi vermiyor. */
async function kovayiBosalt(kova, uid) {
  for (let tur = 0; tur < 60; tur++) {
    const { data, error } = await db.storage.from(kova).list(uid, { limit: 100 });
    if (error) throw new Error(error.message);
    if (!data || !data.length) return;
    const yollar = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].id) yollar.push(uid + "/" + data[i].name);   // klasor girisi degilse
    }
    if (!yollar.length) return;
    const { error: silHatasi } = await db.storage.from(kova).remove(yollar);
    if (silHatasi) throw new Error(silHatasi.message);
  }
  throw new Error("Fotoğraflar silinemedi.");
}

document.getElementById("silOnayla").addEventListener("click", async function () {
  const btn = this;
  const durum = document.getElementById("silDurum");
  if (btn.disabled) return;
  btn.disabled = true;
  document.getElementById("silVazgec").disabled = true;
  document.getElementById("silOnay").disabled = true;

  try {
    const { data: oturum } = await db.auth.getSession();
    if (!oturum.session) throw new Error("Oturum kapanmış, tekrar giriş yap.");
    const uid = oturum.session.user.id;

    durum.textContent = "Fotoğraflar siliniyor…";
    await kovayiBosalt(KOVA, uid);
    await kovayiBosalt(PROFIL_KOVA, uid);

    durum.textContent = "Hesap siliniyor…";
    const { error } = await db.rpc("hesabimi_sil");
    if (error) throw new Error(hataYaz(error.message));

    // Telefonda duran kopyalar da gitsin, yoksa bir sonraki acilista
    // silinmis hesabin haritasi gorunur.
    await db.auth.signOut();
    try { localStorage.clear(); } catch (e) {}
    location.reload();
  } catch (h) {
    durum.textContent = h.message;
    document.getElementById("silOnay").disabled = false;
    document.getElementById("silVazgec").disabled = false;
    btn.disabled = false;
  }
});

/* =====================================================================
   BAŞLANGIÇ
   ===================================================================== */
async function veriYukle() {
  // Once kim oldugumuza bakalim; baskasinin kopyasiyla ise baslamayalim
  try {
    const { data: o } = await db.auth.getSession();
    yerelSahibiniAyarla(o.session ? o.session.user.id : "");
  } catch (e) { /* oturum okunamadiysa asagisi zaten yerel kopyasiz calisir */ }
  await ulkeleriYukle();
  await gezileriYukle();
  await Promise.all([koordinatlariYukle(), detaylariYukle(), profilYukle(),
                     arkadasVeriTazele(), engelListesiniYukle(), listeleriYukle()]);
  istatistikGuncelle();
  gecmisGuncelle();
  kitaChartCiz();
  kureRenkTazele();
  pinleriTazele();
}

(async function baslat() {
  kureKur();
  if (SIFRE_KURTARMA) {
    // Baglanti gecerli bir oturum aciyor ama kullaniciyi dogruca haritaya
    // birakmak yanlis olurdu: buraya sifresini degistirmeye geldi.
    await ulkeleriYukle();
    kitaChartCiz();
    istatistikGuncelle();
    kurtarmaEkraniniAc();
    return;
  }
  const { data: oturum } = await db.auth.getSession();
  if (oturum.session) {
    girisEkran.style.display = "none";
    await veriYukle();
    await kullaniciAdiKapisi();
  } else {
    girisEkran.style.display = "flex";
    await ulkeleriYukle();
    kitaChartCiz();
    istatistikGuncelle();
  }
})();
