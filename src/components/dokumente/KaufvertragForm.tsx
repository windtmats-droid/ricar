import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FileText } from "lucide-react";
import { VerkaeuerSection } from "./VerkaeuerSection";
import { FahrzeugSection, defaultFahrzeugFields, type FahrzeugFields } from "./FahrzeugSection";
import type { VerkaeuerData } from "@/pages/Dokumente";

export interface KaufvertragData extends FahrzeugFields {
  vorname: string;
  nachname: string;
  strasse: string;
  hausnummer: string;
  plz: string;
  ort: string;
  geburtsdatum: string;
  telefon: string;
  email: string;
  kaufpreis: string;
  mwstAusweis: boolean;
  zahlungsart: string;
  uebergabedatum: string;
  gewaehrleistung: string;
  besichtigt: boolean;
  keineMaengel: boolean;
  sondervereinbarungen: string;
}

export const defaultKaufvertragData: KaufvertragData = {
  ...defaultFahrzeugFields,
  vorname: "", nachname: "", strasse: "", hausnummer: "", plz: "", ort: "", geburtsdatum: "", telefon: "", email: "",
  kaufpreis: "", mwstAusweis: false, zahlungsart: "Überweisung", uebergabedatum: new Date().toLocaleDateString("de-DE"),
  gewaehrleistung: "Keine", besichtigt: false, keineMaengel: false, sondervereinbarungen: "",
};

interface Props {
  data: KaufvertragData;
  update: (p: Partial<KaufvertragData>) => void;
  verkaeufer: VerkaeuerData;
  updateVerkaeufer: (p: Partial<VerkaeuerData>) => void;
  onGenerate: () => void;
}

export function KaufvertragForm({ data, update, verkaeufer, updateVerkaeufer, onGenerate }: Props) {
  return (
    <div className="space-y-4">
      <VerkaeuerSection data={verkaeufer} update={updateVerkaeufer} />

      {/* Käufer */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-[14px] font-medium">Käufer</CardTitle>
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
          <div className="grid grid-cols-3 gap-3">
            <div><Label className="text-[11px]">Geburtsdatum</Label><Input value={data.geburtsdatum} onChange={e => update({ geburtsdatum: e.target.value })} className="h-9 text-[13px]" placeholder="TT.MM.JJJJ" /></div>
            <div><Label className="text-[11px]">Telefon</Label><Input value={data.telefon} onChange={e => update({ telefon: e.target.value })} className="h-9 text-[13px]" /></div>
            <div><Label className="text-[11px]">E-Mail</Label><Input value={data.email} onChange={e => update({ email: e.target.value })} className="h-9 text-[13px]" /></div>
          </div>
        </CardContent>
      </Card>

      <FahrzeugSection data={data} update={update} />

      {/* Konditionen */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-[14px] font-medium">Konditionen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[11px]">Kaufpreis (brutto in €)</Label>
              <Input type="number" value={data.kaufpreis} onChange={e => update({ kaufpreis: e.target.value })} className="h-9 text-[13px]" placeholder="0,00" />
            </div>
            <div className="flex items-end gap-3 pb-0.5">
              <div className="flex items-center gap-2">
                <Switch checked={data.mwstAusweis} onCheckedChange={v => update({ mwstAusweis: v })} />
                <Label className="text-[11px]">MwSt. ausweisen</Label>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-[11px]">Zahlungsart</Label>
              <Select value={data.zahlungsart} onValueChange={v => update({ zahlungsart: v })}>
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
              <Input value={data.uebergabedatum} onChange={e => update({ uebergabedatum: e.target.value })} className="h-9 text-[13px]" placeholder="TT.MM.JJJJ" />
            </div>
            <div>
              <Label className="text-[11px]">Gewährleistung</Label>
              <Select value={data.gewaehrleistung} onValueChange={v => update({ gewaehrleistung: v })}>
                <SelectTrigger className="h-9 text-[13px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Keine">Keine</SelectItem>
                  <SelectItem value="12 Monate">12 Monate</SelectItem>
                  <SelectItem value="24 Monate">24 Monate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rechtliches */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-[14px] font-medium">Rechtliches</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox checked={data.besichtigt} onCheckedChange={v => update({ besichtigt: !!v })} />
            <Label className="text-[12px]">Fahrzeug wurde besichtigt und Probe gefahren</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={data.keineMaengel} onCheckedChange={v => update({ keineMaengel: !!v })} />
            <Label className="text-[12px]">Keine versteckten Mängel bekannt</Label>
          </div>
          <div>
            <Label className="text-[11px]">Sondervereinbarungen</Label>
            <Textarea rows={3} value={data.sondervereinbarungen} onChange={e => update({ sondervereinbarungen: e.target.value })} className="text-[13px] resize-none" />
          </div>
        </CardContent>
      </Card>

      <Button onClick={onGenerate} className="w-full text-[13px] gap-1.5 h-11" style={{ background: "linear-gradient(to right, var(--accent-from, hsl(var(--primary))), var(--accent-to, hsl(var(--primary))))" }}>
        <FileText className="w-4 h-4" /> Kaufvertrag als PDF generieren
      </Button>
    </div>
  );
}
