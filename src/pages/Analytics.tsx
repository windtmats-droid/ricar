import { useState, useMemo, useRef } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Euro, Car, Tag, ShoppingCart, Clock, TrendingUp, Percent, Landmark,
  FileText, Mail, Brain, MessageSquare, Search, Timer, Sparkles, AlertTriangle,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  computeKPIs, getMonthlyData, getStandzeitDistribution, getMarkenDistribution,
  getTopStandzeit, getVerkauferPerformance, getKIStats, formatEuro,
  getAutohausData, getUploadedLogo, getTeamMembers,
  type TimePeriod,
} from "@/lib/analytics-helpers";
import { getFahrzeuge } from "@/lib/fahrzeuge-store";
import jsPDF from "jspdf";
import { cn } from "@/lib/utils";

const periodLabels: Record<TimePeriod, string> = {
  monat: "Dieser Monat",
  letzter_monat: "Letzter Monat",
  quartal: "Dieses Quartal",
  jahr: "Dieses Jahr",
  alle: "Gesamtzeitraum",
};

const Analytics = () => {
  const [period, setPeriod] = useState<TimePeriod>("alle");
  const kpis = useMemo(() => computeKPIs(period), [period]);
  const monthly = useMemo(() => getMonthlyData(6), []);
  const standzeitDist = useMemo(() => getStandzeitDistribution(), []);
  const markenDist = useMemo(() => getMarkenDistribution(), []);
  const topStandzeit = useMemo(() => getTopStandzeit(3), []);
  const verkauferPerf = useMemo(() => getVerkauferPerformance(period), [period]);
  const kiStats = useMemo(() => getKIStats(), []);
  const team = useMemo(() => getTeamMembers(), []);
  const autohaus = useMemo(() => getAutohausData(), []);
  const firmenname = autohaus.firmenname || autohaus.name || "Autohaus";

  const now = new Date();
  const monatJahr = now.toLocaleString("de-DE", { month: "long", year: "numeric" });

  const kpiCards = [
    { label: "Gesamtumsatz", value: formatEuro(kpis.totalRevenue), icon: Euro, color: "text-primary" },
    { label: "Fahrzeuge im Bestand", value: String(kpis.inStockCount), icon: Car, color: "text-primary" },
    { label: "Davon inseriert", value: String(kpis.listedCount), icon: Tag, color: "text-info" },
    { label: "Verkaufte Fahrzeuge", value: String(kpis.soldCount), icon: ShoppingCart, color: "text-success" },
    { label: "Ø Standzeit aktiv", value: `${kpis.avgStandzeitActive} T.`, icon: Clock, color: "text-warning" },
    { label: "Ø Standzeit verkauft", value: `${kpis.avgStandzeitSold} T.`, icon: Timer, color: "text-muted-foreground" },
    { label: "Ø Marge", value: `${kpis.avgMargin}%`, icon: Percent, color: "text-success" },
    { label: "Gebundenes Kapital", value: formatEuro(kpis.boundCapital), icon: Landmark, color: "text-destructive" },
  ];

  const avgEK = (() => {
    const inStock = getFahrzeuge().filter(f => f.status !== "verkauft");
    if (!inStock.length) return 0;
    return Math.round(inStock.reduce((s, f) => s + (f.einkaufspreis || 0), 0) / inStock.length);
  })();
  const avgVK = (() => {
    const sold = getFahrzeuge().filter(f => f.status === "verkauft" && f.verkaufspreis);
    if (!sold.length) return 0;
    return Math.round(sold.reduce((s, f) => s + (f.verkaufspreis || 0), 0) / sold.length);
  })();

  /* ---- PDF Export ---- */
  const handlePDFExport = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const w = doc.internal.pageSize.getWidth();
    const logo = getUploadedLogo();
    let y = 20;

    const addHeader = (pageNum: number, totalPages: number) => {
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text(firmenname, 14, 290);
      doc.text(now.toLocaleDateString("de-DE"), w / 2, 290, { align: "center" });
      doc.text(`Seite ${pageNum} / ${totalPages}`, w - 14, 290, { align: "right" });
    };

    // Cover
    if (logo) {
      try { doc.addImage(logo, "PNG", w / 2 - 20, 30, 40, 20); } catch {}
    }
    doc.setFontSize(22);
    doc.setTextColor(24, 95, 165);
    doc.text("Analytics Report", w / 2, 70, { align: "center" });
    doc.setFontSize(14);
    doc.setTextColor(60);
    doc.text(monatJahr, w / 2, 82, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Erstellt am ${now.toLocaleDateString("de-DE")}`, w / 2, 92, { align: "center" });
    doc.text(firmenname, w / 2, 100, { align: "center" });
    addHeader(1, 5);

    // Page 1 - KPIs
    doc.addPage();
    y = 20;
    doc.setFontSize(16); doc.setTextColor(24, 95, 165);
    doc.text("KPI-Übersicht", 14, y); y += 12;
    doc.setFontSize(10); doc.setTextColor(40);
    kpiCards.forEach(k => {
      doc.text(`${k.label}: ${k.value}`, 14, y); y += 8;
    });
    addHeader(2, 5);

    // Page 2 - Umsatz & Marge
    doc.addPage();
    y = 20;
    doc.setFontSize(16); doc.setTextColor(24, 95, 165);
    doc.text("Umsatz & Marge (letzte 6 Monate)", 14, y); y += 12;
    doc.setFontSize(10); doc.setTextColor(40);
    monthly.forEach(m => {
      doc.text(`${m.label}: Umsatz ${formatEuro(m.umsatz)} | Marge ${formatEuro(m.marge)}`, 14, y); y += 8;
    });
    addHeader(3, 5);

    // Page 3 - Bestand
    doc.addPage();
    y = 20;
    doc.setFontSize(16); doc.setTextColor(24, 95, 165);
    doc.text("Bestand & Standzeit-Analyse", 14, y); y += 12;
    doc.setFontSize(10); doc.setTextColor(40);
    standzeitDist.forEach(b => {
      doc.text(`${b.name}: ${b.count} Fahrzeuge`, 14, y); y += 8;
    });
    y += 4;
    doc.text("Top 3 längste Standzeiten:", 14, y); y += 8;
    topStandzeit.forEach(f => {
      doc.text(`${f.marke} ${f.modell} — ${f.standzeit} Tage`, 18, y); y += 7;
    });
    addHeader(4, 5);

    // Page 4 - KI
    doc.addPage();
    y = 20;
    doc.setFontSize(16); doc.setTextColor(24, 95, 165);
    doc.text("KI-Nutzung & ROI", 14, y); y += 12;
    doc.setFontSize(10); doc.setTextColor(40);
    doc.text(`KI-Inseratstexte generiert: ${kiStats.texte}`, 14, y); y += 8;
    doc.text(`KI-Postfach-Bewertungen: ${kiStats.bewertungen}`, 14, y); y += 8;
    doc.text(`Markt-Scans: ${kiStats.scans}`, 14, y); y += 8;
    doc.text(`Gesparte Zeit: ${kiStats.hours} Stunden`, 14, y); y += 8;
    doc.text(`ROI der KI: ${formatEuro(kiStats.roi)}`, 14, y); y += 8;
    y += 4;
    doc.text("Kapital-Analyse:", 14, y); y += 8;
    doc.text(`Gebundenes Kapital: ${formatEuro(kpis.boundCapital)}`, 14, y); y += 8;
    doc.text(`Ø Einkaufspreis: ${formatEuro(avgEK)}`, 14, y); y += 8;
    doc.text(`Ø Verkaufspreis: ${formatEuro(avgVK)}`, 14, y); y += 8;
    addHeader(5, 5);

    doc.save(`Analytics_Report_${now.toISOString().slice(0, 7)}.pdf`);
  };

  const handleEmail = () => {
    handlePDFExport();
    const subject = encodeURIComponent(`Analytics Report ${monatJahr} — ${firmenname}`);
    const body = encodeURIComponent(
      `Hallo,\n\nanbei der Analytics Report für ${monatJahr}.\n\n` +
      `Gesamtumsatz: ${formatEuro(kpis.totalRevenue)}\n` +
      `Verkaufte Fahrzeuge: ${kpis.soldCount}\n` +
      `Ø Marge: ${kpis.avgMargin}%\n` +
      `Gebundenes Kapital: ${formatEuro(kpis.boundCapital)}\n\n` +
      `Mit freundlichen Grüßen\n${firmenname}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Analytics</h1>
            <p className="text-xs text-muted-foreground">Geschäftsentwicklung und KI-Performance im Überblick</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={(v) => setPeriod(v as TimePeriod)}>
              <SelectTrigger className="w-[170px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(periodLabels).map(([k, v]) => (
                  <SelectItem key={k} value={k} className="text-xs">{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={handlePDFExport}>
              <FileText className="w-3.5 h-3.5" /> PDF Export
            </Button>
            <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={handleEmail}>
              <Mail className="w-3.5 h-3.5" /> Per E-Mail senden
            </Button>
          </div>
        </div>

        <div className="space-y-5">
          {/* Section 1: KPIs */}
          <div className="grid grid-cols-4 gap-3">
            {kpiCards.map(k => (
              <Card key={k.label} className="border-none shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={cn("p-1.5 rounded-md bg-accent/60", k.color)}>
                      <k.icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] text-muted-foreground">{k.label}</span>
                  </div>
                  <div className="text-xl font-bold text-foreground">{k.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Section 2: Umsatz & Marge */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium">Monatlicher Umsatz</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthly}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `€${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                        formatter={(v: number) => [formatEuro(v), "Umsatz"]}
                      />
                      <Bar dataKey="umsatz" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium">Monatliche Marge €</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthly}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `€${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                        formatter={(v: number) => [formatEuro(v), "Marge"]}
                      />
                      <Bar dataKey="marge" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section 3: Bestand-Analyse */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium">Standzeit-Verteilung</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={standzeitDist.filter(b => b.count > 0)}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        label={({ name, count }) => `${name}: ${count}`}
                      >
                        {standzeitDist.filter(b => b.count > 0).map((b, i) => (
                          <Cell key={i} fill={b.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium">Marken-Verteilung im Bestand</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="h-[220px]">
                  {markenDist.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-xs text-muted-foreground">Keine Fahrzeuge im Bestand</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={markenDist.slice(0, 8)} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={80} />
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                        <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section 4: KI-Nutzung & ROI */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> KI-Nutzung & ROI
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="grid grid-cols-5 gap-3">
                {[
                  { label: "KI-Inseratstexte", value: String(kiStats.texte), icon: FileText, desc: "Automatisch generierte Inseratstexte" },
                  { label: "Postfach-Bewertungen", value: String(kiStats.bewertungen), icon: MessageSquare, desc: "Automatisch bewertete Anfragen" },
                  { label: "Markt-Scans", value: String(kiStats.scans), icon: Search, desc: "Durchgeführte Marktanalysen" },
                  { label: "Gesparte Zeit", value: `${kiStats.hours} Std.`, icon: Timer, desc: `${kiStats.total} Aktionen × 15 Min.` },
                  { label: "ROI der KI", value: formatEuro(kiStats.roi), icon: TrendingUp, desc: `${kiStats.hours} Std. × 45 €/Std.` },
                ].map(item => (
                  <div key={item.label} className="bg-accent/40 rounded-xl p-4 text-center">
                    <item.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                    <div className="text-xl font-bold text-foreground">{item.value}</div>
                    <div className="text-[11px] font-medium text-foreground mt-1">{item.label}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Kapital-Analyse */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-medium">Kapital-Analyse</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-accent/30 rounded-xl p-5">
                  <div className="text-xs text-muted-foreground mb-1">Gebundenes Kapital</div>
                  <div className={cn("text-2xl font-bold", kpis.boundCapital > 100000 ? "text-destructive" : "text-foreground")}>
                    {formatEuro(kpis.boundCapital)}
                  </div>
                  {kpis.boundCapital > 100000 && (
                    <div className="flex items-center gap-1 mt-1 text-[11px] text-destructive">
                      <AlertTriangle className="w-3 h-3" /> Hohes gebundenes Kapital
                    </div>
                  )}
                </div>
                <div className="bg-accent/30 rounded-xl p-5">
                  <div className="text-xs text-muted-foreground mb-1">Ø EK vs. VK</div>
                  <div className="flex items-end gap-4 mt-1">
                    <div>
                      <div className="text-[10px] text-muted-foreground">Einkauf</div>
                      <div className="text-lg font-bold text-foreground">{formatEuro(avgEK)}</div>
                    </div>
                    <TrendingUp className="w-4 h-4 text-success mb-1" />
                    <div>
                      <div className="text-[10px] text-muted-foreground">Verkauf</div>
                      <div className="text-lg font-bold text-success">{formatEuro(avgVK)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top 3 Standzeiten */}
              {topStandzeit.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-foreground mb-2">Top 3 längste Standzeiten</div>
                  <div className="space-y-1.5">
                    {topStandzeit.map((f, i) => (
                      <div key={f.id} className="flex items-center justify-between bg-muted/60 rounded-lg px-3 py-2">
                        <span className="text-xs text-foreground">{f.marke} {f.modell} {f.baujahr && `(${f.baujahr})`}</span>
                        <span className={cn(
                          "text-xs font-semibold px-2 py-0.5 rounded-full",
                          f.standzeit > 60 ? "bg-destructive/15 text-destructive"
                            : f.standzeit > 30 ? "bg-warning/15 text-warning"
                            : "bg-muted text-muted-foreground"
                        )}>
                          {f.standzeit} Tage
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 6: Verkäufer-Performance */}
          {team.length > 0 && (
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium">Verkäufer-Performance</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground">
                        <th className="text-left py-2 font-medium">Verkäufer</th>
                        <th className="text-right py-2 font-medium">Verkäufe</th>
                        <th className="text-right py-2 font-medium">Umsatz</th>
                        <th className="text-right py-2 font-medium">Ø Marge</th>
                        <th className="text-right py-2 font-medium">Ø Standzeit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {verkauferPerf.map(v => (
                        <tr key={v.name} className="border-b border-border/50">
                          <td className="py-2.5 text-foreground font-medium">{v.name}</td>
                          <td className="py-2.5 text-right text-foreground">{v.sales}</td>
                          <td className="py-2.5 text-right text-foreground">{formatEuro(v.umsatz)}</td>
                          <td className="py-2.5 text-right text-foreground">{v.avgMargin}%</td>
                          <td className="py-2.5 text-right text-foreground">{v.avgStandzeit} T.</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Analytics;
