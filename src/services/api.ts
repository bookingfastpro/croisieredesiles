import { Circuit, HeroData, Boat } from "../types";

// Fallback defaults for instantaneous initial render
export const DEFAULT_HERO: HeroData = {
  title: "L'Excellence en Mer",
  subtitle: "Découvrez la Corse et la Sardaigne à bord de nos navires d'exception. Une expérience de navigation unique entre Bonifacio et l'archipel de la Maddalena.",
  image: "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Bateau/WhatsApp%20Image%202026-04-30%20at%2013.05.08.jpeg"
};

export const DEFAULT_BOATS: Boat[] = [
  {
    id: "1",
    name: "Prestige 42 Flybridge",
    description: "Le Prestige 42 Flybridge allie élégance, confort et volume. Parfait pour des croisières prolongées ou des journées de détente avec sa plateforme aquatique gonflable, paddle, seabob et sa bouée tractée avec annexe.",
    image: "https://qzvurftthvlazlizltgy.supabase.co/storage/v1/object/public/property-images/Cabine/PHOTO-2026-04-26-21-58-57.jpg",
    images: [
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
    specs: [
      { label: "Longueur", value: "11.98m" },
      { label: "Largeur", value: "4.16m" },
      { label: "Capacité", value: "10 personnes" },
      { label: "Moteur", value: "2 x 424 CV" }
    ],
    options: [
      "Possibilité de BBQ à bord",
      "Tarif selon nombre de personnes (sur demande)"
    ]
  }
];

// In-memory cache
const memoryCache: {
  circuits: Circuit[] | null;
  hero: HeroData | null;
  boats: Boat[] | null;
  images: string[] | null;
} = {
  circuits: null,
  hero: null,
  boats: null,
  images: null,
};

// Helper for localStorage caching
const getStorageItem = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

const setStorageItem = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

export const login = async (password: string): Promise<{ success: boolean; token?: string; error?: string }> => {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });
  const data = await response.json();
  if (data.success) {
    localStorage.setItem("admin_token", data.token);
  }
  return data;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("admin_token");
  return {
    "Content-Type": "application/json",
    "x-admin-token": token || "",
  };
};

export const getCircuits = async (): Promise<Circuit[]> => {
  if (memoryCache.circuits) {
    // Revalidate in background
    fetch("/api/circuits")
      .then(res => res.json())
      .then(data => {
        memoryCache.circuits = data;
        setStorageItem("cache_circuits", data);
      })
      .catch(() => {});
    return memoryCache.circuits;
  }

  const stored = getStorageItem<Circuit[]>("cache_circuits");
  if (stored) {
    memoryCache.circuits = stored;
    // Revalidate
    fetch("/api/circuits")
      .then(res => res.json())
      .then(data => {
        memoryCache.circuits = data;
        setStorageItem("cache_circuits", data);
      })
      .catch(() => {});
    return stored;
  }

  try {
    const response = await fetch("/api/circuits");
    const data = await response.json();
    memoryCache.circuits = data;
    setStorageItem("cache_circuits", data);
    return data;
  } catch {
    return [];
  }
};

export const saveCircuits = async (circuits: Circuit[]): Promise<void> => {
  memoryCache.circuits = circuits;
  setStorageItem("cache_circuits", circuits);
  const response = await fetch("/api/circuits", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(circuits),
  });
  if (!response.ok) throw new Error("Unauthorized");
};

export const getHero = async (): Promise<HeroData> => {
  if (memoryCache.hero) {
    fetch("/api/hero")
      .then(res => res.json())
      .then(data => {
        memoryCache.hero = data;
        setStorageItem("cache_hero", data);
      })
      .catch(() => {});
    return memoryCache.hero;
  }

  const stored = getStorageItem<HeroData>("cache_hero");
  if (stored) {
    memoryCache.hero = stored;
    fetch("/api/hero")
      .then(res => res.json())
      .then(data => {
        memoryCache.hero = data;
        setStorageItem("cache_hero", data);
      })
      .catch(() => {});
    return stored;
  }

  try {
    const response = await fetch("/api/hero");
    const data = await response.json();
    memoryCache.hero = data;
    setStorageItem("cache_hero", data);
    return data;
  } catch {
    return DEFAULT_HERO;
  }
};

export const saveHero = async (hero: HeroData): Promise<void> => {
  memoryCache.hero = hero;
  setStorageItem("cache_hero", hero);
  const response = await fetch("/api/hero", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(hero),
  });
  if (!response.ok) throw new Error("Unauthorized");
};

export const getBoats = async (): Promise<Boat[]> => {
  if (memoryCache.boats) {
    fetch("/api/boats")
      .then(res => res.json())
      .then(data => {
        memoryCache.boats = data;
        setStorageItem("cache_boats", data);
      })
      .catch(() => {});
    return memoryCache.boats;
  }

  const stored = getStorageItem<Boat[]>("cache_boats");
  if (stored) {
    memoryCache.boats = stored;
    fetch("/api/boats")
      .then(res => res.json())
      .then(data => {
        memoryCache.boats = data;
        setStorageItem("cache_boats", data);
      })
      .catch(() => {});
    return stored;
  }

  try {
    const response = await fetch("/api/boats");
    const data = await response.json();
    memoryCache.boats = data;
    setStorageItem("cache_boats", data);
    return data;
  } catch {
    return DEFAULT_BOATS;
  }
};

export const saveBoats = async (boats: Boat[]): Promise<void> => {
  memoryCache.boats = boats;
  setStorageItem("cache_boats", boats);
  const response = await fetch("/api/boats", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(boats),
  });
  if (!response.ok) throw new Error("Unauthorized");
};

export const getImages = async (): Promise<string[]> => {
  if (memoryCache.images) {
    return memoryCache.images;
  }
  const stored = getStorageItem<string[]>("cache_images");
  if (stored) {
    memoryCache.images = stored;
    return stored;
  }
  try {
    const response = await fetch("/api/images");
    const data = await response.json();
    memoryCache.images = data;
    setStorageItem("cache_images", data);
    return data;
  } catch {
    return [];
  }
};
