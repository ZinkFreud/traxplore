// ŞEHİR VERİSİ (şimdilik sadece Türkiye)
const sehirVerisi = {
    "Turkey": [
        { ad: "İstanbul", foto: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400", aciklama: "İki kıtayı birleştiren tarihi metropol." },
        { ad: "Ankara", foto: "https://images.unsplash.com/photo-1589561253898-768105ca91a8?w=400", aciklama: "Türkiye'nin başkenti." },
        { ad: "İzmir", foto: "https://images.unsplash.com/photo-1605101479435-005f9c563944?w=400", aciklama: "Ege'nin incisi, sahil şehri." },
        { ad: "Antalya", foto: "https://images.unsplash.com/photo-1600240644455-3edc55c375fe?w=400", aciklama: "Turkuaz sahilleriyle ünlü tatil şehri." }
    ],
    "France": [
        { ad: "Paris", foto: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400", aciklama: "Işık şehri, Eyfel Kulesi'nin evi." },
        { ad: "Nice", foto: "https://images.unsplash.com/photo-1491166617655-0723a0999cfc?w=400", aciklama: "Fransız Rivierası'nın gözdesi." },
        { ad: "Lyon", foto: "https://images.unsplash.com/photo-1524396309943-e03f5249f002?w=400", aciklama: "Gastronomi başkenti." },
        { ad: "Marseille", foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Vieux%20Port%20Marseille.jpg?width=400", aciklama: "Akdeniz'in liman şehri." }
    ],
    "Italy": [
        { ad: "Roma", foto: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400", aciklama: "Antik tarihin başkenti, Kolezyum." },
        { ad: "Venedik", foto: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=400", aciklama: "Kanallar üstüne kurulu şehir." },
        { ad: "Floransa", foto: "https://images.unsplash.com/photo-1541370976299-4d24ebbc9077?w=400", aciklama: "Rönesans'ın doğduğu yer." },
        { ad: "Milano", foto: "https://images.unsplash.com/photo-1520440229-6469a149ac59?w=400", aciklama: "Moda ve tasarım merkezi." }
    ],
    "Spain": [
        { ad: "Barselona", foto: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400", aciklama: "Gaudí mimarisi ve deniz." },
        { ad: "Madrid", foto: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400", aciklama: "İspanya'nın canlı başkenti." },
        { ad: "Sevilla", foto: "https://images.unsplash.com/photo-1559386081-325882507af7?w=400", aciklama: "Flamenko ve Endülüs ruhu." },
        { ad: "Valencia", foto: "https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=400", aciklama: "Paella'nın ve modern mimarinin şehri." }
    ],
    "Germany": [
        { ad: "Berlin", foto: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=400", aciklama: "Tarih ve sanatın buluştuğu başkent." },
        { ad: "Münih", foto: "https://images.unsplash.com/photo-1595867818082-083862f3d630?w=400", aciklama: "Bavyera'nın kalbi, Oktoberfest." },
        { ad: "Hamburg", foto: "https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=400", aciklama: "Kuzey'in büyük liman şehri." },
        { ad: "Köln", foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Cologne%20Germany%20Panorama-of-Cologne-city-center-01.jpg?width=400", aciklama: "Ünlü katedraliyle tanınır." }
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
                "<img src='" + sehirler[i].foto + "' onerror='this.src=\"https://placehold.co/400x200/1a1a1a/E67E22?text=\" + encodeURIComponent(this.alt || \"foto\")' alt='" + sehirler[i].ad + "'>" +
                    "<div class='sehir-bilgi'>" +
                        "<div class='sehir-ad'>" + sehirler[i].ad + "</div>" +
                        "<div class='sehir-aciklama'>" + sehirler[i].aciklama + "</div>" +
                    "</div>" +
                "</div>";
        }
    }
    document.getElementById("panel").classList.add("acik");
    document.getElementById("ortu").classList.add("acik");
}

function paneliKapat() {
    document.getElementById("panel").classList.remove("acik");
    document.getElementById("ortu").classList.remove("acik");
}

document.getElementById("kapat").addEventListener("click", paneliKapat);
document.getElementById("ortu").addEventListener("click", paneliKapat);