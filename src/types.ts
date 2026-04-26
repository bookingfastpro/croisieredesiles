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
