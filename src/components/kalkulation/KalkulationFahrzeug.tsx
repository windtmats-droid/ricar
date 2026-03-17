import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import type { KalkulationData } from "@/pages/Kalkulation";

interface Props {
  data: KalkulationData;
  update: (p: Partial<KalkulationData>) => void;
}

interface Fahrzeug { id: string; marke: string; modell: string; baujahr: number | null }

export function KalkulationFahrzeug({ data, update }: Props) {
  const [fahrzeuge, setFahrzeuge] = useState<Fahrzeug[]>([]);
  const [manualMarke, setManualMarke] = useState("");
  const [manualModell, setManualModell] = useState("");
  const [manualBj, setManualBj] = useState("");
  const [manualKm, setManualKm] = useState("");

  useEffect(() => {
    supabase.from("fahrzeuge").select("id, marke, modell, baujahr").then(({ data: d }) => {
      if (d) setFahrzeuge(d);
    });
  }, []);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-[14px] font-medium">Fahrzeug auswählen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Select
          value={data.fahrzeugId || ""}
          onValueChange={(v) => {
            const f = fahrzeuge.find((x) => x.id === v);
            update({ fahrzeugId: v, fahrzeugLabel: f ? `${f.marke} ${f.modell} ${f.baujahr || ""}` : "" });
          }}
        >
          <SelectTrigger className="h-9 text-[13px]">
            <SelectValue placeholder="Fahrzeug aus Bestand wählen" />
          </SelectTrigger>
          <SelectContent>
            {fahrzeuge.map((f) => (
              <SelectItem key={f.id} value={f.id} className="text-[13px]">
                {f.marke} {f.modell} {f.baujahr || ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <div className="flex-1 h-px bg-border" />oder<div className="flex-1 h-px bg-border" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div><Label className="text-[11px]">Marke</Label><Input value={manualMarke} onChange={(e) => { setManualMarke(e.target.value); update({ fahrzeugId: null, fahrzeugLabel: `${e.target.value} ${manualModell}` }); }} className="h-9 text-[13px]" placeholder="z.B. BMW" /></div>
          <div><Label className="text-[11px]">Modell</Label><Input value={manualModell} onChange={(e) => { setManualModell(e.target.value); update({ fahrzeugId: null, fahrzeugLabel: `${manualMarke} ${e.target.value}` }); }} className="h-9 text-[13px]" placeholder="z.B. 320d" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="text-[11px]">Baujahr</Label><Input type="number" value={manualBj} onChange={(e) => setManualBj(e.target.value)} className="h-9 text-[13px]" placeholder="2021" /></div>
          <div><Label className="text-[11px]">KM-Stand</Label><Input type="number" value={manualKm} onChange={(e) => setManualKm(e.target.value)} className="h-9 text-[13px]" placeholder="65.000" /></div>
        </div>
      </CardContent>
    </Card>
  );
}
