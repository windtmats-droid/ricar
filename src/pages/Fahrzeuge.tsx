import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getFahrzeuge, addFahrzeug, updateFahrzeug, getStandzeit, generateId, type Fahrzeug } from "@/lib/fahrzeuge-store";
import { FahrzeugFormModal } from "@/components/fahrzeuge/FahrzeugFormModal";
import { InseratPanel } from "@/components/fahrzeuge/InseratPanel";
import { VerkaufModal } from "@/components/fahrzeuge/VerkaufModal";
import { Car, Search, ChevronDown, Edit, FileText, CheckCircle, Package, Tag, Plus, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  neu: { label: "Neu", className: "bg-muted text-muted-foreground" },
  aufbereitung: { label: "In Aufbereitung", className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  bereit: { label: "Bereit", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  inseriert: { label: "Inseriert", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  pausiert: { label: "Pausiert", className: "bg-muted text-muted-foreground" },
  verkauft: { label: "Verkauft", className: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400" },
};

const inseratStatusConfig: Record<string, { label: string; className: string }> = {
  inseriert: { label: "Aktiv", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  pausiert: { label: "Pausiert", className: "bg-muted text-muted-foreground" },
};

function StandzeitBadge({ days }: { days: number }) {
  const color = days > 30 ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    : days > 14 ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
    : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
  return <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", color)}>{days} Tage</span>;
}

function StatusBadgeDropdown({ fahrzeug, options, config, onChange }: {
  fahrzeug: Fahrzeug;
  options: { value: string; label: string }[];
  config: Record<string, { label: string; className: string }>;
  onChange: (id: string, status: Fahrzeug["status"]) => void;
}) {
  const sc = config[fahrzeug.status] || config.neu || { label: fahrzeug.status, className: "bg-muted text-muted-foreground" };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn(
          "text-[10px] px-2.5 py-0.5 rounded-full font-medium cursor-pointer hover:opacity-80 transition-opacity inline-flex items-center gap-1",
          sc.className
        )}>
          {fahrzeug.status === "pausiert" && <Pause className="w-2.5 h-2.5" />}
          {sc.label}
          <ChevronDown className="w-2.5 h-2.5 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => onChange(fahrzeug.id, opt.value as Fahrzeug["status"])}
            className="text-xs"
          >
            <span className={cn("w-2 h-2 rounded-full mr-2 shrink-0", (config[opt.value] || {}).className?.split(" ")[0])} />
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type BestandSort = "neueste" | "standzeit_asc" | "standzeit_desc" | "km_asc" | "km_desc" | "ek_asc" | "ek_desc" | "vk_asc" | "vk_desc" | "alpha";
type InserateSort = "neueste" | "standzeit_asc" | "standzeit_desc" | "preis_asc" | "preis_desc" | "km_asc" | "km_desc" | "alpha";

const bestandSortOptions: { value: BestandSort; label: string }[] = [
  { value: "neueste", label: "Neueste zuerst" },
  { value: "standzeit_asc", label: "Standzeit ↑" },
  { value: "standzeit_desc", label: "Standzeit ↓" },
  { value: "km_asc", label: "Kilometerstand ↑" },
  { value: "km_desc", label: "Kilometerstand ↓" },
  { value: "ek_asc", label: "Einkaufspreis ↑" },
  { value: "ek_desc", label: "Einkaufspreis ↓" },
  { value: "vk_asc", label: "Empf. VK-Preis ↑" },
  { value: "vk_desc", label: "Empf. VK-Preis ↓" },
  { value: "alpha", label: "Alphabetisch A-Z" },
];

const inserateSortOptions: { value: InserateSort; label: string }[] = [
  { value: "neueste", label: "Neueste zuerst" },
  { value: "standzeit_asc", label: "Standzeit ↑" },
  { value: "standzeit_desc", label: "Standzeit ↓" },
  { value: "preis_asc", label: "Preis ↑" },
  { value: "preis_desc", label: "Preis ↓" },
  { value: "km_asc", label: "Kilometerstand ↑" },
  { value: "km_desc", label: "Kilometerstand ↓" },
  { value: "alpha", label: "Alphabetisch A-Z" },
];

const bestandStatusOptions = [
  { value: "neu", label: "Neu" },
  { value: "aufbereitung", label: "In Aufbereitung" },
  { value: "bereit", label: "Bereit" },
  { value: "inseriert", label: "Inseriert" },
  { value: "pausiert", label: "Pausiert" },
];

const inseratStatusOptions = [
  { value: "inseriert", label: "Aktiv" },
  { value: "pausiert", label: "Pausiert" },
];

function applySorting<T extends BestandSort | InserateSort>(list: Fahrzeug[], sort: T): Fahrzeug[] {
  return [...list].sort((a, b) => {
    switch (sort) {
      case "neueste": return new Date(b.ankaufDatum).getTime() - new Date(a.ankaufDatum).getTime();
      case "standzeit_asc": return getStandzeit(a) - getStandzeit(b);
      case "standzeit_desc": return getStandzeit(b) - getStandzeit(a);
      case "km_asc": return (Number(a.km) || 0) - (Number(b.km) || 0);
      case "km_desc": return (Number(b.km) || 0) - (Number(a.km) || 0);
      case "ek_asc": return (a.einkaufspreis || 0) - (b.einkaufspreis || 0);
      case "ek_desc": return (b.einkaufspreis || 0) - (a.einkaufspreis || 0);
      case "vk_asc": return (a.empfohlenerVKPreis || 0) - (b.empfohlenerVKPreis || 0);
      case "vk_desc": return (b.empfohlenerVKPreis || 0) - (a.empfohlenerVKPreis || 0);
      case "preis_asc": return (a.inseratPreis || a.empfohlenerVKPreis || 0) - (b.inseratPreis || b.empfohlenerVKPreis || 0);
      case "preis_desc": return (b.inseratPreis || b.empfohlenerVKPreis || 0) - (a.inseratPreis || a.empfohlenerVKPreis || 0);
      case "alpha": return `${a.marke} ${a.modell}`.localeCompare(`${b.marke} ${b.modell}`);
      default: return 0;
    }
  });
}

const Fahrzeuge = () => {
  const { toast } = useToast();
  const [tab, setTab] = useState("bestand");
  const [refreshKey, setRefreshKey] = useState(0);

  // Bestand filters
  const [bSearch, setBSearch] = useState("");
  const [bStatus, setBStatus] = useState("alle");
  const [bMarke, setBMarke] = useState("alle");
  const [bKraftstoff, setBKraftstoff] = useState("alle");
  const [bGetriebe, setBGetriebe] = useState("alle");
  const [bSort, setBSort] = useState<BestandSort>("neueste");

  // Inserate filters
  const [iSearch, setISearch] = useState("");
  const [iStatus, setIStatus] = useState("alle");
  const [iMarke, setIMarke] = useState("alle");
  const [iKraftstoff, setIKraftstoff] = useState("alle");
  const [iPreis, setIPreis] = useState("alle");
  const [iSort, setISort] = useState<InserateSort>("neueste");

  // Modal state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formModalFahrzeug, setFormModalFahrzeug] = useState<Fahrzeug | null>(null);
  const [formSaving, setFormSaving] = useState(false);
  const [inseratOpen, setInseratOpen] = useState(false);
  const [inseratFahrzeug, setInseratFahrzeug] = useState<Fahrzeug | null>(null);
  const [verkaufOpen, setVerkaufOpen] = useState(false);
  const [verkaufFahrzeug, setVerkaufFahrzeug] = useState<Fahrzeug | null>(null);

  const allFahrzeuge = useMemo(() => getFahrzeuge(), [refreshKey]);
  const refresh = () => setRefreshKey((k) => k + 1);

  // Dynamic marke lists
  const bestandMarken = useMemo(() => [...new Set(allFahrzeuge.filter(f => f.status !== "verkauft").map(f => f.marke).filter(Boolean))].sort(), [allFahrzeuge]);
  const inserateMarken = useMemo(() => [...new Set(allFahrzeuge.filter(f => f.status === "inseriert" || f.status === "pausiert").map(f => f.marke).filter(Boolean))].sort(), [allFahrzeuge]);

  // Filtered + sorted bestand
  const bestand = useMemo(() => {
    let list = allFahrzeuge.filter(f => f.status !== "verkauft");
    if (bSearch) {
      const q = bSearch.toLowerCase();
      list = list.filter(f => `${f.marke} ${f.modell} ${f.kennzeichen || ""}`.toLowerCase().includes(q));
    }
    if (bStatus !== "alle") list = list.filter(f => f.status === bStatus);
    if (bMarke !== "alle") list = list.filter(f => f.marke === bMarke);
    if (bKraftstoff !== "alle") list = list.filter(f => f.kraftstoff === bKraftstoff);
    if (bGetriebe !== "alle") list = list.filter(f => f.getriebe === bGetriebe);
    return applySorting(list, bSort);
  }, [allFahrzeuge, bSearch, bStatus, bMarke, bKraftstoff, bGetriebe, bSort]);

  // Filtered + sorted inserate
  const inserierte = useMemo(() => {
    let list = allFahrzeuge.filter(f => f.status === "inseriert" || f.status === "pausiert");
    if (iSearch) {
      const q = iSearch.toLowerCase();
      list = list.filter(f => `${f.marke} ${f.modell}`.toLowerCase().includes(q));
    }
    if (iStatus !== "alle") list = list.filter(f => f.status === iStatus);
    if (iMarke !== "alle") list = list.filter(f => f.marke === iMarke);
    if (iKraftstoff !== "alle") list = list.filter(f => f.kraftstoff === iKraftstoff);
    if (iPreis !== "alle") {
      const p = (f: Fahrzeug) => f.inseratPreis || f.empfohlenerVKPreis || 0;
      if (iPreis === "unter10k") list = list.filter(f => p(f) < 10000);
      else if (iPreis === "10k-20k") list = list.filter(f => p(f) >= 10000 && p(f) < 20000);
      else if (iPreis === "20k-30k") list = list.filter(f => p(f) >= 20000 && p(f) < 30000);
      else if (iPreis === "ueber30k") list = list.filter(f => p(f) >= 30000);
    }
    return applySorting(list, iSort);
  }, [allFahrzeuge, iSearch, iStatus, iMarke, iKraftstoff, iPreis, iSort]);

  // Active filter counts
  const bFilterCount = [bStatus !== "alle", bMarke !== "alle", bKraftstoff !== "alle", bGetriebe !== "alle"].filter(Boolean).length;
  const iFilterCount = [iStatus !== "alle", iMarke !== "alle", iKraftstoff !== "alle", iPreis !== "alle"].filter(Boolean).length;

  const resetBestandFilters = () => { setBSearch(""); setBStatus("alle"); setBMarke("alle"); setBKraftstoff("alle"); setBGetriebe("alle"); setBSort("neueste"); };
  const resetInserateFilters = () => { setISearch(""); setIStatus("alle"); setIMarke("alle"); setIKraftstoff("alle"); setIPreis("alle"); setISort("neueste"); };

  const handleStatusChange = (id: string, status: Fahrzeug["status"]) => {
    updateFahrzeug(id, { status });
    refresh();
    toast({ title: "Status aktualisiert" });
  };

  const openVerkaufModal = (f: Fahrzeug) => { setVerkaufFahrzeug(f); setVerkaufOpen(true); };

  const handleVerkaufConfirm = (data: {
    verkaufspreis: number; kaeuferName: string; kaeuferTelefon: string;
    kaeuferEmail: string; verkaufsDatum: string; zahlungsart: string; verkaufsNotizen: string;
  }) => {
    if (!verkaufFahrzeug) return;
    updateFahrzeug(verkaufFahrzeug.id, { status: "verkauft", ...data });
    setVerkaufOpen(false);
    refresh();
    toast({ title: "Verkauf abgeschlossen", description: `${verkaufFahrzeug.marke} ${verkaufFahrzeug.modell}` });
  };

  const openAddModal = () => { setFormModalFahrzeug(null); setFormModalOpen(true); };
  const openEditModal = (f: Fahrzeug) => { setFormModalFahrzeug(f); setFormModalOpen(true); };

  const handleFormSave = (data: any) => {
    setFormSaving(true);
    if (data.id) {
      updateFahrzeug(data.id, data);
      toast({ title: "Fahrzeug aktualisiert" });
    } else {
      addFahrzeug({ ...data, id: generateId(), status: "neu", ankaufDatum: new Date().toISOString().split("T")[0], inseratEntwurf: "", inseratText: "", inseratPreis: data.empfohlenerVKPreis || 0, verkaufsDatum: "" });
      toast({ title: "Fahrzeug hinzugefügt" });
    }
    setFormSaving(false);
    setFormModalOpen(false);
    refresh();
  };

  const openInseratFromBestand = (f: Fahrzeug) => { setInseratFahrzeug(f); setInseratOpen(true); };
  const openInseratEdit = (f: Fahrzeug) => { setInseratFahrzeug(f); setInseratOpen(true); };
  const openNewInserat = () => { setInseratFahrzeug(null); setInseratOpen(true); };

  const handleInseratPublish = (data: Partial<Fahrzeug> & { marke: string; modell: string }) => {
    if (data.id) {
      updateFahrzeug(data.id, { ...data, status: "inseriert" });
    } else {
      addFahrzeug({
        id: generateId(), marke: data.marke, modell: data.modell,
        typ: "", baujahr: data.baujahr || "", erstzulassung: "",
        km: data.km || "", farbe: data.farbe || "", fin: "", kennzeichen: "",
        kraftstoff: data.kraftstoff || "", getriebe: data.getriebe || "",
        huBis: "", tuevBis: "", zustand: "Gut", notizen: "",
        einkaufspreis: 0, aufbereitungskosten: 0, transportkosten: 0, sonstigeKosten: 0,
        marge: 15, gesamtkosten: 0, empfohlenerVKPreis: data.inseratPreis || 0,
        fotos: data.fotos || [], status: "inseriert",
        ankaufDatum: new Date().toISOString().split("T")[0],
        inseratEntwurf: "", inseratText: data.inseratText || "",
        inseratPreis: data.inseratPreis || 0, verkaufsDatum: "",
      });
    }
    setInseratOpen(false);
    setTab("inserate");
    refresh();
    toast({ title: "Inserat veröffentlicht" });
  };

  // Count for tab badges (unfiltered)
  const bestandTotal = allFahrzeuge.filter(f => f.status !== "verkauft").length;
  const inserateTotal = allFahrzeuge.filter(f => f.status === "inseriert" || f.status === "pausiert").length;

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
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="bestand" className="gap-1.5 text-xs">
                <Package className="w-3.5 h-3.5" /> Bestand
                <span className="ml-1 text-[10px] bg-muted-foreground/10 px-1.5 rounded-full">{bestandTotal}</span>
              </TabsTrigger>
              <TabsTrigger value="inserate" className="gap-1.5 text-xs">
                <Tag className="w-3.5 h-3.5" /> Inserate
                <span className="ml-1 text-[10px] bg-muted-foreground/10 px-1.5 rounded-full">{inserateTotal}</span>
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

          {/* ===== BESTAND TAB ===== */}
          <TabsContent value="bestand">
            {/* Filter bar */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="relative flex-1 min-w-[180px] max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input value={bSearch} onChange={(e) => setBSearch(e.target.value)} placeholder="Marke, Modell, Kennzeichen..." className="pl-8 text-xs h-8" />
              </div>
              <Select value={bStatus} onValueChange={setBStatus}>
                <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="alle">Alle Status</SelectItem>
                  {bestandStatusOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={bMarke} onValueChange={setBMarke}>
                <SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Marke" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="alle">Alle Marken</SelectItem>
                  {bestandMarken.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={bKraftstoff} onValueChange={setBKraftstoff}>
                <SelectTrigger className="w-[110px] h-8 text-xs"><SelectValue placeholder="Kraftstoff" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="alle">Alle</SelectItem>
                  <SelectItem value="Benzin">Benzin</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="Elektro">Elektro</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              <Select value={bGetriebe} onValueChange={setBGetriebe}>
                <SelectTrigger className="w-[110px] h-8 text-xs"><SelectValue placeholder="Getriebe" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="alle">Alle</SelectItem>
                  <SelectItem value="Manuell">Manuell</SelectItem>
                  <SelectItem value="Automatik">Automatik</SelectItem>
                </SelectContent>
              </Select>
              <Select value={bSort} onValueChange={(v) => setBSort(v as BestandSort)}>
                <SelectTrigger className="w-[150px] h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {bestandSortOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
              {bFilterCount > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{bFilterCount} Filter aktiv</span>
                  <button onClick={resetBestandFilters} className="text-[10px] text-muted-foreground hover:text-foreground underline">Zurücksetzen</button>
                </div>
              )}
            </div>

            {bestand.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Car className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">{bFilterCount > 0 || bSearch ? "Keine Fahrzeuge gefunden." : "Noch keine Fahrzeuge im Bestand."}</p>
                {!bFilterCount && !bSearch && (
                  <p className="text-xs mt-1">Klicke auf „Fahrzeug hinzufügen" oder gehe zu <a href="/ankauf" className="text-primary underline">Ankauf</a>.</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {bestand.map((f) => {
                  const days = getStandzeit(f);
                  return (
                    <div key={f.id} className="bg-card border border-border rounded-xl overflow-hidden relative">
                      {/* Status badge top-right */}
                      <div className="absolute top-2.5 right-2.5 z-10">
                        <StatusBadgeDropdown
                          fahrzeug={f}
                          options={bestandStatusOptions}
                          config={statusConfig}
                          onChange={handleStatusChange}
                        />
                      </div>

                      <div className="h-36 bg-muted flex items-center justify-center">
                        {f.fotos?.[0] ? (
                          <img src={f.fotos[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Car className="w-8 h-8 text-muted-foreground/30" />
                        )}
                      </div>
                      <div className="p-4">
                        <div className="mb-2">
                          <div className="text-sm font-semibold text-foreground">{f.marke} {f.modell}</div>
                          <div className="text-[11px] text-muted-foreground">{f.baujahr} · {f.km ? `${Number(f.km).toLocaleString("de-DE")} km` : "–"}</div>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <StandzeitBadge days={days} />
                        </div>

                        <div className="flex items-center justify-between text-xs mb-3">
                          <div>
                            <span className="text-muted-foreground">EK:</span>{" "}
                            <span className="font-medium">€ {(f.einkaufspreis || 0).toLocaleString("de-DE")}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Empf. VK:</span>{" "}
                            <span className="font-semibold text-primary">€ {(f.empfohlenerVKPreis || 0).toLocaleString("de-DE")}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
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

          {/* ===== INSERATE TAB ===== */}
          <TabsContent value="inserate">
            {/* Filter bar */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="relative flex-1 min-w-[180px] max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input value={iSearch} onChange={(e) => setISearch(e.target.value)} placeholder="Marke, Modell suchen..." className="pl-8 text-xs h-8" />
              </div>
              <Select value={iStatus} onValueChange={setIStatus}>
                <SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="alle">Alle Status</SelectItem>
                  {inseratStatusOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={iMarke} onValueChange={setIMarke}>
                <SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Marke" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="alle">Alle Marken</SelectItem>
                  {inserateMarken.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={iKraftstoff} onValueChange={setIKraftstoff}>
                <SelectTrigger className="w-[110px] h-8 text-xs"><SelectValue placeholder="Kraftstoff" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="alle">Alle</SelectItem>
                  <SelectItem value="Benzin">Benzin</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="Elektro">Elektro</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              <Select value={iPreis} onValueChange={setIPreis}>
                <SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Preis" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="alle">Alle Preise</SelectItem>
                  <SelectItem value="unter10k">Unter 10.000 €</SelectItem>
                  <SelectItem value="10k-20k">10.000 – 20.000 €</SelectItem>
                  <SelectItem value="20k-30k">20.000 – 30.000 €</SelectItem>
                  <SelectItem value="ueber30k">Über 30.000 €</SelectItem>
                </SelectContent>
              </Select>
              <Select value={iSort} onValueChange={(v) => setISort(v as InserateSort)}>
                <SelectTrigger className="w-[150px] h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {inserateSortOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
              {iFilterCount > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{iFilterCount} Filter aktiv</span>
                  <button onClick={resetInserateFilters} className="text-[10px] text-muted-foreground hover:text-foreground underline">Zurücksetzen</button>
                </div>
              )}
            </div>

            {inserierte.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Tag className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">{iFilterCount > 0 || iSearch ? "Keine Inserate gefunden." : "Noch keine Inserate erstellt."}</p>
                {!iFilterCount && !iSearch && (
                  <p className="text-xs mt-1">Erstelle ein Inserat aus dem Bestand oder klicke „Neues Inserat".</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {inserierte.map((f) => {
                  const isc = inseratStatusConfig[f.status] || inseratStatusConfig.inseriert;
                  return (
                    <div key={f.id} className="bg-card border border-border rounded-xl overflow-hidden relative">
                      {/* Status badge top-right */}
                      <div className="absolute top-2.5 right-2.5 z-10">
                        <StatusBadgeDropdown
                          fahrzeug={f}
                          options={inseratStatusOptions}
                          config={inseratStatusConfig}
                          onChange={handleStatusChange}
                        />
                      </div>

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
                        <div className="text-base font-bold text-foreground mb-3">€ {(f.inseratPreis || f.empfohlenerVKPreis || 0).toLocaleString("de-DE")}</div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="text-xs flex-1 gap-1" onClick={() => openInseratEdit(f)}>
                            <Edit className="w-3 h-3" /> Bearbeiten
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs gap-1">
                            <FileText className="w-3 h-3" /> PDF
                          </Button>
                          <Button variant="destructive" size="sm" className="text-xs gap-1" onClick={() => openVerkaufModal(f)}>
                            <CheckCircle className="w-3 h-3" /> Verkauft
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <FahrzeugFormModal open={formModalOpen} onClose={() => setFormModalOpen(false)} onSave={handleFormSave} fahrzeug={formModalFahrzeug} saving={formSaving} />
        <InseratPanel open={inseratOpen} onClose={() => setInseratOpen(false)} onPublish={handleInseratPublish} fahrzeug={inseratFahrzeug} />
        <VerkaufModal open={verkaufOpen} onClose={() => setVerkaufOpen(false)} onConfirm={handleVerkaufConfirm} fahrzeug={verkaufFahrzeug} />
      </main>
    </div>
  );
};

export default Fahrzeuge;
