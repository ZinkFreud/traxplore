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
    ],
    
    "United Kingdom": [
        { ad: "Londra", foto: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400", aciklama: "Big Ben ve Thames'in şehri." },
        { ad: "Edinburgh", foto: "https://images.unsplash.com/photo-1506377585622-bedcbb027afc?w=400", aciklama: "İskoçya'nın tarihi başkenti." },
        { ad: "Manchester", foto: "https://images.unsplash.com/photo-1588934402681-c0b6f1a6a30f?w=400", aciklama: "Futbol ve müzik şehri." },
        { ad: "Liverpool", foto: "https://images.unsplash.com/photo-1557925179-4a01b4e6e3a1?w=400", aciklama: "Beatles'ın memleketi, liman şehri." }
    ],
    "Netherlands": [
        { ad: "Amsterdam", foto: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400", aciklama: "Kanallar ve bisikletler şehri." },
        { ad: "Rotterdam", foto: "https://images.unsplash.com/photo-1558551649-e44c8f992010?w=400", aciklama: "Modern mimarinin limanı." },
        { ad: "Utrecht", foto: "https://images.unsplash.com/photo-1601999009162-5a4a1a1a1a1a?w=400", aciklama: "Ortaçağ merkezli üniversite şehri." },
        { ad: "Lahey", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Hükümet ve uluslararası mahkemeler." }
    ],
    "Belgium": [
        { ad: "Brüksel", foto: "https://images.unsplash.com/photo-1559113202-c916b8e44373?w=400", aciklama: "AB'nin başkenti, Grand Place." },
        { ad: "Bruges", foto: "https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=400", aciklama: "Kuzey'in Venedik'i, kanallar." },
        { ad: "Anvers", foto: "https://images.unsplash.com/photo-1605106702734-205df224ecce?w=400", aciklama: "Elmas ve moda şehri." },
        { ad: "Gent", foto: "https://images.unsplash.com/photo-1608022625637-a8e0a1a1a1a1?w=400", aciklama: "Ortaçağ mimarisi ve kanallar." }
    ],
    "Portugal": [
        { ad: "Lizbon", foto: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=400", aciklama: "Tramvaylar ve tepeler şehri." },
        { ad: "Porto", foto: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400", aciklama: "Porto şarabının memleketi." },
        { ad: "Faro", foto: "https://images.unsplash.com/photo-1591792447271-4a1a1a1a1a1a?w=400", aciklama: "Algarve sahillerinin kapısı." },
        { ad: "Coimbra", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Tarihi üniversite şehri." }
    ],
    "Switzerland": [
        { ad: "Zürih", foto: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=400", aciklama: "Finans merkezi, göl kıyısı." },
        { ad: "Cenevre", foto: "https://images.unsplash.com/photo-1552644561-0c2a1a1a1a1a?w=400", aciklama: "Uluslararası kuruluşların şehri." },
        { ad: "Bern", foto: "https://images.unsplash.com/photo-1596395819057-e37f0e0a1a1a?w=400", aciklama: "İsviçre'nin başkenti." },
        { ad: "Luzern", foto: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=400", aciklama: "Göl ve dağların buluştuğu yer." }
    ],
    "Austria": [
        { ad: "Viyana", foto: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=400", aciklama: "Müzik ve saraylar şehri." },
        { ad: "Salzburg", foto: "https://images.unsplash.com/photo-1595867818082-083862f3d630?w=400", aciklama: "Mozart'ın doğduğu şehir." },
        { ad: "Innsbruck", foto: "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=400", aciklama: "Alpler'in kucağında kayak merkezi." },
        { ad: "Graz", foto: "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=400", aciklama: "Öğrenci şehri, tarihi merkez." }
    ],
    "Greece": [
        { ad: "Atina", foto: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=400", aciklama: "Antik demokrasinin beşiği, Akropolis." },
        { ad: "Selanik", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Kuzey'in canlı liman şehri." },
        { ad: "Santorini", foto: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400", aciklama: "Beyaz evler, mavi kubbeler." },
        { ad: "Rodos", foto: "https://images.unsplash.com/photo-1589561084283-930aa7b1ce50?w=400", aciklama: "Şövalyeler adası." }
    ],
    "Poland": [
        { ad: "Varşova", foto: "https://images.unsplash.com/photo-1519197924294-4ba991a11128?w=400", aciklama: "Yeniden doğan başkent." },
        { ad: "Krakov", foto: "https://images.unsplash.com/photo-1607427293702-036933bbf746?w=400", aciklama: "Ortaçağ mimarisi korunmuş şehir." },
        { ad: "Gdansk", foto: "https://images.unsplash.com/photo-1601049676869-702ea24cfd58?w=400", aciklama: "Baltık kıyısında liman şehri." },
        { ad: "Wroclaw", foto: "https://images.unsplash.com/photo-1602522797683-8b8b8b8b8b8b?w=400", aciklama: "Cüceleriyle ünlü renkli şehir." }
    ],
    "Czech Republic": [
        { ad: "Prag", foto: "https://images.unsplash.com/photo-1541849546-216549ae216d?w=400", aciklama: "Yüz kuleli şehir, Charles Köprüsü." },
        { ad: "Brno", foto: "https://images.unsplash.com/photo-1600250395178-40fe752e5189?w=400", aciklama: "Çekya'nın ikinci büyük şehri." },
        { ad: "Cesky Krumlov", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Masalsı ortaçağ kasabası." },
        { ad: "Ostrava", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Sanayi mirası şehri." }
    ],
    "Hungary": [
        { ad: "Budapeşte", foto: "https://images.unsplash.com/photo-1541849546-216549ae216d?w=400", aciklama: "Tuna'nın incisi, termal banyolar." },
        { ad: "Debrecen", foto: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400", aciklama: "Macaristan'ın ikinci şehri." },
        { ad: "Szeged", foto: "https://images.unsplash.com/photo-1571983823232-07c35b70d3a1?w=400", aciklama: "Güneş şehri, üniversite merkezi." },
        { ad: "Pecs", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Akdeniz havalı kültür şehri." }
    ],
    "Ireland": [
        { ad: "Dublin", foto: "https://images.unsplash.com/photo-1549918864-48ac978761a4?w=400", aciklama: "Edebiyat ve pub kültürü." },
        { ad: "Cork", foto: "https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=400", aciklama: "Güneyin canlı liman şehri." },
        { ad: "Galway", foto: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400", aciklama: "Batı kıyısının sanat şehri." },
        { ad: "Limerick", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Shannon nehri kıyısında tarihi şehir." }
    ],
    "Sweden": [
        { ad: "Stockholm", foto: "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=400", aciklama: "14 ada üstüne kurulu başkent." },
        { ad: "Göteborg", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Batı kıyısının liman şehri." },
        { ad: "Malmö", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Köprüyle Danimarka'ya bağlı." },
        { ad: "Uppsala", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Tarihi üniversite şehri." }
    ],
    "Norway": [
        { ad: "Oslo", foto: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400", aciklama: "Fiyortların başkenti." },
        { ad: "Bergen", foto: "https://images.unsplash.com/photo-1516913887303-c40e9ba6e651?w=400", aciklama: "Renkli ahşap evler, fiyort kapısı." },
        { ad: "Tromsø", foto: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400", aciklama: "Kuzey ışıklarının şehri." },
        { ad: "Stavanger", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Preikestolen'in kapısı." }
    ],
    "Denmark": [
        { ad: "Kopenhag", foto: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=400", aciklama: "Bisiklet ve tasarım şehri." },
        { ad: "Aarhus", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Genç ve canlı sahil şehri." },
        { ad: "Odense", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Andersen'in doğduğu şehir." },
        { ad: "Aalborg", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Kuzey Jutland'ın merkezi." }
    ],
    "Finland": [
        { ad: "Helsinki", foto: "https://images.unsplash.com/photo-1559564484-e48b3e040ff4?w=400", aciklama: "Baltık'ın tasarım başkenti." },
        { ad: "Tampere", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Göller arası sanayi şehri." },
        { ad: "Turku", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Finlandiya'nın eski başkenti." },
        { ad: "Rovaniemi", foto: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=400", aciklama: "Noel Baba'nın memleketi, Lapland." }
    ],
    "Croatia": [
        { ad: "Zagreb", foto: "https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?w=400", aciklama: "Orta Avrupa havalı başkent." },
        { ad: "Dubrovnik", foto: "https://images.unsplash.com/photo-1555990538-ffce5cd94e10?w=400", aciklama: "Adriyatik'in incisi, surlar." },
        { ad: "Split", foto: "https://images.unsplash.com/photo-1591536421904-8b8b8b8b8b8b?w=400", aciklama: "Diocletian Sarayı'nın şehri." },
        { ad: "Zadar", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Deniz orgu ve gün batımı." }
    ],
    "Romania": [
        { ad: "Bükreş", foto: "https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=400", aciklama: "Küçük Paris denen başkent." },
        { ad: "Braşov", foto: "https://images.unsplash.com/photo-1583266699665-8b8b8b8b8b8b?w=400", aciklama: "Karpatlar'da ortaçağ şehri." },
        { ad: "Cluj-Napoca", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Transilvanya'nın kalbi." },
        { ad: "Sibiu", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Renkli çatılı ortaçağ şehri." }
    ],
    "Bulgaria": [
        { ad: "Sofya", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Vitosha dağı eteğinde başkent." },
        { ad: "Plovdiv", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Avrupa'nın en eski şehirlerinden." },
        { ad: "Varna", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Karadeniz'in yazlık başkenti." },
        { ad: "Burgas", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Karadeniz liman şehri." }
    ],
    "Republic of Serbia": [
        { ad: "Belgrad", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "İki nehrin buluştuğu başkent." },
        { ad: "Novi Sad", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Exit festivalinin şehri." },
        { ad: "Niş", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Güneyin tarihi şehri." },
        { ad: "Subotica", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Art nouveau mimarisi." }
    ],
    "Ukraine": [
        { ad: "Kiev", foto: "https://images.unsplash.com/photo-1596395819057-e37f0e0a1a1a?w=400", aciklama: "Altın kubbeli tarihi başkent." },
        { ad: "Lviv", foto: "https://images.unsplash.com/photo-1591536421904-8b8b8b8b8b8b?w=400", aciklama: "Kahve ve ortaçağ mimarisi." },
        { ad: "Odessa", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Karadeniz'in liman incisi." },
        { ad: "Kharkiv", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Doğunun büyük üniversite şehri." }
    ],
    "Russia": [
        { ad: "Moskova", foto: "https://images.unsplash.com/photo-1513326738677-b964603b136d?w=400", aciklama: "Kızıl Meydan ve Kremlin." },
        { ad: "St. Petersburg", foto: "https://images.unsplash.com/photo-1556610961-2fecc5927173?w=400", aciklama: "Kuzey'in Venedik'i, saraylar." },
        { ad: "Kazan", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Doğu-Batı kültürlerinin buluştuğu yer." },
        { ad: "Soçi", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Karadeniz'in tatil şehri." }
    ],
    "Iceland": [
        { ad: "Reykjavik", foto: "https://images.unsplash.com/photo-1504284882432-3f30a2c98b6c?w=400", aciklama: "Dünyanın en kuzeydeki başkenti." },
        { ad: "Akureyri", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Kuzey'in başkenti denen şehir." },
        { ad: "Vik", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Siyah kumlu plajlar." },
        { ad: "Hafnarfjörður", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Lav alanı üstünde kurulu liman." }
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
    katman.setStyle({ fillColor: gezildi ? "#E67E22" : "#1e2a3a" });
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
    gecmisGuncelle();
    ulkeRenkGuncelle(ulke);
}

const harita = L.map("harita", { center: [30, 15], zoom: 2 });

fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json")
    .then(function(cevap) { return cevap.json(); })
    .then(function(veri) {
        L.geoJSON(veri, {
            style: {
                fillColor: "#1e2a3a",
                fillOpacity: 1,
                color: "#e8e0d0",
                weight: 1
            },
            onEachFeature: function(feature, layer) {
                ulkeKatmanlari[feature.properties.name] = layer;
                layer.bindTooltip(feature.properties.name, { sticky: true, className: "ulke-etiket", direction: "top", offset: [0, -10] });
                layer.on({
                    mouseover: function(e) { e.target.setStyle({ fillColor: "#E67E22" }); },
                    mouseout: function(e) {
                        const gezildi = gezilenler.some(function(g) { return g.ulke === feature.properties.name; });
                        e.target.setStyle({ fillColor: gezildi ? "#E67E22" : "#1e2a3a" });
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
    gecmisGuncelle();
istatistikGuncelle();
function gecmisGuncelle() {
    const liste = document.getElementById("gecmisListe");
    liste.innerHTML = "";

    // Ülkeleri son eklenme sırasına göre, tekrarsız topla
    const ulkeSirasi = [];
    for (let i = gezilenler.length - 1; i >= 0; i--) {
        const u = gezilenler[i].ulke;
        if (ulkeSirasi.indexOf(u) === -1) {
            ulkeSirasi.push(u);
        }
    }

    const son10 = ulkeSirasi.slice(0, 10);

    for (let i = 0; i < son10.length; i++) {
        const ulke = son10[i];
        const sehirler = gezilenler.filter(function(g) { return g.ulke === ulke; });

        let sehirHtml = "";
        for (let j = 0; j < sehirler.length; j++) {
            sehirHtml += "<div class='gecmis-sehir'>" + sehirler[j].sehir + "</div>";
        }

        liste.innerHTML +=
            "<div class='gecmis-ulke' onclick='this.classList.toggle(\"acik\")'>" +
                "<div class='gecmis-ulke-ad'>" +
                    "<span>" + ulke + "</span>" +
                    "<span class='gecmis-ok'>›</span>" +
                "</div>" +
                "<div class='gecmis-sehirler'>" + sehirHtml + "</div>" +
            "</div>";
    }
}

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

document.addEventListener("mousemove", function(e) {
    document.getElementById("crosshairX").style.top = e.clientY + "px";
    document.getElementById("crosshairY").style.left = e.clientX + "px";
});