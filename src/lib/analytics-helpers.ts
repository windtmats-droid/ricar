import { getFahrzeuge, type Fahrzeug, getStandzeit } from "./fahrzeuge-store";

export interface TeamMember {
  id: string;
  vorname: string;
  nachname: string;
  rolle: string;
  email: string;
  telefon: string;
}

export function getTeamMembers(): TeamMember[] {
  try {
    return JSON.parse(localStorage.getItem("team") || "[]");
  } catch {
    return [];
  }
}

export function getAutohausData(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem("autohausData") || "{}");
  } catch {
    return {};
  }
}

export function getUploadedLogo(): string | null {
  return localStorage.getItem("uploadedLogo");
}

export type TimePeriod = "monat" | "letzter_monat" | "quartal" | "jahr" | "alle";

function isInPeriod(dateStr: string, period: TimePeriod): boolean {
  if (!dateStr || period === "alle") return true;
  const d = new Date(dateStr);
  const now = new Date();
  switch (period) {
    case "monat":
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    case "letzter_monat": {
      const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear();
    }
    case "quartal": {
      const q = Math.floor(now.getMonth() / 3);
      const dq = Math.floor(d.getMonth() / 3);
      return dq === q && d.getFullYear() === now.getFullYear();
    }
    case "jahr":
      return d.getFullYear() === now.getFullYear();
    default:
      return true;
  }
}

export function computeKPIs(period: TimePeriod) {
  const all = getFahrzeuge();
  const sold = all.filter(f => f.status === "verkauft" && isInPeriod(f.verkaufsDatum, period));
  const inStock = all.filter(f => f.status !== "verkauft");
  const listed = all.filter(f => f.status === "inseriert");

  const totalRevenue = sold.reduce((s, f) => s + (f.verkaufspreis || 0), 0);
  const avgStandzeitActive = inStock.length
    ? Math.round(inStock.reduce((s, f) => s + getStandzeit(f), 0) / inStock.length)
    : 0;

  const soldWithDates = sold.filter(f => f.ankaufDatum && f.verkaufsDatum);
  const avgStandzeitSold = soldWithDates.length
    ? Math.round(soldWithDates.reduce((s, f) => {
        const days = Math.floor((new Date(f.verkaufsDatum).getTime() - new Date(f.ankaufDatum).getTime()) / 86400000);
        return s + Math.max(0, days);
      }, 0) / soldWithDates.length)
    : 0;

  const avgMargin = sold.length
    ? Math.round(sold.reduce((s, f) => {
        const cost = f.gesamtkosten || f.einkaufspreis || 0;
        if (!cost) return s;
        return s + (((f.verkaufspreis || 0) - cost) / cost) * 100;
      }, 0) / sold.length)
    : 0;

  const boundCapital = inStock.reduce((s, f) => {
    return s + (f.einkaufspreis || 0) + (f.aufbereitungskosten || 0) + (f.transportkosten || 0) + (f.sonstigeKosten || 0);
  }, 0);

  return {
    totalRevenue,
    inStockCount: inStock.length,
    listedCount: listed.length,
    soldCount: sold.length,
    avgStandzeitActive,
    avgStandzeitSold,
    avgMargin,
    boundCapital,
  };
}

export function getMonthlyData(months: number = 6) {
  const all = getFahrzeuge();
  const sold = all.filter(f => f.status === "verkauft" && f.verkaufsDatum);
  const now = new Date();
  const result: { label: string; umsatz: number; marge: number; month: number; year: number }[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const m = d.getMonth();
    const y = d.getFullYear();
    const label = d.toLocaleString("de-DE", { month: "short" });
    const monthSold = sold.filter(f => {
      const vd = new Date(f.verkaufsDatum);
      return vd.getMonth() === m && vd.getFullYear() === y;
    });
    const umsatz = monthSold.reduce((s, f) => s + (f.verkaufspreis || 0), 0);
    const marge = monthSold.reduce((s, f) => {
      const cost = f.gesamtkosten || f.einkaufspreis || 0;
      return s + ((f.verkaufspreis || 0) - cost);
    }, 0);
    result.push({ label, umsatz, marge, month: m, year: y });
  }
  return result;
}

export function getStandzeitDistribution() {
  const inStock = getFahrzeuge().filter(f => f.status !== "verkauft");
  const brackets = [
    { name: "< 14 Tage", color: "hsl(var(--success))", count: 0 },
    { name: "14–30 Tage", color: "hsl(var(--warning))", count: 0 },
    { name: "30–60 Tage", color: "hsl(38, 92%, 40%)", count: 0 },
    { name: "> 60 Tage", color: "hsl(var(--destructive))", count: 0 },
  ];
  inStock.forEach(f => {
    const d = getStandzeit(f);
    if (d < 14) brackets[0].count++;
    else if (d < 30) brackets[1].count++;
    else if (d < 60) brackets[2].count++;
    else brackets[3].count++;
  });
  return brackets;
}

export function getMarkenDistribution() {
  const inStock = getFahrzeuge().filter(f => f.status !== "verkauft");
  const map: Record<string, number> = {};
  inStock.forEach(f => {
    const m = f.marke || "Unbekannt";
    map[m] = (map[m] || 0) + 1;
  });
  return Object.entries(map)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getTopStandzeit(n: number = 3) {
  const inStock = getFahrzeuge().filter(f => f.status !== "verkauft");
  return inStock
    .map(f => ({ ...f, standzeit: getStandzeit(f) }))
    .sort((a, b) => b.standzeit - a.standzeit)
    .slice(0, n);
}

export function getVerkauferPerformance(period: TimePeriod) {
  const team = getTeamMembers();
  const sold = getFahrzeuge().filter(f => f.status === "verkauft" && isInPeriod(f.verkaufsDatum, period));
  return team.map(member => {
    const sales = sold.filter(f => f.verkaeuferId === member.id);
    const umsatz = sales.reduce((s, f) => s + (f.verkaufspreis || 0), 0);
    const avgMargin = sales.length
      ? Math.round(sales.reduce((s, f) => {
          const cost = f.gesamtkosten || f.einkaufspreis || 0;
          if (!cost) return s;
          return s + (((f.verkaufspreis || 0) - cost) / cost) * 100;
        }, 0) / sales.length)
      : 0;
    const avgStandzeit = sales.length
      ? Math.round(sales.reduce((s, f) => {
          if (!f.ankaufDatum || !f.verkaufsDatum) return s;
          return s + Math.max(0, Math.floor((new Date(f.verkaufsDatum).getTime() - new Date(f.ankaufDatum).getTime()) / 86400000));
        }, 0) / sales.length)
      : 0;
    return {
      name: `${member.vorname} ${member.nachname}`,
      rolle: member.rolle,
      sales: sales.length,
      umsatz,
      avgMargin,
      avgStandzeit,
    };
  }).filter(v => v.sales > 0 || true);
}

export function getKIStats() {
  const texte = Number(localStorage.getItem("ki_inserate_count") || "0") || 12;
  const bewertungen = Number(localStorage.getItem("ki_bewertungen_count") || "0") || 8;
  const scans = Number(localStorage.getItem("ki_scans_count") || "0") || 5;
  const total = texte + bewertungen + scans;
  const minutes = total * 15;
  const hours = Math.round(minutes / 60 * 10) / 10;
  const roi = Math.round(hours * 45);
  return { texte, bewertungen, scans, total, minutes, hours, roi };
}

export function formatEuro(val: number): string {
  return val.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}
