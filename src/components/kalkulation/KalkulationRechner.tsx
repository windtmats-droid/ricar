import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { KalkulationData } from "@/pages/Kalkulation";

interface Props {
  data: KalkulationData;
  update: (p: Partial<KalkulationData>) => void;
  calc: { aufbereitungTotal: number; gesamtkosten: number };
}

export function KalkulationRechner({ data, update, calc }: Props) {
  const updateAufbereitung = (idx: number, value: number) => {
    const next = [...data.aufbereitung];
    next[idx] = { ...next[idx], value };
    update({ aufbereitung: next });
  };

  const addCost = () => {
    update({ aufbereitung: [...data.aufbereitung, { label: "Weitere Kosten", value: 0 }] });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-[14px] font-medium">Ankaufskalkulation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Einkauf */}
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Einkauf</div>
          <Label className="text-[11px]">Ankaufspreis (€)</Label>
          <Input
            type="number"
            value={data.ankaufspreis || ""}
            onChange={(e) => update({ ankaufspreis: Number(e.target.value) })}
            className="h-[44px] text-[18px] font-medium"
            placeholder="0"
          />
        </div>

        {/* Aufbereitung */}
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Aufbereitung</div>
          <div className="grid grid-cols-2 gap-3">
            {data.aufbereitung.map((a, i) => (
              <div key={i}>
                <Label className="text-[11px]">{a.label}</Label>
                <Input
                  type="number"
                  value={a.value || ""}
                  onChange={(e) => updateAufbereitung(i, Number(e.target.value))}
                  className="h-9 text-[13px]"
                  placeholder="€ 0"
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-2">
            <Button variant="outline" size="sm" className="text-[11px] gap-1 h-7" onClick={addCost}>
              <Plus className="w-3 h-3" /> Weitere Kosten
            </Button>
            <span className="text-[12px] font-medium text-foreground">Gesamtkosten: € {calc.aufbereitungTotal.toLocaleString("de-DE")}</span>
          </div>
        </div>

        {/* Ziel */}
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Ziel</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[11px] flex items-center gap-2">
                Gewünschte Marge
                <button
                  className="text-[10px] text-primary underline"
                  onClick={() => update({ margeTyp: data.margeTyp === "%" ? "€" : "%" })}
                >
                  {data.margeTyp === "%" ? "→ €" : "→ %"}
                </button>
              </Label>
              <Input
                type="number"
                value={data.margeProzent || ""}
                onChange={(e) => update({ margeProzent: Number(e.target.value) })}
                className="h-9 text-[13px]"
                placeholder={data.margeTyp === "%" ? "15" : "3000"}
              />
            </div>
            <div>
              <Label className="text-[11px]">Händlerprovision (%)</Label>
              <Input type="number" value={data.provision || ""} onChange={(e) => update({ provision: Number(e.target.value) })} className="h-9 text-[13px]" placeholder="0" />
            </div>
          </div>
          <div className="mt-3">
            <Label className="text-[11px]">Überführungskosten (€)</Label>
            <Input type="number" value={data.ueberfuehrung || ""} onChange={(e) => update({ ueberfuehrung: Number(e.target.value) })} className="h-9 text-[13px]" placeholder="0" />
          </div>
        </div>

        {/* Marktvergleich */}
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Marktvergleich</div>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Label className="text-[11px]">Markt-Ø Preis (€)</Label>
              <Input type="number" value={data.marktAvg || ""} onChange={(e) => update({ marktAvg: Number(e.target.value) })} className="h-9 text-[13px]" placeholder="0" />
            </div>
            <button className="text-[11px] text-primary hover:underline pb-2">Letzten Scan laden</button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
