import { useState } from "react";
import { Loader2, Search, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface ScanResult {
  markt?: {
    durchschnitt?: number;
    minimum?: number;
    maximum?: number;
    anzahl?: number;
    preise?: number[];
  };
  analyse?: {
    bewertung?: string;
    empfehlung?: string;
    marktpreis?: number;
    differenz_pct?: number;
  };
  [key: string]: any;
}

function getBewertungStyle(bewertung: string) {
  const lower = bewertung.toLowerCase();
  if (lower.includes("gut") || lower.includes("günstig") || lower.includes("fair")) {
    return { bg: "bg-[hsl(120,35%,92%)]", text: "text-[hsl(122,39%,34%)]", icon: TrendingDown };
  }
  if (lower.includes("teuer") || lower.includes("hoch") || lower.includes("überteuert")) {
    return { bg: "bg-destructive/10", text: "text-destructive", icon: TrendingUp };
  }
  return { bg: "bg-warning/15", text: "text-warning", icon: Minus };
}

const MarktScan = () => {
  const [marke, setMarke] = useState("");
  const [modell, setModell] = useState("");
  const [baujahr, setBaujahr] = useState("");
  const [meinPreis, setMeinPreis] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    if (!marke || !modell) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("market-scan", {
        body: {
          marke,
          modell,
          baujahr: baujahr || undefined,
          meinPreis: meinPreis ? Number(meinPreis) : undefined,
        },
      });

      if (fnError) {
        setError("Edge Function Fehler: " + JSON.stringify(fnError));
        alert("Edge Function Fehler: " + JSON.stringify(fnError));
        return;
      }

      if (data?.error) {
        setError(data.error);
        alert("Fehler vom Server: " + data.error);
        return;
      }

      console.log("MarktScan result:", data);
      setResult(data);
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : JSON.stringify(err);
      setError(msg);
      alert("Fehler: " + msg);
    } finally {
      setLoading(false);
    }
  };

  const avg = result?.markt?.durchschnitt ?? 0;
  const min = result?.markt?.minimum ?? 0;
  const max = result?.markt?.maximum ?? 0;
  const count = result?.markt?.anzahl ?? 0;
  const bewertung = result?.analyse?.bewertung ?? "";
  const empfehlung = result?.analyse?.empfehlung ?? "";

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="mb-5">
          <h1 className="text-[18px] font-medium text-foreground">Markt-Scan</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Marktpreise analysieren und Ihren Preis vergleichen
          </p>
        </div>

        <div className="max-w-2xl space-y-4">
          {/* Form */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-[13px] font-medium text-foreground">Fahrzeug eingeben</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Marke</label>
                <Input
                  placeholder="z.B. BMW"
                  value={marke}
                  onChange={(e) => setMarke(e.target.value)}
                  className="h-9 text-[12px]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Modell</label>
                <Input
                  placeholder="z.B. 320d"
                  value={modell}
                  onChange={(e) => setModell(e.target.value)}
                  className="h-9 text-[12px]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Baujahr</label>
                <Input
                  placeholder="z.B. 2021"
                  value={baujahr}
                  onChange={(e) => setBaujahr(e.target.value)}
                  className="h-9 text-[12px]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Mein Preis in €</label>
                <Input
                  type="number"
                  placeholder="z.B. 28500"
                  value={meinPreis}
                  onChange={(e) => setMeinPreis(e.target.value)}
                  className="h-9 text-[12px]"
                />
              </div>
            </div>
            <Button
              onClick={handleScan}
              disabled={loading || !marke || !modell}
              className="w-full gap-2 text-[13px]"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              {loading ? "Analyse läuft..." : "Markt analysieren"}
            </Button>
          </div>

          {/* Results */}
          {result && (
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-medium text-foreground">Ergebnis</h3>
                <span className="text-[11px] text-muted-foreground">
                  {marke} {modell} {baujahr}
                </span>
              </div>

              {/* Price cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <div className="text-[11px] text-muted-foreground">Marktdurchschnitt</div>
                  <div className="text-[22px] font-medium text-primary mt-1">
                    {avg > 0 ? `€${avg.toLocaleString("de-DE")}` : "–"}
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <div className="text-[11px] text-muted-foreground">Vergleichsfahrzeuge</div>
                  <div className="text-[22px] font-medium text-foreground mt-1">{count}</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <div className="text-[11px] text-muted-foreground">Minimum</div>
                  <div className="text-[22px] font-medium text-[hsl(122,39%,34%)] mt-1">
                    {min > 0 ? `€${min.toLocaleString("de-DE")}` : "–"}
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <div className="text-[11px] text-muted-foreground">Maximum</div>
                  <div className="text-[22px] font-medium text-warning mt-1">
                    {max > 0 ? `€${max.toLocaleString("de-DE")}` : "–"}
                  </div>
                </div>
              </div>

              {/* Bewertung badge + Empfehlung */}
              {bewertung && (
                <div className="space-y-2">
                  {(() => {
                    const style = getBewertungStyle(bewertung);
                    const Icon = style.icon;
                    return (
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${style.bg} ${style.text} text-[12px] font-medium`}>
                        <Icon className="w-3.5 h-3.5" />
                        {bewertung}
                      </div>
                    );
                  })()}
                </div>
              )}

              {empfehlung && (
                <div className="bg-primary/5 border-l-[3px] border-primary rounded-r-lg p-3 flex items-start gap-2">
                  <Badge variant="info" className="text-[9px] px-1.5 py-0 shrink-0 mt-0.5">KI</Badge>
                  <p className="text-[12px] text-foreground leading-relaxed">{empfehlung}</p>
                </div>
              )}

              {/* Raw data fallback for debugging */}
              {!avg && !bewertung && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-[11px] text-muted-foreground mb-1">Rohdaten:</p>
                  <pre className="text-[11px] text-foreground whitespace-pre-wrap break-all">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {error && !result && (
            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4">
              <p className="text-[12px] text-destructive">{error}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MarktScan;
