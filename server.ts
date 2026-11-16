import express from "express";
import "dotenv/config";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import compression from "compression";
import crypto from "crypto";
import { PAGES, NOT_FOUND_META, getPageMeta, buildHeadHtml } from "./src/seo.ts";
import { DEFAULT_SETTINGS, mergeSettings } from "./src/data/defaultSettings.ts";
import { IMAGE_WIDTHS, REMOTE_IMAGE_PREFIX, srcSet } from "./src/utils/img.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, "src", "data", "circuits.json");
const HERO_FILE = path.join(__dirname, "src", "data", "hero.json");
const BOATS_FILE = path.join(__dirname, "src", "data", "boats.json");
const SETTINGS_FILE = path.join(__dirname, "src", "data", "settings.json");
const IMAGES_DIR = path.join(process.cwd(), "public", "images", "circuits");
const PUBLIC_DIR = path.join(process.cwd(), "public");

// Memory cache to accelerate data reads and avoid disk latency
let cachedCircuits: any = null;
let cachedHero: any = null;
let cachedBoats: any = null;
let cachedImages: string[] | null = null;
let cachedSettings: any = null;

// Ensure data directory exists
const dataDir = path.join(__dirname, "src", "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure images directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Initial data if file doesn't exist
const INITIAL_CIRCUITS = [
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
      { lat: 41.3875, lng: 9.1561 }, // Bonifacio
      { lat: 41.5000, lng: 8.8000 }, // Roccapina
      { lat: 41.9267, lng: 8.7369 }, // Ajaccio
      { lat: 42.2500, lng: 8.6000 }, // Piana
      { lat: 42.3500, lng: 8.6100 }, // Girolata
      { lat: 42.5667, lng: 8.7572 }, // Calvi
      { lat: 42.6833, lng: 9.3000 }, // St Florent
      { lat: 42.7000, lng: 9.4500 }, // Bastia
      { lat: 41.5911, lng: 9.2786 }  // Porto-Vecchio
    ],
    exclusiveBoat: "prestige",
    boatImages: {
      prestige: [
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Cabine/PHOTO-2026-04-26-21-58-57.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%2014.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%2016.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%2017.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%202.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/interieur..jpeg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-02%202.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-02%203.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-02%205.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-03%203.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-03%207.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-03%206.jpg"
      ],
      pardo: []
    }
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
      "Tarif variable selon saison"
    ],
    coordinates: [
      { lat: 41.3875, lng: 9.1561 },
      { lat: 41.2167, lng: 9.4000 }
    ],
    boatImages: {
      prestige: [
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Cabine/PHOTO-2026-04-26-21-58-57.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%2014.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%2016.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%2017.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%202.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/interieur..jpeg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-02%202.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-02%203.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-02%205.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-03%203.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-03%207.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-03%206.jpg"
      ],
      pardo: [
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-02-19-14-06-09%202.jpg",
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
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Cabine/PHOTO-2026-04-26-21-58-57.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%2014.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%2016.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%2017.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%202.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/interieur..jpeg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-02%202.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-02%203.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-02%205.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-03%203.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-03%207.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-03%206.jpg"
      ],
      pardo: [
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-02-19-14-06-09%202.jpg",
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
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Cabine/PHOTO-2026-04-26-21-58-57.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%2014.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%2016.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%2017.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%202.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/interieur..jpeg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-02%202.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-02%203.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-02%205.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-03%203.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-03%207.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-03%206.jpg"
      ],
      pardo: [
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-02-19-14-06-09%202.jpg",
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
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Cabine/PHOTO-2026-04-26-21-58-57.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%2014.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%2016.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%2017.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%202.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/interieur..jpeg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-02%202.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-02%203.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-02%205.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-03%203.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-03%207.jpg",
        "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-03%206.jpg"
      ],
      pardo: []
    },
    coordinates: [
      { lat: 41.3875, lng: 9.1561 }
    ]
  }
];

const INITIAL_BOATS = [
  {
    "id": "1",
    "name": "Prestige 42 Flybridge",
    "description": "Le Prestige 42 Flybridge allie élégance, confort et volume. Parfait pour des croisières prolongées ou des journées de détente avec sa plateforme aquatique gonflable, paddle, seabob et sa bouée tractée avec annexe.",
    "image": "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Cabine/PHOTO-2026-04-26-21-58-57.jpg",
    "images": [
      "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Cabine/PHOTO-2026-04-26-21-58-57.jpg",
      "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%2014.jpg",
      "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%2016.jpg",
      "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%2017.jpg",
      "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-04-24-09-22-34%202.jpg",
      "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/interieur..jpeg",
      "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-02%202.jpg",
      "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-02%203.jpg",
      "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-02%205.jpg",
      "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-03%203.jpg",
      "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-03%207.jpg",
      "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau%20Interieur/PHOTO-2026-02-13-12-50-03%206.jpg"
    ],
    "specs": [
      { "label": "Longueur", "value": "11.98m" },
      { "label": "Largeur", "value": "4.16m" },
      { "label": "Capacité", "value": "10 personnes" },
      { "label": "Équipements", "value": "Paddle, Seabob, Bouée" }
    ],
    "options": [
      "Possibilité de BBQ à bord",
      "Tarif selon nombre de personnes (sur demande)"
    ]
  }
];

const INITIAL_HERO = {
  title: "L'Excellence en Mer",
  subtitle: "Découvrez la Corse et la Sardaigne à bord de nos navires d'exception. Une expérience de navigation unique entre Bonifacio et l'archipel de la Maddalena.",
  image: "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/WhatsApp%20Image%202026-04-30%20at%2013.05.08.jpeg"
};

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_CIRCUITS, null, 2));
}

if (!fs.existsSync(HERO_FILE)) {
  fs.writeFileSync(HERO_FILE, JSON.stringify(INITIAL_HERO, null, 2));
}

if (!fs.existsSync(SETTINGS_FILE)) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2));
}

function getSettings() {
  if (!cachedSettings) {
    try {
      cachedSettings = mergeSettings(JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf-8")));
    } catch {
      cachedSettings = mergeSettings({});
    }
  }
  return cachedSettings;
}

if (!fs.existsSync(BOATS_FILE)) {
  fs.writeFileSync(BOATS_FILE, JSON.stringify(INITIAL_BOATS, null, 2));
}

const IS_PROD = process.env.NODE_ENV === "production";

// Admin password: mandatory in production (no insecure "admin" default).
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || (IS_PROD ? "" : "admin");
if (!ADMIN_PASSWORD) {
  console.warn("[admin] ADMIN_PASSWORD n'est pas défini : le panel administrateur est désactivé.");
}

// Session tokens (random, never the password itself), valid 12h.
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const sessions = new Map<string, number>();

// Basic brute-force protection on the login route.
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 10;
const loginAttempts = new Map<string, { count: number; first: number }>();

function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function isValidSession(token: unknown): boolean {
  if (typeof token !== "string" || !token) return false;
  const exp = sessions.get(token);
  if (!exp) return false;
  if (exp < Date.now()) {
    sessions.delete(token);
    return false;
  }
  return true;
}

function writeJson(file: string, data: unknown) {
  // Atomic write: avoids a corrupted JSON file if the process stops mid-write.
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, file);
}

function getOrigin(req: express.Request): string {
  const configured = process.env.SITE_URL || process.env.APP_URL;
  if (configured && /^https?:\/\//.test(configured)) return configured.replace(/\/+$/, "");
  return `${req.protocol}://${req.get("host")}`;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.disable("x-powered-by");
  app.set("trust proxy", true); // behind Coolify / reverse proxy → correct https origin

  // Security headers
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    if (IS_PROD) res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    next();
  });

  // Trailing slash → canonical URL without slash (avoids duplicate content)
  app.use((req, res, next) => {
    if ((req.method === "GET" || req.method === "HEAD") && req.path.length > 1 && req.path.endsWith("/")) {
      const query = req.url.slice(req.path.length);
      return res.redirect(301, req.path.replace(/\/+$/, "") + query);
    }
    next();
  });

  // Enable HTTP response compression (gzip / deflate) for faster transfers
  app.use(compression());
  app.use(express.json({ limit: "2mb" }));

  // ---------- SEO: robots.txt & sitemap.xml (generated with the real domain) ----------
  app.get("/robots.txt", (req, res) => {
    const origin = getOrigin(req);
    res.type("text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(`User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin\n\nSitemap: ${origin}/sitemap.xml\n`);
  });

  const sitemapHandler = (req: express.Request, res: express.Response) => {
    const origin = getOrigin(req);
    // Last real content change: data files edited from the admin panel, or the last build
    const sources = [DATA_FILE, HERO_FILE, BOATS_FILE, SETTINGS_FILE, path.join(process.cwd(), "dist", "index.html")];
    const lastChange = Math.max(...sources.map(f => (fs.existsSync(f) ? fs.statSync(f).mtimeMs : 0)));
    const lastmod = new Date(lastChange || Date.now()).toISOString().slice(0, 10);
    const urls = Object.entries(PAGES)
      .filter(([, meta]) => meta.sitemap && !meta.noindex)
      .map(([p, meta]) => {
        const img = meta.image
          ? `\n    <image:image>\n      <image:loc>${meta.image.replace(/&/g, "&amp;")}</image:loc>\n    </image:image>`
          : "";
        return `  <url>\n    <loc>${origin}${p}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${meta.sitemap!.changefreq}</changefreq>\n    <priority>${meta.sitemap!.priority}</priority>${img}\n  </url>`;
      })
      .join("\n");
    res.type("application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>\n`
    );
  };
  app.get("/sitemap.xml", sitemapHandler);
  // Legacy URL kept as a permanent redirect (was a duplicate sitemap)
  app.get("/site.xml", (req, res) => res.redirect(301, "/sitemap.xml"));

  // ---------- Responsive images: /img?src=…&w=… → resized WebP, cached on disk ----------
  const IMG_CACHE_DIR = path.join(process.cwd(), ".cache", "img");
  fs.mkdirSync(IMG_CACHE_DIR, { recursive: true });
  const inFlight = new Map<string, Promise<Buffer>>();
  let sharpModule: any = null;
  const getSharp = async () => (sharpModule ??= (await import("sharp")).default);

  const loadSource = async (src: string): Promise<Buffer> => {
    if (src.startsWith("/images/")) {
      const file = path.join(PUBLIC_DIR, decodeURIComponent(src));
      if (!file.startsWith(path.join(PUBLIC_DIR, "images") + path.sep)) throw new Error("forbidden");
      return fs.promises.readFile(file);
    }
    const response = await fetch(src, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buf = Buffer.from(await response.arrayBuffer());
    if (buf.length > 30 * 1024 * 1024) throw new Error("too large");
    return buf;
  };

  app.get("/img", async (req, res) => {
    const src = typeof req.query.src === "string" ? req.query.src : "";
    const requested = Number(req.query.w) || 1080;
    const width = IMAGE_WIDTHS.find(w => w >= requested) ?? IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1];
    if (!(src.startsWith("/images/") || src.startsWith(REMOTE_IMAGE_PREFIX)) || src.includes("..")) {
      return res.status(400).send("Image non autorisée");
    }
    const key = crypto.createHash("sha1").update(`${src}|${width}`).digest("hex");
    const cached = path.join(IMG_CACHE_DIR, `${key}.webp`);
    const send = (buf: Buffer) => {
      res.setHeader("Content-Type", "image/webp");
      res.setHeader("Cache-Control", "public, max-age=2592000, stale-while-revalidate=86400");
      res.end(buf);
    };
    try {
      if (fs.existsSync(cached)) return send(await fs.promises.readFile(cached));
      let job = inFlight.get(key);
      if (!job) {
        job = (async () => {
          const sharp = await getSharp();
          const input = await loadSource(src);
          const out: Buffer = await sharp(input, { failOn: "none" })
            .rotate()
            .resize({ width, withoutEnlargement: true })
            .webp({ quality: 72, effort: 4 })
            .toBuffer();
          await fs.promises.writeFile(cached, out);
          return out;
        })().finally(() => inFlight.delete(key));
        inFlight.set(key, job);
      }
      send(await job);
    } catch (error) {
      console.warn("[img] optimisation impossible, image d'origine utilisée :", src, (error as Error).message);
      res.redirect(302, src);
    }
  });

  // Static assets in /public (uploaded images…)
  app.use(express.static(PUBLIC_DIR, { maxAge: "7d", index: false }));

  // Health check route
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (isValidSession(req.headers["x-admin-token"])) return next();
    res.status(401).json({ error: "Unauthorized" });
  };

  app.post("/api/login", (req, res) => {
    if (!ADMIN_PASSWORD) {
      return res.status(503).json({ success: false, error: "Administration désactivée (ADMIN_PASSWORD manquant)" });
    }
    const ip = req.ip || "unknown";
    const now = Date.now();
    const entry = loginAttempts.get(ip);
    if (entry && now - entry.first < LOGIN_WINDOW_MS && entry.count >= LOGIN_MAX_ATTEMPTS) {
      return res.status(429).json({ success: false, error: "Trop de tentatives, réessayez dans 15 minutes" });
    }
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    if (password && safeEqual(password, ADMIN_PASSWORD)) {
      loginAttempts.delete(ip);
      const token = crypto.randomBytes(32).toString("hex");
      sessions.set(token, now + SESSION_TTL_MS);
      return res.json({ success: true, token });
    }
    if (!entry || now - entry.first >= LOGIN_WINDOW_MS) loginAttempts.set(ip, { count: 1, first: now });
    else entry.count++;
    res.status(401).json({ success: false, error: "Mot de passe incorrect" });
  });

  app.get("/api/session", (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.json({ valid: isValidSession(req.headers["x-admin-token"]) });
  });

  app.post("/api/logout", (req, res) => {
    const token = req.headers["x-admin-token"];
    if (typeof token === "string") sessions.delete(token);
    res.json({ success: true });
  });

  const readCached = (file: string, get: () => any, set: (v: any) => void) => {
    if (!get()) set(JSON.parse(fs.readFileSync(file, "utf-8")));
    return get();
  };

  app.get("/api/circuits", (req, res) => {
    res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
    res.json(readCached(DATA_FILE, () => cachedCircuits, v => (cachedCircuits = v)));
  });

  app.post("/api/circuits", authenticate, (req, res) => {
    if (!Array.isArray(req.body)) return res.status(400).json({ error: "Format invalide" });
    cachedCircuits = req.body;
    writeJson(DATA_FILE, req.body);
    res.json({ success: true });
  });

  app.get("/api/hero", (req, res) => {
    res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
    res.json(readCached(HERO_FILE, () => cachedHero, v => (cachedHero = v)));
  });

  app.post("/api/hero", authenticate, (req, res) => {
    const body = req.body;
    if (!body || typeof body !== "object" || Array.isArray(body) || typeof body.title !== "string") {
      return res.status(400).json({ error: "Format invalide" });
    }
    cachedHero = body;
    writeJson(HERO_FILE, body);
    res.json({ success: true });
  });

  app.get("/api/boats", (req, res) => {
    res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
    res.json(readCached(BOATS_FILE, () => cachedBoats, v => (cachedBoats = v)));
  });

  app.post("/api/boats", authenticate, (req, res) => {
    if (!Array.isArray(req.body)) return res.status(400).json({ error: "Format invalide" });
    cachedBoats = req.body;
    writeJson(BOATS_FILE, req.body);
    res.json({ success: true });
  });

  app.get("/api/settings", (req, res) => {
    res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
    res.json(getSettings());
  });

  app.post("/api/settings", authenticate, (req, res) => {
    const body = req.body;
    if (!body || typeof body !== "object" || Array.isArray(body) || typeof body.contact !== "object") {
      return res.status(400).json({ error: "Format invalide" });
    }
    cachedSettings = mergeSettings(body);
    writeJson(SETTINGS_FILE, cachedSettings);
    res.json({ success: true });
  });

  // Photo upload from the admin panel (raw image body, already resized in the browser)
  const IMAGE_TYPES: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
  };
  app.post(
    "/api/upload",
    authenticate,
    express.raw({ type: Object.keys(IMAGE_TYPES), limit: "15mb" }),
    (req, res) => {
      const ext = IMAGE_TYPES[String(req.headers["content-type"] || "").split(";")[0]];
      if (!ext || !Buffer.isBuffer(req.body) || req.body.length === 0) {
        return res.status(400).json({ error: "Format d'image non pris en charge (JPG, PNG, WebP ou GIF)" });
      }
      const original = decodeURIComponent(String(req.headers["x-filename"] || "photo"));
      const base =
        original
          .replace(/\.[^.]+$/, "")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 60) || "photo";
      const fileName = `${base}-${Date.now().toString(36)}${ext}`;
      fs.writeFileSync(path.join(IMAGES_DIR, fileName), req.body);
      cachedImages = null;
      res.json({ success: true, url: `/images/circuits/${fileName}` });
    }
  );

  app.delete("/api/images/:name", authenticate, (req, res) => {
    const name = path.basename(req.params.name);
    const file = path.join(IMAGES_DIR, name);
    if (!file.startsWith(IMAGES_DIR + path.sep) || !fs.existsSync(file)) {
      return res.status(404).json({ error: "Image introuvable" });
    }
    fs.unlinkSync(file);
    cachedImages = null;
    res.json({ success: true });
  });

  app.get("/api/images", (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    try {
      if (cachedImages) {
        return res.json(cachedImages);
      }
      if (!fs.existsSync(IMAGES_DIR)) {
        return res.json([]);
      }
      const files = fs
        .readdirSync(IMAGES_DIR)
        .map(file => ({ file, time: fs.statSync(path.join(IMAGES_DIR, file)).mtimeMs }))
        .sort((a, b) => b.time - a.time)
        .map(f => f.file);
      const images = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext);
      }).map(file => `/images/circuits/${file}`);
      cachedImages = images;
      res.json(images);
    } catch (error) {
      console.error("Error listing images:", error);
      res.status(500).json({ error: "Failed to list images" });
    }
  });

  app.use("/api", (req, res) => res.status(404).json({ error: "Not found" }));

  // Inject per-page <title>, description, canonical, Open Graph & JSON-LD
  const SEO_BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;
  const renderPage = (template: string, req: express.Request) => {
    const settings = getSettings();
    const meta = getPageMeta(req.path, settings.seo);
    const head = buildHeadHtml(meta ?? NOT_FOUND_META, getOrigin(req), req.path, settings);
    let preload = "";
    if (req.path === "/") {
      // Start downloading the hero photo immediately (main image of the page = LCP)
      const hero = readCached(HERO_FILE, () => cachedHero, v => (cachedHero = v));
      const set = hero?.image ? srcSet(hero.image, [640, 828, 1080, 1280, 1600]) : undefined;
      if (set) {
        preload = `    <link rel="preload" as="image" imagesrcset="${set.replace(/&/g, "&amp;").replace(/"/g, "&quot;")}" imagesizes="100vw" />`;
      }
    }
    // Image preload goes after the CSS/JS so it doesn't slow down the first paint
    const html = template.replace(SEO_BLOCK, head).replace("</head>", `${preload}\n  </head>`);
    return { html, status: meta ? 200 : 404 };
  };

  if (!IS_PROD) {
    // Vite middleware for development
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
    app.get("*", async (req, res, next) => {
      try {
        if (path.extname(req.path)) return res.status(404).end();
        const raw = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf-8");
        const template = await vite.transformIndexHtml(req.originalUrl, raw);
        const { html, status } = renderPage(template, req);
        res.status(status).type("html").send(html);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    // Hashed build assets never change → cache for one year
    app.use(
      "/assets",
      express.static(path.join(distPath, "assets"), { immutable: true, maxAge: "1y", fallthrough: false })
    );
    app.use(express.static(distPath, { index: false, maxAge: "7d" }));
    const template = fs.readFileSync(path.join(distPath, "index.html"), "utf-8");
    app.get("*", (req, res) => {
      if (path.extname(req.path)) return res.status(404).type("text/plain").send("Not found");
      const { html, status } = renderPage(template, req);
      res.setHeader("Cache-Control", "no-cache");
      res.status(status).type("html").send(html);
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
