import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles } from "lucide-react";
import type { DokumentData } from "@/pages/Dokumente";

interface Props {
  data: DokumentData;
  update: (p: Partial<DokumentData>) => void;
}

export function DokumentVerkaufsdaten({ data, update }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-[14px] font-medium">Verkaufsdaten</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label className="text-[11px]">Verkaufspreis (€)</Label>
          <Input
            type="number"
            value={data.verkaufspreis || ""}
            onChange={(e) => update({ verkaufspreis: Number(e.target.value) })}
            className="h-9 text-[13px]"
            placeholder="0"
          />
        </div>

        <div>
          <Label className="text-[11px]">Zahlungsart</Label>
          <Select value={data.zahlungsart} onValueChange={(v) => update({ zahlungsart: v })}>
            <SelectTrigger className="h-9 text-[13px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Bar">Bar</SelectItem>
              <SelectItem value="Überweisung">Überweisung</SelectItem>
              <SelectItem value="Finanzierung">Finanzierung</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-[11px]">Übergabedatum</Label>
          <Input type="date" value={data.uebergabedatum} onChange={(e) => update({ uebergabedatum: e.target.value })} className="h-9 text-[13px]" />
        </div>

        <div>
          <Label className="text-[11px]">Gewährleistung</Label>
          <Select value={data.gewaehrleistung} onValueChange={(v) => update({ gewaehrleistung: v })}>
            <SelectTrigger className="h-9 text-[13px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Keine">Keine</SelectItem>
              <SelectItem value="12 Monate">12 Monate</SelectItem>
              <SelectItem value="24 Monate">24 Monate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-[11px]">Bemerkungen</Label>
          <Textarea rows={2} value={data.bemerkungen} onChange={(e) => update({ bemerkungen: e.target.value })} className="text-[13px] resize-none" />
        </div>

        <div className="pt-1 space-y-2">
          <Button disabled className="w-full text-[13px] gap-1.5 relative">
            <Sparkles className="w-4 h-4" /> Dokument generieren
            <Badge className="absolute -top-2 -right-2 bg-muted text-muted-foreground text-[9px] hover:bg-muted">Bald verfügbar</Badge>
          </Button>
          <p className="text-[11px] text-muted-foreground text-center">
            Die KI erstellt automatisch einen vollständigen {data.typ === "kaufvertrag" ? "Kaufvertrag" : "eine Rechnung"}
          </p>
          <button className="w-full text-[11px] text-muted-foreground hover:text-foreground underline text-center">
            Oder: Vorlage herunterladen
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
