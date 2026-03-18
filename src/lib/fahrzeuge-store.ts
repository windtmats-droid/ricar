// localStorage-based vehicle store

export interface Fahrzeug {
  id: string;
  marke: string;
  modell: string;
  typ: string;
  baujahr: string;
  erstzulassung: string;
  km: string;
  farbe: string;
  fin: string;
  kennzeichen: string;
  kraftstoff: string;
  getriebe: string;
  huBis: string;
  tuevBis: string;
  zustand: string;
  notizen: string;
  einkaufspreis: number;
  aufbereitungskosten: number;
  transportkosten: number;
  sonstigeKosten: number;
  marge: number;
  gesamtkosten: number;
  empfohlenerVKPreis: number;
  fotos: string[]; // base64 or data URLs
  status: "neu" | "aufbereitung" | "bereit" | "inseriert" | "verkauft";
  ankaufDatum: string;
  inseratEntwurf: string;
  inseratText: string;
  inseratPreis: number;
  verkaufsDatum: string;
}

const STORAGE_KEY = "fahrzeuge";

export function getFahrzeuge(): Fahrzeug[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveFahrzeuge(fahrzeuge: Fahrzeug[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fahrzeuge));
}

export function addFahrzeug(f: Fahrzeug): void {
  const all = getFahrzeuge();
  all.push(f);
  saveFahrzeuge(all);
}

export function updateFahrzeug(id: string, updates: Partial<Fahrzeug>): void {
  const all = getFahrzeuge();
  const idx = all.findIndex((f) => f.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates };
    saveFahrzeuge(all);
  }
}

export function getBestandFahrzeuge(): Fahrzeug[] {
  return getFahrzeuge().filter((f) => f.status !== "verkauft");
}

export function getInserierteFahrzeuge(): Fahrzeug[] {
  return getFahrzeuge().filter((f) => f.status === "inseriert");
}

export function getStandzeit(f: Fahrzeug): number {
  return Math.floor((Date.now() - new Date(f.ankaufDatum).getTime()) / 86400000);
}

export function generateId(): string {
  return `fzg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
