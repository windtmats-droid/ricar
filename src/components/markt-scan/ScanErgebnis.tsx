import { BarChart3, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const SAMPLE_RESULT = {
  header: "BMW 320d · Diesel · 2019–2022 · 50.000–90.000 km",
  sub: "100 km Umkreis · 47 Angebote gefunden",
  timestamp: "Scan vom 17. März 2026, 10:15 Uhr",
  avg: 24800,
  min: 18900,
  max: 32500,
  minLabel: "VW Passat, 2019, 87.000 km",
  maxLabel: "BMW 320d, 2022, 28.000 km",
  eigenerPreis: 28500,
  distribution: [
    { label: "unter €20k", count: 8, pct: 17 },
    { label: "€20k–€24k", count: 14, pct: 30 },
    { label: "€24k–€28k", count: 16, pct: 34 },
    { label: "€28k–€32k", count: 6, pct: 13 },
    { label: "über €32k", count: 3, pct: 6 },
  ],
  vergleich: [
    { fahrzeug: "BMW 320d Touring", preis: 23900, km: 72000, baujahr: 2020, quelle: "Mobile.de" },
    { fahrzeug: "BMW 320d Limousine", preis: 25400, km: 58000, baujahr: 2021, quelle: "AutoScout24" },
    { fahrzeug: "BMW 318d Sport Line", preis: 22800, km: 84000, baujahr: 2019, quelle: "Mobile.de" },
    { fahrzeug: "BMW 320d xDrive", preis: 27900, km: 45000, baujahr: 2021, quelle: "AutoScout24" },
    { fahrzeug: "BMW 320d M Sport", preis: 29500, km: 38000, baujahr: 2022, quelle: "Mobile.de" },
  ],
};

interface ScanErgebnisProps {
  showResult?: boolean;
}

export function ScanErgebnis({ showResult = true }: ScanErgebnisProps) {
  const r = SAMPLE_RESULT;
  const diff = r.eigenerPreis - r.avg;

  if (!showResult) {
    return (
      <div className="bg-card border border-border rounded-xl p-[18px] flex flex-col items-center justify-center min-h-[350px]">
        <BarChart3 className="w-12 h-12 text-muted-foreground/40 mb-3" />
        <p className="text-[14px] text-muted-foreground font-medium">Noch kein Scan durchgeführt</p>
        <p className="text-[12px] text-muted-foreground mt-1">Konfiguriere links einen Scan und klicke &apos;Scan starten&apos;</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-[18px] space-y-5">
      {/* Header */}
      <div>
        <div className="text-[13px] font-medium text-foreground">{r.header}</div>
        <div className="text-[12px] text-muted-foreground">{r.sub}</div>
        <div className="text-[11px] text-muted-foreground mt-0.5">{r.timestamp}</div>
      </div>

      {/* Price Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <div className="text-[11px] text-muted-foreground">Ø Marktpreis</div>
          <div className="text-[22px] font-medium text-primary mt-1">€{r.avg.toLocaleString("de-DE")}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">basierend auf 47 Angeboten</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <div className="text-[11px] text-muted-foreground">Günstigstes</div>
          <div className="text-[22px] font-medium text-[hsl(122,39%,34%)] mt-1">€{r.min.toLocaleString("de-DE")}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">{r.minLabel}</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <div className="text-[11px] text-muted-foreground">Teuerstes</div>
          <div className="text-[22px] font-medium text-warning mt-1">€{r.max.toLocaleString("de-DE")}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">{r.maxLabel}</div>
        </div>
      </div>

      {/* Eigener Preis Vergleich */}
      <div className="space-y-2">
        <div className="flex items-center gap-3 text-[12px]">
          <span className="text-foreground font-medium">Ihr Preis: €{r.eigenerPreis.toLocaleString("de-DE")}</span>
          <span className="text-muted-foreground">Markt-Ø: €{r.avg.toLocaleString("de-DE")}</span>
          <span className="px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-[11px] font-medium">
            ▲ €{diff.toLocaleString("de-DE")} über Markt
          </span>
        </div>
        <div className="bg-primary/5 border-l-[3px] border-primary rounded-r-lg p-3 flex items-start gap-2">
          <Badge variant="info" className="text-[9px] px-1.5 py-0 shrink-0 mt-0.5">KI</Badge>
          <p className="text-[12px] text-foreground leading-relaxed">
            Preisanpassung empfohlen: Reduzierung auf €24.500–€25.500 könnte Standzeit um ~40% verkürzen.
          </p>
        </div>
      </div>

      {/* Distribution */}
      <div className="space-y-2">
        <div className="text-[12px] font-medium text-foreground">Preisverteilung der 47 Angebote</div>
        <div className="space-y-1.5">
          {r.distribution.map((d) => (
            <div key={d.label} className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground w-[80px] shrink-0 text-right">{d.label}</span>
              <div className="flex-1 h-5 bg-muted/50 rounded overflow-hidden">
                <div
                  className="h-full rounded bg-primary/70 transition-all"
                  style={{ width: `${d.pct}%` }}
                />
              </div>
              <span className="text-[11px] text-muted-foreground w-[70px] shrink-0">{d.count} Angebote</span>
            </div>
          ))}
        </div>
      </div>

      {/* Vergleichsangebote */}
      <div className="space-y-2">
        <div className="text-[12px] font-medium text-foreground">Top 5 Vergleichsangebote</div>
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8">Fahrzeug</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8">Preis</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8">KM</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8">Baujahr</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8">Quelle</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8 w-20">Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {r.vergleich.map((v, i) => (
                <TableRow key={i} className="h-10">
                  <TableCell className="text-[12px] py-2">{v.fahrzeug}</TableCell>
                  <TableCell className="text-[12px] font-medium py-2">€{v.preis.toLocaleString("de-DE")}</TableCell>
                  <TableCell className="text-[12px] py-2">{v.km.toLocaleString("de-DE")} km</TableCell>
                  <TableCell className="text-[12px] py-2">{v.baujahr}</TableCell>
                  <TableCell className="py-2">
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${v.quelle === "Mobile.de" ? "bg-primary/10 text-primary" : "bg-warning/15 text-warning"}`}>
                      {v.quelle}
                    </span>
                  </TableCell>
                  <TableCell className="py-2">
                    <button className="text-[11px] text-primary hover:underline flex items-center gap-0.5">
                      Anzeige <ExternalLink className="w-3 h-3" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
