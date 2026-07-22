(function () {
  const collections = [
    {
      match: "Turkey",
      title: "🇹🇷 Turkey Tourist Places",
      intro: "Istanbul icons, Cappadocia skies, Mediterranean coastlines and ancient landmarks.",
      places: [
        { name: "Istanbul", place: "Hagia Sophia & Bosphorus", image: "assets/images/turkey/istanbul.webp", tag: "Historic skyline" },
        { name: "Cappadocia", place: "Fairy Chimneys & Balloons", image: "assets/images/turkey/cappadocia.webp", tag: "Sunrise landscape" },
        { name: "Antalya", place: "Kaleiçi & Old Harbour", image: "assets/images/turkey/antalya.webp", tag: "Mediterranean coast" },
        { name: "Pamukkale", place: "White Travertine Terraces", image: "assets/images/turkey/pamukkale.webp", tag: "Natural wonder" },
        { name: "Ephesus", place: "Library of Celsus", image: "assets/images/turkey/ephesus.webp", tag: "Ancient city" },
        { name: "Ölüdeniz", place: "Blue Lagoon", image: "assets/images/turkey/oludeniz.webp", tag: "Turquoise coast" }
      ]
    },
    {
      match: "France",
      title: "🇫🇷 Paris Tourist Places",
      intro: "Two unmistakable Paris landmarks, from the Seine skyline to the Louvre courtyard.",
      places: [
        { name: "Eiffel Tower", place: "Seine & Trocadéro View", image: "assets/images/paris/eiffel-tower.webp", tag: "Paris icon" },
        { name: "Louvre Museum", place: "Palace Courtyard & Glass Pyramid", image: "assets/images/paris/louvre-museum.webp", tag: "Art and architecture" }
      ]
    },
    {
      match: "Belgium",
      title: "🇧🇪 Brussels Tourist Places",
      intro: "Brussels architecture at its most memorable, from the historic centre to a modern city symbol.",
      places: [
        { name: "Grand-Place", place: "Historic Guildhall Square", image: "assets/images/brussels/grand-place.webp", tag: "Historic centre" },
        { name: "Atomium", place: "Heysel Landmark", image: "assets/images/brussels/atomium.webp", tag: "Modern landmark" }
      ]
    },
    {
      match: "Netherlands",
      title: "🇳🇱 Amsterdam Tourist Places",
      intro: "Classic Amsterdam views through its canal ring, bridges, museums and cycling streets.",
      places: [
        { name: "Canal Ring", place: "Canal Houses, Bridges & Bicycles", image: "assets/images/amsterdam/canal-ring.webp", tag: "City atmosphere" },
        { name: "Rijksmuseum", place: "Museumplein", image: "assets/images/amsterdam/rijksmuseum.webp", tag: "Culture and history" }
      ]
    },
    {
      match: "Poland",
      title: "🇵🇱 Poland Tourist Places",
      intro: "Historic Krakow streets and the mountain character of Zakopane from the planned Poland route.",
      places: [
        { name: "Krakow Old Town", place: "Rynek Główny & St Mary's Basilica", image: "assets/images/poland/krakow-old-town.webp", tag: "Historic centre" },
        { name: "Zakopane", place: "Town & Tatra Mountains", image: "assets/images/poland/zakopane-tatras.webp", tag: "Mountain escape" }
      ]
    },
    {
      match: "Czechia",
      title: "🇨🇿 Czechia Tourist Places",
      intro: "Prague's best-known river crossing and its hilltop castle skyline.",
      places: [
        { name: "Charles Bridge", place: "Vltava River, Prague", image: "assets/images/czechia/charles-bridge.webp", tag: "Prague icon" },
        { name: "Prague Castle", place: "Castle District & St Vitus Cathedral", image: "assets/images/czechia/prague-castle.webp", tag: "Historic skyline" }
      ]
    },
    {
      match: "Austria",
      title: "🇦🇹 Austria Tourist Places",
      intro: "Imperial Vienna through a grand palace and the cathedral at the heart of the old city.",
      places: [
        { name: "Schönbrunn Palace", place: "Palace & Gardens, Vienna", image: "assets/images/austria/schonbrunn-palace.webp", tag: "Imperial landmark" },
        { name: "St Stephen's Cathedral", place: "Stephansplatz, Vienna", image: "assets/images/austria/st-stephens-cathedral.webp", tag: "City centre icon" }
      ]
    },
    {
      match: "Slovakia",
      title: "🇸🇰 Slovakia Tourist Places",
      intro: "Two distinctive Bratislava landmarks, from the Danube hilltop to a blue Art Nouveau church.",
      places: [
        { name: "Bratislava Castle", place: "Castle Hill & Danube View", image: "assets/images/slovakia/bratislava-castle.webp", tag: "Capital viewpoint" },
        { name: "Blue Church", place: "Church of St Elizabeth, Bratislava", image: "assets/images/slovakia/blue-church.webp", tag: "Art Nouveau" }
      ]
    },
    {
      match: "Hungary",
      title: "🇭🇺 Hungary Tourist Places",
      intro: "Budapest on both sides of the Danube, framed by Parliament and the Castle District.",
      places: [
        { name: "Hungarian Parliament", place: "Danube Riverfront, Budapest", image: "assets/images/hungary/hungarian-parliament.webp", tag: "Danube landmark" },
        { name: "Fisherman's Bastion", place: "Buda Castle District", image: "assets/images/hungary/fishermans-bastion.webp", tag: "Panoramic viewpoint" }
      ]
    },
    {
      match: "Slovenia",
      title: "🇸🇮 Slovenia Tourist Places",
      intro: "Ljubljana's riverside heart and the hilltop castle above its green historic centre.",
      places: [
        { name: "Triple Bridge", place: "Prešeren Square, Ljubljana", image: "assets/images/slovenia/triple-bridge.webp", tag: "Riverside centre" },
        { name: "Ljubljana Castle", place: "Castle Hill & City View", image: "assets/images/slovenia/ljubljana-castle.webp", tag: "Hilltop landmark" }
      ]
    },
    {
      match: "Italy",
      title: "🇮🇹 Italy Tourist Places",
      intro: "Two defining Italian landmarks from the Gothic heart of Milan to the ancient centre of Rome.",
      places: [
        { name: "Milan Cathedral", place: "Duomo di Milano & Piazza del Duomo", image: "assets/images/italy/milan-duomo.webp", tag: "Gothic landmark" },
        { name: "Colosseum", place: "Ancient Rome", image: "assets/images/italy/rome-colosseum.webp", tag: "Historic icon" }
      ]
    },
    {
      match: "Switzerland",
      title: "🇨🇭 Switzerland Tourist Places",
      intro: "Waterfalls, alpine villages and high-mountain views from the Jungfrau region.",
      places: [
        { name: "Lauterbrunnen", place: "Valley Village & Staubbach Falls", image: "assets/images/switzerland/lauterbrunnen.webp", tag: "Alpine valley" },
        { name: "Grindelwald First", place: "First Cliff Walk & Bernese Alps", image: "assets/images/switzerland/grindelwald-first.webp", tag: "Mountain adventure" }
      ]
    },
    {
      match: "Spain",
      title: "🇪🇸 Spain Tourist Places",
      intro: "Barcelona architecture and Mallorca waterfront scenery from the planned Spanish route.",
      places: [
        { name: "Sagrada Família", place: "Barcelona", image: "assets/images/spain/sagrada-familia.webp", tag: "Barcelona icon" },
        { name: "Palma Cathedral", place: "Parc de la Mar, Mallorca", image: "assets/images/spain/palma-cathedral.webp", tag: "Island landmark" }
      ]
    },
    {
      match: "Sweden",
      title: "🇸🇪 Sweden Tourist Places",
      intro: "Stockholm's colourful Old Town, royal architecture and waterfront character.",
      places: [
        { name: "Gamla Stan", place: "Stortorget & Historic Old Town", image: "assets/images/sweden/gamla-stan.webp", tag: "Old Town" },
        { name: "Royal Palace", place: "Stockholm Waterfront", image: "assets/images/sweden/royal-palace.webp", tag: "Royal landmark" }
      ]
    }
  ];

  const sections = Array.from(document.querySelectorAll(".media-country"));
  if (!sections.length) return;

  const pageIntro = document.querySelector(".page-head p");
  if (pageIntro) {
    pageIntro.textContent = "Explore 14 featured tourist-place collections across Turkey, Western Europe, Central Europe, Southern Europe and Sweden.";
  }

  collections.forEach((collection) => {
    const section = sections.find((item) => item.querySelector("h3")?.textContent.includes(collection.match));
    if (!section) return;

    section.classList.add("tour-media-showcase");
    section.innerHTML = `
      <div class="media-section-head">
        <div>
          <span class="media-kicker">Featured collection</span>
          <h2>${collection.title}</h2>
          <p>${collection.intro}</p>
        </div>
        <span class="media-count">${collection.places.length} places</span>
      </div>
      <div class="tour-gallery${collection.places.length === 2 ? " tour-gallery-compact" : ""}">
        ${collection.places.map((place, index) => `
          <article class="tour-photo-card${collection.places.length > 2 && index === 0 ? " tour-photo-featured" : ""}">
            <img src="${place.image}" alt="AI travel artwork inspired by ${place.place} in ${place.name}" loading="${index === 0 ? "eager" : "lazy"}">
            <div class="tour-photo-shade"></div>
            <div class="tour-photo-copy">
              <span>${place.tag}</span>
              <h3>${place.name}</h3>
              <p>${place.place}</p>
            </div>
          </article>
        `).join("")}
      </div>
      <p class="media-art-note">AI-created travel artwork for trip inspiration.</p>
    `;
  });
})();
