import express from "express";
import "dotenv/config";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, "src", "data", "circuits.json");
const HERO_FILE = path.join(__dirname, "src", "data", "hero.json");
const BOATS_FILE = path.join(__dirname, "src", "data", "boats.json");
const IMAGES_DIR = path.join(process.cwd(), "public", "images", "circuits");

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
    price: 15000,
    description: "Une odyssée complète autour de l'Île de Beauté, de Bonifacio à Bastia.",
    longDescription: "Embarquez pour une croisière inoubliable de 7 jours. Ce périple vous fera découvrir les joyaux de la Corse : les falaises de Bonifacio, les calanques de Piana, le village mythique de Girolata, la citadelle de Calvi, le Cap Corse et les plages célèbres de Porto-Vecchio.",
    image: "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/WhatsApp%20Image%202026-04-20%20at%2020.01.37.jpeg",
    itinerary: [
      "Jour 1 : Bonifacio - Roccapina – Campomoro – Porto Pollo. Départ du port de Bonifacio en direction de la côte ouest. Pause baignade à Arbitru et Roccapina, célèbre pour son rocher en forme de lion et ses eaux cristallines. Escale possible à Campomoro, charmant port avec tour génoise et ambiance paisible. Nuit recommandée à Porto-Pollo, spot idéal pour un premier mouillage.",
      "Jour 2 : Ajaccio – Calanques de Piana. Cap sur le golfe d’Ajaccio : Escale ravitaillement et déjeuner à Ajaccio. Continuation vers les calanques de Piana, site spectaculaire classé UNESCO.",
      "Jour 3 : Girolata. Direction le mythique village de Girolata, accessible uniquement par bateau ou randonnée. Mouillage exceptionnel, ambiance nature et authentique.",
      "Jour 4 : Calvi – Île-Rousse. Remontée vers la balagne : Calvi (citadelle, restaurants, ambiance animée) puis Île-Rousse.",
      "Jour 5 : Saint Florent – Bastia. Cap sur le nord : Arrêt à Saint-Florent, station balnéaire chic et agréable. Nuit à Bastia, port dynamique et historique. Belle navigation entre cap corse et désert des Agriates.",
      "Jour 6 : Solenzara – Fautea - Porto-Vecchio. Descente par la côte est : Pause à Solenzara (restaurant, plage MARADEA). Mouillage à Fautea avec sa tour génoise iconique. Escale soirée à Porto-Vecchio, ambiance festive et plages célèbres.",
      "Jour 7 : Îles Lavezzi & Cavallo – Retour Bonifacio. Archipel des îles Lavezzi et île de cavallo. Eaux turquoise, snorkeling. Retour au port de Bonifacio en fin de journée."
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
    ]
  },
  {
    id: "2",
    name: "Sardaigne & La Maddalena",
    duration: "Journée / Croisière",
    price: 2500,
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
    ]
  },
  {
    id: "3",
    name: "Bonifacio & Îles Lavezzi",
    duration: "Journée",
    price: 1800,
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
    ]
  },
  {
    id: "4",
    name: "Criques & Roccapina",
    duration: "Journée",
    price: 1800,
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
    ]
  }
];

const INITIAL_BOATS = [
  {
    id: "1",
    name: "Sessa Key Largo 34",
    description: "Le Key Largo 34 est l'un des bateaux les plus populaires de sa catégorie. Avec son design élégant et ses performances exceptionnelles, il est idéal pour une journée en mer en famille ou entre amis.",
    image: "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/WhatsApp%20Image%202026-04-20%20at%2020.01.31.jpeg",
    specs: [
      { label: "Longueur", value: "10.5m" },
      { label: "Largeur", value: "3.5m" },
      { label: "Capacité", value: "10 personnes" },
      { label: "Moteur", value: "2 x 300 CV" }
    ]
  },
  {
    id: "2",
    name: "Pardo 43",
    description: "Le Pardo 43 est le choix parfait pour ceux qui recherchent le luxe et le confort. Son design moderne et ses finitions haut de gamme en font un véritable joyau des mers.",
    image: "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/PHOTO-2026-02-19-14-06-09%2011.jpg",
    specs: [
      { label: "Longueur", value: "13.5m" },
      { label: "Largeur", value: "4.2m" },
      { label: "Capacité", value: "12 personnes" },
      { label: "Moteur", value: "2 x 435 CV" }
    ]
  }
];

const INITIAL_HERO = {
  title: "L'Excellence en Mer",
  subtitle: "Découvrez la Corse et la Sardaigne à bord de nos navires d'exception. Une expérience de navigation unique entre Bonifacio et l'archipel de la Maddalena.",
  image: "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/PHOTO-2026-02-19-14-06-09%2015.jpg"
};

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_CIRCUITS, null, 2));
}

if (!fs.existsSync(HERO_FILE)) {
  fs.writeFileSync(HERO_FILE, JSON.stringify(INITIAL_HERO, null, 2));
}

if (!fs.existsSync(BOATS_FILE)) {
  fs.writeFileSync(BOATS_FILE, JSON.stringify(INITIAL_BOATS, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());
  
  // Health check route
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", env: process.env.NODE_ENV, port: PORT });
  });

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";

  // Simple authentication middleware
  const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.headers["x-admin-token"];
    if (token === ADMIN_PASSWORD) {
      next();
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  };

  // API Routes
  app.post("/api/login", (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      res.json({ success: true, token: ADMIN_PASSWORD });
    } else {
      res.status(401).json({ success: false, error: "Mot de passe incorrect" });
    }
  });

  app.get("/api/circuits", (req, res) => {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    res.json(JSON.parse(data));
  });

  app.post("/api/circuits", authenticate, (req, res) => {
    const newCircuits = req.body;
    fs.writeFileSync(DATA_FILE, JSON.stringify(newCircuits, null, 2));
    res.json({ success: true });
  });

  app.get("/api/hero", (req, res) => {
    const data = fs.readFileSync(HERO_FILE, "utf-8");
    res.json(JSON.parse(data));
  });

  app.post("/api/hero", authenticate, (req, res) => {
    const newHero = req.body;
    fs.writeFileSync(HERO_FILE, JSON.stringify(newHero, null, 2));
    res.json({ success: true });
  });

  app.get("/api/boats", (req, res) => {
    const data = fs.readFileSync(BOATS_FILE, "utf-8");
    res.json(JSON.parse(data));
  });

  app.post("/api/boats", authenticate, (req, res) => {
    const newBoats = req.body;
    fs.writeFileSync(BOATS_FILE, JSON.stringify(newBoats, null, 2));
    res.json({ success: true });
  });

  app.get("/api/images", (req, res) => {
    try {
      if (!fs.existsSync(IMAGES_DIR)) {
        console.log("Images directory does not exist:", IMAGES_DIR);
        return res.json([]);
      }
      const files = fs.readdirSync(IMAGES_DIR);
      console.log(`Found ${files.length} files in ${IMAGES_DIR}`);
      const images = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext);
      }).map(file => `/images/circuits/${file}`);
      console.log(`Returning ${images.length} images:`, images);
      res.json(images);
    } catch (error) {
      console.error("Error listing images:", error);
      res.status(500).json({ error: "Failed to list images" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
