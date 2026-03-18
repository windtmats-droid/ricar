import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { getFahrzeuge, type Fahrzeug } from "@/lib/fahrzeuge-store";
import { getTeam, type TeamMember } from "@/components/fahrzeuge/VerkaufModal";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Clock, Car, Euro, Search, Eye, FileText, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

function standzeitDays(f: Fahrzeug): number {
  if (!f.ankaufDatum || !f.verkaufsDatum) return 0;
  return Math.max(0, Math.floor((new Date(f.verkaufsDatum).getTime() - new Date(f.ankaufDatum).getTime()) / 86400000));
}

function margeEuro(f: Fahrzeug): number {
  return (f.verkaufspreis || 0) - (f.gesamtkosten || f.einkaufspreis || 0);
}

function margeProzent(f: Fahrzeug): number {
  const cost = f.gesamtkosten || f.einkaufspreis || 0;
  if (!cost) return 0;
  return ((f.verkaufspreis || 0) - cost) / cost * 100;
}

type SortKey = "datum" | "marge" | "standzeit";
type DateRange = "alle" | "monat" | "quartal" | "jahr";

const Verkauf = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("datum");
  const [dateRange, setDateRange] = useState<DateRange>("alle");
  const [detailFahrzeug, setDetailFahrzeug] = useState<Fahrzeug | null>(null);
  const teamMembers = useMemo(() => getTeam(), []);

  const getVerkaeufername = (id?: string) => {
    if (!id) return "–";
    const m = teamMembers.find(t => t.id === id);
    return m ? `${m.vorname} ${m.nachname}` : "–";
  };

  const verkaufte = useMemo(() => {
    let list = getFahrzeuge().filter((f) => f.status === "verkauft");

    // Date filter
    if (dateRange !== "alle") {
      const now = new Date();
      const cutoff = new Date();
      if (dateRange === "monat") cutoff.setMonth(now.getMonth() - 1);
      else if (dateRange === "quartal") cutoff.setMonth(now.getMonth() - 3);
      else if (dateRange === "jahr") cutoff.setFullYear(now.getFullYear() - 1);
      list = list.filter((f) => new Date(f.verkaufsDatum) >= cutoff);
    }

    // Search
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((f) =>
        `${f.marke} ${f.modell} ${getVerkaeufername(f.verkaeuferId)}`.toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === "datum") return new Date(b.verkaufsDatum).getTime() - new Date(a.verkaufsDatum).getTime();
      if (sortBy === "marge") return margeProzent(b) - margeProzent(a);
      return standzeitDays(b) - standzeitDays(a);
    });

    return list;
  }, [search, sortBy, dateRange]);

  // KPIs
  const gesamtUmsatz = verkaufte.reduce((s, f) => s + (f.verkaufspreis || 0), 0);
  const avgMarge = verkaufte.length ? verkaufte.reduce((s, f) => s + margeProzent(f), 0) / verkaufte.length : 0;
  const avgStandzeit = verkaufte.length ? verkaufte.reduce((s, f) => s + standzeitDays(f), 0) / verkaufte.length : 0;

  const standzeitColor = (d: number) =>
    d > 60 ? "text-red-600 dark:text-red-400" : d > 30 ? "text-orange-600 dark:text-orange-400" : "text-green-600 dark:text-green-400";

  const margeColor = (v: number) => v >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";

  const df = detailFahrzeug;

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-lg font-medium text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> Verkauf
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Verkaufshistorie und Margen-Analyse</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {[
            { label: "Gesamtumsatz", value: `€ ${gesamtUmsatz.toLocaleString("de-DE")}`, icon: Euro, color: "text-primary" },
            { label: "Ø Marge", value: `${avgMarge.toFixed(1)}%`, icon: TrendingUp, color: avgMarge >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500" },
            { label: "Ø Standzeit", value: `${Math.round(avgStandzeit)} Tage`, icon: Clock, color: standzeitColor(avgStandzeit) },
            { label: "Verkaufte Fahrzeuge", value: String(verkaufte.length), icon: Car, color: "text-foreground" },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <kpi.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground">{kpi.label}</span>
              </div>
              <p className={cn("text-xl font-semibold", kpi.color)}>{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Fahrzeug oder Käufer suchen..." className="pl-9 text-xs h-8" />
          </div>
          <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
            <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="alle">Alle</SelectItem>
              <SelectItem value="monat">Letzter Monat</SelectItem>
              <SelectItem value="quartal">Letztes Quartal</SelectItem>
              <SelectItem value="jahr">Letztes Jahr</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
            <SelectTrigger className="w-36 h-8 text-xs gap-1"><ArrowUpDown className="w-3 h-3" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="datum">Datum</SelectItem>
              <SelectItem value="marge">Marge</SelectItem>
              <SelectItem value="standzeit">Standzeit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {verkaufte.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Car className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Noch keine Fahrzeuge verkauft.</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Fahrzeug</th>
                    <th className="text-right px-3 py-3 font-medium text-muted-foreground">Einkauf</th>
                    <th className="text-right px-3 py-3 font-medium text-muted-foreground">Verkauf</th>
                    <th className="text-right px-3 py-3 font-medium text-muted-foreground">Marge</th>
                    <th className="text-center px-3 py-3 font-medium text-muted-foreground">Standzeit</th>
                    <th className="text-left px-3 py-3 font-medium text-muted-foreground">Verkäufer</th>
                    <th className="text-left px-3 py-3 font-medium text-muted-foreground">Datum</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {verkaufte.map((f) => {
                    const me = margeEuro(f);
                    const mp = margeProzent(f);
                    const sd = standzeitDays(f);
                    return (
                      <tr key={f.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                              {f.fotos?.[0] ? <img src={f.fotos[0]} alt="" className="w-full h-full object-cover" /> : <Car className="w-4 h-4 text-muted-foreground/40" />}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{f.marke} {f.modell}</p>
                              <p className="text-[10px] text-muted-foreground">{f.baujahr}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-right px-3 py-3 text-muted-foreground">€ {(f.einkaufspreis || 0).toLocaleString("de-DE")}</td>
                        <td className="text-right px-3 py-3 font-medium text-foreground">€ {(f.verkaufspreis || 0).toLocaleString("de-DE")}</td>
                        <td className="text-right px-3 py-3">
                          <span className={cn("font-medium", margeColor(me))}>
                            {me >= 0 ? "+" : ""}€ {me.toLocaleString("de-DE")}
                          </span>
                          <span className={cn("block text-[10px]", margeColor(mp))}>
                            {mp >= 0 ? "+" : ""}{mp.toFixed(1)}%
                          </span>
                        </td>
                        <td className="text-center px-3 py-3">
                          <span className={cn("font-medium", standzeitColor(sd))}>{sd} Tage</span>
                        </td>
                        <td className="px-3 py-3 text-foreground">{getVerkaeufername(f.verkaeuferId)}</td>
                        <td className="px-3 py-3 text-muted-foreground">{f.verkaufsDatum ? new Date(f.verkaufsDatum).toLocaleDateString("de-DE") : "–"}</td>
                        <td className="text-right px-4 py-3">
                          <div className="flex justify-end gap-1.5">
                            <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1" onClick={() => setDetailFahrzeug(f)}>
                              <Eye className="w-3 h-3" /> Details
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1" onClick={() => navigate("/dokumente")}>
                              <FileText className="w-3 h-3" /> Dokument
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detail Slide-over */}
        <Sheet open={!!df} onOpenChange={(o) => !o && setDetailFahrzeug(null)}>
          <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
            {df && (
              <>
                <SheetHeader className="mb-5">
                  <SheetTitle>{df.marke} {df.modell}</SheetTitle>
                  <SheetDescription>{df.baujahr} · {df.fin || "Keine FIN"}</SheetDescription>
                </SheetHeader>

                <div className="space-y-5">
                  {/* Vehicle photo */}
                  {df.fotos?.[0] && (
                    <div className="aspect-[16/9] rounded-lg overflow-hidden bg-muted">
                      <img src={df.fotos[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Fahrzeugdaten */}
                  <section>
                    <h3 className="text-xs font-semibold text-foreground mb-2">Fahrzeugdaten</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                      {[
                        ["Marke", df.marke], ["Modell", df.modell], ["Baujahr", df.baujahr],
                        ["Kilometerstand", df.km ? `${Number(df.km).toLocaleString("de-DE")} km` : "–"],
                        ["Kraftstoff", df.kraftstoff], ["Getriebe", df.getriebe],
                        ["Farbe", df.farbe], ["Zustand", df.zustand], ["FIN", df.fin || "–"],
                      ].map(([l, v]) => (
                        <div key={l} className="flex justify-between py-1 border-b border-border/50">
                          <span className="text-muted-foreground">{l}</span>
                          <span className="font-medium text-foreground">{v || "–"}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Kaufdetails */}
                  <section>
                    <h3 className="text-xs font-semibold text-foreground mb-2">Kaufdetails</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                      {[
                        ["Einkaufspreis", `€ ${(df.einkaufspreis || 0).toLocaleString("de-DE")}`],
                        ["Aufbereitung", `€ ${(df.aufbereitungskosten || 0).toLocaleString("de-DE")}`],
                        ["Transport", `€ ${(df.transportkosten || 0).toLocaleString("de-DE")}`],
                        ["Sonstige", `€ ${(df.sonstigeKosten || 0).toLocaleString("de-DE")}`],
                        ["Gesamtkosten", `€ ${(df.gesamtkosten || 0).toLocaleString("de-DE")}`],
                      ].map(([l, v]) => (
                        <div key={l} className="flex justify-between py-1 border-b border-border/50">
                          <span className="text-muted-foreground">{l}</span>
                          <span className="font-medium text-foreground">{v}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Verkaufsdetails */}
                  <section>
                    <h3 className="text-xs font-semibold text-foreground mb-2">Verkaufsdetails</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                      {[
                        ["Verkaufspreis", `€ ${(df.verkaufspreis || 0).toLocaleString("de-DE")}`],
                        ["Käufer", df.kaeuferName || "–"],
                        ["Telefon", df.kaeuferTelefon || "–"],
                        ["E-Mail", df.kaeuferEmail || "–"],
                        ["Datum", df.verkaufsDatum ? new Date(df.verkaufsDatum).toLocaleDateString("de-DE") : "–"],
                        ["Zahlungsart", df.zahlungsart || "–"],
                      ].map(([l, v]) => (
                        <div key={l} className="flex justify-between py-1 border-b border-border/50">
                          <span className="text-muted-foreground">{l}</span>
                          <span className="font-medium text-foreground">{v}</span>
                        </div>
                      ))}
                    </div>
                    {df.verkaufsNotizen && (
                      <p className="text-xs text-muted-foreground mt-2 bg-muted/50 rounded-lg p-3">{df.verkaufsNotizen}</p>
                    )}
                  </section>

                  {/* Marge bar */}
                  <section>
                    <h3 className="text-xs font-semibold text-foreground mb-2">Marge-Analyse</h3>
                    <div className="space-y-2">
                      {(() => {
                        const cost = df.gesamtkosten || df.einkaufspreis || 0;
                        const sale = df.verkaufspreis || 0;
                        const maxVal = Math.max(cost, sale, 1);
                        const me = sale - cost;
                        const mp = cost ? (me / cost) * 100 : 0;
                        return (
                          <>
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-[11px]">
                                <span className="text-muted-foreground">Einkauf</span>
                                <span className="font-medium">€ {cost.toLocaleString("de-DE")}</span>
                              </div>
                              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-red-400/70 rounded-full" style={{ width: `${(cost / maxVal) * 100}%` }} />
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-[11px]">
                                <span className="text-muted-foreground">Verkauf</span>
                                <span className="font-medium">€ {sale.toLocaleString("de-DE")}</span>
                              </div>
                              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                                <div className={cn("h-full rounded-full", me >= 0 ? "bg-green-500/70" : "bg-red-500/70")} style={{ width: `${(sale / maxVal) * 100}%` }} />
                              </div>
                            </div>
                            <p className={cn("text-sm font-semibold text-center pt-1", margeColor(me))}>
                              {me >= 0 ? "+" : ""}€ {me.toLocaleString("de-DE")} ({mp >= 0 ? "+" : ""}{mp.toFixed(1)}%)
                            </p>
                          </>
                        );
                      })()}
                    </div>
                  </section>

                  {/* Standzeit timeline */}
                  <section>
                    <h3 className="text-xs font-semibold text-foreground mb-2">Standzeit</h3>
                    <div className="bg-muted/50 rounded-lg p-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Angekauft am</span>
                        <span className="font-medium">{df.ankaufDatum ? new Date(df.ankaufDatum).toLocaleDateString("de-DE") : "–"}</span>
                        <span className="text-muted-foreground">→ Verkauft am</span>
                        <span className="font-medium">{df.verkaufsDatum ? new Date(df.verkaufsDatum).toLocaleDateString("de-DE") : "–"}</span>
                      </div>
                      <p className={cn("text-lg font-semibold mt-1", standzeitColor(standzeitDays(df)))}>
                        = {standzeitDays(df)} Tage
                      </p>
                    </div>
                  </section>

                  {/* Action buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1 text-xs gap-1.5" onClick={() => navigate("/dokumente")}>
                      <FileText className="w-3.5 h-3.5" /> Kaufvertrag erstellen
                    </Button>
                    <Button variant="outline" className="flex-1 text-xs gap-1.5" onClick={() => navigate("/dokumente")}>
                      <FileText className="w-3.5 h-3.5" /> Rechnung erstellen
                    </Button>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </main>
    </div>
  );
};

export default Verkauf;
