import { Circuit } from "./types";

export const CIRCUITS: Circuit[] = [
  {
    id: "1",
    name: "Tour de Corse (7 Jours)",
    duration: "7 Jours",
    priceOnRequest: true,
    category: "croisiere",
    description: "Une odyssée complète autour de l'Île de Beauté, de Bonifacio à Bastia.",
    longDescription: "Embarquez pour une croisière inoubliable de 7 jours. Ce périple vous fera découvrir les joyaux de la Corse : les falaises de Bonifacio, les calanques de Piana, le village mythique de Girolata, la citadelle de Calvi, le Cap Corse et les plages célèbres de Porto-Vecchio.",
    image: "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/WhatsApp%20Image%202026-04-20%20at%2020.01.37.jpeg",
    itinerary: [
      "Jour 1 : Bonifacio - Roccapina – Campomoro – Porto Pollo. Baignade à Arbitru et Roccapina (le Lion). Nuit recommandée à Porto-Pollo.",
      "Jour 2 : Ajaccio – Calanques de Piana. Escale ravitaillement à Ajaccio. Traversée spectaculaire des calanques de Piana (UNESCO).",
      "Jour 3 : Girolata. Direction le village de Girolata, accessible uniquement par mer. Mouillage sauvage et authentique.",
      "Jour 4 : Calvi – Île-Rousse. Escale à Calvi (citadelle et vie animée) puis cap sur l'Île-Rousse.",
      "Jour 5 : Saint Florent – Bastia. Passage par le désert des Agriates et Saint-Florent. Nuit au port historique de Bastia.",
      "Jour 6 : Solenzara – Fautea - Porto-Vecchio. Descente vers Solenzara et la tour de Fautea. Escale festive à Porto-Vecchio.",
      "Jour 7 : Îles Lavezzi & Cavallo. Eaux turquoises des Lavezzi et Cavallo. Snorkeling avant le retour à Bonifacio."
    ],
    locations: ["Bonifacio", "Roccapina", "Ajaccio", "Piana", "Girolata", "Calvi", "Bastia", "Porto-Vecchio", "Lavezzi"],
    practicalInfos: [
      "Capacité : 4 personnes + skipper (+1 personnel sur demande)",
      "Carburant et skipper inclus",
      "Équipement de snorkeling fourni",
      "Cuisine équipée, climatisation, TV à bord"
    ],
    coordinates: [
      { lat: 41.3875, lng: 9.1561 },
      { lat: 41.5000, lng: 8.8000 },
      { lat: 41.9267, lng: 8.7369 },
      { lat: 42.2500, lng: 8.6000 },
      { lat: 42.3500, lng: 8.6100 },
      { lat: 42.5667, lng: 8.7572 },
      { lat: 42.6833, lng: 9.3000 },
      { lat: 42.7000, lng: 9.4500 },
      { lat: 41.5911, lng: 9.2786 }
    ],
    exclusiveBoat: "prestige"
  },
  {
    id: "2",
    name: "Sardaigne & La Maddalena",
    duration: "Journée / Croisière",
    price: 2500,
    category: "circuit",
    description: "Explorez l'archipel de la Maddalena et les côtes sauvages de la Sardaigne.",
    longDescription: "Une escapade internationale au départ de Bonifacio. Découvrez les eaux cristallines de l'archipel de la Maddalena, ses îles préservées et ses plages de sable fin. Un dépaysement total à seulement quelques milles nautiques.",
    image: "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-02-19-14-06-10%206.jpg",
    itinerary: [
      "Départ de Bonifacio",
      "Traversée des Bouches de Bonifacio",
      "Archipel de la Maddalena",
      "Île de Budelli (Plage Rose)",
      "Spargi et Santa Maria",
      "Retour Bonifacio"
    ],
    locations: ["Bonifacio", "La Maddalena", "Budelli", "Spargi", "Santa Maria"],
    practicalInfos: [
      "Passeport ou CNI valide requis",
      "Skipper inclus",
      "Boissons fraîches à bord",
      "Tarif variable selon saison"
    ],
    coordinates: [
      { lat: 41.3875, lng: 9.1561 },
      { lat: 41.2167, lng: 9.4000 }
    ],
    boatImages: {
      prestige: [
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-33.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%2014.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%2016.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%2017.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%202.jpg"
      ],
      pardo: [
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-02-19-14-06-09%2011.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-02-19-14-06-09%2013.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-02-19-14-06-09%2015.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-02-19-14-06-09.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-02-19-14-06-10%203.jpg"
      ]
    }
  },
  {
    id: "3",
    name: "Bonifacio & Îles Lavezzi",
    duration: "Journée",
    price: 1800,
    category: "circuit",
    description: "Le grand classique : les falaises de Bonifacio et le lagon des Lavezzi.",
    longDescription: "Découvrez Bonifacio comme vous ne l'avez jamais vue, depuis la mer. Admirez les falaises de calcaire blanc, les grottes marines, puis plongez dans l'aquarium naturel des îles Lavezzi. Un incontournable de la région.",
    image: "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-02-19-14-06-09%208.jpg",
    itinerary: [
      "Sortie du port de Bonifacio",
      "Grottes de Sdragonato et Saint-Antoine",
      "Falaises et Grain de Sable",
      "Escale aux Îles Lavezzi",
      "Île de Cavallo",
      "Retour Bonifacio"
    ],
    locations: ["Bonifacio", "Grottes", "Falaises", "Lavezzi", "Cavallo"],
    practicalInfos: [
      "Idéal pour le snorkeling",
      "Skipper inclus",
      "Départ 10h - Retour 18h",
      "Privatisation totale"
    ],
    coordinates: [
      { lat: 41.3875, lng: 9.1561 },
      { lat: 41.3400, lng: 9.2500 }
    ],
    boatImages: {
      prestige: [
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-33.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%2014.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%2016.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%2017.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%202.jpg"
      ],
      pardo: [
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-02-19-14-06-09%2011.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-02-19-14-06-09%2013.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-02-19-14-06-09%2015.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-02-19-14-06-09.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-02-19-14-06-10%203.jpg"
      ]
    }
  },
  {
    id: "4",
    name: "Criques & Roccapina",
    duration: "Journée",
    price: 1800,
    category: "circuit",
    description: "Une journée sauvage vers l'ouest : Pianottoli, Arbitru et le Lion de Roccapina.",
    longDescription: "Fuyez la foule et dirigez-vous vers l'ouest. Ce circuit vous emmène dans des criques isolées accessibles uniquement par la mer. Le point d'orgue est la baie de Roccapina avec son célèbre lion de pierre veillant sur une plage de rêve.",
    image: "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-02-19-14-06-09%202.jpg",
    itinerary: [
      "Départ Bonifacio",
      "Anse de Fazzio",
      "Pianottoli-Caldarello",
      "Plage d'Arbitru",
      "Baie de Roccapina",
      "Retour Bonifacio"
    ],
    locations: ["Bonifacio", "Fazzio", "Pianottoli", "Arbitru", "Roccapina"],
    practicalInfos: [
      "Navigation sauvage",
      "Skipper inclus",
      "Eaux turquoises garanties",
      "Pique-nique possible à bord"
    ],
    coordinates: [
      { lat: 41.3875, lng: 9.1561 },
      { lat: 41.4500, lng: 9.0000 },
      { lat: 41.5000, lng: 8.8000 }
    ],
    boatImages: {
      prestige: [
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-33.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%2014.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%2016.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%2017.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%202.jpg"
      ],
      pardo: [
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-02-19-14-06-09%2011.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-02-19-14-06-09%2013.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-02-19-14-06-09%2015.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-02-19-14-06-09.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-02-19-14-06-10%203.jpg"
      ]
    }
  },
  {
    id: "5",
    name: "Croisières sur mesure",
    duration: "À partir de 2 jours",
    priceOnRequest: true,
    category: "croisiere",
    description: "Séjours prolongés en mer pour une évasion totale.",
    longDescription: "Découvrez le plaisir de vivre à bord. Nos croisières de plusieurs jours vous permettent d'explorer les plus beaux sites de Méditerranée en toute sérénité. Un itinéraire 100% personnalisable selon vos envies.",
    image: "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/IMG_0261.png",
    itinerary: [
      "Définition de votre projet",
      "Sélection des escales",
      "Navigation sur mesure",
      "Vie à bord et détente"
    ],
    locations: ["Corse", "Sardaigne", "Archipels"],
    practicalInfos: [
      "À partir de 2 jours / 1 nuit",
      "Skipper professionnel inclus",
      "Confort premium à bord",
      "Sur devis uniquement"
    ],
    exclusiveBoat: "prestige",
    boatImages: {
      prestige: [
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-33.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%2014.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%2016.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%2017.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%202.jpg"
      ],
      pardo: []
    },
    coordinates: [
      { lat: 41.3875, lng: 9.1561 }
    ]
  }
];
