export interface Circuit {
  id: string;
  name: string;
  duration: string;
  price?: number;
  priceOnRequest?: boolean;
  category: 'circuit' | 'croisiere';
  description: string;
  longDescription: string;
  image: string;
  itinerary: string[];
  locations: string[];
  practicalInfos: string[];
  coordinates: { lat: number; lng: number }[];
  boatImages?: {
    prestige: string[];
    pardo: string[];
  };
  exclusiveBoat?: 'prestige' | 'pardo';
  /** Masqué du site public (brouillon) */
  hidden?: boolean;
  /** Afficher la grille des tarifs saisonniers sous ce circuit */
  showSeasonalRates?: boolean;
}

export interface HeroData {
  title: string;
  subtitle: string;
  image: string;
}

export interface Boat {
  id: string;
  name: string;
  description: string;
  image: string;
  images?: string[];
  specs: {
    label: string;
    value: string;
  }[];
  options?: string[];
}

export interface SiteSettings {
  contact: {
    phone: string;
    email: string;
    address: string;
    postalCode: string;
    city: string;
    hours: string;
    seasonNote: string;
    instagram: string;
    googleProfile: string;
  };
  about: {
    photo: string;
    title: string;
    highlight: string;
    personalTitle: string;
    personalText: string;
    careerTitle: string;
    careerText: string;
    quote: string;
    signature: string;
    signatureRole: string;
    stats: { value: string; label: string; desc: string }[];
  };
  rates: { label: string; price: string }[];
  ratesNote: string;
  services: { title: string; icon: string; description: string; details: string[] }[];
  faq: { q: string; a: string }[];
  legal: { legalForm: string; siret: string; director: string; host: string };
  seo: Record<string, { title?: string; description?: string }>;
}
