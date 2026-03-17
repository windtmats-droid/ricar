export interface LeadRow {
  id: string;
  sender_name: string;
  sender_email: string | null;
  sender_phone: string | null;
  fahrzeug_id: string | null;
  fahrzeug_label: string | null;
  fahrzeug_preis: number | null;
  status: string;
  quelle: string;
  prioritaet: string;
  notizen: Array<{ text: string; timestamp: string }>;
  ki_zusammenfassung: string | null;
  erstellt_at: string;
  letzte_aktivitaet_at: string;
  anfrage_id: string | null;
}

export const SAMPLE_LEADS: LeadRow[] = [
  {
    id: "l1", sender_name: "Klaus Weber", sender_email: "k.weber@email.de", sender_phone: "+49 170 1234567",
    fahrzeug_id: "s1", fahrzeug_label: "BMW 320d 2021", fahrzeug_preis: 28500,
    status: "Neu", quelle: "Mobile.de", prioritaet: "Hoch",
    notizen: [], ki_zusammenfassung: "Klaus Weber interessiert sich aktiv für den BMW 320d. Schnelle Reaktion empfohlen — Kaufwahrscheinlichkeit hoch. Bisher 1 Anfrage über Mobile.de, keine Preisverhandlung erkennbar.",
    erstellt_at: new Date(Date.now() - 12 * 60000).toISOString(),
    letzte_aktivitaet_at: new Date(Date.now() - 12 * 60000).toISOString(), anfrage_id: null,
  },
  {
    id: "l2", sender_name: "Thomas Becker", sender_email: "t.becker@gmail.com", sender_phone: "+49 171 9876543",
    fahrzeug_id: "s3", fahrzeug_label: "VW Golf 8 GTI", fahrzeug_preis: 38500,
    status: "Kontaktiert", quelle: "E-Mail", prioritaet: "Hoch",
    notizen: [{ text: "Probefahrt vereinbart für Donnerstag", timestamp: new Date(Date.now() - 3600000).toISOString() }],
    ki_zusammenfassung: "Thomas Becker hat konkretes Kaufinteresse am Golf GTI. Probefahrtanfrage deutet auf fortgeschrittene Kaufentscheidung hin.",
    erstellt_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    letzte_aktivitaet_at: new Date(Date.now() - 2 * 3600000).toISOString(), anfrage_id: null,
  },
  {
    id: "l3", sender_name: "Sandra Müller", sender_email: "s.mueller@web.de", sender_phone: null,
    fahrzeug_id: "s2", fahrzeug_label: "Audi A4 Avant", fahrzeug_preis: 32900,
    status: "Neu", quelle: "AutoScout24", prioritaet: "Mittel",
    notizen: [], ki_zusammenfassung: "Sandra Müller fragt nach Unfallfreiheit — deutet auf ernsthaftes Interesse hin, aber noch in der Vergleichsphase.",
    erstellt_at: new Date(Date.now() - 3600000).toISOString(),
    letzte_aktivitaet_at: new Date(Date.now() - 3600000).toISOString(), anfrage_id: null,
  },
  {
    id: "l4", sender_name: "Maria Schmidt", sender_email: "maria.s@t-online.de", sender_phone: "+49 172 5551234",
    fahrzeug_id: "s4", fahrzeug_label: "Mercedes C200", fahrzeug_preis: 24900,
    status: "Angebot", quelle: "Mobile.de", prioritaet: "Mittel",
    notizen: [{ text: "Angebot über €23.500 unterbreitet", timestamp: new Date(Date.now() - 86400000).toISOString() }],
    ki_zusammenfassung: "Maria Schmidt verhandelt aktiv. Preisbereitschaft vorhanden, Abschluss wahrscheinlich bei Entgegenkommen.",
    erstellt_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    letzte_aktivitaet_at: new Date(Date.now() - 86400000).toISOString(), anfrage_id: null,
  },
  {
    id: "l5", sender_name: "Peter Hoffmann", sender_email: "p.hoffmann@gmx.de", sender_phone: null,
    fahrzeug_id: "s1", fahrzeug_label: "BMW 320d 2021", fahrzeug_preis: 28500,
    status: "Kontaktiert", quelle: "AutoScout24", prioritaet: "Niedrig",
    notizen: [], ki_zusammenfassung: "Peter Hoffmann fragt nach Finanzierung — eher unverbindliches Interesse, Priorität niedrig.",
    erstellt_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    letzte_aktivitaet_at: new Date(Date.now() - 86400000).toISOString(), anfrage_id: null,
  },
  {
    id: "l6", sender_name: "Julia Lang", sender_email: "j.lang@email.de", sender_phone: "+49 173 4445566",
    fahrzeug_id: "s5", fahrzeug_label: "Opel Insignia", fahrzeug_preis: 16400,
    status: "Verloren", quelle: "E-Mail", prioritaet: "Niedrig",
    notizen: [{ text: "Hat sich für ein anderes Fahrzeug entschieden", timestamp: new Date(Date.now() - 3 * 86400000).toISOString() }],
    ki_zusammenfassung: "Julia Lang hat sich anderweitig entschieden. Lead verloren.",
    erstellt_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    letzte_aktivitaet_at: new Date(Date.now() - 3 * 86400000).toISOString(), anfrage_id: null,
  },
  {
    id: "l7", sender_name: "Andreas Krause", sender_email: "a.krause@gmail.com", sender_phone: "+49 174 7778899",
    fahrzeug_id: "s2", fahrzeug_label: "Audi A4 Avant", fahrzeug_preis: 32900,
    status: "Gewonnen", quelle: "Mobile.de", prioritaet: "Mittel",
    notizen: [{ text: "Kaufvertrag unterschrieben", timestamp: new Date(Date.now() - 2 * 86400000).toISOString() }],
    ki_zusammenfassung: "Andreas Krause hat den Audi A4 Avant gekauft. Lead abgeschlossen.",
    erstellt_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    letzte_aktivitaet_at: new Date(Date.now() - 2 * 86400000).toISOString(), anfrage_id: null,
  },
  {
    id: "l8", sender_name: "Sabine Wolf", sender_email: "s.wolf@web.de", sender_phone: null,
    fahrzeug_id: "s3", fahrzeug_label: "VW Golf 8 GTI", fahrzeug_preis: 38500,
    status: "Neu", quelle: "AutoScout24", prioritaet: "Niedrig",
    notizen: [], ki_zusammenfassung: "Sabine Wolf fragt nach Extras — unverbindliche Anfrage, Priorität niedrig.",
    erstellt_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    letzte_aktivitaet_at: new Date(Date.now() - 3 * 86400000).toISOString(), anfrage_id: null,
  },
];

export const LEAD_STATUSES = ["Neu", "Kontaktiert", "Angebot", "Gewonnen", "Verloren"] as const;
export const LEAD_QUELLEN = ["Mobile.de", "AutoScout24", "E-Mail", "Direkt"] as const;
export const LEAD_PRIORITAETEN = ["Hoch", "Mittel", "Niedrig"] as const;

export function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `vor ${mins} Min.`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `vor ${hours} Std.`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "gestern";
  return `vor ${days} Tagen`;
}

export function getStatusStyle(status: string) {
  switch (status) {
    case "Neu": return "bg-[hsl(211,72%,95%)] text-[hsl(211,72%,37%)]";
    case "Kontaktiert": return "bg-[hsl(45,100%,94%)] text-[hsl(24,100%,45%)]";
    case "Angebot": return "bg-[hsl(270,80%,95%)] text-[hsl(263,70%,58%)]";
    case "Gewonnen": return "bg-[hsl(120,35%,92%)] text-[hsl(122,39%,34%)]";
    case "Verloren": return "bg-[hsl(0,69%,95%)] text-[hsl(0,58%,47%)]";
    default: return "bg-muted text-muted-foreground";
  }
}

export function getQuelleStyle(quelle: string) {
  switch (quelle) {
    case "Mobile.de": return "bg-primary/10 text-primary";
    case "AutoScout24": return "bg-warning/15 text-warning";
    default: return "bg-muted text-muted-foreground";
  }
}

export function getPrioStyle(prio: string) {
  switch (prio) {
    case "Hoch": return { dot: "bg-[hsl(122,39%,34%)]", text: "text-[hsl(122,39%,34%)]" };
    case "Mittel": return { dot: "bg-warning", text: "text-warning" };
    default: return { dot: "bg-muted-foreground", text: "text-muted-foreground" };
  }
}
