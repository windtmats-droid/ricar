import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, ClipboardList, Receipt } from "lucide-react";
import { KaufvertragForm, type KaufvertragData, defaultKaufvertragData } from "@/components/dokumente/KaufvertragForm";
import { UebergabeprotokollForm, type UebergabeprotokollData, defaultUebergabeprotokollData } from "@/components/dokumente/UebergabeprotokollForm";
import { RechnungForm, type RechnungData, defaultRechnungData } from "@/components/dokumente/RechnungForm";
import { DokumenteListe, type GeneratedDocument } from "@/components/dokumente/DokumenteListe";
import { generateKaufvertragPdf, generateUebergabeprotokollPdf, generateRechnungPdf } from "@/components/dokumente/pdfGenerator";
import { loadAutohausData, saveAutohausData, type AutohausData } from "@/components/einstellungen/AutohausDatenSection";

const DOCS_KEY = "generated_documents";

export interface VerkaeuerData {
  autohausName: string;
  strasse: string;
  plzOrt: string;
  telefon: string;
  email: string;
  steuernummer: string;
  iban: string;
  bic: string;
  bank: string;
}

export const defaultVerkaeuerData: VerkaeuerData = {
  autohausName: "", strasse: "", plzOrt: "", telefon: "", email: "", steuernummer: "", iban: "", bic: "", bank: "",
};

function autohausToVerkaeufer(ah: AutohausData): VerkaeuerData {
  return {
    autohausName: ah.firmenname,
    strasse: [ah.strasse, ah.hausnr].filter(Boolean).join(" "),
    plzOrt: [ah.plz, ah.ort].filter(Boolean).join(" "),
    telefon: ah.telefon,
    email: ah.email,
    steuernummer: ah.steuernummer,
    iban: ah.iban,
    bic: ah.bic,
    bank: ah.bankname,
  };
}

function loadDocs(): GeneratedDocument[] {
  try {
    const raw = localStorage.getItem(DOCS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveDocs(docs: GeneratedDocument[]) {
  localStorage.setItem(DOCS_KEY, JSON.stringify(docs));
}

const Dokumente = () => {
  const [tab, setTab] = useState("kaufvertrag");
  const [verkaeufer, setVerkaeufer] = useState<VerkaeuerData>(() => {
    const ah = loadAutohausData();
    const v = autohausToVerkaeufer(ah);
    // Only use if there's actual data
    return v.autohausName ? v : { ...defaultVerkaeuerData };
  });
  const [kaufvertrag, setKaufvertrag] = useState<KaufvertragData>({ ...defaultKaufvertragData });
  const [protokoll, setProtokoll] = useState<UebergabeprotokollData>({ ...defaultUebergabeprotokollData });
  const [rechnung, setRechnung] = useState<RechnungData>(() => {
    const ah = loadAutohausData();
    return {
      ...defaultRechnungData,
      rechnungsnummer: `${ah.rechnungsnrPraefix}${ah.naechsteRechnungsnr}`,
    };
  });
  const [docs, setDocs] = useState<GeneratedDocument[]>(loadDocs);

  useEffect(() => { saveDocs(docs); }, [docs]);

  const updateVerkaeufer = (p: Partial<VerkaeuerData>) => setVerkaeufer(prev => ({ ...prev, ...p }));

  const addDoc = (typ: string, nummer: string, kunde: string, pdfData: string) => {
    const doc: GeneratedDocument = {
      id: crypto.randomUUID(),
      typ: typ as any,
      nummer,
      kunde,
      datum: new Date().toLocaleDateString("de-DE"),
      pdfData,
    };
    setDocs(prev => [doc, ...prev]);
  };

  const handleGenerateKaufvertrag = () => {
    const nr = `KV-${new Date().getFullYear()}-${String(docs.filter(d => d.typ === "kaufvertrag").length + 1).padStart(3, "0")}`;
    const pdfData = generateKaufvertragPdf(verkaeufer, kaufvertrag, nr);
    addDoc("kaufvertrag", nr, `${kaufvertrag.vorname} ${kaufvertrag.nachname}`, pdfData);
  };

  const handleGenerateProtokoll = () => {
    const nr = `UP-${new Date().getFullYear()}-${String(docs.filter(d => d.typ === "uebergabe").length + 1).padStart(3, "0")}`;
    const pdfData = generateUebergabeprotokollPdf(verkaeufer, protokoll, nr);
    addDoc("uebergabe", nr, `Übergabe ${protokoll.marke} ${protokoll.modell}`, pdfData);
  };

  const handleGenerateRechnung = () => {
    const ah = loadAutohausData();
    const nr = rechnung.rechnungsnummer || `${ah.rechnungsnrPraefix}${ah.naechsteRechnungsnr}`;
    const brutto = rechnung.nettobetrag * 1.19;
    const pdfData = generateRechnungPdf(verkaeufer, { ...rechnung, rechnungsnummer: nr, bruttobetrag: brutto, mwstBetrag: brutto - rechnung.nettobetrag }, nr);
    addDoc("rechnung", nr, `${rechnung.vorname} ${rechnung.nachname}`, pdfData);

    // Auto-increment
    const nextNr = ah.naechsteRechnungsnr + 1;
    saveAutohausData({ ...ah, naechsteRechnungsnr: nextNr });
    setRechnung(prev => ({ ...prev, rechnungsnummer: `${ah.rechnungsnrPraefix}${nextNr}` }));
  };

  const deleteDoc = (id: string) => setDocs(prev => prev.filter(d => d.id !== id));

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-[18px] font-medium text-foreground">Dokumente</h1>
          <p className="text-[13px] text-muted-foreground">Kaufverträge, Übergabeprotokolle und Rechnungen erstellen</p>
        </div>

        {!verkaeufer.autohausName && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/40 px-4 py-2.5 text-[12px] text-muted-foreground">
            <span>💡</span> Autohaus-Daten in <a href="/einstellungen" className="underline font-medium text-primary hover:text-primary/80">Einstellungen</a> hinterlegen für automatische Vorbefüllung.
          </div>
        )}

        <div className="grid grid-cols-[1fr_340px] gap-4">
          <div>
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="mb-4 w-full grid grid-cols-3 h-10">
                <TabsTrigger value="kaufvertrag" className="text-[13px] gap-1.5">
                  <FileText className="w-4 h-4" /> Kaufvertrag
                </TabsTrigger>
                <TabsTrigger value="uebergabe" className="text-[13px] gap-1.5">
                  <ClipboardList className="w-4 h-4" /> Übergabeprotokoll
                </TabsTrigger>
                <TabsTrigger value="rechnung" className="text-[13px] gap-1.5">
                  <Receipt className="w-4 h-4" /> Rechnung
                </TabsTrigger>
              </TabsList>

              <TabsContent value="kaufvertrag">
                <KaufvertragForm
                  data={kaufvertrag}
                  update={(p) => setKaufvertrag(prev => ({ ...prev, ...p }))}
                  verkaeufer={verkaeufer}
                  updateVerkaeufer={updateVerkaeufer}
                  onGenerate={handleGenerateKaufvertrag}
                />
              </TabsContent>

              <TabsContent value="uebergabe">
                <UebergabeprotokollForm
                  data={protokoll}
                  update={(p) => setProtokoll(prev => ({ ...prev, ...p }))}
                  verkaeufer={verkaeufer}
                  updateVerkaeufer={updateVerkaeufer}
                  onGenerate={handleGenerateProtokoll}
                />
              </TabsContent>

              <TabsContent value="rechnung">
                <RechnungForm
                  data={rechnung}
                  update={(p) => setRechnung(prev => ({ ...prev, ...p }))}
                  verkaeufer={verkaeufer}
                  updateVerkaeufer={updateVerkaeufer}
                  onGenerate={handleGenerateRechnung}
                />
              </TabsContent>
            </Tabs>
          </div>

          <DokumenteListe docs={docs} onDelete={deleteDoc} />
        </div>
      </main>
    </div>
  );
};

export default Dokumente;
