export interface Circuit {
  id: string;
  name: string;
  duration: string;
  price: number;
  description: string;
  longDescription: string;
  image: string;
  itinerary: string[];
  locations: string[];
  practicalInfos: string[];
  coordinates: { lat: number; lng: number }[];
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
  specs: {
    label: string;
    value: string;
  }[];
}
