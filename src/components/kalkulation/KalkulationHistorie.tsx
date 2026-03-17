import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import type { KalkulationData } from "@/pages/Kalkulation";

interface HistoryRow {
  label: string;
  date: string;
  ek: number;
  vk: number;
  marge: number;
  raw: KalkulationData;
}

const sampleHistory: HistoryRow[] = [
  { label: "BMW 320d 2021", date: "15. März", ek: 18500, vk: 24500, marge: 15, raw: null as any },
  { label: "Audi A4 Avant", date: "12. März", ek: 24000, vk: 32900, marge: 18, raw: null as any },
  { label: "VW Golf 8 GTI", date: "10. März", ek: 29500, vk: 38500, marge: 20, raw: null as any },
  { label: "Mercedes C200", date: "8. März", ek: 17800, vk: 24900, marge: 14, raw: null as any },
  { label: "Opel Insignia", date: "5. März", ek: 11200, vk: 16400, marge: 12, raw: null as any },
];

interface Props {
  onSelect: (d: KalkulationData) => void;
}

export function KalkulationHistorie({ onSelect }: Props) {
  const [history, setHistory] = useState<HistoryRow[]>(sampleHistory);

  useEffect(() => {
    supabase
      .from("kalkulationen")
      .select("*")
      .order("erstellt_at", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setHistory(
            data.map((k: any) => ({
              label: k.fahrzeug_id ? "Fahrzeug" : "Manuell",
              date: new Date(k.erstellt_at).toLocaleDateString("de-DE", { day: "numeric", month: "long" }),
              ek: Number(k.ankaufspreis),
              vk: Number(k.empfohlener_vk),
              marge: Number(k.marge_prozent),
              raw: {
                fahrzeugId: k.fahrzeug_id,
                fahrzeugLabel: "",
                ankaufspreis: Number(k.ankaufspreis),
                aufbereitung: Array.isArray(k.aufbereitungskosten_json) ? k.aufbereitungskosten_json : [],
                margeProzent: Number(k.marge_prozent),
                margeTyp: "%",
                provision: Number(k.provision_prozent),
                ueberfuehrung: Number(k.ueberfuehrung),
                marktAvg: Number(k.markt_avg) || 0,
                notizen: k.notizen || "",
              } as KalkulationData,
            }))
          );
        }
      });
  }, []);

  const badgeColor = (m: number) =>
    m >= 15 ? "bg-success/10 text-success" : "bg-warning/10 text-warning";

  return (
    <Card>
      <CardHeader className="pb-2 flex-row items-center justify-between">
        <CardTitle className="text-[14px] font-medium">Letzte Kalkulationen</CardTitle>
        <button className="text-[11px] text-primary hover:underline">Alle anzeigen</button>
      </CardHeader>
      <CardContent className="space-y-1">
        {history.map((h, i) => (
          <button
            key={i}
            onClick={() => h.raw && onSelect(h.raw)}
            className="w-full flex items-center justify-between py-2.5 px-2 rounded-md hover:bg-muted transition-colors text-left"
          >
            <div>
              <div className="text-[13px] font-medium text-foreground">{h.label}</div>
              <div className="text-[11px] text-muted-foreground">{h.date}</div>
            </div>
            <div className="text-right flex items-center gap-3">
              <div className="text-[11px] text-muted-foreground">
                EK: €{h.ek.toLocaleString("de-DE")} · VK: €{h.vk.toLocaleString("de-DE")}
              </div>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${badgeColor(h.marge)}`}>
                {h.marge}%
              </span>
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
