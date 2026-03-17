import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DokumentTyp } from "@/components/dokumente/DokumentTyp";
import { DokumentFormular } from "@/components/dokumente/DokumentFormular";
import { DokumentVerkaufsdaten } from "@/components/dokumente/DokumentVerkaufsdaten";
import { DokumentVorschau } from "@/components/dokumente/DokumentVorschau";
import { DokumentArchiv } from "@/components/dokumente/DokumentArchiv";

export interface KaeuferData {
  vorname: string;
  nachname: string;
  strasse: string;
  hausnummer: string;
  plz: string;
  stadt: string;
  telefon: string;
  email: string;
  geburtsdatum: string;
}

export interface DokumentData {
  typ: "kaufvertrag" | "rechnung";
  fahrzeugId: string | null;
  fahrzeugLabel: string;
  fahrzeugPreis: number;
  kaeufer: KaeuferData;
  verkaufspreis: number;
  zahlungsart: string;
  uebergabedatum: string;
  gewaehrleistung: string;
  bemerkungen: string;
}

const defaultKaeufer: KaeuferData = {
  vorname: "", nachname: "", strasse: "", hausnummer: "", plz: "", stadt: "", telefon: "", email: "", geburtsdatum: "",
};

const today = new Date().toISOString().split("T")[0];

const defaultData: DokumentData = {
  typ: "kaufvertrag",
  fahrzeugId: null,
  fahrzeugLabel: "",
  fahrzeugPreis: 0,
  kaeufer: defaultKaeufer,
  verkaufspreis: 0,
  zahlungsart: "Überweisung",
  uebergabedatum: today,
  gewaehrleistung: "Keine",
  bemerkungen: "",
};

const Dokumente = () => {
  const [data, setData] = useState<DokumentData>(defaultData);

  const update = (partial: Partial<DokumentData>) =>
    setData((prev) => ({ ...prev, ...partial }));

  const updateKaeufer = (partial: Partial<KaeuferData>) =>
    setData((prev) => ({ ...prev, kaeufer: { ...prev.kaeufer, ...partial } }));

  const resetForm = () => setData({ ...defaultData, kaeufer: { ...defaultKaeufer } });

  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[18px] font-medium text-foreground">Dokumente</h1>
            <p className="text-[13px] text-muted-foreground">Kaufverträge und Rechnungen erstellen und verwalten</p>
          </div>
          <Button onClick={resetForm} className="gap-1.5 text-[13px]">
            <Plus className="w-4 h-4" /> Neues Dokument
          </Button>
        </div>

        <div className="grid grid-cols-[52fr_48fr] gap-4">
          <div className="space-y-4">
            <DokumentTyp data={data} update={update} />
            <DokumentFormular data={data} update={update} updateKaeufer={updateKaeufer} />
            <DokumentVerkaufsdaten data={data} update={update} />
          </div>
          <div className="space-y-4">
            <DokumentVorschau data={data} />
            <DokumentArchiv />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dokumente;
