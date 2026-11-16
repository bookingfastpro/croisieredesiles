import { Circuit, HeroData, Boat, SiteSettings } from "../types";
import { DEFAULT_SETTINGS, mergeSettings } from "../data/defaultSettings";

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
  settings: SiteSettings | null;
} = {
  circuits: null,
  hero: null,
  boats: null,
  images: null,
  settings: null,
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

export const checkSession = async (): Promise<boolean> => {
  const token = localStorage.getItem("admin_token");
  if (!token) return false;
  try {
    const response = await fetch("/api/session", { headers: { "x-admin-token": token } });
    const data = await response.json();
    if (!data.valid) localStorage.removeItem("admin_token");
    return Boolean(data.valid);
  } catch {
    return false;
  }
};

export const logout = async (): Promise<void> => {
  const token = localStorage.getItem("admin_token");
  localStorage.removeItem("admin_token");
  if (token) {
    await fetch("/api/logout", { method: "POST", headers: { "x-admin-token": token } }).catch(() => {});
  }
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
  const response = await fetch("/api/circuits", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(circuits),
  });
  if (!response.ok) throw new Error(response.status === 401 ? "Unauthorized" : "Save failed");
  memoryCache.circuits = circuits;
  setStorageItem("cache_circuits", circuits);
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
  const response = await fetch("/api/hero", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(hero),
  });
  if (!response.ok) throw new Error(response.status === 401 ? "Unauthorized" : "Save failed");
  memoryCache.hero = hero;
  setStorageItem("cache_hero", hero);
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
  const response = await fetch("/api/boats", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(boats),
  });
  if (!response.ok) throw new Error(response.status === 401 ? "Unauthorized" : "Save failed");
  memoryCache.boats = boats;
  setStorageItem("cache_boats", boats);
};

export const getImages = async (): Promise<string[]> => {
  try {
    const response = await fetch("/api/images", { cache: "no-store" });
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

export const getSettings = async (): Promise<SiteSettings> => {
  const refresh = () =>
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        const merged = mergeSettings(data);
        memoryCache.settings = merged;
        setStorageItem("cache_settings", merged);
        return merged;
      });

  if (memoryCache.settings) {
    refresh().catch(() => {});
    return memoryCache.settings;
  }
  const stored = getStorageItem<SiteSettings>("cache_settings");
  if (stored) {
    memoryCache.settings = mergeSettings(stored);
    return memoryCache.settings;
  }
  try {
    return await refresh();
  } catch {
    return DEFAULT_SETTINGS;
  }
};

/** Always asks the server (used to revalidate after a cached first render). */
export const fetchFreshSettings = async (): Promise<SiteSettings | null> => {
  try {
    const res = await fetch("/api/settings");
    const merged = mergeSettings(await res.json());
    memoryCache.settings = merged;
    setStorageItem("cache_settings", merged);
    return merged;
  } catch {
    return null;
  }
};

export const saveSettings = async (settings: SiteSettings): Promise<void> => {
  const response = await fetch("/api/settings", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(settings),
  });
  if (!response.ok) throw new Error(response.status === 401 ? "Unauthorized" : "Save failed");
  memoryCache.settings = settings;
  setStorageItem("cache_settings", settings);
};

/** Resize big photos in the browser (max 2000 px, WebP) before sending them to the server. */
async function compressImage(file: File): Promise<Blob> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/webp", 0.82));
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

export const uploadImage = async (file: File): Promise<string> => {
  const body = await compressImage(file);
  const response = await fetch("/api/upload", {
    method: "POST",
    headers: {
      "Content-Type": body.type || file.type,
      "x-admin-token": localStorage.getItem("admin_token") || "",
      "x-filename": encodeURIComponent(file.name),
    },
    body,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || (response.status === 401 ? "Session expirée, reconnectez-vous" : "Échec de l'envoi"));
  return data.url;
};

export const deleteImage = async (url: string): Promise<void> => {
  const name = url.split("/").pop() || "";
  const response = await fetch(`/api/images/${encodeURIComponent(name)}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Suppression impossible");
};
