import { Circuit, HeroData, Boat } from "../types";

export const getCircuits = async (): Promise<Circuit[]> => {
  const response = await fetch("/api/circuits");
  return response.json();
};

export const saveCircuits = async (circuits: Circuit[]): Promise<void> => {
  await fetch("/api/circuits", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(circuits),
  });
};

export const getHero = async (): Promise<HeroData> => {
  const response = await fetch("/api/hero");
  return response.json();
};

export const saveHero = async (hero: HeroData): Promise<void> => {
  await fetch("/api/hero", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(hero),
  });
};

export const getBoats = async (): Promise<Boat[]> => {
  const response = await fetch("/api/boats");
  return response.json();
};

export const saveBoats = async (boats: Boat[]): Promise<void> => {
  await fetch("/api/boats", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(boats),
  });
};

export const getImages = async (): Promise<string[]> => {
  const response = await fetch("/api/images");
  return response.json();
};
