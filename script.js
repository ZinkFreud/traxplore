// Supabase bağlantısı
const SUPABASE_URL = "https://nfmbutrdhdomgaltneuq.supabase.co";
const SUPABASE_KEY = "sb_publishable_VHpyi0vznoFhj2RaXewyig_Rk0v07tG";
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ŞEHİR VERİSİ (şimdilik sadece Türkiye)
// Ülke -> Kıta eşleşmesi
const ulkeKita = {
    "Turkey": "Asya", "Russia": "Asya", "Cyprus": "Asya",
    "France": "Avrupa", "Italy": "Avrupa", "Spain": "Avrupa", "Germany": "Avrupa",
    "United Kingdom": "Avrupa", "Netherlands": "Avrupa", "Belgium": "Avrupa",
    "Portugal": "Avrupa", "Switzerland": "Avrupa", "Austria": "Avrupa",
    "Greece": "Avrupa", "Poland": "Avrupa", "Czech Republic": "Avrupa",
    "Hungary": "Avrupa", "Ireland": "Avrupa", "Sweden": "Avrupa",
    "Norway": "Avrupa", "Denmark": "Avrupa", "Finland": "Avrupa",
    "Croatia": "Avrupa", "Romania": "Avrupa", "Bulgaria": "Avrupa",
    "Republic of Serbia": "Avrupa", "Ukraine": "Avrupa", "Iceland": "Avrupa",
    "Slovakia": "Avrupa", "Slovenia": "Avrupa", "Bosnia and Herzegovina": "Avrupa",
    "Albania": "Avrupa", "Macedonia": "Avrupa", "Montenegro": "Avrupa",
    "Kosovo": "Avrupa", "Lithuania": "Avrupa", "Latvia": "Avrupa",
    "Estonia": "Avrupa", "Belarus": "Avrupa", "Moldova": "Avrupa",
    "Luxembourg": "Avrupa",
    "Brazil": "Güney Amerika", "Argentina": "Güney Amerika", "Chile": "Güney Amerika",
    "Peru": "Güney Amerika", "Colombia": "Güney Amerika", "Venezuela": "Güney Amerika",
    "Ecuador": "Güney Amerika", "Bolivia": "Güney Amerika", "Paraguay": "Güney Amerika",
    "Uruguay": "Güney Amerika", "Guyana": "Güney Amerika", "Suriname": "Güney Amerika",
    "United States of America": "Kuzey Amerika", "Canada": "Kuzey Amerika",
    "Mexico": "Kuzey Amerika", "Cuba": "Kuzey Amerika", "Guatemala": "Kuzey Amerika",
    "Panama": "Kuzey Amerika", "Costa Rica": "Kuzey Amerika", "Jamaica": "Kuzey Amerika",
    "Australia": "Okyanusya", "New Zealand": "Okyanusya", "Fiji": "Okyanusya",
    "Papua New Guinea": "Okyanusya", "Solomon Islands": "Okyanusya", "Vanuatu": "Okyanusya",
    "China": "Asya", "Japan": "Asya", "India": "Asya", "Thailand": "Asya",
    "Vietnam": "Asya", "South Korea": "Asya", "Indonesia": "Asya",
    "Saudi Arabia": "Asya", "United Arab Emirates": "Asya", "Iran": "Asya",
    "Israel": "Asya", "Jordan": "Asya", "Kazakhstan": "Asya",
    "Uzbekistan": "Asya", "Pakistan": "Asya",
    "Iraq": "Asya", "Syria": "Asya",
    "Lebanon": "Asya", "Azerbaijan": "Asya", "Kuwait": "Asya", "Qatar": "Asya",
    "Oman": "Asya", "Yemen": "Asya", "Tajikistan": "Asya", "Kyrgyzstan": "Asya",
    "Nepal": "Asya", "Bangladesh": "Asya", "Myanmar": "Asya", "Laos": "Asya",
    "Cambodia": "Asya", "North Korea": "Asya", "Philippines": "Asya",
    "Taiwan": "Asya", "East Timor": "Asya", "Malaysia": "Asya",
    "Brunei": "Asya", "Sri Lanka": "Asya",
    "Mongolia": "Asya", "New Caledonia": "Okyanusya",
    "French Guiana": "Güney Amerika",
    "Belize": "Kuzey Amerika", "Honduras": "Kuzey Amerika", "Nicaragua": "Kuzey Amerika",
    "El Salvador": "Kuzey Amerika", "The Bahamas": "Kuzey Amerika",
    "Dominican Republic": "Kuzey Amerika", "Haiti": "Kuzey Amerika",
    "Puerto Rico": "Kuzey Amerika", "Trinidad and Tobago": "Kuzey Amerika",
    "Falkland Islands": "Güney Amerika",
    "Greenland": "Kuzey Amerika", "Georgia": "Asya", "Armenia": "Asya",
    "Turkmenistan": "Asya", "Afghanistan": "Asya", "Antarctica": "Antarktika",
    "West Bank": "Asya", "Northern Cyprus": "Asya", "Bhutan": "Asya",
    "French Southern and Antarctic Lands": "Antarktika",
    "Egypt": "Afrika", "Morocco": "Afrika", "Algeria": "Afrika", "Tunisia": "Afrika",
    "Libya": "Afrika", "Nigeria": "Afrika", "Ghana": "Afrika", "Senegal": "Afrika",
    "Kenya": "Afrika", "Ethiopia": "Afrika", "United Republic of Tanzania": "Afrika", "Uganda": "Afrika",
    "Rwanda": "Afrika", "Democratic Republic of the Congo": "Afrika", "Cameroon": "Afrika",
    "South Africa": "Afrika", "Namibia": "Afrika", "Botswana": "Afrika",
    "Zimbabwe": "Afrika", "Mozambique": "Afrika", "Madagascar": "Afrika", "Angola": "Afrika",
    "Western Sahara": "Afrika", "Mauritania": "Afrika", "Mali": "Afrika", "Gambia": "Afrika",
    "Guinea Bissau": "Afrika", "Guinea": "Afrika", "Sierra Leone": "Afrika",
    "Liberia": "Afrika", "Ivory Coast": "Afrika", "Togo": "Afrika", "Benin": "Afrika",
    "Burkina Faso": "Afrika", "Niger": "Afrika", "Chad": "Afrika",
    "Central African Republic": "Afrika", "Sudan": "Afrika", "South Sudan": "Afrika",
    "Eritrea": "Afrika", "Republic of the Congo": "Afrika", "Equatorial Guinea": "Afrika",
    "Gabon": "Afrika", "Burundi": "Afrika", "Zambia": "Afrika", "Malawi": "Afrika",
    "Swaziland": "Afrika", "Lesotho": "Afrika",
    "Somalia": "Afrika", "Somaliland": "Afrika", "Djibouti": "Afrika",
    "Malta": "Avrupa"
};




// Her kıtada kaç ülke EKLEDİĞİMİZİ otomatik say (ulkeKita'dan)
const kitaToplam = {};
for (const ulke in ulkeKita) {
    const kita = ulkeKita[ulke];
    kitaToplam[kita] = (kitaToplam[kita] || 0) + 1;
}

// Kıta renkleri
const kitaRenk = {
    "Avrupa": "#E67E22", "Asya": "#3498DB", "Afrika": "#F1C40F",
    "Kuzey Amerika": "#2ECC71", "Güney Amerika": "#9B59B6", "Okyanusya": "#1ABC9C",
    "Antarktika": "#95A5A6"
};
const sehirVerisi = {
    "Turkey": [
        { ad: "Istanbul", foto: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400", aciklama: "İki kıtayı birleştiren tarihi metropol." },
        { ad: "Ankara", foto: "https://images.unsplash.com/photo-1589561253898-768105ca91a8?w=400", aciklama: "Türkiye'nin başkenti." },
        { ad: "Izmir", foto: "https://images.unsplash.com/photo-1605101479435-005f9c563944?w=400", aciklama: "Ege'nin incisi, sahil şehri." },
        { ad: "Antalya", foto: "https://images.unsplash.com/photo-1600240644455-3edc55c375fe?w=400", aciklama: "Turkuaz sahilleriyle ünlü tatil şehri." }
            ],
            "France": [
                { ad: "Paris", foto: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400", aciklama: "Işık şehri, Eyfel Kulesi." },
                { ad: "Nice", foto: "https://images.unsplash.com/photo-1491166617655-0723a0999cfc?w=400", aciklama: "Fransız Rivierası'nın incisi." },
                { ad: "Lyon", foto: "https://images.unsplash.com/photo-1524396309943-e03f5249f002?w=400", aciklama: "Gastronomi başkenti." },
                { ad: "Marseille", foto: "https://images.unsplash.com/photo-1589786742305-e2f4b1e6c4a0?w=400", aciklama: "Akdeniz liman şehri." }
            ],
            "Italy": [
                { ad: "Rome", foto: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400", aciklama: "Kolezyum ve antik tarih." },
                { ad: "Venice", foto: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=400", aciklama: "Kanallar üzerine kurulu şehir." },
                { ad: "Florence", foto: "https://images.unsplash.com/photo-1541370976299-4d24ebbc9077?w=400", aciklama: "Rönesans'ın doğduğu şehir." },
                { ad: "Milan", foto: "https://images.unsplash.com/photo-1520440229-6469a149ac59?w=400", aciklama: "Moda ve tasarım merkezi." }
            ],
            "Spain": [
                { ad: "Madrid", foto: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400", aciklama: "İspanya'nın canlı başkenti." },
                { ad: "Barcelona", foto: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400", aciklama: "Gaudi'nin mimari harikaları." },
                { ad: "Seville", foto: "https://images.unsplash.com/photo-1558642084-fd07fae5282e?w=400", aciklama: "Endülüs'ün kalbi, flamenko." },
                { ad: "Valencia", foto: "https://images.unsplash.com/photo-1599484839914-c0a7b2e2f7c6?w=400", aciklama: "Paella'nın memleketi." }
            ],
            "Germany": [
                { ad: "Berlin", foto: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=400", aciklama: "Tarih ve modern sanatın başkenti." },
                { ad: "Munich", foto: "https://images.unsplash.com/photo-1595867818082-083862f3d630?w=400", aciklama: "Bavyera'nın kültür şehri." },
                { ad: "Hamburg", foto: "https://images.unsplash.com/photo-1552751753-0fc84ac0fddd?w=400", aciklama: "Kuzey'in büyük liman şehri." },
                { ad: "Cologne", foto: "https://images.unsplash.com/photo-1583537784468-2c0a5f0a5e6e?w=400", aciklama: "Ünlü katedrali olan şehir." }
            ],
    
            "United Kingdom": [
                { ad: "London", foto: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400", aciklama: "Big Ben ve Thames'in şehri." },
                { ad: "Edinburgh", foto: "https://images.unsplash.com/photo-1506377585622-bedcbb027afc?w=400", aciklama: "İskoçya'nın tarihi başkenti." },
                { ad: "Manchester", foto: "https://images.unsplash.com/photo-1588934402681-c0b6f1a6a30f?w=400", aciklama: "Futbol ve müzik şehri." },
                { ad: "Liverpool", foto: "https://images.unsplash.com/photo-1557925179-4a01b4e6e3a1?w=400", aciklama: "Beatles'ın memleketi, liman şehri." }
            ],
            "Netherlands": [
                { ad: "Amsterdam", foto: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400", aciklama: "Kanallar ve bisikletler şehri." },
                { ad: "Rotterdam", foto: "https://images.unsplash.com/photo-1558551649-e44c8f992010?w=400", aciklama: "Modern mimarinin limanı." },
                { ad: "Utrecht", foto: "https://images.unsplash.com/photo-1601999009162-5a4a1a1a1a1a?w=400", aciklama: "Ortaçağ merkezli üniversite şehri." },
                { ad: "The Hague", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Hükümet ve uluslararası mahkemeler." }
            ],
            "Belgium": [
                { ad: "Brussels", foto: "https://images.unsplash.com/photo-1559113202-c916b8e44373?w=400", aciklama: "AB'nin başkenti, Grand Place." },
                { ad: "Bruges", foto: "https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=400", aciklama: "Kuzey'in Venedik'i, kanallar." },
                { ad: "Antwerp", foto: "https://images.unsplash.com/photo-1605106702734-205df224ecce?w=400", aciklama: "Elmas ve moda şehri." },
                { ad: "Ghent", foto: "https://images.unsplash.com/photo-1608022625637-a8e0a1a1a1a1?w=400", aciklama: "Ortaçağ mimarisi ve kanallar." }
            ],
            "Portugal": [
                { ad: "Lisbon", foto: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=400", aciklama: "Tramvaylar ve tepeler şehri." },
                { ad: "Porto", foto: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400", aciklama: "Porto şarabının memleketi." },
                { ad: "Faro", foto: "https://images.unsplash.com/photo-1591792447271-4a1a1a1a1a1a?w=400", aciklama: "Algarve sahillerinin kapısı." },
                { ad: "Coimbra", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Tarihi üniversite şehri." }
            ],
            "Switzerland": [
                { ad: "Zurich", foto: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=400", aciklama: "Finans merkezi, göl kıyısı." },
                { ad: "Geneva", foto: "https://images.unsplash.com/photo-1552644561-0c2a1a1a1a1a?w=400", aciklama: "Uluslararası kuruluşların şehri." },
                { ad: "Bern", foto: "https://images.unsplash.com/photo-1596395819057-e37f0e0a1a1a?w=400", aciklama: "İsviçre'nin başkenti." },
                { ad: "Lucerne", foto: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=400", aciklama: "Göl ve dağların buluştuğu yer." }
            ],
            "Austria": [
                { ad: "Vienna", foto: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=400", aciklama: "Müzik ve saraylar şehri." },
                { ad: "Salzburg", foto: "https://images.unsplash.com/photo-1595867818082-083862f3d630?w=400", aciklama: "Mozart'ın doğduğu şehir." },
                { ad: "Innsbruck", foto: "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=400", aciklama: "Alpler'in kucağında kayak merkezi." },
                { ad: "Graz", foto: "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=400", aciklama: "Öğrenci şehri, tarihi merkez." }
            ],
            "Greece": [
                { ad: "Athens", foto: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=400", aciklama: "Antik demokrasinin beşiği, Akropolis." },
                { ad: "Thessaloniki", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Kuzey'in canlı liman şehri." },
                { ad: "Santorini", foto: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400", aciklama: "Beyaz evler, mavi kubbeler." },
                { ad: "Rhodes", foto: "https://images.unsplash.com/photo-1589561084283-930aa7b1ce50?w=400", aciklama: "Şövalyeler adası." }
            ],
            "Poland": [
                { ad: "Warsaw", foto: "https://images.unsplash.com/photo-1519197924294-4ba991a11128?w=400", aciklama: "Yeniden doğan başkent." },
                { ad: "Krakow", foto: "https://images.unsplash.com/photo-1607427293702-036933bbf746?w=400", aciklama: "Ortaçağ mimarisi korunmuş şehir." },
                { ad: "Gdansk", foto: "https://images.unsplash.com/photo-1601049676869-702ea24cfd58?w=400", aciklama: "Baltık kıyısında liman şehri." },
                { ad: "Wroclaw", foto: "https://images.unsplash.com/photo-1602522797683-8b8b8b8b8b8b?w=400", aciklama: "Cüceleriyle ünlü renkli şehir." }
            ],
            "Czech Republic": [
                { ad: "Prague", foto: "https://images.unsplash.com/photo-1541849546-216549ae216d?w=400", aciklama: "Yüz kuleli şehir, Charles Köprüsü." },
                { ad: "Brno", foto: "https://images.unsplash.com/photo-1600250395178-40fe752e5189?w=400", aciklama: "Çekya'nın ikinci büyük şehri." },
                { ad: "Cesky Krumlov", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Masalsı ortaçağ kasabası." },
                { ad: "Ostrava", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Sanayi mirası şehri." }
            ],
            "Hungary": [
                { ad: "Budapest", foto: "https://images.unsplash.com/photo-1541849546-216549ae216d?w=400", aciklama: "Tuna'nın incisi, termal banyolar." },
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
                { ad: "Gothenburg", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Batı kıyısının liman şehri." },
                { ad: "Malmo", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Köprüyle Danimarka'ya bağlı." },
                { ad: "Uppsala", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Tarihi üniversite şehri." }
            ],
            "Norway": [
                { ad: "Oslo", foto: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400", aciklama: "Fiyortların başkenti." },
                { ad: "Bergen", foto: "https://images.unsplash.com/photo-1516913887303-c40e9ba6e651?w=400", aciklama: "Renkli ahşap evler, fiyort kapısı." },
                { ad: "Tromso", foto: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400", aciklama: "Kuzey ışıklarının şehri." },
                { ad: "Stavanger", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Preikestolen'in kapısı." }
            ],
            "Denmark": [
                { ad: "Copenhagen", foto: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=400", aciklama: "Bisiklet ve tasarım şehri." },
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
                { ad: "Bucharest", foto: "https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=400", aciklama: "Küçük Paris denen başkent." },
                { ad: "Brasov", foto: "https://images.unsplash.com/photo-1583266699665-8b8b8b8b8b8b?w=400", aciklama: "Karpatlar'da ortaçağ şehri." },
                { ad: "Cluj-Napoca", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Transilvanya'nın kalbi." },
                { ad: "Sibiu", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Renkli çatılı ortaçağ şehri." }
            ],
            "Bulgaria": [
                { ad: "Sofia", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Vitosha dağı eteğinde başkent." },
                { ad: "Plovdiv", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Avrupa'nın en eski şehirlerinden." },
                { ad: "Varna", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Karadeniz'in yazlık başkenti." },
                { ad: "Burgas", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Karadeniz liman şehri." }
            ],
            "Republic of Serbia": [
                { ad: "Belgrade", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "İki nehrin buluştuğu başkent." },
                { ad: "Novi Sad", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Exit festivalinin şehri." },
                { ad: "Nis", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Güneyin tarihi şehri." },
                { ad: "Subotica", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Art nouveau mimarisi." }
            ],
            "Ukraine": [
                { ad: "Kyiv", foto: "https://images.unsplash.com/photo-1596395819057-e37f0e0a1a1a?w=400", aciklama: "Altın kubbeli tarihi başkent." },
                { ad: "Lviv", foto: "https://images.unsplash.com/photo-1591536421904-8b8b8b8b8b8b?w=400", aciklama: "Kahve ve ortaçağ mimarisi." },
                { ad: "Odessa", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Karadeniz'in liman incisi." },
                { ad: "Kharkiv", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Doğunun büyük üniversite şehri." }
            ],
            "Russia": [
                { ad: "Moscow", foto: "https://images.unsplash.com/photo-1513326738677-b964603b136d?w=400", aciklama: "Kızıl Meydan ve Kremlin." },
                { ad: "St. Petersburg", foto: "https://images.unsplash.com/photo-1556610961-2fecc5927173?w=400", aciklama: "Kuzey'in Venedik'i, saraylar." },
                { ad: "Kazan", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Doğu-Batı kültürlerinin buluştuğu yer." },
                { ad: "Sochi", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Karadeniz'in tatil şehri." }
            ],
            "Iceland": [
                { ad: "Reykjavik", foto: "https://images.unsplash.com/photo-1504284882432-3f30a2c98b6c?w=400", aciklama: "Dünyanın en kuzeydeki başkenti." },
                { ad: "Akureyri", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Kuzey'in başkenti denen şehir." },
                { ad: "Vik", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Siyah kumlu plajlar." },
                { ad: "Hafnarfjordur", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Lav alanı üstünde kurulu liman." }
            ]    ,
            "Slovakia": [
                { ad: "Bratislava", foto: "https://images.unsplash.com/photo-1568792923760-d70635a89fdc?w=400", aciklama: "Tuna kıyısında şirin başkent." },
                { ad: "Kosice", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Doğunun tarihi şehri." },
                { ad: "Zilina", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Kuzeyin sanayi ve kültür merkezi." },
                { ad: "Poprad", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Yüksek Tatra dağlarının kapısı." }
            ],
            "Slovenia": [
                { ad: "Ljubljana", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Ejderha köprülü yeşil başkent." },
                { ad: "Bled", foto: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400", aciklama: "Göl ortasında kilise, masalsı." },
                { ad: "Maribor", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Dünyanın en yaşlı asmasının şehri." },
                { ad: "Piran", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Adriyatik'te Venedik havalı kasaba." }
            ],
            "Bosnia and Herzegovina": [
                { ad: "Sarajevo", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Doğu-Batı kültürünün buluştuğu başkent." },
                { ad: "Mostar", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Ünlü eski köprüsüyle tanınır." },
                { ad: "Banja Luka", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Yeşil, nehir kıyısı şehir." },
                { ad: "Tuzla", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Tuz gölleriyle ünlü şehir." }
            ],
            "Albania": [
                { ad: "Tirana", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Renkli binalarıyla canlanan başkent." },
                { ad: "Sarande", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "İyon sahilinin tatil şehri." },
                { ad: "Berat", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Bin pencereli şehir, UNESCO." },
                { ad: "Shkoder", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Göl kıyısında kültür şehri." }
            ],
            "Macedonia": [
                { ad: "Skopje", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Vardar nehri ve heykeller şehri." },
                { ad: "Ohrid", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Göl kıyısında tarihi inci." },
                { ad: "Bitola", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Konsoloslar şehri denen yer." },
                { ad: "Tetovo", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Renkli camiyle ünlü." }
            ],
            "Montenegro": [
                { ad: "Podgorica", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Karadağ'ın sakin başkenti." },
                { ad: "Kotor", foto: "https://images.unsplash.com/photo-1591536421904-8b8b8b8b8b8b?w=400", aciklama: "Fiyort benzeri körfezde surlu şehir." },
                { ad: "Budva", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Adriyatik'in gece hayatı merkezi." },
                { ad: "Cetinje", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Eski kraliyet başkenti." }
            ],
            "Kosovo": [
                { ad: "Pristina", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Genç nüfuslu canlı başkent." },
                { ad: "Prizren", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Osmanlı mirası tarihi şehir." },
                { ad: "Peja", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Dağların eteğinde, manastırlar." },
                { ad: "Gjakova", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Eski çarşısıyla ünlü." }
            ],
            "Lithuania": [
                { ad: "Vilnius", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Barok mimarili tarihi başkent." },
                { ad: "Kaunas", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Savaşlar arası mimari şehri." },
                { ad: "Klaipeda", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Baltık liman şehri." },
                { ad: "Siauliai", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Haçlar Tepesi'nin şehri." }
            ],
            "Latvia": [
                { ad: "Riga", foto: "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=400", aciklama: "Art nouveau başkenti, Baltık." },
                { ad: "Jurmala", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Baltık kıyısında kaplıca şehri." },
                { ad: "Daugavpils", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Doğunun kültür merkezi." },
                { ad: "Liepaja", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Rüzgar ve müzik şehri." }
            ],
            "Estonia": [
                { ad: "Tallinn", foto: "https://images.unsplash.com/photo-1541447271487-09612b3f49f7?w=400", aciklama: "Ortaçağ surları korunmuş başkent." },
                { ad: "Tartu", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Estonya'nın üniversite şehri." },
                { ad: "Parnu", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Yazlık başkent, plajlar." },
                { ad: "Narva", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Rusya sınırında kaleli şehir." }
            ],
            "Belarus": [
                { ad: "Minsk", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Geniş bulvarlı Sovyet mimarisi." },
                { ad: "Brest", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Ünlü kalesiyle sınır şehri." },
                { ad: "Grodno", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Tarihi merkezi korunmuş şehir." },
                { ad: "Vitebsk", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Chagall'ın doğduğu şehir." }
            ],
            "Moldova": [
                { ad: "Chisinau", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Yeşil parklı sakin başkent." },
                { ad: "Tiraspol", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Transdinyester bölgesinin merkezi." },
                { ad: "Balti", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Kuzeyin başkenti denen şehir." },
                { ad: "Orhei", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Eski manastırlarıyla ünlü." }
            ],
            "Luxembourg": [
                { ad: "Luxembourg City", foto: "https://images.unsplash.com/photo-1591622180787-1e2b1e1e1e1e?w=400", aciklama: "Vadiler üstünde kaleli başkent." }
            ],
            "Cyprus": [
                { ad: "Nicosia", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Bölünmüş son başkent." },
                { ad: "Limassol", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Sahil ve gece hayatı." },
                { ad: "Paphos", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Antik mozaikler, Afrodit efsanesi." },
                { ad: "Larnaca", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Palmiyeli sahil şehri." }
            ]    ,
            "Malta": [
                { ad: "Valletta", foto: "https://images.unsplash.com/photo-1509130446053-9a5b8a4b0e7d?w=400", aciklama: "Surlarla çevrili barok başkent." },
                { ad: "Mdina", foto: "https://images.unsplash.com/photo-1558271736-cd043ef2e855?w=400", aciklama: "Sessiz sedasız eski başkent." },
                { ad: "Sliema", foto: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400", aciklama: "Sahil ve alışveriş şehri." },
                { ad: "Gozo", foto: "https://images.unsplash.com/photo-1591792447271-4a1a1a1a1a1a?w=400", aciklama: "Kırsal ve sakin kardeş ada." }
            ],
            "Brazil": [
                { ad: "Rio de Janeiro", foto: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400", aciklama: "Kristo heykeli ve Copacabana." },
                { ad: "Sao Paulo", foto: "https://images.unsplash.com/photo-1541609309631-0a1a1a1a1a1a?w=400", aciklama: "Latin Amerika'nın dev metropolü." },
                { ad: "Salvador", foto: "https://images.unsplash.com/photo-1591634616938-1dfa7ee2e617?w=400", aciklama: "Afro-Brezilya kültürünün kalbi." },
                { ad: "Brasilia", foto: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400", aciklama: "Modern mimarili planlı başkent." }
            ],
            "Argentina": [
                { ad: "Buenos Aires", foto: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=400", aciklama: "Tango ve Avrupa havalı başkent." },
                { ad: "Cordoba", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Kolonyal mimarili üniversite şehri." },
                { ad: "Mendoza", foto: "https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=400", aciklama: "And Dağları eteğinde şarap bölgesi." },
                { ad: "Bariloche", foto: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=400", aciklama: "Göller ve kayak, İsviçre havası." }
            ],
            "Chile": [
                { ad: "Santiago", foto: "https://images.unsplash.com/photo-1478827387698-1527781a4887?w=400", aciklama: "And Dağları'nın gölgesinde başkent." },
                { ad: "Valparaiso", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Renkli tepe evleri, liman şehri." },
                { ad: "Atacama", foto: "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=400", aciklama: "Dünyanın en kurak çölü." },
                { ad: "Puerto Montt", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Patagonya'nın kapısı." }
            ],
            "Peru": [
                { ad: "Lima", foto: "https://images.unsplash.com/photo-1531968455001-5c5272a41129?w=400", aciklama: "Pasifik kıyısında gastronomi başkenti." },
                { ad: "Cusco", foto: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400", aciklama: "İnka İmparatorluğu'nun eski başkenti." },
                { ad: "Machu Picchu", foto: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400", aciklama: "Bulutlar üstünde İnka şehri." },
                { ad: "Arequipa", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Beyaz taştan kolonyal şehir." }
            ],
            "Colombia": [
                { ad: "Bogota", foto: "https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=400", aciklama: "Dağların üstünde yüksek başkent." },
                { ad: "Cartagena", foto: "https://images.unsplash.com/photo-1583531352515-8c0e9d1a4b5d?w=400", aciklama: "Karayip kıyısında surlu kolonyal şehir." },
                { ad: "Medellin", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Ebedi bahar şehri." },
                { ad: "Cali", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Salsa'nın dünya başkenti." }
            ],
            "Venezuela": [
                { ad: "Caracas", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Dağ eteğinde canlı başkent." },
                { ad: "Maracaibo", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Petrol ve göl şehri." },
                { ad: "Merida", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "And Dağları'nda üniversite şehri." },
                { ad: "Valencia", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Sanayi merkezi." }
            ],
            "Ecuador": [
                { ad: "Quito", foto: "https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=400", aciklama: "Ekvator çizgisindeki başkent." },
                { ad: "Guayaquil", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Büyük liman şehri." },
                { ad: "Cuenca", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Kolonyal mimarili UNESCO şehri." },
                { ad: "Galapagos", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Eşsiz doğa yaşamının adaları." }
            ],
            "Bolivia": [
                { ad: "La Paz", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Dünyanın en yüksek başkenti." },
                { ad: "Uyuni", foto: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400", aciklama: "Dünyanın en büyük tuz gölü." },
                { ad: "Sucre", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Beyaz şehir, anayasal başkent." },
                { ad: "Santa Cruz", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Ovadaki büyük ticaret şehri." }
            ],
            "Paraguay": [
                { ad: "Asuncion", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Nehir kıyısında tarihi başkent." },
                { ad: "Ciudad del Este", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Sınır ticaret şehri, Iguazú yakını." },
                { ad: "Encarnacion", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Plajları ve karnavalıyla ünlü." },
                { ad: "Luque", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "El sanatları merkezi." }
            ],
            "Uruguay": [
                { ad: "Montevideo", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Sakin sahil başkenti." },
                { ad: "Punta del Este", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Güney Amerika'nın lüks tatil yeri." },
                { ad: "Colonia del Sacramento", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Kolonyal UNESCO kasabası." },
                { ad: "Salto", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Kaplıcaları ve nehriyle bilinir." }
            ],
            "Guyana": [
                { ad: "Georgetown", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Ahşap kolonyal mimarili başkent." },
                { ad: "Linden", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Boksit madenciliği şehri." },
                { ad: "Kaieteur", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Dünyanın en büyük tek şelalelerinden." },
                { ad: "New Amsterdam", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Doğu kıyısında nehir şehri." }
            ],
            "Suriname": [
                { ad: "Paramaribo", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Hollanda kolonyal mimarili başkent." },
                { ad: "Lelydorp", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "İkinci büyük yerleşim." },
                { ad: "Nieuw Nickerie", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Pirinç tarımı bölgesi." },
                { ad: "Brokopondo", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Baraj gölü ve orman." }
            ]    ,
            "United States of America": [
                { ad: "New York", foto: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400", aciklama: "Big Ben ve Thames'in şehri." },
                { ad: "Los Angeles", foto: "https://images.unsplash.com/photo-1506190503914-c e2b4f5b5c8e?w=400", aciklama: "Hollywood ve Pasifik sahili." },
                { ad: "San Francisco", foto: "https://images.unsplash.com/photo-1521747116042-5a810fda9664?w=400", aciklama: "Golden Gate ve teknoloji vadisi." },
                { ad: "Las Vegas", foto: "https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?w=400", aciklama: "Çölün ortasında ışıklar şehri." }
            ],
            "Canada": [
                { ad: "Toronto", foto: "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400", aciklama: "CN Kulesi ve çok kültürlü metropol." },
                { ad: "Vancouver", foto: "https://images.unsplash.com/photo-1560814304-4f05b62af116?w=400", aciklama: "Dağlar ve okyanus arasında." },
                { ad: "Montreal", foto: "https://images.unsplash.com/photo-1519178614-68673b201f36?w=400", aciklama: "Fransız ruhlu tarihi şehir." },
                { ad: "Quebec City", foto: "https://images.unsplash.com/photo-1609825488888-3a766db05542?w=400", aciklama: "Surlu Avrupa havalı şehir." }
            ],
            "Mexico": [
                { ad: "Mexico City", foto: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=400", aciklama: "Aztek mirası üstüne kurulu dev başkent." },
                { ad: "Cancun", foto: "https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=400", aciklama: "Karayip'in turkuaz plajları." },
                { ad: "Guadalajara", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Tekila ve mariachi'nin şehri." },
                { ad: "Oaxaca", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Renkli kültür ve mutfak." }
            ],
            "Cuba": [
                { ad: "Havana", foto: "https://images.unsplash.com/photo-1500759285222-a95626b934cb?w=400", aciklama: "Klasik arabalar ve kolonyal şehir." },
                { ad: "Varadero", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Uzun beyaz kumlu plajlar." },
                { ad: "Trinidad", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Zamanın durduğu kolonyal kasaba." },
                { ad: "Santiago de Cuba", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Müzik ve devrim tarihi." }
            ],
            "Guatemala": [
                { ad: "Guatemala City", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Ülkenin büyük başkenti." },
                { ad: "Antigua", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Volkanlar arası kolonyal şehir." },
                { ad: "Tikal", foto: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400", aciklama: "Ormanda antik Maya kenti." },
                { ad: "Panajachel", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Atitlán gölü kıyısında." }
            ],
            "Panama": [
                { ad: "Panama City", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Modern gökdelenler ve ünlü kanal." },
                { ad: "Bocas del Toro", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Karayip takımadası." },
                { ad: "Boquete", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Dağlarda kahve bölgesi." },
                { ad: "Colon", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Kanalın Karayip ucu." }
            ],
            "Costa Rica": [
                { ad: "San Jose", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Yeşil ülkenin başkenti." },
                { ad: "Monteverde", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Bulut ormanı ve doğa." },
                { ad: "Tamarindo", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Sörf ve Pasifik plajları." },
                { ad: "La Fortuna", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Arenal yanardağının eteği." }
            ],
            "Jamaica": [
                { ad: "Kingston", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Reggae'nin doğduğu başkent." },
                { ad: "Montego Bay", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Tatil ve plaj şehri." },
                { ad: "Negril", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Yedi millik plajıyla ünlü." },
                { ad: "Ocho Rios", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Şelaleler ve kruvaziyer limanı." }
            ]    ,
            "Australia": [
                { ad: "Sydney", foto: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400", aciklama: "Opera Binası ve limanıyla ünlü." },
                { ad: "Melbourne", foto: "https://images.unsplash.com/photo-1514395462725-fb4566210144?w=400", aciklama: "Kahve ve sanat kültürünün merkezi." },
                { ad: "Brisbane", foto: "https://images.unsplash.com/photo-1566734904496-9309bb1798ae?w=400", aciklama: "Güneşli nehir şehri." },
                { ad: "Perth", foto: "https://images.unsplash.com/photo-1573935448851-1b4b1a1a1a1a?w=400", aciklama: "Batı kıyısının izole modern şehri." }
            ],
            "New Zealand": [
                { ad: "Auckland", foto: "https://images.unsplash.com/photo-1507097634215-e6dd0f99b56d?w=400", aciklama: "Yelkenler şehri, volkanik tepeler." },
                { ad: "Wellington", foto: "https://images.unsplash.com/photo-1589871173318-9e07c5f4e5b3?w=400", aciklama: "Rüzgarlı kültür başkenti." },
                { ad: "Queenstown", foto: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=400", aciklama: "Macera sporlarının başkenti." },
                { ad: "Rotorua", foto: "https://images.unsplash.com/photo-1531804226530-2b1a1a1a1a1a?w=400", aciklama: "Jeotermal kaynaklar ve Maori kültürü." }
            ],
            "Fiji": [
                { ad: "Suva", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Tropik ada başkenti." },
                { ad: "Nadi", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Ada tatilinin giriş kapısı." },
                { ad: "Denarau", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Lüks tatil köyleri adası." },
                { ad: "Lautoka", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Şeker şehri denen liman." }
            ],
            "Papua New Guinea": [
                { ad: "Port Moresby", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Pasifik'in çeşitli başkenti." },
                { ad: "Lae", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Sanayi ve liman şehri." },
                { ad: "Mount Hagen", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Yayla kültür festivalleri." },
                { ad: "Madang", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Dalış cenneti kıyı şehri." }
            ],
            "Solomon Islands": [
                { ad: "Honiara", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Guadalcanal adasında başkent." },
                { ad: "Gizo", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Dalış ve takımada." },
                { ad: "Auki", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Malaita adasının merkezi." },
                { ad: "Munda", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Savaş tarihi ve resifler." }
            ],
            "Vanuatu": [
                { ad: "Port Vila", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Yanardağlı ada başkenti." },
                { ad: "Luganville", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "İkinci büyük şehir, dalış." },
                { ad: "Tanna", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Aktif yanardağıyla ünlü ada." },
                { ad: "Norsup", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Malekula adası merkezi." }
            ]    ,
            "China": [
                { ad: "Beijing", foto: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400", aciklama: "Yasak Şehir ve Çin Seddi'nin kapısı." },
                { ad: "Shanghai", foto: "https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=400", aciklama: "Fütüristik silüetli dev metropol." },
                { ad: "Xian", foto: "https://images.unsplash.com/photo-1537531383496-f4749b8032cf?w=400", aciklama: "Terracotta askerlerinin şehri." },
                { ad: "Guilin", foto: "https://images.unsplash.com/photo-1537531383496-f4749b8032cf?w=400", aciklama: "Masalsı karst dağları." }
            ],
            "Japan": [
                { ad: "Tokyo", foto: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400", aciklama: "Gelenek ve teknolojinin metropolü." },
                { ad: "Kyoto", foto: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400", aciklama: "Tapınaklar ve geyşa mahalleleri." },
                { ad: "Osaka", foto: "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=400", aciklama: "Sokak lezzetlerinin başkenti." },
                { ad: "Hiroshima", foto: "https://images.unsplash.com/photo-1595253958-9a3f1f1a0f1a?w=400", aciklama: "Barış anıtı ve yeniden doğuş." }
            ],
            "India": [
                { ad: "New Delhi", foto: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400", aciklama: "Tarih ve kaosun buluştuğu başkent." },
                { ad: "Mumbai", foto: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=400", aciklama: "Bollywood ve okyanus şehri." },
                { ad: "Jaipur", foto: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400", aciklama: "Pembe şehir, saraylar." },
                { ad: "Agra", foto: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400", aciklama: "Tac Mahal'in evi." }
            ],
            "Thailand": [
                { ad: "Bangkok", foto: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400", aciklama: "Tapınaklar ve sokak yaşamı." },
                { ad: "Chiang Mai", foto: "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=400", aciklama: "Kuzeyin dağ ve tapınak şehri." },
                { ad: "Phuket", foto: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=400", aciklama: "Turkuaz sulu tatil adası." },
                { ad: "Ayutthaya", foto: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=400", aciklama: "Antik başkent harabeleri." }
            ],
            "Vietnam": [
                { ad: "Hanoi", foto: "https://images.unsplash.com/photo-1509030450996-dd1a26dda341?w=400", aciklama: "Eski mahalleleri olan başkent." },
                { ad: "Ho Chi Minh City", foto: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400", aciklama: "Enerjik güney metropolü." },
                { ad: "Ha Long", foto: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400", aciklama: "Zümrüt suda kireçtaşı adalar." },
                { ad: "Hoi An", foto: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=400", aciklama: "Fenerlerle aydınlanan eski şehir." }
            ],
            "South Korea": [
                { ad: "Seoul", foto: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=400", aciklama: "K-pop ve saraylar, modern başkent." },
                { ad: "Busan", foto: "https://images.unsplash.com/photo-1601621915196-2621dc4f2e35?w=400", aciklama: "Plajlar ve liman şehri." },
                { ad: "Jeju", foto: "https://images.unsplash.com/photo-1601703099479-2b5b8f8a2b8a?w=400", aciklama: "Volkanik tatil adası." },
                { ad: "Gyeongju", foto: "https://images.unsplash.com/photo-1600000000000-b35e96722eb9?w=400", aciklama: "Açık hava müzesi denen antik şehir." }
            ],
            "Indonesia": [
                { ad: "Jakarta", foto: "https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=400", aciklama: "Kalabalık ada başkenti." },
                { ad: "Bali", foto: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400", aciklama: "Tapınaklar ve pirinç terasları adası." },
                { ad: "Yogyakarta", foto: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=400", aciklama: "Borobudur'un kültür şehri." },
                { ad: "Surabaya", foto: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400", aciklama: "İkinci büyük liman şehri." }
            ]    ,
            "Saudi Arabia": [
                { ad: "Riyadh", foto: "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=400", aciklama: "Çölün ortasında modern başkent." },
                { ad: "Jeddah", foto: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400", aciklama: "Kızıldeniz kıyısı, Mekke kapısı." },
                { ad: "Mecca", foto: "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=400", aciklama: "İslam'ın kutsal şehri." },
                { ad: "Medina", foto: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400", aciklama: "Peygamber şehri." }
            ],
            "United Arab Emirates": [
                { ad: "Dubai", foto: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400", aciklama: "Gökdelenler ve lüksün şehri." },
                { ad: "Abu Dhabi", foto: "https://images.unsplash.com/photo-1551041777-ed277b8dd348?w=400", aciklama: "Büyük camii ve başkent." },
                { ad: "Sharjah", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Kültür ve sanat emirliği." },
                { ad: "Al Ain", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Vahalar şehri." }
            ],
            "Iran": [
                { ad: "Tehran", foto: "https://images.unsplash.com/photo-1592066575517-58df903152f2?w=400", aciklama: "Dağ eteğinde büyük başkent." },
                { ad: "Isfahan", foto: "https://images.unsplash.com/photo-1560177776-419c8e1c1a8e?w=400", aciklama: "Mavi çinili camiler, meydan." },
                { ad: "Shiraz", foto: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400", aciklama: "Şiir ve bahçeler şehri." },
                { ad: "Yazd", foto: "https://images.unsplash.com/photo-1610642372651-fe6e7bc209ee?w=400", aciklama: "Çöl ortasında kerpiç şehir." }
            ],
            "Israel": [
                { ad: "Jerusalem", foto: "https://images.unsplash.com/photo-1544971587-b4c2e9d81ecd?w=400", aciklama: "Üç dinin kutsal şehri." },
                { ad: "Tel Aviv", foto: "https://images.unsplash.com/photo-1552423314-cf29ab68ad73?w=400", aciklama: "Sahil ve gece hayatı." },
                { ad: "Haifa", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Bahai bahçeleri, liman." },
                { ad: "Nazareth", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Tarihi dini merkez." }
            ],
            "Jordan": [
                { ad: "Amman", foto: "https://images.unsplash.com/photo-1580834341580-8c17a3a630ca?w=400", aciklama: "Tepeler üstünde beyaz başkent." },
                { ad: "Petra", foto: "https://images.unsplash.com/photo-1563177978-4c5ebd66e6cb?w=400", aciklama: "Kayaya oyulmuş antik şehir." },
                { ad: "Wadi Rum", foto: "https://images.unsplash.com/photo-1548786811-dd6e453ccf40?w=400", aciklama: "Kızıl çöl vadisi." },
                { ad: "Aqaba", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Kızıldeniz dalış kasabası." }
            ],
            "Kazakhstan": [
                { ad: "Almaty", foto: "https://images.unsplash.com/photo-1596395819057-e37f0e0a1a1a?w=400", aciklama: "Dağ eteğinde eski başkent." },
                { ad: "Astana", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Fütüristik yeni başkent." },
                { ad: "Shymkent", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Güneyin büyük şehri." },
                { ad: "Turkistan", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Yesevi türbesi, manevi merkez." }
            ],
            "Uzbekistan": [
                { ad: "Tashkent", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "İpek Yolu'nun modern başkenti." },
                { ad: "Samarkand", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Registan ve mavi kubbeler." },
                { ad: "Bukhara", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Açık hava müzesi, kutsal şehir." },
                { ad: "Khiva", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Surlarla çevrili çöl şehri." }
            ],
            "Pakistan": [
                { ad: "Islamabad", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Planlı yeşil başkent." },
                { ad: "Lahore", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Kültür ve Babür mirası şehri." },
                { ad: "Karachi", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Deniz kıyısında dev metropol." },
                { ad: "Multan", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Türbeler şehri." }
            ],
            "Iraq": [
                { ad: "Baghdad", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Dicle kıyısında tarihi başkent." },
                { ad: "Basra", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Güneyin liman şehri." },
                { ad: "Mosul", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Kuzeyin tarihi şehri." },
                { ad: "Erbil", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Antik kalesiyle ünlü şehir." }
            ],
            "Syria": [
                { ad: "Damascus", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Dünyanın en eski başkentlerinden." },
                { ad: "Aleppo", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Tarihi çarşısıyla ünlü şehir." },
                { ad: "Homs", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Orta Suriye'nin merkezi." },
                { ad: "Latakia", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Akdeniz liman şehri." }
            ]    ,
            "Lebanon": [
                { ad: "Beirut", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Akdeniz kıyısında canlı başkent." },
                { ad: "Baalbek", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Devasa Roma tapınakları." },
                { ad: "Byblos", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Dünyanın en eski limanlarından." },
                { ad: "Sidon", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Tarihi liman kasabası." }
            ],
            "Azerbaijan": [
                { ad: "Baku", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Hazar kıyısında modern başkent." },
                { ad: "Ganja", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "İkinci büyük tarihi şehir." },
                { ad: "Sheki", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Han sarayı ve el sanatları." },
                { ad: "Gabala", foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Gabala_in_Azerbaijan.jpg?width=400", aciklama: "Dağ eteğinde tatil bölgesi." },
            ],
            "Kuwait": [
                { ad: "Kuwait City", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Körfez kıyısında modern başkent." },
                { ad: "Hawalli", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Kalabalık şehir bölgesi." },
                { ad: "Al Ahmadi", foto: "https://commons.wikimedia.org/wiki/Special:FilePath/The%20Church%20at%20Ahmadi.jpg?width=400", aciklama: "Petrol sanayi şehri." },
                { ad: "Fahaheel", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Sahil ve alışveriş bölgesi." }
            ],
            "Qatar": [
                { ad: "Doha", foto: "https://images.unsplash.com/photo-1559386081-325882507af7?w=400", aciklama: "Gökdelenler ve müzeler başkenti." },
                { ad: "Al Wakrah", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Eski balıkçı kasabası." },
                { ad: "Al Khor", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Kuzeydeki sahil şehri." },
                { ad: "Lusail", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Sıfırdan kurulan modern şehir." }
            ],
            "Oman": [
                { ad: "Muscat", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Dağ ve deniz arasında başkent." },
                { ad: "Nizwa", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Kale ve geleneksel çarşı." },
                { ad: "Salalah", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Muson yeşili güney şehri." },
                { ad: "Sur", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Geleneksel tekne yapım şehri." }
            ],
            "Yemen": [
                { ad: "Sanaa", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Kerpiç kuleleriyle antik başkent." },
                { ad: "Aden", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Volkanik kraterde liman şehri." },
                { ad: "Taiz", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Dağ eteğinde kültür şehri." },
                { ad: "Socotra", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Eşsiz bitki örtülü ada." }
            ],
            "Tajikistan": [
                { ad: "Dushanbe", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Dağlar arasında sakin başkent." },
                { ad: "Khujand", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "İpek Yolu üstünde eski şehir." },
                { ad: "Kulob", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Güneyin tarihi şehri." },
                { ad: "Pamir", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Dünyanın çatısı denen dağlar." }
            ],
            "Kyrgyzstan": [
                { ad: "Bishkek", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Dağ eteğinde yeşil başkent." },
                { ad: "Osh", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Güneyin kadim çarşı şehri." },
                { ad: "Karakol", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Issık Göl ve dağ yürüyüşleri." },
                { ad: "Issyk-Kul", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Dağlar arasında dev sıcak göl." }
            ],
            "Nepal": [
                { ad: "Kathmandu", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Tapınaklarla dolu Himalaya başkenti." },
                { ad: "Pokhara", foto: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400", aciklama: "Göl ve Annapurna manzarası." },
                { ad: "Everest", foto: "https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=400", aciklama: "Dünyanın çatısına tırmanış kapısı." },
                { ad: "Lumbini", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Buda'nın doğduğu yer." }
            ],
            "Bangladesh": [
                { ad: "Dhaka", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Nehirler arasında kalabalık başkent." },
                { ad: "Chittagong", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Büyük liman şehri." },
                { ad: "Sylhet", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Çay bahçeleri bölgesi." },
                { ad: "Cox's Bazar", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Dünyanın en uzun doğal plajı." }
            ],
            "Myanmar": [
                { ad: "Yangon", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Altın pagodalı büyük şehir." },
                { ad: "Bagan", foto: "https://images.unsplash.com/photo-1544642899-f0d6e5f6ed6f?w=400", aciklama: "Binlerce antik tapınak ovası." },
                { ad: "Mandalay", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Eski kraliyet başkenti." },
                { ad: "Inle", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Ayakla kürek çeken balıkçılar gölü." }
            ],
            "Laos": [
                { ad: "Vientiane", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Mekong kıyısında sakin başkent." },
                { ad: "Luang Prabang", foto: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=400", aciklama: "Tapınaklarla dolu UNESCO şehri." },
                { ad: "Vang Vieng", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Karst dağları ve nehir." },
                { ad: "Pakse", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Güney kapısı, şelaleler." }
            ],
            "Cambodia": [
                { ad: "Phnom Penh", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Nehirlerin buluştuğu başkent." },
                { ad: "Siem Reap", foto: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400", aciklama: "Angkor Wat'ın kapısı." },
                { ad: "Sihanoukville", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Sahil ve adalar." },
                { ad: "Battambang", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Kolonyal mimari ve pirinç ovaları." }
            ],
            "North Korea": [
                { ad: "Pyongyang", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Anıtsal mimarili kapalı başkent." },
                { ad: "Kaesong", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Tarihi eski başkent." },
                { ad: "Wonsan", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Doğu kıyısında liman şehri." },
                { ad: "Hamhung", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Sanayi merkezi." }
            ],
            "Philippines": [
                { ad: "Manila", foto: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=400", aciklama: "Tarihi ve kalabalık ada başkenti." },
                { ad: "Cebu", foto: "https://images.unsplash.com/photo-1552055568-f8f4e8e8e8e8?w=400", aciklama: "Plajlar ve dalış merkezi." },
                { ad: "Palawan", foto: "https://images.unsplash.com/photo-1518632618215-3a0d1a1a1a1a?w=400", aciklama: "Yeraltı nehri ve lagünler." },
                { ad: "Boracay", foto: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400", aciklama: "Beyaz kumlu ünlü tatil adası." }
            ]    ,
            "Taiwan": [
                { ad: "Taipei", foto: "https://images.unsplash.com/photo-1470004914212-05527e49370b?w=400", aciklama: "101 Kulesi ve gece pazarları." },
                { ad: "Kaohsiung", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Güneyin liman şehri." },
                { ad: "Taichung", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Sanat ve kültür merkezi." },
                { ad: "Tainan", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "En eski tarihi şehir." }
            ],
            "East Timor": [
                { ad: "Dili", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Sahil kıyısında sakin başkent." },
                { ad: "Baucau", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "İkinci büyük şehir." },
                { ad: "Maliana", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Batıdaki ova şehri." },
                { ad: "Atauro", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Dalışıyla ünlü ada." }
            ],
            "Malaysia": [
                { ad: "Kuala Lumpur", foto: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400", aciklama: "Petronas Kuleleri'nin şehri." },
                { ad: "Penang", foto: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=400", aciklama: "Sokak sanatı ve lezzet başkenti." },
                { ad: "Malacca", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Kolonyal tarihli UNESCO şehri." },
                { ad: "Borneo", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Yağmur ormanı ve orangutanlar." }
            ],
            "Brunei": [
                { ad: "Bandar Seri Begawan", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Altın camili zengin başkent." },
                { ad: "Kampong Ayer", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Su üstünde kurulu köy." },
                { ad: "Kuala Belait", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Petrol sanayi şehri." },
                { ad: "Tutong", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Nehir ve sahil bölgesi." }
            ],
            "Sri Lanka": [
                { ad: "Colombo", foto: "https://images.unsplash.com/photo-1546975554-31053113e977?w=400", aciklama: "Sahil kıyısında canlı başkent." },
                { ad: "Kandy", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Diş Tapınağı ve göl." },
                { ad: "Galle", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Kolonyal surlu liman şehri." },
                { ad: "Sigiriya", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Kaya üstünde antik saray." }
            ],
            "Mongolia": [
                { ad: "Ulaanbaatar", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Bozkırda dünyanın en soğuk başkenti." },
                { ad: "Erdenet", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Madencilik şehri." },
                { ad: "Karakorum", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Cengiz Han'ın eski başkenti." },
                { ad: "Gobi", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Uçsuz bucaksız çöl." }
            ],
            "New Caledonia": [
                { ad: "Noumea", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Fransız-Pasifik havalı başkent." },
                { ad: "Mont-Dore", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Sahil ve dağ bölgesi." },
                { ad: "Bourail", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Plajlar ve resifler." },
                { ad: "Isle of Pines", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Çam adası, turkuaz koylar." }
            ],
            "French Guiana": [
                { ad: "Cayenne", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Kreol kültürlü başkent." },
                { ad: "Kourou", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Avrupa uzay üssünün şehri." },
                { ad: "Saint-Laurent", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Eski ceza kolonisi kasabası." },
                { ad: "Maripasoula", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Amazon ormanı derinliğinde." }
            ]    ,
            "Belize": [
                { ad: "Belize City", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Karayip kıyısında liman şehri." },
                { ad: "San Ignacio", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Orman ve Maya harabeleri kapısı." },
                { ad: "Caye Caulker", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Resif üstünde sakin ada." },
                { ad: "Placencia", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Beyaz kumlu yarımada." }
            ],
            "Honduras": [
                { ad: "Tegucigalpa", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Dağlar arasında başkent." },
                { ad: "San Pedro Sula", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Ticaret ve sanayi şehri." },
                { ad: "Roatan", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Dalış cenneti Karayip adası." },
                { ad: "Copan", foto: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400", aciklama: "Ünlü Maya harabeleri." }
            ],
            "Nicaragua": [
                { ad: "Managua", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Göl kıyısında başkent." },
                { ad: "Granada", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Renkli kolonyal şehir." },
                { ad: "Leon", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Katedral ve volkan şehri." },
                { ad: "Ometepe", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Göl ortasında çift volkanlı ada." }
            ],
            "El Salvador": [
                { ad: "San Salvador", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Volkanlar arasında başkent." },
                { ad: "Santa Ana", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Tarihi katedral ve volkan." },
                { ad: "El Tunco", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Sörf plajı kasabası." },
                { ad: "Suchitoto", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Kolonyal sanat kasabası." }
            ],
            "The Bahamas": [
                { ad: "Nassau", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Renkli kolonyal başkent." },
                { ad: "Freeport", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Plaj ve mağaralar." },
                { ad: "Exuma", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Yüzen domuzlar ve turkuaz su." },
                { ad: "Paradise Island", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Lüks tatil adası." }
            ],
            "Dominican Republic": [
                { ad: "Santo Domingo", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Amerika'nın en eski kolonyal şehri." },
                { ad: "Punta Cana", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Palmiyeli tatil plajları." },
                { ad: "Puerto Plata", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Kuzey kıyısı liman şehri." },
                { ad: "Samana", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Balina izleme koyu." }
            ],
            "Haiti": [
                { ad: "Port-au-Prince", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Canlı ve tarihi başkent." },
                { ad: "Cap-Haitien", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Kuzeyin kolonyal şehri." },
                { ad: "Jacmel", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Sanat ve el sanatları kasabası." },
                { ad: "Labadee", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Özel plaj koyu." }
            ],
            "Puerto Rico": [
                { ad: "San Juan", foto: "https://images.unsplash.com/photo-1579282240050-352db0a14c21?w=400", aciklama: "Renkli surlu kolonyal başkent." },
                { ad: "Ponce", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Güneyin kültür şehri." },
                { ad: "Rincon", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Sörf ve gün batımı kasabası." },
                { ad: "Culebra", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Flamenco plajlı ada." }
            ],
            "Trinidad and Tobago": [
                { ad: "Port of Spain", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Karnavalın başkenti." },
                { ad: "San Fernando", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Güneyin sanayi şehri." },
                { ad: "Scarborough", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Tobago adasının merkezi." },
                { ad: "Chaguaramas", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Yat limanı ve doğa." }
            ]    ,
            "Falkland Islands": [
                { ad: "Stanley", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Rüzgarlı ada başkenti." },
                { ad: "Goose Green", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Küçük yerleşim, tarih." },
                { ad: "Volunteer Point", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Kral penguen kolonisi." },
                { ad: "Pebble Island", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Kuş ve yaban hayatı adası." }
            ]    ,
            "Greenland": [
                { ad: "Nuuk", foto: "https://images.unsplash.com/photo-1601629665203-f9f2b8d07f0e?w=400", aciklama: "Dünyanın en kuzey başkentlerinden." },
                { ad: "Ilulissat", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Buzdağı fiyortuyla ünlü." },
                { ad: "Sisimiut", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Kuzey kutup dairesi üstünde." },
                { ad: "Qaqortoq", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Güneyin renkli kasabası." }
            ],
            "Georgia": [
                { ad: "Tbilisi", foto: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=400", aciklama: "Kükürt hamamları ve eski şehir." },
                { ad: "Batumi", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Karadeniz kıyısında modern şehir." },
                { ad: "Kutaisi", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Antik başkent, manastırlar." },
                { ad: "Mtskheta", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Dini tarih merkezi." }
            ],
            "Armenia": [
                { ad: "Yerevan", foto: "https://images.unsplash.com/photo-1600250395178-40fe752e5189?w=400", aciklama: "Pembe taştan antik başkent." },
                { ad: "Gyumri", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "İkinci büyük tarihi şehir." },
                { ad: "Dilijan", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Orman içinde kaplıca kasabası." },
                { ad: "Sevan", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Dağ gölü kıyısında manastır." }
            ],
            "Turkmenistan": [
                { ad: "Ashgabat", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Beyaz mermer şehri." },
                { ad: "Turkmenbashi", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Hazar kıyısında liman." },
                { ad: "Darvaza", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Çölde yanan 'cehennem kapısı'." },
                { ad: "Mary", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Antik Merv yakını şehir." }
            ],
            "Afghanistan": [
                { ad: "Kabul", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Dağlar arasında tarihi başkent." },
                { ad: "Herat", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Batının kültür ve sanat şehri." },
                { ad: "Mazar-i-Sharif", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Mavi Camii ile ünlü." },
                { ad: "Bamyan", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Antik Buda heykelleri vadisi." }
            ],
            "Antarctica": [
                { ad: "McMurdo", foto: "https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?w=400", aciklama: "En büyük araştırma istasyonu." },
                { ad: "Amundsen-Scott", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Güney Kutbu üssü." },
                { ad: "Vostok", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Dünyanın en soğuk yeri." },
                { ad: "Palmer", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Yarımadada araştırma istasyonu." }
            ]    ,
            "West Bank": [
                { ad: "Ramallah", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "İdari merkez, canlı şehir." },
                { ad: "Bethlehem", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Doğuş Kilisesi'nin şehri." },
                { ad: "Hebron", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Tarihi eski şehir." },
                { ad: "Jericho", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Dünyanın en eski şehirlerinden." }
            ],
            "Northern Cyprus": [
                { ad: "North Nicosia", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Bölünmüş başkentin kuzeyi." },
                { ad: "Kyrenia", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Kale ve limanıyla ünlü." },
                { ad: "Famagusta", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Surlu tarihi liman şehri." },
                { ad: "Guzelyurt", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Narenciye bahçeleri bölgesi." }
            ],
            "Bhutan": [
                { ad: "Thimphu", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Trafik ışığı olmayan başkent." },
                { ad: "Paro", foto: "https://images.unsplash.com/photo-1553856622-d1b352e9a211?w=400", aciklama: "Kaplan Yuvası Manastırı'nın vadisi." },
                { ad: "Punakha", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Nehirler arası kadim kale." },
                { ad: "Bumthang", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Kutsal vadiler bölgesi." }
            ],
            "French Southern and Antarctic Lands": [
                { ad: "Port-aux-Francais", foto: "https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?w=400", aciklama: "Kerguelen adası üssü." },
                { ad: "Kerguelen", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Izole subantarktik adalar." },
                { ad: "Crozet", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Penguen kolonili adalar." },
                { ad: "Amsterdam Island", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Hint Okyanusu'nda volkanik ada." }
            ]    ,
            "Egypt": [
                { ad: "Cairo", foto: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=400", aciklama: "Piramitlerin gölgesinde dev başkent." },
                { ad: "Luxor", foto: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=400", aciklama: "Açık hava müzesi, tapınaklar." },
                { ad: "Alexandria", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Akdeniz kıyısında liman şehri." },
                { ad: "Aswan", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Nil üstünde güney şehri." }
            ],
            "Morocco": [
                { ad: "Marrakesh", foto: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=400", aciklama: "Kırmızı şehir, çarşılar ve meydan." },
                { ad: "Fez", foto: "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=400", aciklama: "Ortaçağ medinasıyla ünlü." },
                { ad: "Casablanca", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Modern liman metropolü." },
                { ad: "Chefchaouen", foto: "https://images.unsplash.com/photo-1548018560-c7196548e84d?w=400", aciklama: "Mavi boyalı dağ kasabası." }
            ],
            "Algeria": [
                { ad: "Algiers", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Beyaz evli Akdeniz başkenti." },
                { ad: "Oran", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Sahil ve müzik şehri." },
                { ad: "Constantine", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Köprüler ve kanyon şehri." },
                { ad: "Tamanrasset", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Sahra çölünün kapısı." }
            ],
            "Tunisia": [
                { ad: "Tunis", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Medina ve Kartaca'nın şehri." },
                { ad: "Sidi Bou Said", foto: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=400", aciklama: "Mavi-beyaz sahil kasabası." },
                { ad: "Sousse", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Plaj ve tarihi ribat." },
                { ad: "Kairouan", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Kutsal cami şehri." }
            ],
            "Libya": [
                { ad: "Tripoli", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Akdeniz kıyısında başkent." },
                { ad: "Benghazi", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Doğunun büyük şehri." },
                { ad: "Leptis Magna", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Görkemli Roma harabeleri." },
                { ad: "Ghadames", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Çölde vaha kasabası." }
            ],
            "Nigeria": [
                { ad: "Lagos", foto: "https://images.unsplash.com/photo-1618828665347-d5b5c1a5c6ea?w=400", aciklama: "Afrika'nın en kalabalık metropollerinden." },
                { ad: "Abuja", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Planlı modern başkent." },
                { ad: "Kano", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Kuzeyin kadim ticaret şehri." },
                { ad: "Ibadan", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Geniş tarihi şehir." }
            ],
            "Ghana": [
                { ad: "Accra", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Atlantik kıyısında canlı başkent." },
                { ad: "Kumasi", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Aşanti kültürünün merkezi." },
                { ad: "Cape Coast", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Tarihi kaleler ve sahil." },
                { ad: "Tamale", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Kuzeyin merkezi." }
            ],
            "Senegal": [
                { ad: "Dakar", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Atlantik ucunda başkent." },
                { ad: "Saint-Louis", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Kolonyal UNESCO şehri." },
                { ad: "Goree", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Tarihi köle adası." },
                { ad: "Saly", foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Plage-Saly.jpg?width=400", aciklama: "Sahil tatil bölgesi." },
            ]    ,
            "Kenya": [
                { ad: "Nairobi", foto: "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=400", aciklama: "Safari kapısı, canlı başkent." },
                { ad: "Mombasa", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Hint Okyanusu liman şehri." },
                { ad: "Masai Mara", foto: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400", aciklama: "Ünlü safari rezervi." },
                { ad: "Nakuru", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Flamingolu göl şehri." }
            ],
            "Ethiopia": [
                { ad: "Addis Ababa", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Yüksek yaylada başkent." },
                { ad: "Lalibela", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Kayaya oyulmuş kiliseler." },
                { ad: "Gondar", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Kaleler ve saraylar şehri." },
                { ad: "Aksum", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Antik krallık başkenti." }
            ],
            "United Republic of Tanzania": [
                { ad: "Dar es Salaam", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Büyük liman ve ticaret şehri." },
                { ad: "Zanzibar", foto: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400", aciklama: "Baharat adası, turkuaz su." },
                { ad: "Arusha", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Safari ve Kilimanjaro kapısı." },
                { ad: "Serengeti", foto: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400", aciklama: "Efsanevi milli park." }
            ],
            "Uganda": [
                { ad: "Kampala", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Tepeler üstünde canlı başkent." },
                { ad: "Entebbe", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Göl kıyısında sakin şehir." },
                { ad: "Jinja", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Nil'in kaynağı." },
                { ad: "Bwindi", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Goril ormanı." }
            ],
            "Rwanda": [
                { ad: "Kigali", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Tertemiz tepeler şehri." },
                { ad: "Musanze", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Dağ gorilleri kapısı." },
                { ad: "Gisenyi", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Kivu gölü kıyısı." },
                { ad: "Butare", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Üniversite ve kültür şehri." }
            ],
            "Democratic Republic of the Congo": [
                { ad: "Kinshasa", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Kongo nehri kıyısında dev başkent." },
                { ad: "Lubumbashi", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Madencilik merkezi." },
                { ad: "Goma", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Yanardağ eteğinde göl şehri." },
                { ad: "Kisangani", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Nehir üstünde orman şehri." }
            ],
            "Cameroon": [
                { ad: "Yaounde", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Tepeler üstünde başkent." },
                { ad: "Douala", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Büyük liman ve ekonomi şehri." },
                { ad: "Kribi", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Şelaleli sahil kasabası." },
                { ad: "Bamenda", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Yayla bölgesi şehri." }
            ]    ,
            "South Africa": [
                { ad: "Cape Town", foto: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400", aciklama: "Masa Dağı ve okyanus şehri." },
                { ad: "Johannesburg", foto: "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=400", aciklama: "Altın şehri, büyük metropol." },
                { ad: "Durban", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Sıcak Hint Okyanusu sahili." },
                { ad: "Pretoria", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Jakaranda ağaçlı başkent." }
            ],
            "Namibia": [
                { ad: "Windhoek", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Yaylada sakin başkent." },
                { ad: "Swakopmund", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Çöl ve okyanus arası kasaba." },
                { ad: "Sossusvlei", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Kızıl dev kum tepeleri." },
                { ad: "Etosha", foto: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400", aciklama: "Büyük safari parkı." }
            ],
            "Botswana": [
                { ad: "Gaborone", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Sakin modern başkent." },
                { ad: "Okavango", foto: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400", aciklama: "Eşsiz iç deltası." },
                { ad: "Chobe", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Fil sürüleriyle ünlü park." },
                { ad: "Maun", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Safari kapısı kasabası." }
            ],
            "Zimbabwe": [
                { ad: "Harare", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Yeşil bahçeler şehri, başkent." },
                { ad: "Victoria Falls", foto: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400", aciklama: "Dünyanın en büyük şelalelerinden." },
                { ad: "Bulawayo", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Geniş caddeli tarihi şehir." },
                { ad: "Great Zimbabwe", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Antik taş şehir harabeleri." }
            ],
            "Mozambique": [
                { ad: "Maputo", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Sahil kıyısında kolonyal başkent." },
                { ad: "Tofo", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Dalış ve plaj kasabası." },
                { ad: "Island of Mozambique", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Tarihi UNESCO adası." },
                { ad: "Pemba", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Mercan resifli körfez." }
            ],
            "Madagascar": [
                { ad: "Antananarivo", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Tepeler üstünde başkent." },
                { ad: "Nosy Be", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Tropik tatil adası." },
                { ad: "Morondava", foto: "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=400", aciklama: "Baobab ağaçları yolu." },
                { ad: "Andasibe", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Lemur ormanı." }
            ],
            "Angola": [
                { ad: "Luanda", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Atlantik kıyısında başkent." },
                { ad: "Lubango", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Dağlar arası şehir." },
                { ad: "Benguela", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Sahil liman şehri." },
                { ad: "Namibe", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Çöl ve okyanus buluşması." }
            ]    ,
            "Western Sahara": [
                { ad: "Laayoune", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Çöl bölgesinin en büyük şehri." },
                { ad: "Dakhla", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Atlantik kıyısında rüzgar sörfü." },
                { ad: "Smara", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "İç çöl kasabası." },
                { ad: "Bojador", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Sahil burnu kasabası." }
            ],
            "Mauritania": [
                { ad: "Nouakchott", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Çöl kıyısında başkent." },
                { ad: "Chinguetti", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Antik kütüphane şehri." },
                { ad: "Nouadhibou", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Balıkçılık liman şehri." },
                { ad: "Atar", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Sahra vahaları kapısı." }
            ],
            "Mali": [
                { ad: "Bamako", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Nijer nehri kıyısında başkent." },
                { ad: "Timbuktu", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Efsanevi çöl bilim şehri." },
                { ad: "Djenne", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Kerpiç Büyük Camii." },
                { ad: "Mopti", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Nehir limanı, 'Venedik'." }
            ],
            "Gambia": [
                { ad: "Banjul", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Nehir ağzında küçük başkent." },
                { ad: "Serekunda", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "En büyük şehir, çarşılar." },
                { ad: "Kololi", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Sahil tatil bölgesi." },
                { ad: "Janjanbureh", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "İç nehir adası kasabası." }
            ],
            "Guinea Bissau": [
                { ad: "Bissau", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Kolonyal liman başkenti." },
                { ad: "Bafata", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Nehir kıyısında tarihi şehir." },
                { ad: "Bolama", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Eski başkent adası." },
                { ad: "Bijagos", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Bakir takımadalar." }
            ],
            "Guinea": [
                { ad: "Conakry", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Atlantik yarımadasında başkent." },
                { ad: "Kankan", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "İç bölgenin büyük şehri." },
                { ad: "Labe", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Yayla bölgesi merkezi." },
                { ad: "Nzerekore", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Orman bölgesi şehri." }
            ],
            "Sierra Leone": [
                { ad: "Freetown", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Tepeler ve plajlar başkenti." },
                { ad: "Bo", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "İkinci büyük şehir." },
                { ad: "Kenema", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Elmas bölgesi şehri." },
                { ad: "Tokeh", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Beyaz kumlu plaj." }
            ],
            "Liberia": [
                { ad: "Monrovia", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Atlantik kıyısında başkent." },
                { ad: "Gbarnga", foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Monrovia%20to%20Gbarnga%20highway.jpg?width=400", aciklama: "İç bölge merkezi." },
                { ad: "Buchanan", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Liman şehri." },
                { ad: "Robertsport", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Sörf kasabası." }
            ],
            "Ivory Coast": [
                { ad: "Abidjan", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Lagün kıyısında büyük şehir." },
                { ad: "Yamoussoukro", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Dev bazilikalı başkent." },
                { ad: "Grand-Bassam", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Kolonyal UNESCO kasabası." },
                { ad: "Man", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Dağlar ve şelaleler." }
            ],
            "Togo": [
                { ad: "Lome", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Sahil kıyısında başkent." },
                { ad: "Kpalime", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Dağlar ve şelaleler kasabası." },
                { ad: "Sokode", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "İkinci büyük şehir." },
                { ad: "Aneho", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Eski kolonyal başkent." }
            ],
            "Benin": [
                { ad: "Porto-Novo", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Resmi başkent." },
                { ad: "Cotonou", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Ekonomik merkez, liman." },
                { ad: "Ganvie", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Göl üstünde kazıklı köy." },
                { ad: "Ouidah", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Vudu ve tarih şehri." }
            ],
            "Burkina Faso": [
                { ad: "Ouagadougou", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Film festivalli başkent." },
                { ad: "Bobo-Dioulasso", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Kültür ve müzik şehri." },
                { ad: "Banfora", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Şelaleler ve kaya oluşumları." },
                { ad: "Koudougou", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Üçüncü büyük şehir." }
            ],
            "Niger": [
                { ad: "Niamey", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Nijer nehri kıyısında başkent." },
                { ad: "Agadez", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Çöl kapısı, kerpiç minare." },
                { ad: "Zinder", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Eski başkent, sultan sarayı." },
                { ad: "Maradi", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Ticaret şehri." }
            ],
            "Chad": [
                { ad: "N'Djamena", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Nehir kıyısında başkent." },
                { ad: "Zakouma", foto: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400", aciklama: "Fil ve safari parkı." },
                { ad: "Abeche", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Doğunun tarihi şehri." },
                { ad: "Ennedi", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Çölde kaya oluşumları." }
            ],
            "Central African Republic": [
                { ad: "Bangui", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Nehir kıyısında başkent." },
                { ad: "Bimbo", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Başkent yakını şehir." },
                { ad: "Berberati", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Batının büyük şehri." },
                { ad: "Dzanga-Sangha", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Orman fili rezervi." }
            ],
            "Sudan": [
                { ad: "Khartoum", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "İki Nil'in birleştiği başkent." },
                { ad: "Omdurman", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Geleneksel çarşı şehri." },
                { ad: "Meroe", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Nubya piramitleri." },
                { ad: "Port Sudan", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Kızıldeniz liman şehri." }
            ],
            "South Sudan": [
                { ad: "Juba", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Nil kıyısında genç başkent." },
                { ad: "Wau", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "İkinci büyük şehir." },
                { ad: "Malakal", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Nehir liman şehri." },
                { ad: "Boma", foto: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400", aciklama: "Geniş milli park." }
            ],
            "Eritrea": [
                { ad: "Asmara", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Art deco mimarili başkent." },
                { ad: "Massawa", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Kızıldeniz liman şehri." },
                { ad: "Keren", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Dağlar arası pazar şehri." },
                { ad: "Dahlak", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Kızıldeniz takımadaları." }
            ]    ,
            "Republic of the Congo": [
                { ad: "Brazzaville", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Kongo nehri kıyısında başkent." },
                { ad: "Pointe-Noire", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Atlantik liman şehri." },
                { ad: "Dolisie", foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Dolisie.jpg?width=400", aciklama: "Üçüncü büyük şehir." },
                { ad: "Odzala", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Goril ormanı parkı." }
            ],
            "Equatorial Guinea": [
                { ad: "Malabo", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Ada üstünde başkent." },
                { ad: "Bata", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Anakaranın büyük şehri." },
                { ad: "Mongomo", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Dev bazilikalı şehir." },
                { ad: "Luba", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Liman kasabası." }
            ],
            "Gabon": [
                { ad: "Libreville", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Atlantik kıyısında başkent." },
                { ad: "Port-Gentil", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Petrol ve liman şehri." },
                { ad: "Loango", foto: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400", aciklama: "Plajda fillerin gezdiği park." },
                { ad: "Franceville", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Güneydoğu merkezi." }
            ],
            "Burundi": [
                { ad: "Gitega", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "İç bölgede başkent." },
                { ad: "Bujumbura", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Tanganyika gölü kıyısı." },
                { ad: "Rumonge", foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Lac%20Tanganyika,%20Rumonge.jpg?width=400", aciklama: "Göl kıyısı kasabası." },
                { ad: "Ngozi", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Kuzeyin merkezi." }
            ],
            "Zambia": [
                { ad: "Lusaka", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Canlı ve büyüyen başkent." },
                { ad: "Livingstone", foto: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400", aciklama: "Victoria Şelaleleri kapısı." },
                { ad: "Kitwe", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Bakır kuşağı şehri." },
                { ad: "South Luangwa", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Ünlü safari parkı." }
            ],
            "Malawi": [
                { ad: "Lilongwe", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Planlı başkent." },
                { ad: "Blantyre", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Ticaret ve tarih şehri." },
                { ad: "Lake Malawi", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Berrak sulu dev göl." },
                { ad: "Zomba", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Yayla eteğinde eski başkent." }
            ],
            "Swaziland": [
                { ad: "Mbabane", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Dağlar arasında başkent." },
                { ad: "Lobamba", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Kraliyet ve meclis merkezi." },
                { ad: "Manzini", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "En büyük şehir, pazar." },
                { ad: "Hlane", foto: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400", aciklama: "Kraliyet safari parkı." }
            ],
            "Lesotho": [
                { ad: "Maseru", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Dağlar arasında başkent." },
                { ad: "Semonkong", foto: "https://commons.wikimedia.org/wiki/Special:FilePath/Lesotho%20maletsunyane%20falls.jpg?width=400", aciklama: "Yüksek şelale kasabası." },
                { ad: "Thaba-Bosiu", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Tarihi kaya platosu." },
                { ad: "Katse", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Dev baraj ve gölü." }
            ],
            "Somalia": [
                { ad: "Mogadishu", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Hint Okyanusu kıyısında başkent." },
                { ad: "Hargeisa", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Kuzeyin büyük şehri." },
                { ad: "Kismayo", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Güney liman şehri." },
                { ad: "Berbera", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Kızıldeniz liman kasabası." }
            ],
            "Somaliland": [
                { ad: "Hargeisa", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "İlan edilmiş başkent." },
                { ad: "Berbera", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Tarihi liman şehri." },
                { ad: "Burao", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "İç bölge merkezi." },
                { ad: "Laas Geel", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Antik kaya resimleri." }
            ],
            "Djibouti": [
                { ad: "Djibouti City", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Körfez ağzında başkent." },
                { ad: "Lac Assal", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Afrika'nın en alçak tuz gölü." },
                { ad: "Tadjoura", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Eski beyaz kasaba." },
                { ad: "Obock", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Kuzey sahil kasabası." }
            ]
};

let gezilenler = JSON.parse(localStorage.getItem("gezilenler")) || [];
let sehirDetaylari = JSON.parse(localStorage.getItem("sehirDetaylari")) || {};
let aktifDetay = { ulke: "", sehir: "" };
let sehirFotolari = JSON.parse(localStorage.getItem("sehirFotolari")) || {};
let sehirKoordinatlari = JSON.parse(localStorage.getItem("sehirKoordinatlari")) || {};
let profilVeri = JSON.parse(localStorage.getItem("profilVeri")) || { isim: "", konum: "", fotolar: [] };
let profilDuzenleme = false;
let pinler = {}; // haritadaki marker'ları tutar (anahtar: "ulke|sehir")

function gezileriKaydet() {
    localStorage.setItem("gezilenler", JSON.stringify(gezilenler));
}

let ulkeKatmanlari = {};

function istatistikGuncelle() {
    const ulkeler = [];
    const kitalar = [];
    for (let i = 0; i < gezilenler.length; i++) {
        if (ulkeler.indexOf(gezilenler[i].ulke) === -1) {
            ulkeler.push(gezilenler[i].ulke);
        }
        const kita = ulkeKita[gezilenler[i].ulke];
        if (kita && kitalar.indexOf(kita) === -1) {
            kitalar.push(kita);
        }
    }
    document.getElementById("istatistik").textContent =
        kitalar.length + " Kıta — " + ulkeler.length + " Ülke — " + gezilenler.length + " Şehir gezdin";
}

function ulkeRenkGuncelle(ulke) {
    const katman = ulkeKatmanlari[ulke];
    if (!katman) return;
    const gezildi = gezilenler.some(function(g) { return g.ulke === ulke; });
    katman.setStyle({ fillColor: gezildi ? "#E67E22" : "#1e2a3a" });
}

async function sehirSec(btn, ulke, sehir) {
    const indeks = gezilenler.findIndex(function(g) {
        return g.ulke === ulke && g.sehir === sehir;
    });

    const kart = btn.closest(".sehir-kart");
    if (indeks === -1) {
        gezilenler.push({ ulke: ulke, sehir: sehir });
        kart.classList.add("secili");
        btn.classList.add("aktif");
        btn.textContent = "✓";
        pinEkle(ulke, sehir);

        // Supabase'e YAZ
        const { data: oturum } = await db.auth.getSession();
        if (oturum.session) {
            const kullanici = oturum.session.user.id;
            const { error } = await db.from("gezilenler").insert({
                user_id: kullanici,
                ulke: ulke,
                sehir: sehir
            });
            if (error) console.log("Supabase yazma hatası:", error.message);
        }
    } else {
        gezilenler.splice(indeks, 1);
        kart.classList.remove("secili");
        btn.classList.remove("aktif");
        btn.textContent = "+";
        pinKaldir(ulke, sehir);

        // Supabase'den SİL
        const { data: oturum } = await db.auth.getSession();
        if (oturum.session) {
            const kullanici = oturum.session.user.id;
            const { error } = await db.from("gezilenler")
                .delete()
                .eq("user_id", kullanici)
                .eq("ulke", ulke)
                .eq("sehir", sehir);
            if (error) console.log("Supabase silme hatası:", error.message);
        }
    }
    gezileriKaydet();
    istatistikGuncelle();
    gecmisGuncelle();
    ulkeRenkGuncelle(ulke);
    kitaChartCiz();
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
                // Kayıtlı gezilen ülkeleri baştan renklendir
                for (let i = 0; i < gezilenler.length; i++) {
                    ulkeRenkGuncelle(gezilenler[i].ulke);
                }
        
                // Kayıtlı gezilen şehirlere pin at
                for (let i = 0; i < gezilenler.length; i++) {
                    pinEkle(gezilenler[i].ulke, gezilenler[i].sehir);
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
            sehirHtml += "<div class='gecmis-sehir' onclick='event.stopPropagation(); sehirDetayAc(\"" + ulke + "\", \"" + sehirler[j].sehir + "\")'>" + sehirler[j].sehir + "</div>";
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

            // Bu şehrin puanını al
            const anahtar = ulkeAdi + "|" + sehirler[i].ad;
            const detay = sehirDetaylari[anahtar];
            const puan = detay && detay.puan ? detay.puan : 0;

            // Yıldız HTML'i (puan varsa göster)
            let yildizHtml = "";
            if (puan > 0) {
                let dolu = "";
                for (let y = 0; y < 5; y++) {
                    dolu += (y < puan) ? "★" : "☆";
                }
                yildizHtml = "<div class='kart-puan'>" + dolu + "</div>";
            }

            liste.innerHTML +=
                "<div class='sehir-kart" + (seciliMi ? " secili" : "") + "' onclick='sehirDetayAc(\"" + ulkeAdi + "\", \"" + sehirler[i].ad + "\")'>" +
                "<button class='gittim-btn" + (seciliMi ? " aktif" : "") + "' onclick='event.stopPropagation(); sehirSec(this, \"" + ulkeAdi + "\", \"" + sehirler[i].ad + "\")'>" + (seciliMi ? "✓" : "+") + "</button>" +
                yildizHtml +
                "<img src='" + sehirler[i].foto + "' onerror='this.src=\"https://placehold.co/400x200/1a1a1a/E67E22?text=\" + encodeURIComponent(this.alt || \"foto\")' alt='" + sehirler[i].ad + "'>" +
                    "<div class='sehir-bilgi'>" +
                        "<div class='sehir-ad'>" + sehirler[i].ad + "</div>" +
                        "<div class='sehir-aciklama'>" + sehirler[i].aciklama + "</div>" +
                    "</div>" +
                "</div>";
        }
                // Her şehir için Wikipedia fotosunu çek (kayıtlıysa direkt kullan)
                const kartlar = liste.querySelectorAll(".sehir-kart img");
                for (let i = 0; i < sehirler.length; i++) {
                    (function(index) {
                        const sehirAd = sehirler[index].ad;
                        const img = kartlar[index];
                        if (!img) return;
        
                        // Kayıtlı foto varsa direkt koy
                        if (sehirFotolari[sehirAd]) {
                            if (sehirFotolari[sehirAd] !== "yok") {
                                img.src = sehirFotolari[sehirAd];
                            }
                            return;
                        }
        
                        // Yoksa Wikipedia'dan çek
                        wikiFotoBul(sehirAd, ulkeAdi, function(foto) {
                            if (foto) {
                                sehirFotolari[sehirAd] = foto;
                                img.src = foto;
                            } else {
                                sehirFotolari[sehirAd] = "yok"; // bir daha arama
                            }
                            localStorage.setItem("sehirFotolari", JSON.stringify(sehirFotolari));
                        });
                    })(i);
                }
    }
    document.getElementById("panel").classList.add("acik");
    document.getElementById("harita").classList.add("itili"); // haritayı sola it
    
}

function paneliKapat() {
    document.getElementById("panel").classList.remove("acik");
    document.getElementById("harita").classList.remove("itili"); // haritayı geri getir
}

document.getElementById("kapat").addEventListener("click", paneliKapat);
document.getElementById("ortu").addEventListener("click", function() {
    paneliKapat();
    istatistikPaneliKapat();
    sehirDetayKapat();
    profilKapat();
});

document.addEventListener("mousemove", function(e) {
    document.getElementById("crosshairX").style.top = e.clientY + "px";
    document.getElementById("crosshairY").style.left = e.clientX + "px";
});

function kitaChartCiz() {
    // Gezilen tekrarsız ülkeleri bul
    const gezilenUlkeler = [];
    for (let i = 0; i < gezilenler.length; i++) {
        if (gezilenUlkeler.indexOf(gezilenler[i].ulke) === -1) {
            gezilenUlkeler.push(gezilenler[i].ulke);
        }
    }

    // Kıta başına gezilen ülke sayısı
    const kitaSayim = {};
    for (let i = 0; i < gezilenUlkeler.length; i++) {
        const kita = ulkeKita[gezilenUlkeler[i]];
        if (!kita) continue;
        kitaSayim[kita] = (kitaSayim[kita] || 0) + 1;
    }

    const svg = document.getElementById("kitaSvg");
    const lejant = document.getElementById("kitaLejant");
    svg.innerHTML = "";
    lejant.innerHTML = "";

    const kitalar = Object.keys(kitaSayim);
    const toplamGezilen = gezilenUlkeler.length;

    if (toplamGezilen === 0) {
        lejant.innerHTML = "<div style='color:#888;font-size:13px'>Henüz ülke gezmedin.</div>";
        return;
    }

    // Donut ayarları
        // Pasta (pie) ayarları
        const merkez = 100, yaricap = 90;
        let baslangicAci = -90; // tepeden başla
    
        // Bir açıyı x,y noktasına çeviren yardımcı
        function noktaBul(aci) {
            const rad = (aci * Math.PI) / 180;
            return {
                x: merkez + yaricap * Math.cos(rad),
                y: merkez + yaricap * Math.sin(rad)
            };
        }
    
        for (let i = 0; i < kitalar.length; i++) {
            const kita = kitalar[i];
            const pay = kitaSayim[kita] / toplamGezilen;
            const renk = kitaRenk[kita] || "#888";
    
            const bitisAci = baslangicAci + pay * 360;
            const bas = noktaBul(baslangicAci);
            const bit = noktaBul(bitisAci);
            const buyukYay = pay > 0.5 ? 1 : 0;
    
            // Dilim (path): merkez -> yay başı -> yay -> merkez
            const d =
                "M " + merkez + " " + merkez + " " +
                "L " + bas.x + " " + bas.y + " " +
                "A " + yaricap + " " + yaricap + " 0 " + buyukYay + " 1 " + bit.x + " " + bit.y + " " +
                "Z";
    
            const dilim = document.createElementNS("http://www.w3.org/2000/svg", "path");
            dilim.setAttribute("d", d);
            dilim.setAttribute("fill", renk);
            svg.appendChild(dilim);
    
            baslangicAci = bitisAci;
    
            // Lejant satırı
            const gezilen = kitaSayim[kita];
            const toplam = kitaToplam[kita] || "?";
            const yuzde = Math.round((gezilen / toplam) * 100);
    
            lejant.innerHTML +=
                "<div class='lejant-satir'>" +
                    "<span class='lejant-renk' style='background:" + renk + "'></span>" +
                    "<span>" + kita + "</span>" +
                    "<span class='lejant-yuzde'>%" + yuzde + " (" + gezilen + "/" + toplam + ")</span>" +
                "</div>";
        }
    
        // Dönerek açılma efekti
        // Dönerek açılma efekti
        svg.classList.remove("donuyor");
        void svg.offsetWidth; // animasyonu yeniden tetikle
        svg.classList.add("donuyor");
}

kitaChartCiz();

function istatistikPaneliDoldur() {
    // Gezilen tekrarsız ülkeleri kıtalara göre say
    const gezilenUlkeler = [];
    for (let i = 0; i < gezilenler.length; i++) {
        if (gezilenUlkeler.indexOf(gezilenler[i].ulke) === -1) {
            gezilenUlkeler.push(gezilenler[i].ulke);
        }
    }
    const kitaSayim = {};
    for (let i = 0; i < gezilenUlkeler.length; i++) {
        const kita = ulkeKita[gezilenUlkeler[i]];
        if (!kita) continue;
        kitaSayim[kita] = (kitaSayim[kita] || 0) + 1;
    }

    const liste = document.getElementById("kitaBarListe");
    liste.innerHTML = "";

    // TÜM kıtalar (gidilmemiş olsa da)
    const tumKitalar = Object.keys(kitaToplam);

    for (let i = 0; i < tumKitalar.length; i++) {
        const kita = tumKitalar[i];
        const gezilen = kitaSayim[kita] || 0;
        const toplam = kitaToplam[kita];
        const yuzde = Math.round((gezilen / toplam) * 100);
        const renk = kitaRenk[kita] || "#888";

        liste.innerHTML +=
            "<div class='bar-satir'>" +
                "<div class='bar-ust'>" +
                    "<span>" + kita + " (" + gezilen + "/" + toplam + ")</span>" +
                    "<span class='bar-yuzde'>%" + yuzde + "</span>" +
                "</div>" +
                "<div class='bar-dis'>" +
                    "<div class='bar-ic' data-yuzde='" + yuzde + "' style='background:" + renk + "'></div>" +
                "</div>" +
            "</div>";
    }

    // Çubukları soldan sağa doldur (kısa gecikmeyle animasyon tetiklensin)
    setTimeout(function() {
        const barlar = document.querySelectorAll("#kitaBarListe .bar-ic");
        for (let i = 0; i < barlar.length; i++) {
            barlar[i].style.width = barlar[i].getAttribute("data-yuzde") + "%";
        }
    }, 50);
}

function istatistikPaneliAc() {
    istatistikPaneliDoldur();
    document.getElementById("istatistikPanel").classList.add("acik");
    document.getElementById("harita").classList.add("itili");
}

function istatistikPaneliKapat() {
    document.getElementById("istatistikPanel").classList.remove("acik");
    document.getElementById("harita").classList.remove("itili");
}

document.getElementById("kitaChart").addEventListener("click", istatistikPaneliAc);
document.getElementById("istatistikKapat").addEventListener("click", istatistikPaneliKapat);


document.getElementById("sifirlaBtn").addEventListener("click", function() {
    if (confirm("Emin misin? Tüm gezdiğin yerler silinecek ve harita ilk haline dönecek.")) {
        gezilenler = [];

                // Pinleri kaldır
                for (const anahtar in pinler) {
                    harita.removeLayer(pinler[anahtar]);
                }
                pinler = {};

        gezileriKaydet();

        // Tüm ülke renklerini sıfırla
        for (const ulke in ulkeKatmanlari) {
            ulkeKatmanlari[ulke].setStyle({ fillColor: "#1e2a3a" });
        }

        istatistikGuncelle();
        kitaChartCiz();
        gecmisGuncelle();
        
    }
});

function sehirDetayAc(ulke, sehir) {
    aktifDetay = { ulke: ulke, sehir: sehir };
    document.getElementById("sehirDetayBaslik").textContent = sehir;

        // Şehrin görselini üstte göster (önce çekilmiş Wikipedia fotosu, yoksa hazır foto)
        const sehirObj = (sehirVerisi[ulke] || []).find(function(s) { return s.ad === sehir; });
        const kapak = document.getElementById("sehirKapak");
        const wikiFoto = sehirFotolari[sehir]; // kartta çekilip kaydedilen foto
        const kapakFoto = (wikiFoto && wikiFoto !== "yok") ? wikiFoto : (sehirObj ? sehirObj.foto : "");
        if (kapakFoto) {
            kapak.src = kapakFoto;
            kapak.style.display = "block";
        } else {
            kapak.style.display = "none";
        }

    const anahtar = ulke + "|" + sehir;
    const detay = sehirDetaylari[anahtar] || { puan: 0, foto: "", not: "" };

    // Yıldızları göster
    yildizGoster(detay.puan);

    // Foto
    const onizle = document.getElementById("sehirFotoOnizle");
    if (detay.foto) {
        onizle.innerHTML = "<img src='" + detay.foto + "'>";
    } else {
        onizle.innerHTML = "";
    }

    // Not
        // Not
        document.getElementById("sehirNot").value = detay.not || "";

        // Gidilmiş mi? Gidilmediyse değerlendirme alanlarını kilitle
        const gidildiMi = gezilenler.findIndex(function(g) {
            return g.ulke === ulke && g.sehir === sehir;
        }) !== -1;
    
        const detayGovde = document.getElementById("detayGovde");
        const kilitUyari = document.getElementById("kilitUyari");
        if (gidildiMi) {
            detayGovde.style.display = "block";
            kilitUyari.style.display = "none";
        } else {
            detayGovde.style.display = "none";
            kilitUyari.style.display = "block";
        }
    
        document.getElementById("panel").classList.remove("acik"); // şehir panelini gizle
        document.getElementById("sehirDetayPanel").classList.add("acik");
    }

let seciliPuan = 0;
let seciliFoto = "";

function yildizGoster(puan) {
    seciliPuan = puan;
    const yildizlar = document.querySelectorAll("#yildizlar .yildiz");
    for (let i = 0; i < yildizlar.length; i++) {
        if (i < puan) {
            yildizlar[i].classList.add("dolu");
        } else {
            yildizlar[i].classList.remove("dolu");
        }
    }
}

// Yıldıza tıklama
document.querySelectorAll("#yildizlar .yildiz").forEach(function(y) {
    y.addEventListener("click", function() {
        yildizGoster(parseInt(this.dataset.puan));
    });
});

// Foto seçme
document.getElementById("sehirFotoInput").addEventListener("change", function(e) {
    const dosya = e.target.files[0];
    if (!dosya) return;
    const okuyucu = new FileReader();
    okuyucu.onload = function(olay) {
        seciliFoto = olay.target.result;
        document.getElementById("sehirFotoOnizle").innerHTML = "<img src='" + seciliFoto + "'>";
    };
    okuyucu.readAsDataURL(dosya);
});

// Kaydet
document.getElementById("sehirDetayKaydet").addEventListener("click", async function() {
    const anahtar = aktifDetay.ulke + "|" + aktifDetay.sehir;
    const mevcut = sehirDetaylari[anahtar] || {};
    sehirDetaylari[anahtar] = {
        puan: seciliPuan,
        foto: seciliFoto || mevcut.foto || "",
        not: document.getElementById("sehirNot").value
    };
    localStorage.setItem("sehirDetaylari", JSON.stringify(sehirDetaylari));

    // Supabase'e YAZ (puan + not)
    const { data: oturum } = await db.auth.getSession();
    if (oturum.session) {
        const kullanici = oturum.session.user.id;
        const { error } = await db.from("sehir_detaylari").upsert({
            user_id: kullanici,
            ulke: aktifDetay.ulke,
            sehir: aktifDetay.sehir,
            puan: seciliPuan,
            notlar: document.getElementById("sehirNot").value
        }, { onConflict: "user_id,ulke,sehir" });
        if (error) console.log("Detay yazma hatası:", error.message);
    }

    seciliFoto = ""; // sıfırla
    sehirDetayKapat();
});

// Kapat
function sehirDetayKapat() {
    document.getElementById("sehirDetayPanel").classList.remove("acik");
    // şehir panelini geri aç (aktifDetay'daki ülkeyle)
    if (aktifDetay && aktifDetay.ulke) {
        panelAc(aktifDetay.ulke);
    }
    seciliFoto = "";
}
    

document.getElementById("sehirDetayKapat").addEventListener("click", sehirDetayKapat);

// Fare koordinatlarını canlı göster
harita.on("mousemove", function(e) {
    const lat = e.latlng.lat.toFixed(2);
    const lng = e.latlng.lng.toFixed(2);
    document.getElementById("koordinat").textContent = lat + ", " + lng;
});

// ---- PİN / KOORDİNAT SİSTEMİ ----
let koordinatKuyrugu = [];
let kuyrukCalisiyor = false;

function kuyruguIslet() {
    if (kuyrukCalisiyor || koordinatKuyrugu.length === 0) return;
    kuyrukCalisiyor = true;

    const is = koordinatKuyrugu.shift();
    const anahtar = is.ulke + "|" + is.sehir;

    const sorgu = encodeURIComponent(is.sehir + ", " + is.ulke);
    fetch("https://nominatim.openstreetmap.org/search?format=json&q=" + sorgu + "&limit=1")
        .then(function(cevap) { return cevap.json(); })
        .then(function(veri) {
            if (veri && veri.length > 0) {
                const koord = [parseFloat(veri[0].lat), parseFloat(veri[0].lon)];
                sehirKoordinatlari[anahtar] = koord;
                localStorage.setItem("sehirKoordinatlari", JSON.stringify(sehirKoordinatlari));
                is.callback(koord);
            }
        })
        .catch(function() {})
        .finally(function() {
            setTimeout(function() {
                kuyrukCalisiyor = false;
                kuyruguIslet();
            }, 2000);
        });
}

function sehirKoordinatBul(ulke, sehir, callback) {
    const anahtar = ulke + "|" + sehir;
    if (sehirKoordinatlari[anahtar]) {
        callback(sehirKoordinatlari[anahtar]);
        return;
    }
    koordinatKuyrugu.push({ ulke: ulke, sehir: sehir, callback: callback });
    kuyruguIslet();
}

function pinEkle(ulke, sehir) {
    const anahtar = ulke + "|" + sehir;
    if (pinler[anahtar]) return;

    sehirKoordinatBul(ulke, sehir, function(koord) {
        const marker = L.circleMarker(koord, {
            radius: 5,
            fillColor: "#4A2511",
            color: "#fff",
            weight: 2,
            fillOpacity: 1
        }).addTo(harita);
        marker.bindTooltip(sehir, { direction: "top", offset: [0, -5], className: "pin-etiket" });
        pinler[anahtar] = marker;
    });
}

function pinKaldir(ulke, sehir) {
    const anahtar = ulke + "|" + sehir;
    if (pinler[anahtar]) {
        harita.removeLayer(pinler[anahtar]);
        delete pinler[anahtar];
    }
}

// ---- PROFİL KARTI ----
function profilAc() {
    profilDuzenleme = false;
    profilDoldur();
    profilKilitle(true);
    document.getElementById("profilKart").classList.add("acik");
    document.getElementById("harita").classList.add("itili"); // haritayı sola it

}

function profilKapat() {
    document.getElementById("profilKart").classList.remove("acik");
    document.getElementById("harita").classList.remove("itili"); // haritayı geri getir
}

function profilDoldur() {
    document.getElementById("profilIsim").value = profilVeri.isim || "";
    document.getElementById("profilKonum").value = profilVeri.konum || "";

    // Fotoğraflar
    const liste = document.getElementById("profilFotoListe");
    liste.innerHTML = "";
    for (let i = 0; i < profilVeri.fotolar.length; i++) {
        liste.innerHTML +=
            "<div class='profil-foto-kutu'>" +
                "<img src='" + profilVeri.fotolar[i] + "'>" +
                (profilDuzenleme ? "<button class='profil-foto-sil' data-i='" + i + "'>×</button>" : "") +
            "</div>";
    }
    // Sil butonlarını bağla
    document.querySelectorAll(".profil-foto-sil").forEach(function(b) {
        b.addEventListener("click", function() {
            profilVeri.fotolar.splice(parseInt(this.dataset.i), 1);
            profilDoldur();
        });
    });

    // Foto ekle butonu 3'ten azsa ve düzenlemedeyse görünsün
    const ekleBtn = document.getElementById("profilFotoEkle");
    ekleBtn.style.display = (profilDuzenleme && profilVeri.fotolar.length < 3) ? "flex" : "none";

    // Son gezilen (otomatik, son 5)
    const sonGezilen = document.getElementById("profilSonGezilen");
    sonGezilen.innerHTML = "";
    const son5 = gezilenler.slice(-5).reverse();
    if (son5.length === 0) {
        sonGezilen.innerHTML = "<div class='profil-gezi-satir' style='color:#777'>Henüz yer eklenmedi.</div>";
    } else {
        for (let i = 0; i < son5.length; i++) {
            sonGezilen.innerHTML += "<div class='profil-gezi-satir'>" + son5[i].ulke + " — " + son5[i].sehir + "</div>";
        }
    }
}

function profilKilitle(kilitli) {
    document.getElementById("profilIsim").disabled = kilitli;
    document.getElementById("profilKonum").disabled = kilitli;
}

// Butonlar
document.getElementById("profilBtn").addEventListener("click", profilAc);
document.getElementById("profilKapat").addEventListener("click", profilKapat);

document.getElementById("profilDegistir").addEventListener("click", function() {
    profilDuzenleme = true;
    profilKilitle(false);
    profilDoldur(); // foto sil butonları + ekle butonu görünsün
});

document.getElementById("profilKaydet").addEventListener("click", async function() {
    profilVeri.isim = document.getElementById("profilIsim").value;
    profilVeri.konum = document.getElementById("profilKonum").value;
    localStorage.setItem("profilVeri", JSON.stringify(profilVeri));

    // Supabase'e YAZ (isim + konum)
    const { data: oturum } = await db.auth.getSession();
    if (oturum.session) {
        const kullanici = oturum.session.user.id;
        const { error } = await db.from("profil").upsert({
            user_id: kullanici,
            isim: profilVeri.isim,
            konum: profilVeri.konum
        }, { onConflict: "user_id" });
        if (error) console.log("Profil yazma hatası:", error.message);
    }

    profilButonFotoGuncelle();
    profilKapat();
});

// Foto ekleme
document.getElementById("profilFotoInput").addEventListener("change", function(e) {
    const dosya = e.target.files[0];
    if (!dosya || profilVeri.fotolar.length >= 3) return;
    const okuyucu = new FileReader();
    okuyucu.onload = function(olay) {
        profilVeri.fotolar.push(olay.target.result);
        profilDoldur();
    };
    okuyucu.readAsDataURL(dosya);
});

// Profil butonundaki küçük fotoyu güncelle
function profilButonFotoGuncelle() {
    const foto = document.getElementById("profilFoto");
    if (profilVeri.fotolar && profilVeri.fotolar.length > 0) {
        foto.style.backgroundImage = "url('" + profilVeri.fotolar[0] + "')";
    } else {
        foto.style.backgroundImage = "";
    }
}

// Sayfa açılışında bir kez çağır
profilButonFotoGuncelle();

// Wikipedia'dan şehir görseli çek (önce ülkeli arar, bulamazsa ülkesiz dener)
function wikiFotoBul(sehir, ulke, callback) {
    // Bir sayfa başlığının orijinal görselini çeken yardımcı
    function fotoCek(baslik, sonuc) {
        const url = "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*" +
                    "&prop=pageimages&piprop=original&titles=" + encodeURIComponent(baslik);
        fetch(url)
            .then(function(c) { return c.json(); })
            .then(function(d) {
                const sayfalar = d.query.pages;
                for (const id in sayfalar) {
                    if (sayfalar[id].original && sayfalar[id].original.source) {
                        sonuc(sayfalar[id].original.source);
                        return;
                    }
                }
                sonuc(null);
            })
            .catch(function() { sonuc(null); });
    }

    // Bir arama sorgusuyla en iyi sayfayı bulup fotosunu çeken yardımcı
    function aramaYap(sorgu, sonuc) {
        const url = "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*" +
                    "&list=search&srlimit=1&srsearch=" + encodeURIComponent(sorgu);
        fetch(url)
            .then(function(c) { return c.json(); })
            .then(function(d) {
                if (!d.query || !d.query.search || d.query.search.length === 0) {
                    sonuc(null);
                    return;
                }
                fotoCek(d.query.search[0].title, sonuc);
            })
            .catch(function() { sonuc(null); });
    }

    // 1. DENEME: şehir + ülke ile ara
    aramaYap(sehir + " " + ulke, function(foto) {
        if (foto) {
            callback(foto);
        } else {
            // 2. DENEME: sadece şehir adının kendi sayfasını dene
            fotoCek(sehir, function(foto2) {
                callback(foto2); // bulursa foto, bulamazsa null
            });
        }
    });
}

// ---- GİRİŞ / KAYIT SİSTEMİ ----

const girisEkran = document.getElementById("girisEkran");
const girisMesaj = document.getElementById("girisMesaj");

// KAYIT OL
document.getElementById("kayitBtn").addEventListener("click", async function() {
    const email = document.getElementById("girisEmail").value.trim();
    const sifre = document.getElementById("girisSifre").value.trim();
    if (!email || !sifre) {
        girisMesaj.textContent = "E-posta ve şifre gir.";
        return;
    }
    girisMesaj.style.color = "#1e2a3a";
    girisMesaj.textContent = "Kayıt yapılıyor...";

    const { data, error } = await db.auth.signUp({ email: email, password: sifre });

    if (error) {
        girisMesaj.style.color = "#c0392b";
        girisMesaj.textContent = "Hata: " + error.message;
    } else {
        girisMesaj.style.color = "#27ae60";
        girisMesaj.textContent = "Kayıt başarılı! E-postanı kontrol et, sonra giriş yap.";
    }
});

// GİRİŞ YAP
document.getElementById("girisBtn").addEventListener("click", async function() {
    const email = document.getElementById("girisEmail").value.trim();
    const sifre = document.getElementById("girisSifre").value.trim();
    if (!email || !sifre) {
        girisMesaj.textContent = "E-posta ve şifre gir.";
        return;
    }
    girisMesaj.style.color = "#1e2a3a";
    girisMesaj.textContent = "Giriş yapılıyor...";

    const { data, error } = await db.auth.signInWithPassword({ email: email, password: sifre });

    if (error) {
        girisMesaj.style.color = "#c0392b";
        girisMesaj.textContent = "Hata: " + error.message;
    } else {
        girisEkran.style.display = "none"; // giriş başarılı → ekranı kapat
        await gezileriYukleSupabase(); // Supabase'den veriyi çek
        await detaylariYukleSupabase(); // puan + notları çek
        await profilYukleSupabase(); // profili çek
    }
});

async function oturumKontrol() {
    const { data } = await db.auth.getSession();
    if (data.session) {
        girisEkran.style.display = "none";
        await gezileriYukleSupabase(); // Supabase'den veriyi çek
        await detaylariYukleSupabase();
        await profilYukleSupabase(); // profili çek
    } else {
        girisEkran.style.display = "flex";
    }
}
oturumKontrol();

// ÇIKIŞ YAP
document.getElementById("cikisBtn").addEventListener("click", async function() {
    await db.auth.signOut();
    location.reload(); // sayfayı yenile → giriş ekranı geri gelir
}); 

// Supabase'den kullanıcının gezdiği şehirleri çek
async function gezileriYukleSupabase() {
    const { data: oturum } = await db.auth.getSession();
    if (!oturum.session) return; // giriş yoksa bir şey yapma

    const kullanici = oturum.session.user.id;
    const { data, error } = await db.from("gezilenler")
        .select("ulke, sehir")
        .eq("user_id", kullanici);

    if (error) {
        console.log("Supabase okuma hatası:", error.message);
        return;
    }

    // Gelen veriyi gezilenler'e koy
    gezilenler = data.map(function(satir) {
        return { ulke: satir.ulke, sehir: satir.sehir };
    });

    // Haritayı ve sayaçları güncelle
    gezileriKaydet();
    istatistikGuncelle();
    gecmisGuncelle();
    kitaChartCiz();
    // Tüm gezilen ülkelerin rengini güncelle
    gezilenler.forEach(function(g) { ulkeRenkGuncelle(g.ulke); });
    // Pinleri ekle
    gezilenler.forEach(function(g) { pinEkle(g.ulke, g.sehir); });
}

// Supabase'den puan + notları çek
async function detaylariYukleSupabase() {
    const { data: oturum } = await db.auth.getSession();
    if (!oturum.session) return;

    const kullanici = oturum.session.user.id;
    const { data, error } = await db.from("sehir_detaylari")
        .select("ulke, sehir, puan, notlar")
        .eq("user_id", kullanici);

    if (error) {
        console.log("Detay okuma hatası:", error.message);
        return;
    }

    // Gelen veriyi sehirDetaylari'na koy
    data.forEach(function(satir) {
        const anahtar = satir.ulke + "|" + satir.sehir;
        const mevcut = sehirDetaylari[anahtar] || {};
        sehirDetaylari[anahtar] = {
            puan: satir.puan || 0,
            foto: mevcut.foto || "",   // foto localStorage'da kalıyor şimdilik
            not: satir.notlar || ""
        };
    });
    localStorage.setItem("sehirDetaylari", JSON.stringify(sehirDetaylari));
}

// Supabase'den profili çek
async function profilYukleSupabase() {
    const { data: oturum } = await db.auth.getSession();
    if (!oturum.session) return;

    const kullanici = oturum.session.user.id;
    const { data, error } = await db.from("profil")
        .select("isim, konum")
        .eq("user_id", kullanici)
        .maybeSingle();

    if (error) {
        console.log("Profil okuma hatası:", error.message);
        return;
    }
    if (!data) return; // profil henüz yok

    profilVeri.isim = data.isim || "";
    profilVeri.konum = data.konum || "";
    localStorage.setItem("profilVeri", JSON.stringify(profilVeri));
    profilButonFotoGuncelle();
}

// ---- CANLI ARAMA ----

const aramaKutu = document.getElementById("aramaKutu");
const aramaInput = document.getElementById("aramaInput");
const aramaSonuc = document.getElementById("aramaSonuc");

document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        const detay = document.getElementById("sehirDetayPanel");
        const panel = document.getElementById("panel");
        const profil = document.getElementById("profilKart");
        const istat = document.getElementById("istatistikPanel");
        if (detay.classList.contains("acik")) {
            sehirDetayKapat();
        } else if (panel.classList.contains("acik")) {
            paneliKapat();
        }
        if (profil.classList.contains("acik")) {
            profilKapat();
        }
        if (istat.classList.contains("acik")) {
            istatistikPaneliKapat();
        }
    }
});

// Yazdıkça filtrele
aramaInput.addEventListener("input", function() {
    const metin = aramaInput.value.trim().toLowerCase();
    aramaSonuc.innerHTML = "";
    if (metin.length === 0) return;

    const sonuclar = [];

    // Ülkeleri ara
    for (const ulke in sehirVerisi) {
        if (ulke.toLowerCase().startsWith(metin)) {
            sonuclar.push({ tip: "ülke", ulke: ulke, ad: ulke });
        }
        // Şehirleri ara
        sehirVerisi[ulke].forEach(function(s) {
            if (s.ad.toLowerCase().startsWith(metin)) {
                sonuclar.push({ tip: "şehir", ulke: ulke, ad: s.ad });
            }
        });
    }

    // İlk 8 sonucu göster
    sonuclar.slice(0, 8).forEach(function(r) {
        const satir = document.createElement("div");
        satir.className = "arama-sonuc-satir";
        satir.innerHTML = r.ad + "<span class='tur'>" + r.tip + (r.tip === "şehir" ? " · " + r.ulke : "") + "</span>";
        satir.addEventListener("click", function() {
            aramaSec(r);
        });
        aramaSonuc.appendChild(satir);
    });
});

// Sonuca tıklayınca
function aramaSec(r) {
    aramaKapat();
    panelAc(r.ulke); // o ülkenin şehir panelini aç
}

function aramaKapat() {
    aramaKutu.style.display = "none";
    aramaInput.value = "";
    aramaSonuc.innerHTML = "";
    
}

document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        const panel = document.getElementById("panel");
        const profil = document.getElementById("profilKart");
        const istat = document.getElementById("istatistikPanel");
        if (panel.classList.contains("acik")) {
            paneliKapat();
        }
        if (profil.classList.contains("acik")) {
            profilKapat();
        }
        if (istat.classList.contains("acik")) {
            istatistikPaneliKapat();
        }
    }
});

// Profil içindeki Çıkış butonu
document.getElementById("profilCikis").addEventListener("click", async function() {
    await db.auth.signOut();
    location.reload();
});

// Profil içindeki Haritayı Sıfırla butonu
document.getElementById("profilSifirla").addEventListener("click", function() {
    document.getElementById("sifirlaBtn").click(); // eski sıfırlama işlevini tetikle
});