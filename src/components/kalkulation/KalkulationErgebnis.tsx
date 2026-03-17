import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { KalkulationData } from "@/pages/Kalkulation";

interface Props {
  data: KalkulationData;
  calc: {
    aufbereitungTotal: number;
    gesamtkosten: number;
    margeAbsolut: number;
    mindestpreis: number;
    empfohlenerVk: number;
    realMargePct: number;
  };
}

export function KalkulationErgebnis({ data, calc }: Props) {
  const navigate = useNavigate();
  const diff = data.marktAvg ? calc.empfohlenerVk - data.marktAvg : null;

  const saveKalkulation = async () => {
    const { error } = await supabase.from("kalkulationen").insert({
      fahrzeug_id: data.fahrzeugId || null,
      ankaufspreis: data.ankaufspreis,
      aufbereitungskosten_json: data.aufbereitung,
      provision_prozent: data.provision,
      ueberfuehrung: data.ueberfuehrung,
      marge_prozent: data.margeProzent,
      mindestpreis: calc.mindestpreis,
      empfohlener_vk: calc.empfohlenerVk,
      markt_avg: data.marktAvg || null,
      notizen: data.notizen || null,
    });
    if (error) toast.error("Fehler beim Speichern");
    else toast.success("Kalkulation gespeichert");
  };

  const applyPrice = async () => {
    if (!data.fahrzeugId) { toast.error("Kein Fahrzeug ausgewählt"); return; }
    const { error } = await supabase.from("fahrzeuge").update({ preis: calc.empfohlenerVk }).eq("id", data.fahrzeugId);
    if (error) toast.error("Fehler beim Aktualisieren");
    else toast.success(`Preis € ${calc.empfohlenerVk.toLocaleString("de-DE")} übernommen`);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-[14px] font-medium">Kalkulationsergebnis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main result */}
        <div className="text-center py-3">
          <div className="text-[12px] text-muted-foreground">Empfohlener Verkaufspreis</div>
          <div className="text-[36px] font-medium text-primary">€ {calc.empfohlenerVk.toLocaleString("de-DE")}</div>
          <div className="text-[12px] text-muted-foreground">inkl. {data.margeTyp === "%" ? `${data.margeProzent}%` : `€ ${data.margeProzent}`} Marge</div>
        </div>

        {/* Breakdown */}
        <div className="bg-muted rounded-lg p-3.5 space-y-1.5 text-[12px]">
          <Row label="Ankaufspreis" value={data.ankaufspreis} />
          <Row label="+ Aufbereitungskosten" value={calc.aufbereitungTotal} />
          <Row label="+ Provision" value={data.provision} />
          <Row label="+ Überführung" value={data.ueberfuehrung} />
          <div className="border-t border-border pt-1.5 flex justify-between font-medium">
            <span>= Gesamtkosten</span><span>€ {calc.gesamtkosten.toLocaleString("de-DE")}</span>
          </div>
          <div className="flex justify-between text-success">
            <span>+ Marge ({data.margeProzent}{data.margeTyp})</span><span>€ {calc.margeAbsolut.toLocaleString("de-DE")}</span>
          </div>
          <div className="border-t border-border pt-1.5 flex justify-between font-medium">
            <span>= Mindestpreis</span><span>€ {calc.mindestpreis.toLocaleString("de-DE")}</span>
          </div>
          <div className="flex justify-between font-semibold text-primary text-[13px]">
            <span>Empfohlener VK-Preis</span><span>€ {calc.empfohlenerVk.toLocaleString("de-DE")}</span>
          </div>
        </div>

        {/* Marge indicator */}
        <div>
          <div className="flex items-center gap-2">
            <Progress value={Math.min(calc.realMargePct, 30) / 30 * 100} className="flex-1 h-2.5 [&>div]:bg-success" />
            <span className="text-[11px] font-medium text-foreground">{calc.realMargePct.toFixed(1)}% · € {calc.margeAbsolut.toLocaleString("de-DE")}</span>
          </div>
        </div>

        {/* Marktvergleich */}
        {data.marktAvg > 0 && diff !== null && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[12px]">
              <span>Ihr Preis: <span className="font-medium">€ {calc.empfohlenerVk.toLocaleString("de-DE")}</span></span>
              <span>Markt-Ø: <span className="font-medium">€ {data.marktAvg.toLocaleString("de-DE")}</span></span>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${diff <= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                {diff <= 0 ? "▼" : "▲"} € {Math.abs(diff).toLocaleString("de-DE")} {diff <= 0 ? "unter" : "über"} Markt
              </span>
            </div>
            <div className="bg-accent rounded-lg border-l-[3px] border-primary px-3 py-2.5 text-[12px] text-foreground">
              <span className="font-semibold text-primary mr-1">KI</span>
              {diff <= 0
                ? "Ihr kalkulierter Preis liegt leicht unter dem Marktdurchschnitt — gute Wettbewerbsposition."
                : "Ihr kalkulierter Preis liegt über dem Marktdurchschnitt — prüfen Sie die Marge oder Aufbereitungskosten."}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2 pt-1">
          <Button onClick={saveKalkulation} className="w-full text-[13px]">Kalkulation speichern</Button>
          <Button variant="outline" onClick={applyPrice} className="w-full text-[13px]">Preis in Inserat übernehmen</Button>
          <Button variant="outline" onClick={() => navigate(data.fahrzeugId ? `/dokumente?fahrzeug=${data.fahrzeugId}` : "/dokumente")} className="w-full text-[13px]">Weiter zu Dokumente</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span><span>€ {(value || 0).toLocaleString("de-DE")}</span>
    </div>
  );
}
