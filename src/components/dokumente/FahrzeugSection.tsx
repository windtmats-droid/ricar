import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FahrzeugFields {
  marke: string;
  modell: string;
  typ: string;
  erstzulassung: string;
  kilometerstand: string;
  farbe: string;
  fin: string;
  kennzeichen: string;
  huBis: string;
  tuevBis: string;
}

interface Props {
  data: FahrzeugFields;
  update: (p: Partial<FahrzeugFields>) => void;
}

export const defaultFahrzeugFields: FahrzeugFields = {
  marke: "", modell: "", typ: "", erstzulassung: "", kilometerstand: "", farbe: "", fin: "", kennzeichen: "", huBis: "", tuevBis: "",
};

export type { FahrzeugFields };

export function FahrzeugSection({ data, update }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-[14px] font-medium">Fahrzeugdaten</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label className="text-[11px]">Marke</Label>
            <Input value={data.marke} onChange={e => update({ marke: e.target.value })} className="h-9 text-[13px]" />
          </div>
          <div>
            <Label className="text-[11px]">Modell</Label>
            <Input value={data.modell} onChange={e => update({ modell: e.target.value })} className="h-9 text-[13px]" />
          </div>
          <div>
            <Label className="text-[11px]">Typ / Variante</Label>
            <Input value={data.typ} onChange={e => update({ typ: e.target.value })} className="h-9 text-[13px]" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label className="text-[11px]">Erstzulassung</Label>
            <Input value={data.erstzulassung} onChange={e => update({ erstzulassung: e.target.value })} className="h-9 text-[13px]" placeholder="MM/JJJJ" />
          </div>
          <div>
            <Label className="text-[11px]">Kilometerstand</Label>
            <Input value={data.kilometerstand} onChange={e => update({ kilometerstand: e.target.value })} className="h-9 text-[13px]" placeholder="z.B. 85.000" />
          </div>
          <div>
            <Label className="text-[11px]">Farbe</Label>
            <Input value={data.farbe} onChange={e => update({ farbe: e.target.value })} className="h-9 text-[13px]" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-[11px]">FIN (Fahrgestellnr.)</Label>
            <Input value={data.fin} onChange={e => update({ fin: e.target.value })} className="h-9 text-[13px]" maxLength={17} />
          </div>
          <div>
            <Label className="text-[11px]">Kennzeichen</Label>
            <Input value={data.kennzeichen} onChange={e => update({ kennzeichen: e.target.value })} className="h-9 text-[13px]" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-[11px]">HU bis</Label>
            <Input value={data.huBis} onChange={e => update({ huBis: e.target.value })} className="h-9 text-[13px]" placeholder="MM/JJJJ" />
          </div>
          <div>
            <Label className="text-[11px]">TÜV bis</Label>
            <Input value={data.tuevBis} onChange={e => update({ tuevBis: e.target.value })} className="h-9 text-[13px]" placeholder="MM/JJJJ" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
