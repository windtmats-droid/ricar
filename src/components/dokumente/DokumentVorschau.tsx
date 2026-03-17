import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Mail, FileText } from "lucide-react";
import type { DokumentData } from "@/pages/Dokumente";

interface Props {
  data: DokumentData;
}

export function DokumentVorschau({ data }: Props) {
  const hasData = data.fahrzeugLabel || data.kaeufer.nachname;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-[14px] font-medium">Dokumentvorschau</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="min-h-[320px] flex flex-col items-center justify-center text-center">
            <FileText className="w-12 h-12 text-muted-foreground/40 mb-3" />
            <div className="text-[14px] text-muted-foreground">Vorschau erscheint nach Generierung</div>
            <div className="text-[12px] text-muted-foreground mt-1">Fülle das Formular aus und klicke &quot;Dokument generieren&quot;</div>
          </div>
        ) : (
          <>
            {/* Simulated document */}
            <div className="border border-border rounded-lg p-5 bg-card text-foreground space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-[16px] font-medium text-center flex-1">
                  {data.typ === "kaufvertrag" ? "KAUFVERTRAG" : "RECHNUNG"}
                </div>
                <span className="text-[12px] text-muted-foreground">Nr. 2026-034</span>
              </div>

              <div className="h-px bg-border" />

              <div className="grid grid-cols-2 gap-4 text-[11px]">
                <div>
                  <div className="text-muted-foreground font-semibold uppercase text-[10px] mb-1">Verkäufer</div>
                  <div>AutoDealer KI</div>
                  <div>Musterstraße 1</div>
                  <div>44135 Dortmund</div>
                </div>
                <div>
                  <div className="text-muted-foreground font-semibold uppercase text-[10px] mb-1">Käufer</div>
                  <div>{data.kaeufer.vorname || "Klaus"} {data.kaeufer.nachname || "Weber"}</div>
                  <div>{data.kaeufer.strasse || "Hauptstraße"} {data.kaeufer.hausnummer || "12"}</div>
                  <div>{data.kaeufer.plz || "45127"} {data.kaeufer.stadt || "Essen"}</div>
                </div>
              </div>

              <div className="h-px bg-border" />

              <div className="text-[11px]">
                <div className="text-muted-foreground font-semibold uppercase text-[10px] mb-1">Fahrzeug</div>
                <div>{data.fahrzeugLabel || "BMW 320d"} · Diesel · Automatik</div>
                <div>Farbe: Schwarz Metallic · FIN: WBA3A5C50DF595596</div>
              </div>

              <div className="h-px bg-border" />

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[16px] font-medium">€ {(data.verkaufspreis || 28500).toLocaleString("de-DE")}</div>
                  <div className="text-[11px] text-muted-foreground">Zahlungsart: {data.zahlungsart}</div>
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Übergabe: {data.uebergabedatum ? new Date(data.uebergabedatum).toLocaleDateString("de-DE") : "21. März 2026"}
                </div>
              </div>

              <div className="h-px bg-border" />

              <div className="flex justify-between text-[11px] text-muted-foreground pt-2">
                <div>Verkäufer: ________________</div>
                <div>Käufer: ________________</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 mt-3">
              <Button disabled className="flex-1 text-[12px] gap-1.5 relative">
                <Download className="w-3.5 h-3.5" /> PDF herunterladen
                <Badge className="absolute -top-2 -right-2 bg-muted text-muted-foreground text-[9px] hover:bg-muted">Bald</Badge>
              </Button>
              <Button variant="outline" disabled className="flex-1 text-[12px] gap-1.5 relative">
                <Mail className="w-3.5 h-3.5" /> Per E-Mail senden
                <Badge className="absolute -top-2 -right-2 bg-muted text-muted-foreground text-[9px] hover:bg-muted">Bald</Badge>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
