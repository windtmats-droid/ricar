import { AlertTriangle, Pencil, Trash2, Plus, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ALARME = [
  { fahrzeug: "Opel Insignia 2018", eigenerPreis: 16400, marktpreis: 13200, diff: 3200, empfehlung: "Preisanpassung auf €13.000–€13.500 empfohlen" },
  { fahrzeug: "Mercedes C200 2019", eigenerPreis: 24900, marktpreis: 22100, diff: 2800, empfehlung: "Preisanpassung auf €21.800–€22.500 empfohlen" },
  { fahrzeug: "Audi A4 Avant 2020", eigenerPreis: 32900, marktpreis: 30400, diff: 2500, empfehlung: "Preisanpassung auf €30.000–€30.800 empfohlen" },
];

const SCAN_ERGEBNISSE = [
  { fahrzeug: "BMW 320d 2021", preis: 28500, markt: 26800, diff: 1700, angebote: 31, status: "Zu teuer" },
  { fahrzeug: "Audi A4 Avant 2020", preis: 32900, markt: 30400, diff: 2500, angebote: 28, status: "Zu teuer" },
  { fahrzeug: "VW Golf 8 GTI 2022", preis: 38500, markt: 39200, diff: -700, angebote: 19, status: "Gut bewertet" },
  { fahrzeug: "Mercedes C200 2019", preis: 24900, markt: 22100, diff: 2800, angebote: 44, status: "Zu teuer" },
  { fahrzeug: "Opel Insignia 2018", preis: 16400, markt: 13200, diff: 3200, angebote: 22, status: "Zu teuer" },
  { fahrzeug: "BMW 318d 2020", preis: 22900, markt: 23400, diff: -500, angebote: 37, status: "Gut bewertet" },
  { fahrzeug: "VW Passat 2019", preis: 18500, markt: 18200, diff: 300, angebote: 41, status: "Im Markt" },
  { fahrzeug: "Skoda Octavia 2021", preis: 21900, markt: 22100, diff: -200, angebote: 29, status: "Gut bewertet" },
];

const SUCHPROFILE = [
  { id: "sp1", name: "Diesel-SUVs", desc: "€25k–€45k · Bj. 2019–2022 · bis 80.000 km · 100km Umkreis" },
  { id: "sp2", name: "Kompakt Benziner", desc: "€15k–€25k · Bj. 2020–2023 · bis 60.000 km · 50km Umkreis" },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "Zu teuer": return "bg-destructive/10 text-destructive";
    case "Im Markt": return "bg-[hsl(120,35%,92%)] text-[hsl(122,39%,34%)]";
    case "Gut bewertet": return "bg-primary/10 text-primary";
    default: return "bg-muted text-muted-foreground";
  }
}

export function AutoScanTab() {
  return (
    <div className="space-y-4">
      {/* Status Card */}
      <div className="bg-card border border-border rounded-xl p-[18px] space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-[14px] font-medium text-foreground">Täglicher Auto-Scan</h3>
          <span className="w-2 h-2 rounded-full bg-[hsl(122,39%,34%)]" />
          <Badge className="bg-[hsl(120,35%,92%)] text-[hsl(122,39%,34%)] border-0 text-[10px]">Aktiv</Badge>
        </div>
        <p className="text-[12px] text-muted-foreground">Läuft täglich um 06:00 Uhr · Scannt alle Fahrzeuge im Bestand automatisch</p>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Fahrzeuge gescannt", value: "34" },
            { label: "Letzter Scan", value: "Heute 06:00" },
            { label: "Preisalarme", value: "3", badge: true },
          ].map((m) => (
            <div key={m.label} className="bg-muted/50 rounded-lg p-3 text-center">
              <div className="text-[11px] text-muted-foreground">{m.label}</div>
              <div className="text-[20px] font-medium text-foreground mt-1 flex items-center justify-center gap-1.5">
                {m.value}
                {m.badge && <span className="px-1.5 py-0.5 rounded-full bg-destructive text-destructive-foreground text-[9px] font-semibold">3</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Preisalarme */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="text-[13px] font-medium text-foreground">Aktuelle Preisalarme</h4>
            <span className="px-1.5 py-0.5 rounded-full bg-destructive text-destructive-foreground text-[9px] font-semibold">3</span>
          </div>
          {ALARME.map((a, i) => (
            <div key={i} className="bg-destructive/5 border-l-[3px] border-destructive rounded-r-lg p-[10px] px-[14px]">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[13px] font-medium text-foreground flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                    {a.fahrzeug}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Ihr Preis €{a.eigenerPreis.toLocaleString("de-DE")} · Markt-Ø €{a.marktpreis.toLocaleString("de-DE")} · <span className="text-destructive font-medium">▲ €{a.diff.toLocaleString("de-DE")} über Markt</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{a.empfehlung}</div>
                </div>
                <Button variant="link" size="sm" className="text-[11px] text-primary p-0 h-auto shrink-0">Jetzt anpassen</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scan-Ergebnisse Tabelle */}
      <div className="bg-card border border-border rounded-xl p-[18px] space-y-3">
        <h3 className="text-[13px] font-medium text-foreground">Letzte Scan-Ergebnisse — 17. März 2026, 06:00 Uhr</h3>
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-9">Fahrzeug</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-9">Ihr Preis</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-9">Markt-Ø</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-9">Differenz</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-9">Angebote</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-9">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SCAN_ERGEBNISSE.map((s, i) => (
                <TableRow key={i} className="h-11">
                  <TableCell className="text-[12px] font-medium py-2">{s.fahrzeug}</TableCell>
                  <TableCell className="text-[12px] py-2">€{s.preis.toLocaleString("de-DE")}</TableCell>
                  <TableCell className="text-[12px] py-2">€{s.markt.toLocaleString("de-DE")}</TableCell>
                  <TableCell className="text-[12px] py-2">
                    <span className={s.diff > 0 ? "text-destructive font-medium" : s.diff < -400 ? "text-[hsl(122,39%,34%)] font-medium" : "text-warning font-medium"}>
                      {s.diff > 0 ? "▲" : "▼"} €{Math.abs(s.diff).toLocaleString("de-DE")}
                    </span>
                  </TableCell>
                  <TableCell className="text-[12px] py-2">{s.angebote}</TableCell>
                  <TableCell className="py-2">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getStatusBadge(s.status)}`}>{s.status}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Suchprofile */}
      <div className="bg-card border border-border rounded-xl p-[18px] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[13px] font-medium text-foreground">Gespeicherte Suchprofile</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Diese Fahrzeugklassen werden täglich zusätzlich gescannt</p>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 text-[12px] h-8">
            <Plus className="w-3.5 h-3.5" />
            Profil hinzufügen
          </Button>
        </div>
        <div className="space-y-2">
          {SUCHPROFILE.map((p) => (
            <div key={p.id} className="bg-muted/50 rounded-lg p-3 flex items-center justify-between">
              <div>
                <div className="text-[13px] font-medium text-foreground">{p.name}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{p.desc}</div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
