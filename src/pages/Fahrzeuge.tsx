import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getFahrzeuge, addFahrzeug, updateFahrzeug, getStandzeit, generateId, type Fahrzeug } from "@/lib/fahrzeuge-store";
import { FahrzeugFormModal } from "@/components/fahrzeuge/FahrzeugFormModal";
import { InseratPanel } from "@/components/fahrzeuge/InseratPanel";
import { VerkaufModal } from "@/components/fahrzeuge/VerkaufModal";
import { Car, Search, ChevronDown, Edit, FileText, CheckCircle, Package, Tag, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  neu: { label: "Neu", className: "bg-muted text-muted-foreground" },
  aufbereitung: { label: "In Aufbereitung", className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  bereit: { label: "Bereit", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  inseriert: { label: "Inseriert", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  verkauft: { label: "Verkauft", className: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400" },
};

function StandzeitBadge({ days }: { days: number }) {
  const color = days > 30 ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    : days > 14 ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
    : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
  return <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", color)}>{days} Tage</span>;
}

const Fahrzeuge = () => {
  const { toast } = useToast();
  const [tab, setTab] = useState("bestand");
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Form modal state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formModalFahrzeug, setFormModalFahrzeug] = useState<Fahrzeug | null>(null);
  const [formSaving, setFormSaving] = useState(false);

  // Inserat panel state
  const [inseratOpen, setInseratOpen] = useState(false);
  const [inseratFahrzeug, setInseratFahrzeug] = useState<Fahrzeug | null>(null);

  // Verkauf modal state
  const [verkaufOpen, setVerkaufOpen] = useState(false);
  const [verkaufFahrzeug, setVerkaufFahrzeug] = useState<Fahrzeug | null>(null);

  const allFahrzeuge = useMemo(() => getFahrzeuge(), [refreshKey]);
  const refresh = () => setRefreshKey((k) => k + 1);

  const bestand = useMemo(() => {
    return allFahrzeuge
      .filter((f) => f.status !== "verkauft")
      .filter((f) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return `${f.marke} ${f.modell} ${f.fin}`.toLowerCase().includes(q);
      });
  }, [allFahrzeuge, search]);

  const inserierte = useMemo(() => allFahrzeuge.filter((f) => f.status === "inseriert"), [allFahrzeuge]);

  const handleStatusChange = (id: string, status: Fahrzeug["status"]) => {
    updateFahrzeug(id, { status });
    refresh();
    toast({ title: "Status aktualisiert" });
  };

  const openVerkaufModal = (f: Fahrzeug) => {
    setVerkaufFahrzeug(f);
    setVerkaufOpen(true);
  };

  const handleVerkaufConfirm = (data: {
    verkaufspreis: number; kaeuferName: string; kaeuferTelefon: string;
    kaeuferEmail: string; verkaufsDatum: string; zahlungsart: string; verkaufsNotizen: string;
  }) => {
    if (!verkaufFahrzeug) return;
    updateFahrzeug(verkaufFahrzeug.id, {
      status: "verkauft",
      verkaufspreis: data.verkaufspreis,
      kaeuferName: data.kaeuferName,
      kaeuferTelefon: data.kaeuferTelefon,
      kaeuferEmail: data.kaeuferEmail,
      verkaufsDatum: data.verkaufsDatum,
      zahlungsart: data.zahlungsart,
      verkaufsNotizen: data.verkaufsNotizen,
    });
    setVerkaufOpen(false);
    refresh();
    toast({ title: "Verkauf abgeschlossen", description: `${verkaufFahrzeug.marke} ${verkaufFahrzeug.modell} wurde als verkauft markiert.` });
  };

  // --- Form Modal handlers ---
  const openAddModal = () => { setFormModalFahrzeug(null); setFormModalOpen(true); };
  const openEditModal = (f: Fahrzeug) => { setFormModalFahrzeug(f); setFormModalOpen(true); };

  const handleFormSave = (data: any) => {
    setFormSaving(true);
    if (data.id) {
      updateFahrzeug(data.id, data);
      toast({ title: "Fahrzeug aktualisiert", description: `${data.marke} ${data.modell} gespeichert.` });
    } else {
      const fahrzeug: Fahrzeug = {
        ...data,
        id: generateId(),
        status: "neu",
        ankaufDatum: new Date().toISOString().split("T")[0],
        inseratEntwurf: "",
        inseratText: "",
        inseratPreis: data.empfohlenerVKPreis || 0,
        verkaufsDatum: "",
      };
      addFahrzeug(fahrzeug);
      toast({ title: "Fahrzeug hinzugefügt", description: `${data.marke} ${data.modell} wurde in den Bestand aufgenommen.` });
    }
    setFormSaving(false);
    setFormModalOpen(false);
    refresh();
  };

  // --- Inserat Panel handlers ---
  const openInseratFromBestand = (f: Fahrzeug) => { setInseratFahrzeug(f); setInseratOpen(true); };
  const openInseratEdit = (f: Fahrzeug) => { setInseratFahrzeug(f); setInseratOpen(true); };
  const openNewInserat = () => { setInseratFahrzeug(null); setInseratOpen(true); };

  const handleInseratPublish = (data: Partial<Fahrzeug> & { marke: string; modell: string }) => {
    if (data.id) {
      updateFahrzeug(data.id, { ...data, status: "inseriert" });
      toast({ title: "Inserat aktualisiert", description: `${data.marke} ${data.modell}` });
    } else {
      const fahrzeug: Fahrzeug = {
        id: generateId(),
        marke: data.marke,
        modell: data.modell,
        typ: "", baujahr: data.baujahr || "", erstzulassung: "",
        km: data.km || "", farbe: data.farbe || "", fin: "", kennzeichen: "",
        kraftstoff: data.kraftstoff || "", getriebe: data.getriebe || "",
        huBis: "", tuevBis: "", zustand: "Gut", notizen: "",
        einkaufspreis: 0, aufbereitungskosten: 0, transportkosten: 0, sonstigeKosten: 0,
        marge: 15, gesamtkosten: 0, empfohlenerVKPreis: data.inseratPreis || 0,
        fotos: data.fotos || [],
        status: "inseriert",
        ankaufDatum: new Date().toISOString().split("T")[0],
        inseratEntwurf: "",
        inseratText: data.inseratText || "",
        inseratPreis: data.inseratPreis || 0,
        verkaufsDatum: "",
      };
      addFahrzeug(fahrzeug);
      toast({ title: "Inserat veröffentlicht", description: `${data.marke} ${data.modell} ist jetzt inseriert.` });
    }
    setInseratOpen(false);
    setTab("inserate");
    refresh();
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-lg font-medium text-foreground flex items-center gap-2">
              <Car className="w-5 h-5" /> Fahrzeuge
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">Bestand verwalten und Inserate erstellen</p>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Fahrzeug suchen..." className="pl-9 text-xs" />
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="bestand" className="gap-1.5 text-xs">
                <Package className="w-3.5 h-3.5" /> Bestand
                <span className="ml-1 text-[10px] bg-muted-foreground/10 px-1.5 rounded-full">{bestand.length}</span>
              </TabsTrigger>
              <TabsTrigger value="inserate" className="gap-1.5 text-xs">
                <Tag className="w-3.5 h-3.5" /> Inserate
                <span className="ml-1 text-[10px] bg-muted-foreground/10 px-1.5 rounded-full">{inserierte.length}</span>
              </TabsTrigger>
            </TabsList>

            {tab === "bestand" && (
              <Button size="sm" className="gap-1.5 text-xs" onClick={openAddModal}>
                <Plus className="w-3.5 h-3.5" /> Fahrzeug hinzufügen
              </Button>
            )}
            {tab === "inserate" && (
              <Button size="sm" className="gap-1.5 text-xs" onClick={openNewInserat}>
                <Plus className="w-3.5 h-3.5" /> Neues Inserat
              </Button>
            )}
          </div>

          {/* BESTAND TAB */}
          <TabsContent value="bestand">
            {bestand.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Car className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Noch keine Fahrzeuge im Bestand.</p>
                <p className="text-xs mt-1">Klicke auf „Fahrzeug hinzufügen" oder gehe zu <a href="/ankauf" className="text-primary underline">Ankauf</a>.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {bestand.map((f) => {
                  const days = getStandzeit(f);
                  const sc = statusConfig[f.status] || statusConfig.neu;
                  return (
                    <div key={f.id} className="bg-card border border-border rounded-xl overflow-hidden">
                      <div className="h-36 bg-muted flex items-center justify-center">
                        {f.fotos?.[0] ? (
                          <img src={f.fotos[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Car className="w-8 h-8 text-muted-foreground/30" />
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="text-sm font-semibold text-foreground">{f.marke} {f.modell}</div>
                            <div className="text-[11px] text-muted-foreground">{f.baujahr} · {f.km ? `${Number(f.km).toLocaleString("de-DE")} km` : "–"}</div>
                          </div>
                          <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", sc.className)}>{sc.label}</span>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <StandzeitBadge days={days} />
                        </div>

                        <div className="flex items-center justify-between text-xs mb-3">
                          <div>
                            <span className="text-muted-foreground">EK:</span>{" "}
                            <span className="font-medium">€ {f.einkaufspreis.toLocaleString("de-DE")}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Empf. VK:</span>{" "}
                            <span className="font-semibold text-green-600 dark:text-green-400">€ {f.empfohlenerVKPreis.toLocaleString("de-DE")}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="text-xs gap-1">
                                Status <ChevronDown className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleStatusChange(f.id, "neu")}>Neu</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(f.id, "aufbereitung")}>In Aufbereitung</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(f.id, "bereit")}>Bereit</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => openEditModal(f)}>
                            <Edit className="w-3 h-3" /> Bearbeiten
                          </Button>
                          <Button size="sm" className="text-xs gap-1 flex-1" onClick={() => openInseratFromBestand(f)}>
                            <Tag className="w-3 h-3" /> Inserat
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* INSERATE TAB */}
          <TabsContent value="inserate">
            {inserierte.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Tag className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Noch keine Inserate erstellt.</p>
                <p className="text-xs mt-1">Erstelle ein Inserat aus dem Bestand oder klicke „Neues Inserat".</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {inserierte.map((f) => (
                  <div key={f.id} className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="h-36 bg-muted flex items-center justify-center">
                      {f.fotos?.[0] ? (
                        <img src={f.fotos[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Car className="w-8 h-8 text-muted-foreground/30" />
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-sm font-semibold text-foreground mb-1">{f.marke} {f.modell}</div>
                      <div className="text-[11px] text-muted-foreground mb-2">{f.baujahr} · {f.km ? `${Number(f.km).toLocaleString("de-DE")} km` : "–"}</div>
                      <div className="text-xs text-foreground/80 line-clamp-3 mb-3">{f.inseratText || f.inseratEntwurf}</div>
                      <div className="text-base font-bold text-foreground mb-3">€ {(f.inseratPreis || f.empfohlenerVKPreis).toLocaleString("de-DE")}</div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-xs flex-1 gap-1" onClick={() => openInseratEdit(f)}>
                          <Edit className="w-3 h-3" /> Bearbeiten
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs gap-1">
                          <FileText className="w-3 h-3" /> PDF
                        </Button>
                        <Button variant="destructive" size="sm" className="text-xs gap-1" onClick={() => markAsSold(f.id)}>
                          <CheckCircle className="w-3 h-3" /> Verkauft
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Fahrzeug Form Modal (add/edit) */}
        <FahrzeugFormModal
          open={formModalOpen}
          onClose={() => setFormModalOpen(false)}
          onSave={handleFormSave}
          fahrzeug={formModalFahrzeug}
          saving={formSaving}
        />

        {/* Inserat Slide-over Panel */}
        <InseratPanel
          open={inseratOpen}
          onClose={() => setInseratOpen(false)}
          onPublish={handleInseratPublish}
          fahrzeug={inseratFahrzeug}
        />
      </main>
    </div>
  );
};

export default Fahrzeuge;
