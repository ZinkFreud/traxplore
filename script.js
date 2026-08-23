// ŞEHİR VERİSİ (şimdilik sadece Türkiye)
const sehirVerisi = {
    "Turkey": [
        { ad: "İstanbul", foto: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400", aciklama: "İki kıtayı birleştiren tarihi metropol." },
        { ad: "Ankara", foto: "https://images.unsplash.com/photo-1589561253898-768105ca91a8?w=400", aciklama: "Türkiye'nin başkenti." },
        { ad: "İzmir", foto: "https://images.unsplash.com/photo-1605101479435-005f9c563944?w=400", aciklama: "Ege'nin incisi, sahil şehri." },
        { ad: "Antalya", foto: "https://images.unsplash.com/photo-1600240644455-3edc55c375fe?w=400", aciklama: "Turkuaz sahilleriyle ünlü tatil şehri." }
    ]
};

let gezilenler = JSON.parse(localStorage.getItem("gezilenler")) || [];

function gezileriKaydet() {
    localStorage.setItem("gezilenler", JSON.stringify(gezilenler));
}

let ulkeKatmanlari = {};

function istatistikGuncelle() {
    const ulkeler = [];
    for (let i = 0; i < gezilenler.length; i++) {
        if (ulkeler.indexOf(gezilenler[i].ulke) === -1) {
            ulkeler.push(gezilenler[i].ulke);
        }
    }
    document.getElementById("istatistik").textContent =
        ulkeler.length + " Ülke — " + gezilenler.length + " Şehir gezdin";
}

function ulkeRenkGuncelle(ulke) {
    const katman = ulkeKatmanlari[ulke];
    if (!katman) return;
    const gezildi = gezilenler.some(function(g) { return g.ulke === ulke; });
    katman.setStyle({ fillColor: gezildi ? "#E67E22" : "#1a1a1a" });
}

function sehirSec(kart, ulke, sehir) {
    const indeks = gezilenler.findIndex(function(g) {
        return g.ulke === ulke && g.sehir === sehir;
    });

    if (indeks === -1) {
        gezilenler.push({ ulke: ulke, sehir: sehir });
        kart.classList.add("secili");
    } else {
        gezilenler.splice(indeks, 1);
        kart.classList.remove("secili");
    }
    gezileriKaydet();
    istatistikGuncelle();
    ulkeRenkGuncelle(ulke);
}

const harita = L.map("harita", { center: [30, 15], zoom: 2 });

fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json")
    .then(function(cevap) { return cevap.json(); })
    .then(function(veri) {
        L.geoJSON(veri, {
            style: {
                fillColor: "#1a1a1a",
                fillOpacity: 1,
                color: "#1b3a5c",
                weight: 1
            },
            onEachFeature: function(feature, layer) {
                ulkeKatmanlari[feature.properties.name] = layer;
                layer.bindTooltip(feature.properties.name, { sticky: true, className: "ulke-etiket", direction: "top", offset: [0, -10] });
                layer.on({
                    mouseover: function(e) { e.target.setStyle({ fillColor: "#E67E22" }); },
                    mouseout: function(e) {
                        const gezildi = gezilenler.some(function(g) { return g.ulke === feature.properties.name; });
                        e.target.setStyle({ fillColor: gezildi ? "#E67E22" : "#1a1a1a" });
                    },
                    click: function(e) { panelAc(feature.properties.name); }
                });
            }
        }).addTo(harita);

        // Kayıtlı gezilen ülkeleri baştan renklendir
        for (let i = 0; i < gezilenler.length; i++) {
            ulkeRenkGuncelle(gezilenler[i].ulke);
        }
    });

istatistikGuncelle();

function panelAc(ulkeAdi) {
    document.getElementById("panelBaslik").textContent = ulkeAdi;
    const liste = document.getElementById("sehirListe");
    liste.innerHTML = "";

    const sehirler = sehirVerisi[ulkeAdi];
    if (sehirler) {
        const sutunSayisi = Math.ceil(sehirler.length / 2);
        liste.style.gridTemplateColumns = "repeat(" + sutunSayisi + ", 1fr)";
    }
    if (!sehirler) {
        liste.innerHTML = "<p style='color:#888'>Bu ülke için henüz şehir eklenmedi.</p>";
    } else {
        for (let i = 0; i < sehirler.length; i++) {
            const seciliMi = gezilenler.findIndex(function(g) {
                return g.ulke === ulkeAdi && g.sehir === sehirler[i].ad;
            }) !== -1;

            liste.innerHTML +=
                "<div class='sehir-kart" + (seciliMi ? " secili" : "") + "' onclick='sehirSec(this, \"" + ulkeAdi + "\", \"" + sehirler[i].ad + "\")'>" +
                    "<img src='" + sehirler[i].foto + "'>" +
                    "<div class='sehir-bilgi'>" +
                        "<div class='sehir-ad'>" + sehirler[i].ad + "</div>" +
                        "<div class='sehir-aciklama'>" + sehirler[i].aciklama + "</div>" +
                    "</div>" +
                "</div>";
        }
    }
    document.getElementById("panel").classList.add("acik");
}

document.getElementById("kapat").addEventListener("click", function() {
    document.getElementById("panel").classList.remove("acik");
});