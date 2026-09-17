// TEST ICIN: globe.gl ve supabase-js yerine sahte kutuphaneler
(function () {
  const cagrilar = [];
  window.__kureCagri = cagrilar;
  window.__kureVeri = {};
  function zincir() {
    const o = function () { return o; };
    return new Proxy(o, {
      get(t, ad) {
        // Etiket islevlerini sakliyoruz ki testte dogrudan cagirabilelim
        if (ad === 'polygonLabel' || ad === 'pointLabel')
          return function (f) { if (typeof f === 'function') window.__kureVeri[ad] = f;
                                return zincirNesne; };
        if (ad === 'pointsData' || ad === 'ringsData' || ad === 'polygonsData')
          return function (v) { if (v !== undefined) window.__kureVeri[ad] = v; return zincirNesne; };
        if (ad === 'controls') return function () {
          /* Tek nesne dondurmek SART: video kaydi autoRotate'i acip
             kapatiyor, her cagrida yeni nesne donseydi test bunu
             goremezdi. */
          return (window.__kontrol = window.__kontrol ||
            { autoRotate: true, autoRotateSpeed: 0.28,
              addEventListener(){}, enableDamping:true });
        };
        if (ad === 'pauseAnimation')  return function () { window.__cizim = 'durdu';  };
        if (ad === 'resumeAnimation') return function () { window.__cizim = 'suruyor'; };
        if (ad === 'pointOfView') return function (v, ms) {
          if (v) {
            window.__pov = {v:v, ms:ms};
            /* Video testi kurenin gercekten dondugunu buradan olcuyor:
               kure bir Proxy oldugu icin disaridan casus takilamiyor. */
            (window.__povGecmisi = window.__povGecmisi || []).push(v);
            return v;
          }
          /* Video kaydi "tam tur atildi mi" diye bakis acisini okuyor.
             Sahte kure de donmezse kayit hic bitmez. Otomatik donus
             acikken her okumada aciyi ilerletiyoruz. */
          const k = window.__kontrol;
          if (k && k.autoRotate) {
            /* 0.08 katsayisi bilerek: 15 hizda kare basina 1.2 derece,
               yani tam tur 300 kare = ~5 saniye. Hedef sure 4 saniye
               oldugu icin "sure dolunca bitir" diyen bir surum turu
               kapatamaz ve test bunu yakalar. Kare dusuren gercek bir
               telefonu taklit ediyor. */
            window.__sahteAci = ((window.__sahteAci || 0) + (k.autoRotateSpeed || 2) * 0.08);
            let a = window.__sahteAci % 360;
            if (a > 180) a -= 360;
            return { lat: 0, lng: a, altitude: 2.5 };
          }
          return window.__povSahte || { lat:0, lng:0, altitude:2.5 };
        };
        if (ad === 'globeMaterial') return function () { return { color:{set(){}} }; };
        if (ad === 'toGlobeCoords') return function () { return { lat: 41.0, lng: 29.0 }; };
        if (ad === 'width' || ad === 'height') return function () { return zincirNesne; };
        return function () { cagrilar.push(ad); return zincirNesne; };
      },
      apply() { return zincirNesne; }
    });
  }
  const zincirNesne = zincir();
  window.Globe = function () { return function () { return zincirNesne; }; };

  const SEHIRLER = [
    { id:1, ad:"Istanbul", enlem:41.01, boylam:28.95, nufus:15701602, foto:null, arandi:false },
    { id:2, ad:"Ankara",   enlem:39.92, boylam:32.85, nufus:3517182,  foto:"https://x/a.jpg", arandi:true },
    { id:3, ad:"İzmir",    enlem:38.42, boylam:27.13, nufus:2938292,  foto:null, arandi:true },
    // kesme isaretli ve tirnakli adlar — eski kodda paneli kiran durum
    { id:4, ad:"Sant'Antioco", enlem:39.06, boylam:8.45, nufus:11000, foto:null, arandi:true },
    { id:5, ad:'Ma"an',        enlem:30.19, boylam:35.73, nufus:41000, foto:null, arandi:true },
    { id:6, ad:"<script>x</script>", enlem:0, boylam:0, nufus:1000, foto:null, arandi:true }
  ];
  const OTURUM = { session: { user: { id: "test-kullanici", email: "cihan@ornek.com" } } };
  function ok(d) { return Promise.resolve({ data: d, error: null }); }

  window.__puanlar = [
    { ulke:'Turkey', sehir:'Istanbul', puan:5, benim:true },
    { ulke:'Turkey', sehir:'Istanbul', puan:4 },
    { ulke:'Turkey', sehir:'Istanbul', puan:4 },
    { ulke:'Turkey', sehir:'İzmir',    puan:5 },
    { ulke:'Turkey', sehir:'İzmir',    puan:4 }
  ];
  window.__yorumlar = [
    { id:101, ulke:'Turkey', sehir:'Istanbul', metin:'Boğazda vapurla bir tur şart.', puan:5,
      benim:false, sahip:'mert', kullanici_adi:'mert', sahip_foto:null,
      begeni:2, begendim:false },
    { id:102, ulke:'Turkey', sehir:'Istanbul', metin:'Kendi notum.', puan:4,
      benim:true,  sahip:'cihan', kullanici_adi:'cihanec', sahip_foto:null,
      begeni:0, begendim:false }
  ];
  /* Bildirimler. Sahte sunucu da gercek kurallari uyguluyor:
     begeni bildiriminde kaynak kisi HIC donmuyor (kullanici_adi/isim/
     foto null), cunku gercek fonksiyon da dondurmuyor. */
  window.__bildirimler = [
    { id:1, tur:'arkadas_istek', sayi:1, okundu:false,
      guncellendi:new Date(Date.now() - 5*60000).toISOString(),
      kullanici_adi:'mert', isim:'Mert', foto:null, ulke:null, sehir:null },
    { id:2, tur:'yorum_begeni', sayi:3, okundu:false,
      guncellendi:new Date(Date.now() - 3*3600000).toISOString(),
      kullanici_adi:null, isim:null, foto:null, ulke:'Turkey', sehir:'Istanbul' },
    { id:3, tur:'arkadas_kabul', sayi:1, okundu:true,
      guncellendi:new Date(Date.now() - 4*86400000).toISOString(),
      kullanici_adi:'ayse', isim:'Ayşe', foto:null, ulke:null, sehir:null }
  ];
  window.__istekler2 = [];
  window.__favoriler  = [];
  window.__gezilenSunucu = [
    {ulke:'Turkey', sehir:'Istanbul'}, {ulke:'Turkey', sehir:'İzmir'},
    {ulke:'Italy',  sehir:"Sant'Antioco"}];
  window.__fotolar = [
    { id:'f1', yol:'u1/a.jpg', gorunurluk:'gizli',  eklendi:'2026-09-01', benim:true,  sahip:'cihan', ulke:'Turkey', sehir:'Istanbul' },
    { id:'f2', yol:'u1/b.jpg', gorunurluk:'herkes', eklendi:'2026-08-20', benim:true,  sahip:'cihan', ulke:'Italy',  sehir:"Sant'Antioco" },
    { id:'f3', yol:'u2/c.jpg', gorunurluk:'herkes', eklendi:'2026-08-10', benim:false, sahip:'mert', kullanici_adi:'mert', sahip_foto: window.__mertFoto||null }
  ];
  window.__log = { yukleme:[], silme:[], imza:0, ekleme:[], guncelleme:[] };
  window.__kova = {
    'sehir-fotolari':  ['test-kullanici/a.jpg', 'test-kullanici/b.jpg', 'baskasi/x.jpg'],
    'profil-fotolari': ['test-kullanici/p.jpg']
  };

  window.supabase = {
    createClient() {
      return {
        storage: {
          from(kova) {
            return {
              upload(yol, blob, ayar) {
                window.__log.yukleme.push({ yol, tur: blob && blob.type, boyut: blob && blob.size });
                return ok(null);
              },
              remove(yollar) {
                window.__log.silme.push(...yollar);
                if (window.__kova && window.__kova[kova]) {
                  window.__kova[kova] = window.__kova[kova].filter(y => yollar.indexOf(y) < 0);
                }
                return ok(null);
              },
              list(klasor, ayar) {
                const hep = (window.__kova && window.__kova[kova]) || [];
                const on = klasor + '/';
                return ok(hep.filter(y => y.indexOf(on) === 0)
                             .slice(0, (ayar && ayar.limit) || 100)
                             .map(y => ({ id: y, name: y.slice(on.length) })));
              },
              getPublicUrl(yol) { return { data: { publicUrl: 'https://acik/' + kova + '/' + yol } }; },
              createSignedUrls(yollar, sure) {
                window.__log.imza++;
                return ok(yollar.map(y => ({ path: y, signedUrl: 'https://imzali/' + y })));
              }
            };
          }
        },
        auth: {
          /* Testte "oturumu olmayan ziyaretci" durumunu kurabilmek icin.
             window.__oturumYok, sayfa acilmadan once kuruluyor.
             __oturumGecikme ise gercek hayati taklit ediyor: telefonda bu
             sorgu aninda cevaplanmiyor, ~1 saniye suruyor. Acilis testi
             tam o araligi olctugu icin gecikme sart -- gecikmesiz taklit
             sunucu hatayi hic gostermiyordu. */
          getSession: () => new Promise(function (c) {
            const d = window.__oturumYok ? { session: null } : OTURUM;
            setTimeout(function () { c({ data: d, error: null }); },
                       window.__oturumGecikme || 0);
          }),
          signOut: () => ok(null),
          signUp: () => ok(null),
          signInWithPassword: () => ok(null),
          resetPasswordForEmail: () => ok(null),
          updateUser: () => ok(null),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } })
        },
        rpc(ad, p) {
          if (ad === "ulke_sehirleri") {
            let l = SEHIRLER;
            if (p.p_arama) l = l.filter(s => s.ad.toLowerCase().includes(p.p_arama.toLowerCase()));
            return ok(l.slice(p.p_offset || 0, (p.p_offset || 0) + (p.p_limit || 60)));
          }
          if (ad === "ulke_sehir_sayisi") return ok(SEHIRLER.length + 40);
          if (ad === "sehir_ara") return ok([{ id:1, ulke:"Turkey", ad:"Istanbul", enlem:41, boylam:29, nufus:1 }]);
          if (ad === "sehir_foto_yaz") { window.__fotoYazildi = (window.__fotoYazildi||0)+1; return ok(null); }
          if (ad === "sehir_fotograflari") return ok(window.__fotolar.slice());
          if (ad === "gezgin_ara") return ok([
            { kullanici_adi:'mert', isim:'Mert', foto: window.__mertFoto||null, ulke_sayisi:9, sehir_sayisi:21 }]);
          if (ad === "gezgin_profil") return ok([
            { kullanici_adi:'mert', isim:'Mert', konum:'Bursa',
              foto: window.__mertFoto || null,
              kita_sayisi:2, ulke_sayisi:2, sehir_sayisi:3, benim:false,
              arkadaslik: window.__ark || 'yok',
              gorebilir: ('__gorebilir' in window) ? window.__gorebilir : true,
              hareket_acik: ('__mertHareket' in window) ? window.__mertHareket : false }]);
          if (ad === "arkadaslarim")      return ok(window.__arkListe || []);
          if (ad === "arkadas_istekleri") return ok(window.__istekler || []);
          if (ad === "arkadas_istegi_gonder") {
            window.__log.arkadas = (window.__log.arkadas||[]).concat(['gonder:'+p.p_kullanici_adi]);
            window.__ark = 'bekliyor_ben'; return ok('bekliyor_ben');
          }
          if (ad === "arkadas_istegi_yanitla") {
            window.__log.arkadas = (window.__log.arkadas||[]).concat(
              [(p.p_kabul?'kabul:':'red:')+p.p_kullanici_adi]);
            window.__ark = p.p_kabul ? 'arkadas' : 'yok';
            if (p.p_kabul) { window.__arkListe = [{kullanici_adi:'mert',isim:'Mert',foto:window.__mertFoto||null,ulke_sayisi:9,sehir_sayisi:21}];
                             window.__istekler = []; }
            else { window.__istekler = []; }
            return ok(window.__ark);
          }
          if (ad === "arkadaslikten_cik") {
            window.__log.arkadas = (window.__log.arkadas||[]).concat(['cik:'+p.p_kullanici_adi]);
            window.__ark = 'yok'; window.__arkListe = []; return ok('yok');
          }
          if (ad === "gezgin_haritasi") return ok([
            { ulke:'Italy', sehir:"Sant'Antioco", enlem:39.06, boylam:8.45, nufus:11000 },
            { ulke:'Japan', sehir:'Tokyo',  enlem:35.68, boylam:139.75, nufus:8336599 },
            { ulke:'Japan', sehir:'Kyoto',  enlem:35.02, boylam:135.75, nufus:1459640 }]);
          if (ad === "gezgin_fotograflari") return ok([
            { id:'g1', yol:'u2/g1.jpg', ulke:'Japan', sehir:'Tokyo', eklendi:'2026-09-01' }]);
          if (ad === "engellilerim") return ok(window.__engelliler || []);
          if (ad === "sehir_puani") {
            const g = (window.__puanlar || []).filter(x =>
              x.ulke === p.p_ulke && x.sehir === p.p_sehir && !x.yasakli);
            const adet = g.length;
            const top = g.reduce((t, x) => t + x.puan, 0);
            return ok([{ ortalama: adet >= 3 ? Math.round(top / adet * 10) / 10 : null,
                         adet: adet,
                         benim: (g.find(x => x.benim) || {}).puan || null }]);
          }
          /* KOPYA donuyoruz. Gercek Supabase ag uzerinden taze JSON
             veriyor; ayni nesneyi paylasirsak arayuzun iyimser
             guncellemesi "sunucudaki" kaydi da degistiriyor ve
             begeni testi kendi kuyrugunu isiriyor -- bir kez oldu. */
          if (ad === "sehir_yorumlari") return ok(
            (window.__yorumlar || []).filter(y => y.ulke===p.p_ulke && y.sehir===p.p_sehir)
              .map(y => Object.assign({}, y)));
          /* Yorum begenisi: kural taklit sunucuda da var, yoksa
             "kendi yorumunu begenemezsin" arayuzde hic denenmez ve
             kural yokmus gibi gorunur. */
          if (ad === "yorum_begen") {
            const y = (window.__yorumlar || []).filter(x => x.id === p.p_id)[0];
            if (!y) return Promise.resolve({data:null,error:{message:'Yorum bulunamadi.'}});
            if (y.benim) return Promise.resolve(
              {data:null,error:{message:'Kendi yorumunu begenemezsin.'}});
            if (window.__begeniHata) return Promise.resolve(
              {data:null,error:{message: window.__begeniHata}});
            y.begendim = !y.begendim;
            /* __begeniBaskasi: "sen dugmeye basana kadar baskalari da
               begenmisti" durumu. Arayuzun iyimser tahmini ile sunucunun
               sayisi ayrisiyor; son sozu sunucu soylemeli. */
            y.begeni = (y.begeni || 0) + (y.begendim ? 1 : -1)
                     + (window.__begeniBaskasi || 0);
            window.__begeniBaskasi = 0;
            window.__log.begeni = (window.__log.begeni || [])
              .concat([(y.begendim ? 'begen:' : 'geri:') + y.id]);
            return ok([{ begeni: y.begeni, begendim: y.begendim }]);
          }
          if (ad === "bildirimlerim") return ok(
            (window.__bildirimler || []).map(b => Object.assign({}, b)));
          if (ad === "okunmamis_bildirim") return ok(
            (window.__bildirimler || []).filter(b => !b.okundu).length);
          if (ad === "bildirimleri_okudum") {
            const n = (window.__bildirimler || []).filter(b => !b.okundu).length;
            (window.__bildirimler || []).forEach(b => { b.okundu = true; });
            window.__log.bildirim = (window.__log.bildirim || []).concat(['okudum:' + n]);
            return ok(n);
          }
          if (ad === "yorumlarim") return ok(
            (window.__yorumlar || []).filter(y => y.benim));
          if (ad === "gezgin_yorumlari") return ok(
            window.__mertYorum || [{ulke:'Japan', sehir:'Tokyo', metin:'Kalabalık ama bağımlılık yapıyor.', puan:5}]);
          /* --- listeler: sahte sunucu da gercek kurallari uyguluyor,
             yoksa "6 sinir" ya da "once gitmis olmalisin" testte hic
             calismaz ve arayuz kurali yokmus gibi gorunur. --- */
          if (ad === "listelerim") return ok(
            (window.__istekler2 || []).map(r => Object.assign({tur:'istek'}, r))
              .concat((window.__favoriler || []).map(r => Object.assign({tur:'favori'}, r))));
          if (ad === "gezgin_listeleri") return ok(
            (window.__mertIstek || [{ulke:'Peru', sehir:'Cusco', enlem:-13.5, boylam:-71.9}])
              .map(r => Object.assign({tur:'istek'}, r))
            .concat((window.__mertFavori || [{ulke:'Japan', sehir:'Tokyo', enlem:35.68, boylam:139.75}])
              .map(r => Object.assign({tur:'favori'}, r))));
          if (ad === "gitmek_istiyorum") {
            const g = (window.__gezilenSunucu || []).some(x =>
              x.ulke === p.p_ulke && x.sehir === p.p_sehir);
            if (g) return Promise.resolve({data:null,error:{message:'Buraya zaten gitmissin.'}});
            const v = (window.__istekler2 || []).some(x => x.ulke===p.p_ulke && x.sehir===p.p_sehir);
            if (v) { window.__istekler2 = window.__istekler2.filter(x =>
                       !(x.ulke===p.p_ulke && x.sehir===p.p_sehir)); return ok(false); }
            window.__istekler2 = (window.__istekler2||[]).concat([{ulke:p.p_ulke, sehir:p.p_sehir}]);
            return ok(true);
          }
          if (ad === "favori_degistir") {
            const v = (window.__favoriler || []).some(x => x.ulke===p.p_ulke && x.sehir===p.p_sehir);
            if (v) { window.__favoriler = window.__favoriler.filter(x =>
                       !(x.ulke===p.p_ulke && x.sehir===p.p_sehir)); return ok(false); }
            const gitti = (window.__gezilenSunucu || []).some(x =>
              x.ulke === p.p_ulke && x.sehir === p.p_sehir);
            if (!gitti) return Promise.resolve({data:null,
              error:{message:'Favorilere eklemek icin once buraya gittigini isaretle.'}});
            if ((window.__favoriler||[]).length >= 6) return Promise.resolve({data:null,
              error:{message:'En fazla 6 favori sehir secebilirsin. Once birini cikar.'}});
            window.__favoriler = (window.__favoriler||[]).concat([{ulke:p.p_ulke, sehir:p.p_sehir}]);
            return ok(true);
          }
          if (ad === "hesabimi_sil") {
            const kalan = []
              .concat((window.__kova && window.__kova['sehir-fotolari']) || [])
              .concat((window.__kova && window.__kova['profil-fotolari']) || [])
              .filter(y => y.indexOf(OTURUM.session.user.id + '/') === 0);
            if (kalan.length) {
              return Promise.resolve({ data:null,
                error:{ message:'Fotograflar silinemedi, tekrar dene.' } });
            }
            window.__log.hesapSilindi = true;
            // Sayfa birazdan yenilenecek; sonucu sessionStorage'a birakiyoruz
            // ki test yenilemeden sonra okuyabilsin.
            try {
              sessionStorage.setItem('__silTest', JSON.stringify({
                silinen: window.__log.silme, kalan: window.__kova }));
            } catch (e) {}
            return ok(true);
          }
          if (ad === "engelle") {
            window.__log.engel = (window.__log.engel||[]).concat(['engelle:'+p.p_kullanici_adi]);
            window.__engelliler = (window.__engelliler||[]).concat(
              [{kullanici_adi:p.p_kullanici_adi, isim:null, foto:null, olusturuldu:'2026-09-08'}]);
            return ok(true);
          }
          if (ad === "engeli_kaldir") {
            window.__log.engel = (window.__log.engel||[]).concat(['kaldir:'+p.p_kullanici_adi]);
            window.__engelliler = (window.__engelliler||[]).filter(g=>g.kullanici_adi!==p.p_kullanici_adi);
            return ok(true);
          }
          if (ad === "sikayet_et") {
            window.__log.sikayet = (window.__log.sikayet||[]).concat(
              [{tur:p.p_tur, foto:p.p_foto_id, ad:p.p_kullanici_adi,
                sebep:p.p_sebep, aciklama:p.p_aciklama,
                ulke:p.p_ulke||null, sehir:p.p_sehir||null}]);
            if (!p.p_sebep) return Promise.resolve({data:null,error:{message:'Gecersiz sebep.'}});
            return ok(true);
          }
          if (ad === "sehir_gezenler") {
            window.__log.gezenler = (window.__log.gezenler||[]).concat([{s:p.p_sehir, ay:p.p_ay}]);
            const hep = window.__gezenler || [
              { kullanici_adi:'cihanec', isim:'Cihan', foto:null, gidilen:'2026-06-01', benim:true },
              { kullanici_adi:'mert', isim:'Mert', foto:'u2/mert.jpg', gidilen:'2026-08-01', benim:false },
              { kullanici_adi:'ayse', isim:'Ayşe', foto:null, gidilen:null, benim:false }];
            if (!p.p_ay) return ok(hep);
            return ok(hep.filter(g=>g.gidilen && g.gidilen >= '2026-07-01'));
          }
          if (ad === "gezgin_gezi_kaydi") return ok(window.__mertKayit || []);
          if (ad === "sehir_tarihi_yaz") {
            window.__log.tarih = (window.__log.tarih||[]).concat(
              [{u:p.p_ulke, s:p.p_sehir, y:p.p_yil, a:p.p_ay}]);
            if (p.p_yil == null || p.p_ay == null) return ok(null);
            return ok(p.p_yil + '-' + String(p.p_ay).padStart(2,'0') + '-01');
          }
          if (ad === "hareket_gizlilik_yaz") {
            window.__hacik = p.p_acik;
            window.__log.hareket = (window.__log.hareket||[]).concat([p.p_acik]);
            return ok(p.p_acik);
          }
          if (ad === "profil_gizlilik_yaz") {
            window.__pacik = p.p_acik;
            window.__log.gizlilik = (window.__log.gizlilik||[]).concat([p.p_acik]);
            return ok(p.p_acik);
          }
          if (ad === "profil_foto_yaz") {
            window.__pfoto = p.p_yol || null;
            window.__log.profilFoto = (window.__log.profilFoto||[]).concat([p.p_yol]);
            return ok(p.p_yol || null);
          }
          if (ad === "kullanici_adi_musait") {
            const t = String(p.p_ad||'').toLowerCase();
            return ok(/^[a-z0-9_]{3,20}$/.test(t) && t !== 'mert');
          }
          if (ad === "kullanici_adi_al") {
            const t = String(p.p_ad||'').toLowerCase();
            if (!/^[a-z0-9_]{3,20}$/.test(t))
              return Promise.resolve({data:null,error:{message:'Kullanici adi 3-20 karakter olmali.'}});
            if (t === 'mert')
              return Promise.resolve({data:null,error:{message:'Bu kullanici adi alinmis.'}});
            return ok(t);
          }
          return ok(null);
        },
        from(tablo) {
          const q = {
            select(sutunlar) { q.__sutun = sutunlar; return q; },
            eq(k, v) { (q.__esit = q.__esit || {})[k] = v; return q; },
            order() { return q; },
            in() { return q; },
            insert(v) {
              window.__yazildi=(window.__yazildi||0)+1;
              if (tablo === "gezilenler") {
                window.__log.gezi = (window.__log.gezi||[]).concat(['ekle:'+v.sehir]);
                window.__gezilenSunucu = (window.__gezilenSunucu||[])
                  .concat([{ulke:v.ulke, sehir:v.sehir}]);
                window.__istekler2 = (window.__istekler2||[])       // tetikleyici
                  .filter(x => !(x.ulke===v.ulke && x.sehir===v.sehir));
              }
              if (tablo === "sehir_fotolari") {
                window.__log.ekleme.push(v);
                if (window.__fotolar.filter(f=>f.benim).length >= 3)
                  return Promise.resolve({ data:null, error:{ message:"Bir sehre en fazla 3 fotograf ekleyebilirsin." } });
                window.__fotolar.unshift({ id:'yeni', yol:v.yol, gorunurluk:'gizli', benim:true, sahip:'cihan' });
              }
              return ok(null);
            },
            delete() { q.__sil = true; return q; },
            upsert(v) { q.__yazilan = v; return q; },
            update(v) { if (tablo === "sehir_fotolari") { q.__guncel = v; } return q; },
            maybeSingle() {
              // Gercek istemcide maybeSingle de ayni sorguyu calistirir;
              // sahte sunucuda kestirmeden null donmek, duzelttigimiz
              // hatanin testte gorunmemesine yol acmisti.
              return new Promise(function (coz) { q.then(coz); });
            },
            then(res) {
              if (tablo === "sehir_fotolari") {
                /* Profilin "Fotograflar" sekmesi kendi satirlarimi
                   dogrudan tablodan cekiyor (RLS zaten suzuyor). */
                if (!q.__sil && !q.__guncel)
                  return res({ data: window.__fotolar.filter(f=>f.benim).map(function(f){
                    return { id:f.id, ulke:f.ulke, sehir:f.sehir, yol:f.yol,
                             gorunurluk:f.gorunurluk, created_at:f.eklendi };
                  }), error: null });
                if (q.__sil)   { window.__log.silme.push('KAYIT'); window.__fotolar = window.__fotolar.filter(f=>f.id!=='f1'); }
                if (q.__guncel){ window.__log.guncelleme.push(q.__guncel);
                                 const f = window.__fotolar.find(x=>x.id==='f1'); if (f) f.gorunurluk = q.__guncel.gorunurluk; }
                return res({ data: null, error: null });
              }
              if (tablo === "ulkeler")
                return res({ data: [
                  {ad:"Turkey",kita:"Asya"},{ad:"Italy",kita:"Avrupa"},{ad:"France",kita:"Avrupa"},
                  {ad:"Japan",kita:"Asya"},{ad:"Brazil",kita:"Güney Amerika"},{ad:"Egypt",kita:"Afrika"}
                ], error: null });
              if (tablo === "gezilenler" && q.__sil) {
                const su = (q.__esit&&q.__esit.ulke)||'', ss = (q.__esit&&q.__esit.sehir)||'?';
                window.__log.gezi = (window.__log.gezi||[]).concat(['sil:'+ss]);
                window.__gezilenSunucu = (window.__gezilenSunucu||[])
                  .filter(x => !(x.ulke===su && x.sehir===ss));
                window.__favoriler = (window.__favoriler||[])
                  .filter(x => !(x.ulke===su && x.sehir===ss));   // tetikleyici
                return res({ data: null, error: null });
              }
              if (tablo === "gezilenler")
                return res({ data: [
                  {ulke:"Turkey",sehir:"Istanbul",gidilen:"2026-06-01",created_at:"2026-01-01T00:00:00Z"},
                  {ulke:"Turkey",sehir:"İzmir",gidilen:null,created_at:"2026-03-01T00:00:00Z"},
                  {ulke:"Italy",sehir:"Sant'Antioco",gidilen:"2025-09-01",created_at:"2026-02-01T00:00:00Z"}
                ], error: null });
              if (tablo === "sehirler")
                return res({ data: [
                  {ulke:"Turkey",ad:"Istanbul",enlem:41.01,boylam:28.95,nufus:15701602},
                  {ulke:"Turkey",ad:"İzmir",enlem:38.42,boylam:27.13,nufus:2938292},
                  {ulke:"Italy",ad:"Sant'Antioco",enlem:39.06,boylam:8.45,nufus:11000}
                ], error: null });
              if (tablo === "profil") {
                // Yeni hesapta profil satiri HIC yok: PostgREST maybeSingle
                // bu durumda data:null, error:null donuyor.
                if (window.__profilYok) return res({ data: null, error: null });
                // Gercek PostgREST sadece istenen sutunlari doner. Sahte
                // sunucunun daha comert davranmasi, eksik bir select'i
                // testte gizler — bir kez oyle bir hata kacti.
                const tam = { isim:'Cihan', konum:'İstanbul',
                              kullanici_adi: ('__kad' in window) ? window.__kad : 'cihanec',
                              foto: ('__pfoto' in window) ? window.__pfoto : null,
                              profil_acik: ('__pacik' in window) ? window.__pacik : true,
                              hareket_acik: ('__hacik' in window) ? window.__hacik : false };
                const istenen = String(q.__sutun || '*').split(',').map(x=>x.trim());
                const cikti = istenen[0] === '*' ? tam : {};
                if (istenen[0] !== '*') istenen.forEach(k => { if (k in tam) cikti[k] = tam[k]; });
                return res({ data: cikti, error: null });
              }
              if (tablo === "sehir_detaylari") {
                if (q.__yazilan) { window.__log.detay = (window.__log.detay||[]).concat([q.__yazilan]);
                                   return res({ data: null, error: window.__detayHata || null }); }
                return res({ data: [{ulke:"Turkey",sehir:"Istanbul",puan:4,
                                     notlar:"güzeldi",not_acik:false}], error: null });
              }
              return res({ data: [], error: null });
            }
          };
          return q;
        }
      };
    }
  };
  // wikipedia istegi test ortaminda gitmesin
  const asilFetch = window.fetch;
  window.fetch = function (u, o) {
    if (String(u).includes("wikipedia")) {
      window.__wiki = (window.__wiki||0)+1;
      return Promise.resolve({ json: () => Promise.resolve({ query:{ pages:{ 1:{ thumbnail:{ source:"https://w/x.jpg" } } } } }) });
    }
    if (String(u).includes("countries.geo.json")) {
      const kare=(x,y,r)=>[[[x-r,y-r],[x+r,y-r],[x+r,y+r],[x-r,y+r],[x-r,y-r]]];
      const ters=(c)=>[c[0].slice().reverse()];
      return Promise.resolve({ json: () => Promise.resolve({ features: [
        { type:"Feature", properties:{name:"Turkey"}, geometry:{type:"Polygon", coordinates:ters(kare(35,39,4))} },
        { type:"Feature", properties:{name:"Italy"},  geometry:{type:"Polygon", coordinates:ters(kare(12,43,3))} },
        { type:"Feature", properties:{name:"France"}, geometry:{type:"MultiPolygon", coordinates:[ters(kare(2,47,3)), ters(kare(9,42,1))]} },
        { type:"Feature", properties:{name:"Bermuda"}, geometry:{type:"Polygon", coordinates:kare(-64.7,32.3,0.1)} }
      ] }) });
    }
    return asilFetch(u, o);
  };
})();
