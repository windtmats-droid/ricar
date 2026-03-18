import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { getFahrzeuge, updateFahrzeug, getStandzeit, type Fahrzeug } from "@/lib/fahrzeuge-store";
import { Car, Search, ChevronDown, Edit, FileText, CheckCircle, Package, Tag } from "lucide-react";
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
  const [inseratModal, setInseratModal] = useState<Fahrzeug | null>(null);
  const [inseratText, setInseratText] = useState("");
  const [inseratPreis, setInseratPreis] = useState("");

  const allFahrzeuge = useMemo(() => getFahrzeuge(), [refreshKey]);

  const bestand = useMemo(() => {
    return allFahrzeuge
      .filter((f) => f.status !== "verkauft")
      .filter((f) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return `${f.marke} ${f.modell} ${f.fin}`.toLowerCase().includes(q);
      });
  }, [allFahrzeuge, search]);

  const inserierte = useMemo(() => {
    return allFahrzeuge.filter((f) => f.status === "inseriert");
  }, [allFahrzeuge]);

  const refresh = () => setRefreshKey((k) => k + 1);

  const handleStatusChange = (id: string, status: Fahrzeug["status"]) => {
    updateFahrzeug(id, { status });
    refresh();
    toast({ title: "Status aktualisiert" });
  };

  const openInseratModal = (f: Fahrzeug) => {
    setInseratModal(f);
    setInseratText(f.inseratEntwurf || f.inseratText || "");
    setInseratPreis(String(f.inseratPreis || f.empfohlenerVKPreis || ""));
  };

  const publishInserat = () => {
    if (!inseratModal) return;
    updateFahrzeug(inseratModal.id, {
      status: "inseriert",
      inseratText: inseratText,
      inseratPreis: parseFloat(inseratPreis) || 0,
    });
    setInseratModal(null);
    refresh();
    toast({ title: "Inserat veröffentlicht", description: `${inseratModal.marke} ${inseratModal.modell} ist jetzt inseriert.` });
  };

  const markAsSold = (id: string) => {
    updateFahrzeug(id, { status: "verkauft", verkaufsDatum: new Date().toISOString().split("T")[0] });
    refresh();
    toast({ title: "Als verkauft markiert" });
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
          <TabsList className="mb-4">
            <TabsTrigger value="bestand" className="gap-1.5 text-xs">
              <Package className="w-3.5 h-3.5" /> Bestand
              <span className="ml-1 text-[10px] bg-muted-foreground/10 px-1.5 rounded-full">{bestand.length}</span>
            </TabsTrigger>
            <TabsTrigger value="inserate" className="gap-1.5 text-xs">
              <Tag className="w-3.5 h-3.5" /> Inserate
              <span className="ml-1 text-[10px] bg-muted-foreground/10 px-1.5 rounded-full">{inserierte.length}</span>
            </TabsTrigger>
          </TabsList>

          {/* BESTAND TAB */}
          <TabsContent value="bestand">
            {bestand.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Car className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Noch keine Fahrzeuge im Bestand.</p>
                <p className="text-xs mt-1">Gehe zu <a href="/ankauf" className="text-primary underline">Ankauf</a> um ein Fahrzeug hinzuzufügen.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {bestand.map((f) => {
                  const days = getStandzeit(f);
                  const sc = statusConfig[f.status] || statusConfig.neu;
                  return (
                    <div key={f.id} className="bg-card border border-border rounded-xl overflow-hidden">
                      {/* Photo */}
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
                              <Button variant="outline" size="sm" className="text-xs flex-1 gap-1">
                                Status <ChevronDown className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleStatusChange(f.id, "neu")}>Neu</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(f.id, "aufbereitung")}>In Aufbereitung</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(f.id, "bereit")}>Bereit</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Button size="sm" className="text-xs flex-1 gap-1" onClick={() => openInseratModal(f)}>
                            <Edit className="w-3 h-3" /> Inserat erstellen
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
                <p className="text-xs mt-1">Erstelle ein Inserat aus dem Bestand-Tab.</p>
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
                        <Button variant="outline" size="sm" className="text-xs flex-1 gap-1" onClick={() => openInseratModal(f)}>
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

        {/* Inserat Modal */}
        <Dialog open={!!inseratModal} onOpenChange={(o) => !o && setInseratModal(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Inserat erstellen — {inseratModal?.marke} {inseratModal?.modell}</DialogTitle>
              <DialogDescription>KI-generierten Text prüfen, anpassen und veröffentlichen.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-xs">Inseratstext</Label>
                <Textarea value={inseratText} onChange={(e) => setInseratText(e.target.value)} rows={8} className="mt-1 text-xs" />
              </div>
              <div>
                <Label className="text-xs">Verkaufspreis (€)</Label>
                <Input type="number" value={inseratPreis} onChange={(e) => setInseratPreis(e.target.value)} className="mt-1" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInseratModal(null)}>Abbrechen</Button>
              <Button onClick={publishInserat}>Veröffentlichen</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Fahrzeuge;
