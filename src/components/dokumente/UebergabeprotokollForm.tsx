import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardList } from "lucide-react";
import { VerkaeuerSection } from "./VerkaeuerSection";
import { FahrzeugSection, defaultFahrzeugFields, type FahrzeugFields } from "./FahrzeugSection";
import type { VerkaeuerData } from "@/pages/Dokumente";

export interface UebergabeprotokollData extends FahrzeugFields {
  uebergabedatum: string;
  uhrzeit: string;
  kmBeiUebergabe: string;
  tankfuellung: string;
  anzahlSchluessel: string;
  anzahlBordbuecher: string;
  reifenzustand: string;
  felgentyp: string;
  vorhandeneMaengel: string;
  zubehoerErsatzrad: boolean;
  zubehoerVerbandskasten: boolean;
  zubehoerWarndreieck: boolean;
  zubehoerFussmatten: boolean;
  zubehoerAhk: boolean;
  notizen: string;
}

export const defaultUebergabeprotokollData: UebergabeprotokollData = {
  ...defaultFahrzeugFields,
  uebergabedatum: new Date().toLocaleDateString("de-DE"), uhrzeit: "", kmBeiUebergabe: "",
  tankfuellung: "1/2", anzahlSchluessel: "2", anzahlBordbuecher: "1",
  reifenzustand: "Gut", felgentyp: "Stahl", vorhandeneMaengel: "",
  zubehoerErsatzrad: false, zubehoerVerbandskasten: false, zubehoerWarndreieck: false,
  zubehoerFussmatten: false, zubehoerAhk: false, notizen: "",
};

interface Props {
  data: UebergabeprotokollData;
  update: (p: Partial<UebergabeprotokollData>) => void;
  verkaeufer: VerkaeuerData;
  updateVerkaeufer: (p: Partial<VerkaeuerData>) => void;
  onGenerate: () => void;
}

export function UebergabeprotokollForm({ data, update, verkaeufer, updateVerkaeufer, onGenerate }: Props) {
  return (
    <div className="space-y-4">
      <VerkaeuerSection data={verkaeufer} update={updateVerkaeufer} />
      <FahrzeugSection data={data} update={update} />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-[14px] font-medium">Übergabedetails</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div><Label className="text-[11px]">Übergabedatum</Label><Input value={data.uebergabedatum} onChange={e => update({ uebergabedatum: e.target.value })} className="h-9 text-[13px]" placeholder="TT.MM.JJJJ" /></div>
            <div><Label className="text-[11px]">Uhrzeit</Label><Input value={data.uhrzeit} onChange={e => update({ uhrzeit: e.target.value })} className="h-9 text-[13px]" placeholder="HH:MM" /></div>
            <div><Label className="text-[11px]">KM bei Übergabe</Label><Input value={data.kmBeiUebergabe} onChange={e => update({ kmBeiUebergabe: e.target.value })} className="h-9 text-[13px]" /></div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div>
              <Label className="text-[11px]">Tankfüllung</Label>
              <Select value={data.tankfuellung} onValueChange={v => update({ tankfuellung: v })}>
                <SelectTrigger className="h-9 text-[13px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1/4">1/4</SelectItem>
                  <SelectItem value="1/2">1/2</SelectItem>
                  <SelectItem value="3/4">3/4</SelectItem>
                  <SelectItem value="Voll">Voll</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label className="text-[11px]">Schlüssel</Label><Input type="number" value={data.anzahlSchluessel} onChange={e => update({ anzahlSchluessel: e.target.value })} className="h-9 text-[13px]" /></div>
            <div><Label className="text-[11px]">Bordbücher</Label><Input type="number" value={data.anzahlBordbuecher} onChange={e => update({ anzahlBordbuecher: e.target.value })} className="h-9 text-[13px]" /></div>
            <div>
              <Label className="text-[11px]">Reifenzustand</Label>
              <Select value={data.reifenzustand} onValueChange={v => update({ reifenzustand: v })}>
                <SelectTrigger className="h-9 text-[13px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Neu">Neu</SelectItem>
                  <SelectItem value="Gut">Gut</SelectItem>
                  <SelectItem value="Mittel">Mittel</SelectItem>
                  <SelectItem value="Abgefahren">Abgefahren</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-[11px]">Felgentyp</Label>
            <Select value={data.felgentyp} onValueChange={v => update({ felgentyp: v })}>
              <SelectTrigger className="h-9 text-[13px] w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Stahl">Stahl</SelectItem>
                <SelectItem value="Alu">Alu</SelectItem>
                <SelectItem value="Alu (AMG/M/RS)">Alu (AMG/M/RS)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-[11px]">Vorhandene Mängel</Label>
            <Textarea rows={2} value={data.vorhandeneMaengel} onChange={e => update({ vorhandeneMaengel: e.target.value })} className="text-[13px] resize-none" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-[14px] font-medium">Zubehör</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {[
            ["zubehoerErsatzrad", "Ersatzrad / Notrad"],
            ["zubehoerVerbandskasten", "Verbandskasten"],
            ["zubehoerWarndreieck", "Warndreieck"],
            ["zubehoerFussmatten", "Fußmatten"],
            ["zubehoerAhk", "Anhängerkupplung (AHK)"],
          ].map(([key, label]) => (
            <div key={key} className="flex items-center gap-2">
              <Checkbox checked={(data as any)[key]} onCheckedChange={v => update({ [key]: !!v })} />
              <Label className="text-[12px]">{label}</Label>
            </div>
          ))}
          <div className="pt-1">
            <Label className="text-[11px]">Notizen</Label>
            <Textarea rows={2} value={data.notizen} onChange={e => update({ notizen: e.target.value })} className="text-[13px] resize-none" />
          </div>
        </CardContent>
      </Card>

      <Button onClick={onGenerate} className="w-full text-[13px] gap-1.5 h-11" style={{ background: "linear-gradient(to right, var(--accent-from, hsl(var(--primary))), var(--accent-to, hsl(var(--primary))))" }}>
        <ClipboardList className="w-4 h-4" /> Übergabeprotokoll als PDF generieren
      </Button>
    </div>
  );
}
