import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Receipt } from "lucide-react";
import { VerkaeuerSection } from "./VerkaeuerSection";
import { FahrzeugSection, defaultFahrzeugFields, type FahrzeugFields } from "./FahrzeugSection";
import type { VerkaeuerData } from "@/pages/Dokumente";

export interface RechnungData extends FahrzeugFields {
  rechnungsnummer: string;
  rechnungsdatum: string;
  vorname: string;
  nachname: string;
  strasse: string;
  hausnummer: string;
  plz: string;
  ort: string;
  nettobetrag: number;
  mwstBetrag: number;
  bruttobetrag: number;
  zahlungsziel: string;
}

export const defaultRechnungData: RechnungData = {
  ...defaultFahrzeugFields,
  rechnungsnummer: "", rechnungsdatum: new Date().toLocaleDateString("de-DE"),
  vorname: "", nachname: "", strasse: "", hausnummer: "", plz: "", ort: "",
  nettobetrag: 0, mwstBetrag: 0, bruttobetrag: 0, zahlungsziel: "14 Tage",
};

interface Props {
  data: RechnungData;
  update: (p: Partial<RechnungData>) => void;
  verkaeufer: VerkaeuerData;
  updateVerkaeufer: (p: Partial<VerkaeuerData>) => void;
  onGenerate: () => void;
}

export function RechnungForm({ data, update, verkaeufer, updateVerkaeufer, onGenerate }: Props) {
  const netto = data.nettobetrag || 0;
  const mwst = Math.round(netto * 0.19 * 100) / 100;
  const brutto = Math.round((netto + mwst) * 100) / 100;

  return (
    <div className="space-y-4">
      <VerkaeuerSection data={verkaeufer} update={updateVerkaeufer} showBank />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-[14px] font-medium">Rechnungsdaten</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[11px]">Rechnungsnummer</Label>
              <Input value={data.rechnungsnummer} onChange={e => update({ rechnungsnummer: e.target.value })} className="h-9 text-[13px]" placeholder="RE-2026-1001" />
            </div>
            <div>
              <Label className="text-[11px]">Rechnungsdatum</Label>
              <Input value={data.rechnungsdatum} onChange={e => update({ rechnungsdatum: e.target.value })} className="h-9 text-[13px]" placeholder="TT.MM.JJJJ" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-[14px] font-medium">Rechnungsempfänger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-[11px]">Vorname</Label><Input value={data.vorname} onChange={e => update({ vorname: e.target.value })} className="h-9 text-[13px]" /></div>
            <div><Label className="text-[11px]">Nachname</Label><Input value={data.nachname} onChange={e => update({ nachname: e.target.value })} className="h-9 text-[13px]" /></div>
          </div>
          <div className="grid grid-cols-[1fr_100px] gap-3">
            <div><Label className="text-[11px]">Straße</Label><Input value={data.strasse} onChange={e => update({ strasse: e.target.value })} className="h-9 text-[13px]" /></div>
            <div><Label className="text-[11px]">Hausnr.</Label><Input value={data.hausnummer} onChange={e => update({ hausnummer: e.target.value })} className="h-9 text-[13px]" /></div>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-3">
            <div><Label className="text-[11px]">PLZ</Label><Input value={data.plz} onChange={e => update({ plz: e.target.value })} className="h-9 text-[13px]" maxLength={5} /></div>
            <div><Label className="text-[11px]">Ort</Label><Input value={data.ort} onChange={e => update({ ort: e.target.value })} className="h-9 text-[13px]" /></div>
          </div>
        </CardContent>
      </Card>

      <FahrzeugSection data={data} update={update} />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-[14px] font-medium">Beträge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-[11px]">Nettobetrag (€)</Label>
            <Input type="number" value={data.nettobetrag || ""} onChange={e => update({ nettobetrag: Number(e.target.value) })} className="h-9 text-[13px]" placeholder="0,00" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-3">
              <div className="text-[11px] text-muted-foreground">MwSt. (19%)</div>
              <div className="text-[15px] font-semibold text-foreground">{mwst.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €</div>
            </div>
            <div className="bg-primary/10 rounded-lg p-3">
              <div className="text-[11px] text-muted-foreground">Bruttobetrag</div>
              <div className="text-[15px] font-semibold text-foreground">{brutto.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €</div>
            </div>
          </div>
          <div>
            <Label className="text-[11px]">Zahlungsziel</Label>
            <Select value={data.zahlungsziel} onValueChange={v => update({ zahlungsziel: v })}>
              <SelectTrigger className="h-9 text-[13px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Sofort">Sofort</SelectItem>
                <SelectItem value="14 Tage">14 Tage</SelectItem>
                <SelectItem value="30 Tage">30 Tage</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Button onClick={onGenerate} className="w-full text-[13px] gap-1.5 h-11" style={{ background: "linear-gradient(to right, var(--accent-from, hsl(var(--primary))), var(--accent-to, hsl(var(--primary))))" }}>
        <Receipt className="w-4 h-4" /> Rechnung als PDF generieren
      </Button>
    </div>
  );
}
