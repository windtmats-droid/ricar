import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Receipt } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface DocRow {
  typ: string;
  nummer: string;
  fahrzeug: string;
  kaeufer: string;
  datum: string;
  status: string;
}

const sampleDocs: DocRow[] = [
  { typ: "kaufvertrag", nummer: "#2026-033", fahrzeug: "BMW 320d 2021", kaeufer: "Klaus Weber", datum: "15. März", status: "Gesendet" },
  { typ: "rechnung", nummer: "#2026-032", fahrzeug: "Audi A4 Avant", kaeufer: "Andreas Krause", datum: "12. März", status: "Gesendet" },
  { typ: "kaufvertrag", nummer: "#2026-031", fahrzeug: "VW Golf 8 GTI", kaeufer: "Maria Schmidt", datum: "10. März", status: "Entwurf" },
  { typ: "rechnung", nummer: "#2026-030", fahrzeug: "Mercedes C200", kaeufer: "Thomas Becker", datum: "8. März", status: "Gesendet" },
  { typ: "kaufvertrag", nummer: "#2026-029", fahrzeug: "Opel Insignia", kaeufer: "Julia Lang", datum: "5. März", status: "Entwurf" },
];

export function DokumentArchiv() {
  const [docs, setDocs] = useState<DocRow[]>(sampleDocs);

  useEffect(() => {
    supabase
      .from("dokumente")
      .select("*")
      .order("erstellt_at", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setDocs(
            data.map((d: any) => ({
              typ: d.typ,
              nummer: `#${d.dok_nummer}`,
              fahrzeug: d.fahrzeug_id || "–",
              kaeufer: (d.kaeufer_json as any)?.nachname ? `${(d.kaeufer_json as any).vorname} ${(d.kaeufer_json as any).nachname}` : "–",
              datum: new Date(d.erstellt_at).toLocaleDateString("de-DE", { day: "numeric", month: "long" }),
              status: d.status === "gesendet" ? "Gesendet" : "Entwurf",
            }))
          );
        }
      });
  }, []);

  return (
    <Card>
      <CardHeader className="pb-2 flex-row items-center justify-between">
        <CardTitle className="text-[14px] font-medium">Letzte Dokumente</CardTitle>
        <button className="text-[11px] text-primary hover:underline">Alle anzeigen</button>
      </CardHeader>
      <CardContent className="space-y-0">
        {docs.map((d, i) => (
          <div key={i} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
            <div className="flex items-center gap-2.5">
              {d.typ === "kaufvertrag" ? (
                <FileText className="w-4 h-4 text-primary" />
              ) : (
                <Receipt className="w-4 h-4 text-success" />
              )}
              <div>
                <div className="text-[13px] font-medium text-foreground">
                  {d.typ === "kaufvertrag" ? "Kaufvertrag" : "Rechnung"} {d.nummer}
                </div>
                <div className="text-[11px] text-muted-foreground">{d.fahrzeug}</div>
              </div>
            </div>
            <div className="text-right flex items-center gap-3">
              <div>
                <div className="text-[12px] text-foreground">{d.kaeufer}</div>
                <div className="text-[11px] text-muted-foreground">{d.datum}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-[11px] text-primary hover:underline">PDF</button>
                <span
                  className={cn(
                    "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                    d.status === "Gesendet" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                  )}
                >
                  {d.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
