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
    "French Guiana": "Güney Amerika"
};



// Kıta başına toplam ülke sayısı (dünyadaki, kabaca)
const kitaToplam = {
    "Avrupa": 44, "Asya": 48, "Afrika": 54,
    "Kuzey Amerika": 23, "Güney Amerika": 14, "Okyanusya": 16
};

// Kıta renkleri
const kitaRenk = {
    "Avrupa": "#E67E22", "Asya": "#3498DB", "Afrika": "#F1C40F",
    "Kuzey Amerika": "#2ECC71", "Güney Amerika": "#9B59B6", "Okyanusya": "#1ABC9C"
};
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
    ]    ,
    "Slovakia": [
        { ad: "Bratislava", foto: "https://images.unsplash.com/photo-1568792923760-d70635a89fdc?w=400", aciklama: "Tuna kıyısında şirin başkent." },
        { ad: "Košice", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Doğunun tarihi şehri." },
        { ad: "Žilina", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Kuzeyin sanayi ve kültür merkezi." },
        { ad: "Poprad", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Yüksek Tatra dağlarının kapısı." }
    ],
    "Slovenia": [
        { ad: "Ljubljana", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Ejderha köprülü yeşil başkent." },
        { ad: "Bled", foto: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400", aciklama: "Göl ortasında kilise, masalsı." },
        { ad: "Maribor", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Dünyanın en yaşlı asmasının şehri." },
        { ad: "Piran", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Adriyatik'te Venedik havalı kasaba." }
    ],
        "Bosnia and Herzegovina": [
        { ad: "Saraybosna", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Doğu-Batı kültürünün buluştuğu başkent." },
        { ad: "Mostar", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Ünlü eski köprüsüyle tanınır." },
        { ad: "Banja Luka", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Yeşil, nehir kıyısı şehir." },
        { ad: "Tuzla", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Tuz gölleriyle ünlü şehir." }
    ],
    "Albania": [
        { ad: "Tiran", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Renkli binalarıyla canlanan başkent." },
        { ad: "Sarande", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "İyon sahilinin tatil şehri." },
        { ad: "Berat", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Bin pencereli şehir, UNESCO." },
        { ad: "Shkoder", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Göl kıyısında kültür şehri." }
    ],
    "Macedonia": [
        { ad: "Üsküp", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Vardar nehri ve heykeller şehri." },
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
        { ad: "Priştine", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Genç nüfuslu canlı başkent." },
        { ad: "Prizren", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Osmanlı mirası tarihi şehir." },
        { ad: "Peja", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Dağların eteğinde, manastırlar." },
        { ad: "Gjakova", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Eski çarşısıyla ünlü." }
    ],
    "Lithuania": [
        { ad: "Vilnius", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Barok mimarili tarihi başkent." },
        { ad: "Kaunas", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Savaşlar arası mimari şehri." },
        { ad: "Klaipeda", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Baltık liman şehri." },
        { ad: "Šiauliai", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Haçlar Tepesi'nin şehri." }
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
        { ad: "Pärnu", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Yazlık başkent, plajlar." },
        { ad: "Narva", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Rusya sınırında kaleli şehir." }
    ],
    "Belarus": [
        { ad: "Minsk", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Geniş bulvarlı Sovyet mimarisi." },
        { ad: "Brest", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Ünlü kalesiyle sınır şehri." },
        { ad: "Grodno", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Tarihi merkezi korunmuş şehir." },
        { ad: "Vitebsk", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Chagall'ın doğduğu şehir." }
    ],
    "Moldova": [
        { ad: "Kişinev", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Yeşil parklı sakin başkent." },
        { ad: "Tiraspol", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Transdinyester bölgesinin merkezi." },
        { ad: "Bălți", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Kuzeyin başkenti denen şehir." },
        { ad: "Orhei", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Eski manastırlarıyla ünlü." }
    ],
    "Luxembourg": [
        { ad: "Lüksemburg", foto: "https://images.unsplash.com/photo-1591622180787-1e2b1e1e1e1e?w=400", aciklama: "Vadiler üstünde kaleli başkent." }
    ],
    "Cyprus": [
        { ad: "Lefkoşa", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Bölünmüş son başkent." },
        { ad: "Limasol", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Sahil ve gece hayatı." },
        { ad: "Baf", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Antik mozaikler, Afrodit efsanesi." },
        { ad: "Larnaka", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Palmiyeli sahil şehri." }
    ]    ,
    "Brazil": [
        { ad: "Rio de Janeiro", foto: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400", aciklama: "Kristo heykeli ve Copacabana." },
        { ad: "São Paulo", foto: "https://images.unsplash.com/photo-1541609309631-0a1a1a1a1a1a?w=400", aciklama: "Latin Amerika'nın dev metropolü." },
        { ad: "Salvador", foto: "https://images.unsplash.com/photo-1591634616938-1dfa7ee2e617?w=400", aciklama: "Afro-Brezilya kültürünün kalbi." },
        { ad: "Brasília", foto: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400", aciklama: "Modern mimarili planlı başkent." }
    ],
    "Argentina": [
        { ad: "Buenos Aires", foto: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=400", aciklama: "Tango ve Avrupa havalı başkent." },
        { ad: "Córdoba", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Kolonyal mimarili üniversite şehri." },
        { ad: "Mendoza", foto: "https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=400", aciklama: "And Dağları eteğinde şarap bölgesi." },
        { ad: "Bariloche", foto: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=400", aciklama: "Göller ve kayak, İsviçre havası." }
    ],
    "Chile": [
        { ad: "Santiago", foto: "https://images.unsplash.com/photo-1478827387698-1527781a4887?w=400", aciklama: "And Dağları'nın gölgesinde başkent." },
        { ad: "Valparaíso", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Renkli tepe evleri, liman şehri." },
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
        { ad: "Bogotá", foto: "https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=400", aciklama: "Dağların üstünde yüksek başkent." },
        { ad: "Cartagena", foto: "https://images.unsplash.com/photo-1583531352515-8c0e9d1a4b5d?w=400", aciklama: "Karayip kıyısında surlu kolonyal şehir." },
        { ad: "Medellín", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Ebedi bahar şehri." },
        { ad: "Cali", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Salsa'nın dünya başkenti." }
    ],
    "Venezuela": [
        { ad: "Caracas", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Dağ eteğinde canlı başkent." },
        { ad: "Maracaibo", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Petrol ve göl şehri." },
        { ad: "Mérida", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "And Dağları'nda üniversite şehri." },
        { ad: "Valencia", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Sanayi merkezi." }
    ],
    "Ecuador": [
        { ad: "Quito", foto: "https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=400", aciklama: "Ekvator çizgisindeki başkent." },
        { ad: "Guayaquil", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Büyük liman şehri." },
        { ad: "Cuenca", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Kolonyal mimarili UNESCO şehri." },
        { ad: "Galápagos", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Eşsiz doğa yaşamının adaları." }
    ],
    "Bolivia": [
        { ad: "La Paz", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Dünyanın en yüksek başkenti." },
        { ad: "Uyuni", foto: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400", aciklama: "Dünyanın en büyük tuz gölü." },
        { ad: "Sucre", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Beyaz şehir, anayasal başkent." },
        { ad: "Santa Cruz", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Ovadaki büyük ticaret şehri." }
    ],
    "Paraguay": [
        { ad: "Asunción", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Nehir kıyısında tarihi başkent." },
        { ad: "Ciudad del Este", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Sınır ticaret şehri, Iguazú yakını." },
        { ad: "Encarnación", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Plajları ve karnavalıyla ünlü." },
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
        { ad: "New York", foto: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400", aciklama: "Özgürlük Heykeli ve gökdelenler." },
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
        { ad: "Cancún", foto: "https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=400", aciklama: "Karayip'in turkuaz plajları." },
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
        { ad: "Colón", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Kanalın Karayip ucu." }
    ],
    "Costa Rica": [
        { ad: "San José", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Yeşil ülkenin başkenti." },
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
        { ad: "Brisbane", foto: "https://images.unsplash.com/photo-1566734904496-9309bb1798 ae?w=400", aciklama: "Güneşli nehir şehri." },
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
        { ad: "Pekin", foto: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400", aciklama: "Yasak Şehir ve Çin Seddi'nin kapısı." },
        { ad: "Şanghay", foto: "https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=400", aciklama: "Fütüristik silüetli dev metropol." },
        { ad: "Xi'an", foto: "https://images.unsplash.com/photo-1591껼?w=400", aciklama: "Terracotta askerlerinin şehri." },
        { ad: "Guilin", foto: "https://images.unsplash.com/photo-1537531383496-f4749b8032cf?w=400", aciklama: "Masalsı karst dağları." }
    ],
    "Japan": [
        { ad: "Tokyo", foto: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400", aciklama: "Gelenek ve teknolojinin metropolü." },
        { ad: "Kyoto", foto: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400", aciklama: "Tapınaklar ve geyşa mahalleleri." },
        { ad: "Osaka", foto: "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=400", aciklama: "Sokak lezzetlerinin başkenti." },
        { ad: "Hiroşima", foto: "https://images.unsplash.com/photo-1595253958-9a3f1f1a0f1a?w=400", aciklama: "Barış anıtı ve yeniden doğuş." }
    ],
    "India": [
        { ad: "Yeni Delhi", foto: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400", aciklama: "Tarih ve kaosun buluştuğu başkent." },
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
        { ad: "Ho Chi Minh", foto: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400", aciklama: "Enerjik güney metropolü." },
        { ad: "Ha Long", foto: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400", aciklama: "Zümrüt suda kireçtaşı adalar." },
        { ad: "Hoi An", foto: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=400", aciklama: "Fenerlerle aydınlanan eski şehir." }
    ],
    "South Korea": [
        { ad: "Seul", foto: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=400", aciklama: "K-pop ve saraylar, modern başkent." },
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
        { ad: "Riyad", foto: "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=400", aciklama: "Çölün ortasında modern başkent." },
        { ad: "Cidde", foto: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400", aciklama: "Kızıldeniz kıyısı, Mekke kapısı." },
        { ad: "Mekke", foto: "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=400", aciklama: "İslam'ın kutsal şehri." },
        { ad: "Medine", foto: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400", aciklama: "Peygamber şehri." }
    ],
    "United Arab Emirates": [
        { ad: "Dubai", foto: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400", aciklama: "Gökdelenler ve lüksün şehri." },
        { ad: "Abu Dhabi", foto: "https://images.unsplash.com/photo-1551041777-ed277b8dd348?w=400", aciklama: "Büyük camii ve başkent." },
        { ad: "Sharjah", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Kültür ve sanat emirliği." },
        { ad: "Al Ain", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Vahalar şehri." }
    ],
    "Iran": [
        { ad: "Tahran", foto: "https://images.unsplash.com/photo-1592066575517-58df903152f2?w=400", aciklama: "Dağ eteğinde büyük başkent." },
        { ad: "İsfahan", foto: "https://images.unsplash.com/photo-1560177776-419c8e1c1a8e?w=400", aciklama: "Mavi çinili camiler, meydan." },
        { ad: "Şiraz", foto: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400", aciklama: "Şiir ve bahçeler şehri." },
        { ad: "Yezd", foto: "https://images.unsplash.com/photo-1610642372651-fe6e7bc209ee?w=400", aciklama: "Çöl ortasında kerpiç şehir." }
    ],
    "Israel": [
        { ad: "Kudüs", foto: "https://images.unsplash.com/photo-1544971587-b4c2e9d81ecd?w=400", aciklama: "Üç dinin kutsal şehri." },
        { ad: "Tel Aviv", foto: "https://images.unsplash.com/photo-1552423314-cf29ab68ad73?w=400", aciklama: "Sahil ve gece hayatı." },
        { ad: "Hayfa", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Bahai bahçeleri, liman." },
        { ad: "Nasıra", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Tarihi dini merkez." }
    ],
    "Jordan": [
        { ad: "Amman", foto: "https://images.unsplash.com/photo-1580834341580-8c17a3a630ca?w=400", aciklama: "Tepeler üstünde beyaz başkent." },
        { ad: "Petra", foto: "https://images.unsplash.com/photo-1563177978-4c5ebd66e6cb?w=400", aciklama: "Kayaya oyulmuş antik şehir." },
        { ad: "Wadi Rum", foto: "https://images.unsplash.com/photo-1548786811-dd6e453ccf40?w=400", aciklama: "Kızıl çöl vadisi." },
        { ad: "Akabe", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Kızıldeniz dalış kasabası." }
    ],
    "Kazakhstan": [
        { ad: "Almatı", foto: "https://images.unsplash.com/photo-1596395819057-e37f0e0a1a1a?w=400", aciklama: "Dağ eteğinde eski başkent." },
        { ad: "Astana", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Fütüristik yeni başkent." },
        { ad: "Şımkent", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Güneyin büyük şehri." },
        { ad: "Türkistan", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Yesevi türbesi, manevi merkez." }
    ],
    "Uzbekistan": [
        { ad: "Taşkent", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "İpek Yolu'nun modern başkenti." },
        { ad: "Semerkant", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Registan ve mavi kubbeler." },
        { ad: "Buhara", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Açık hava müzesi, kutsal şehir." },
        { ad: "Hive", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Surlarla çevrili çöl şehri." }
    ],
    "Pakistan": [
        { ad: "İslamabad", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Planlı yeşil başkent." },
        { ad: "Lahor", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Kültür ve Babür mirası şehri." },
        { ad: "Karaçi", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Deniz kıyısında dev metropol." },
        { ad: "Multan", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Türbeler şehri." }
    ],
    "Iraq": [
        { ad: "Bağdat", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Dicle kıyısında tarihi başkent." },
        { ad: "Basra", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Güneyin liman şehri." },
        { ad: "Musul", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Kuzeyin tarihi şehri." },
        { ad: "Erbil", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Antik kalesiyle ünlü şehir." }
    ],
    "Syria": [
        { ad: "Şam", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Dünyanın en eski başkentlerinden." },
        { ad: "Halep", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Tarihi çarşısıyla ünlü şehir." },
        { ad: "Humus", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Orta Suriye'nin merkezi." },
        { ad: "Lazkiye", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Akdeniz liman şehri." }
    ]    ,
    "Lebanon": [
        { ad: "Beyrut", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Akdeniz kıyısında canlı başkent." },
        { ad: "Baalbek", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Devasa Roma tapınakları." },
        { ad: "Byblos", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Dünyanın en eski limanlarından." },
        { ad: "Sayda", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Tarihi liman kasabası." }
    ],
    "Azerbaijan": [
        { ad: "Bakü", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Hazar kıyısında modern başkent." },
        { ad: "Gence", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "İkinci büyük tarihi şehir." },
        { ad: "Şeki", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Han sarayı ve el sanatları." },
        { ad: "Gabala", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Dağ eteğinde tatil bölgesi." }
    ],
    "Kuwait": [
        { ad: "Kuveyt", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Körfez kıyısında modern başkent." },
        { ad: "Hawalli", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Kalabalık şehir bölgesi." },
        { ad: "Al Ahmadi", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Petrol sanayi şehri." },
        { ad: "Fahaheel", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Sahil ve alışveriş bölgesi." }
    ],
    "Qatar": [
        { ad: "Doha", foto: "https://images.unsplash.com/photo-1559386081-325882507af7?w=400", aciklama: "Gökdelenler ve müzeler başkenti." },
        { ad: "Al Wakrah", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Eski balıkçı kasabası." },
        { ad: "Al Khor", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Kuzeydeki sahil şehri." },
        { ad: "Lusail", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Sıfırdan kurulan modern şehir." }
    ],
    "Oman": [
        { ad: "Maskat", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Dağ ve deniz arasında başkent." },
        { ad: "Nizwa", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Kale ve geleneksel çarşı." },
        { ad: "Salalah", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Muson yeşili güney şehri." },
        { ad: "Sur", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Geleneksel tekne yapım şehri." }
    ],
    "Yemen": [
        { ad: "Sana", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Kerpiç kuleleriyle antik başkent." },
        { ad: "Aden", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Volkanik kraterde liman şehri." },
        { ad: "Taiz", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Dağ eteğinde kültür şehri." },
        { ad: "Sokotra", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Eşsiz bitki örtülü ada." }
    ],
    "Tajikistan": [
        { ad: "Duşanbe", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Dağlar arasında sakin başkent." },
        { ad: "Hocend", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "İpek Yolu üstünde eski şehir." },
        { ad: "Kulob", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Güneyin tarihi şehri." },
        { ad: "Pamir", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Dünyanın çatısı denen dağlar." }
    ],
    "Kyrgyzstan": [
        { ad: "Bişkek", foto: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400", aciklama: "Dağ eteğinde yeşil başkent." },
        { ad: "Oş", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Güneyin kadim çarşı şehri." },
        { ad: "Karakol", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Issık Göl ve dağ yürüyüşleri." },
        { ad: "Issık Göl", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Dağlar arasında dev sıcak göl." }
    ],
    "Nepal": [
        { ad: "Katmandu", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Tapınaklarla dolu Himalaya başkenti." },
        { ad: "Pokhara", foto: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400", aciklama: "Göl ve Annapurna manzarası." },
        { ad: "Everest", foto: "https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=400", aciklama: "Dünyanın çatısına tırmanış kapısı." },
        { ad: "Lumbini", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Buda'nın doğduğu yer." }
    ],
    "Bangladesh": [
        { ad: "Dakka", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Nehirler arasında kalabalık başkent." },
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
        { ad: "Malakka", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Kolonyal tarihli UNESCO şehri." },
        { ad: "Borneo", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Yağmur ormanı ve orangutanlar." }
    ],
    "Brunei": [
        { ad: "Bandar Seri Begawan", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Altın camili zengin başkent." },
        { ad: "Kampong Ayer", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Su üstünde kurulu köy." },
        { ad: "Kuala Belait", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Petrol sanayi şehri." },
        { ad: "Tutong", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Nehir ve sahil bölgesi." }
    ],
    "Sri Lanka": [
        { ad: "Kolombo", foto: "https://images.unsplash.com/photo-1546975554-31053113e977?w=400", aciklama: "Sahil kıyısında canlı başkent." },
        { ad: "Kandy", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Diş Tapınağı ve göl." },
        { ad: "Galle", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Kolonyal surlu liman şehri." },
        { ad: "Sigiriya", foto: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400", aciklama: "Kaya üstünde antik saray." }
    ],
    "Mongolia": [
        { ad: "Ulan Batur", foto: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400", aciklama: "Bozkırda dünyanın en soğuk başkenti." },
        { ad: "Erdenet", foto: "https://images.unsplash.com/photo-1580996378027-23040f16f0c9?w=400", aciklama: "Madencilik şehri." },
        { ad: "Karakurum", foto: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400", aciklama: "Cengiz Han'ın eski başkenti." },
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
    ]
};

let gezilenler = JSON.parse(localStorage.getItem("gezilenler")) || [];

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
document.getElementById("ortu").addEventListener("click", function() {
    paneliKapat();
    istatistikPaneliKapat();
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
    document.getElementById("ortu").classList.add("acik");
}

function istatistikPaneliKapat() {
    document.getElementById("istatistikPanel").classList.remove("acik");
    document.getElementById("ortu").classList.remove("acik");
}

document.getElementById("kitaChart").addEventListener("click", istatistikPaneliAc);
document.getElementById("istatistikKapat").addEventListener("click", istatistikPaneliKapat);


document.getElementById("sifirlaBtn").addEventListener("click", function() {
    if (confirm("Emin misin? Tüm gezdiğin yerler silinecek ve harita ilk haline dönecek.")) {
        gezilenler = [];
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

