import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { VerkaeuerData } from "@/pages/Dokumente";

interface Props {
  data: VerkaeuerData;
  update: (p: Partial<VerkaeuerData>) => void;
  showBank?: boolean;
}

export function VerkaeuerSection({ data, update, showBank }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-[14px] font-medium">Verkäufer / Autohaus</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label className="text-[11px]">Autohaus-Name</Label>
          <Input value={data.autohausName} onChange={e => update({ autohausName: e.target.value })} className="h-9 text-[13px]" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-[11px]">Straße + Nr.</Label>
            <Input value={data.strasse} onChange={e => update({ strasse: e.target.value })} className="h-9 text-[13px]" />
          </div>
          <div>
            <Label className="text-[11px]">PLZ / Ort</Label>
            <Input value={data.plzOrt} onChange={e => update({ plzOrt: e.target.value })} className="h-9 text-[13px]" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-[11px]">Telefon</Label>
            <Input value={data.telefon} onChange={e => update({ telefon: e.target.value })} className="h-9 text-[13px]" />
          </div>
          <div>
            <Label className="text-[11px]">E-Mail</Label>
            <Input value={data.email} onChange={e => update({ email: e.target.value })} className="h-9 text-[13px]" />
          </div>
        </div>
        <div>
          <Label className="text-[11px]">Steuernummer</Label>
          <Input value={data.steuernummer} onChange={e => update({ steuernummer: e.target.value })} className="h-9 text-[13px]" />
        </div>
        {showBank && (
          <div className="grid grid-cols-3 gap-3 pt-1">
            <div>
              <Label className="text-[11px]">IBAN</Label>
              <Input value={data.iban} onChange={e => update({ iban: e.target.value })} className="h-9 text-[13px]" />
            </div>
            <div>
              <Label className="text-[11px]">BIC</Label>
              <Input value={data.bic} onChange={e => update({ bic: e.target.value })} className="h-9 text-[13px]" />
            </div>
            <div>
              <Label className="text-[11px]">Bank</Label>
              <Input value={data.bank} onChange={e => update({ bank: e.target.value })} className="h-9 text-[13px]" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
