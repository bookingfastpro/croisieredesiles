import { Circuit, HeroData, Boat } from "../types";

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
  const response = await fetch("/api/circuits");
  return response.json();
};

export const saveCircuits = async (circuits: Circuit[]): Promise<void> => {
  const response = await fetch("/api/circuits", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(circuits),
  });
  if (!response.ok) throw new Error("Unauthorized");
};

export const getHero = async (): Promise<HeroData> => {
  const response = await fetch("/api/hero");
  return response.json();
};

export const saveHero = async (hero: HeroData): Promise<void> => {
  const response = await fetch("/api/hero", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(hero),
  });
  if (!response.ok) throw new Error("Unauthorized");
};

export const getBoats = async (): Promise<Boat[]> => {
  const response = await fetch("/api/boats");
  return response.json();
};

export const saveBoats = async (boats: Boat[]): Promise<void> => {
  const response = await fetch("/api/boats", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(boats),
  });
  if (!response.ok) throw new Error("Unauthorized");
};

export const getImages = async (): Promise<string[]> => {
  const response = await fetch("/api/images");
  return response.json();
};
