import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { KalkulationFahrzeug } from "@/components/kalkulation/KalkulationFahrzeug";
import { KalkulationRechner } from "@/components/kalkulation/KalkulationRechner";
import { KalkulationErgebnis } from "@/components/kalkulation/KalkulationErgebnis";
import { KalkulationHistorie } from "@/components/kalkulation/KalkulationHistorie";
import { KalkulationNotizen } from "@/components/kalkulation/KalkulationNotizen";

export interface KalkulationData {
  fahrzeugId: string | null;
  fahrzeugLabel: string;
  ankaufspreis: number;
  aufbereitung: { label: string; value: number }[];
  margeProzent: number;
  margeTyp: "%" | "€";
  provision: number;
  ueberfuehrung: number;
  marktAvg: number;
  notizen: string;
}

const defaultData: KalkulationData = {
  fahrzeugId: null,
  fahrzeugLabel: "",
  ankaufspreis: 18500,
  aufbereitung: [
    { label: "Aufbereitung/Reinigung", value: 450 },
    { label: "Lackierung/Delle", value: 0 },
    { label: "HU/Service", value: 650 },
    { label: "Reifen/Reparatur", value: 100 },
  ],
  margeProzent: 15,
  margeTyp: "%",
  provision: 0,
  ueberfuehrung: 0,
  marktAvg: 23800,
  notizen: "",
};

const Kalkulation = () => {
  const [data, setData] = useState<KalkulationData>(defaultData);

  const update = (partial: Partial<KalkulationData>) =>
    setData((prev) => ({ ...prev, ...partial }));

  const calc = useMemo(() => {
    const aufbereitungTotal = data.aufbereitung.reduce((s, a) => s + (a.value || 0), 0);
    const gesamtkosten = (data.ankaufspreis || 0) + aufbereitungTotal + (data.provision || 0) + (data.ueberfuehrung || 0);
    const margeAbsolut = data.margeTyp === "%" ? gesamtkosten * ((data.margeProzent || 0) / 100) : (data.margeProzent || 0);
    const mindestpreis = Math.round(gesamtkosten + margeAbsolut);
    const empfohlenerVk = Math.round(mindestpreis * 1.05);
    const realMargePct = gesamtkosten > 0 ? ((empfohlenerVk - gesamtkosten) / gesamtkosten) * 100 : 0;
    return { aufbereitungTotal, gesamtkosten, margeAbsolut: Math.round(margeAbsolut), mindestpreis, empfohlenerVk, realMargePct };
  }, [data]);

  const resetForm = () => setData({ ...defaultData, aufbereitung: defaultData.aufbereitung.map((a) => ({ ...a, value: 0 })), ankaufspreis: 0, marktAvg: 0 });

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[18px] font-medium text-foreground">Kalkulation</h1>
            <p className="text-[13px] text-muted-foreground">Ankaufspreise kalkulieren und Margen berechnen</p>
          </div>
          <Button onClick={resetForm} className="gap-1.5 text-[13px]">
            <Plus className="w-4 h-4" /> Neue Kalkulation
          </Button>
        </div>

        <div className="grid grid-cols-[55fr_45fr] gap-4">
          <div className="space-y-4">
            <KalkulationFahrzeug data={data} update={update} />
            <KalkulationRechner data={data} update={update} calc={calc} />
            <KalkulationNotizen data={data} update={update} />
          </div>
          <div className="space-y-4">
            <KalkulationErgebnis data={data} calc={calc} />
            <KalkulationHistorie onSelect={(d) => setData(d)} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Kalkulation;
