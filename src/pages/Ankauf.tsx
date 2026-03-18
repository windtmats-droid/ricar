import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { addFahrzeug, generateId, type Fahrzeug } from "@/lib/fahrzeuge-store";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingCart, Upload, X, Loader2 } from "lucide-react";

const Ankauf = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    marke: "", modell: "", typ: "", baujahr: "", erstzulassung: "", km: "",
    farbe: "", fin: "", kennzeichen: "", kraftstoff: "", getriebe: "",
    huBis: "", tuevBis: "", zustand: "Gut", notizen: "",
    einkaufspreis: "", aufbereitungskosten: "", transportkosten: "", sonstigeKosten: "",
  });
  const [marge, setMarge] = useState(15);
  const [fotos, setFotos] = useState<string[]>([]);

  const u = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const ek = parseFloat(form.einkaufspreis) || 0;
  const aufb = parseFloat(form.aufbereitungskosten) || 0;
  const trans = parseFloat(form.transportkosten) || 0;
  const sonst = parseFloat(form.sonstigeKosten) || 0;
  const gesamtkosten = ek + aufb + trans + sonst;
  const empfohlenerVK = gesamtkosten > 0 ? Math.round(gesamtkosten / (1 - marge / 100)) : 0;

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setFotos((prev) => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }, []);

  const handleSave = async () => {
    if (!form.marke.trim() || !form.modell.trim() || !form.einkaufspreis) {
      toast({ title: "Pflichtfelder fehlen", description: "Marke, Modell und Einkaufspreis sind erforderlich.", variant: "destructive" });
      return;
    }

    setSaving(true);

    // Generate description via edge function
    let inseratEntwurf = "";
    try {
      const { data } = await supabase.functions.invoke("generate-description", {
        body: { marke: form.marke, modell: form.modell, baujahr: form.baujahr, km: form.km, kraftstoff: form.kraftstoff, getriebe: form.getriebe, preis: String(empfohlenerVK) },
      });
      inseratEntwurf = data?.beschreibung || "";
    } catch {
      console.warn("KI-Text konnte nicht generiert werden");
    }

    const fahrzeug: Fahrzeug = {
      id: generateId(),
      marke: form.marke.trim(),
      modell: form.modell.trim(),
      typ: form.typ,
      baujahr: form.baujahr,
      erstzulassung: form.erstzulassung,
      km: form.km,
      farbe: form.farbe,
      fin: form.fin,
      kennzeichen: form.kennzeichen,
      kraftstoff: form.kraftstoff,
      getriebe: form.getriebe,
      huBis: form.huBis,
      tuevBis: form.tuevBis,
      zustand: form.zustand,
      notizen: form.notizen,
      einkaufspreis: ek,
      aufbereitungskosten: aufb,
      transportkosten: trans,
      sonstigeKosten: sonst,
      marge,
      gesamtkosten,
      empfohlenerVKPreis: empfohlenerVK,
      fotos,
      status: "neu",
      ankaufDatum: new Date().toISOString().split("T")[0],
      inseratEntwurf,
      inseratText: "",
      inseratPreis: empfohlenerVK,
      verkaufsDatum: "",
    };

    addFahrzeug(fahrzeug);
    setSaving(false);
    toast({ title: "Fahrzeug übernommen", description: `${fahrzeug.marke} ${fahrzeug.modell} wurde in den Bestand aufgenommen.` });
    navigate("/fahrzeuge");
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-lg font-medium text-foreground flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" /> Fahrzeug-Ankauf
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Neues Fahrzeug ankaufen und in den Bestand übernehmen</p>
        </div>

        <div className="grid grid-cols-[1fr_380px] gap-5">
          {/* Left: Fahrzeugdaten */}
          <div className="space-y-4">
            {/* Fahrzeugdaten */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Fahrzeugdaten</h2>
              <div className="grid grid-cols-3 gap-3">
                <div><Label className="text-xs">Marke *</Label><Input value={form.marke} onChange={(e) => u("marke", e.target.value)} placeholder="z.B. BMW" className="mt-1" /></div>
                <div><Label className="text-xs">Modell *</Label><Input value={form.modell} onChange={(e) => u("modell", e.target.value)} placeholder="z.B. 320d" className="mt-1" /></div>
                <div><Label className="text-xs">Typ/Variante</Label><Input value={form.typ} onChange={(e) => u("typ", e.target.value)} placeholder="z.B. Touring" className="mt-1" /></div>
                <div><Label className="text-xs">Baujahr</Label><Input value={form.baujahr} onChange={(e) => u("baujahr", e.target.value)} placeholder="2021" className="mt-1" /></div>
                <div><Label className="text-xs">Erstzulassung</Label><Input type="date" value={form.erstzulassung} onChange={(e) => u("erstzulassung", e.target.value)} className="mt-1" /></div>
                <div><Label className="text-xs">Kilometerstand</Label><Input value={form.km} onChange={(e) => u("km", e.target.value)} placeholder="68.000" className="mt-1" /></div>
                <div><Label className="text-xs">Farbe</Label><Input value={form.farbe} onChange={(e) => u("farbe", e.target.value)} placeholder="Schwarz" className="mt-1" /></div>
                <div><Label className="text-xs">FIN</Label><Input value={form.fin} onChange={(e) => u("fin", e.target.value)} placeholder="Fahrgestellnummer" className="mt-1" /></div>
                <div><Label className="text-xs">Kennzeichen</Label><Input value={form.kennzeichen} onChange={(e) => u("kennzeichen", e.target.value)} placeholder="M-AB 1234" className="mt-1" /></div>
                <div>
                  <Label className="text-xs">Kraftstoff</Label>
                  <Select value={form.kraftstoff} onValueChange={(v) => u("kraftstoff", v)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Wählen" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Benzin">Benzin</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Elektro">Elektro</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Getriebe</Label>
                  <Select value={form.getriebe} onValueChange={(v) => u("getriebe", v)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Wählen" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Automatik">Automatik</SelectItem>
                      <SelectItem value="Manuell">Manuell</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label className="text-xs">HU bis</Label><Input type="date" value={form.huBis} onChange={(e) => u("huBis", e.target.value)} className="mt-1" /></div>
                <div><Label className="text-xs">TÜV bis</Label><Input type="date" value={form.tuevBis} onChange={(e) => u("tuevBis", e.target.value)} className="mt-1" /></div>
                <div>
                  <Label className="text-xs">Zustand</Label>
                  <Select value={form.zustand} onValueChange={(v) => u("zustand", v)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sehr gut">Sehr gut</SelectItem>
                      <SelectItem value="Gut">Gut</SelectItem>
                      <SelectItem value="Akzeptabel">Akzeptabel</SelectItem>
                      <SelectItem value="Aufbereitung nötig">Aufbereitung nötig</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-3">
                <Label className="text-xs">Notizen</Label>
                <Textarea value={form.notizen} onChange={(e) => u("notizen", e.target.value)} placeholder="Anmerkungen zum Fahrzeug..." className="mt-1" rows={3} />
              </div>
            </div>

            {/* Fotos */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Fotos</h2>
              <div className="flex flex-wrap gap-3">
                {fotos.map((src, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => setFotos((p) => p.filter((_, j) => j !== i))} className="absolute top-1 right-1 w-5 h-5 bg-background/80 rounded-full flex items-center justify-center">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className="w-24 h-24 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground mt-1">Hochladen</span>
                  <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Right: Kalkulation */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Kalkulation</h2>
              <div className="space-y-3">
                <div><Label className="text-xs">Einkaufspreis (€) *</Label><Input type="number" value={form.einkaufspreis} onChange={(e) => u("einkaufspreis", e.target.value)} placeholder="0" className="mt-1" /></div>
                <div><Label className="text-xs">Aufbereitungskosten (€)</Label><Input type="number" value={form.aufbereitungskosten} onChange={(e) => u("aufbereitungskosten", e.target.value)} placeholder="0" className="mt-1" /></div>
                <div><Label className="text-xs">Transportkosten (€)</Label><Input type="number" value={form.transportkosten} onChange={(e) => u("transportkosten", e.target.value)} placeholder="0" className="mt-1" /></div>
                <div><Label className="text-xs">Sonstige Kosten (€)</Label><Input type="number" value={form.sonstigeKosten} onChange={(e) => u("sonstigeKosten", e.target.value)} placeholder="0" className="mt-1" /></div>
                <div>
                  <Label className="text-xs">Gewünschte Marge: {marge}%</Label>
                  <Slider value={[marge]} onValueChange={(v) => setMarge(v[0])} min={5} max={40} step={1} className="mt-2" />
                </div>

                <div className="border-t border-border pt-3 mt-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Gesamtkosten</span>
                    <span className="font-medium text-foreground">€ {gesamtkosten.toLocaleString("de-DE")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Empf. VK-Preis</span>
                    <span className="font-bold text-green-600 dark:text-green-400 text-base">€ {empfohlenerVK.toLocaleString("de-DE")}</span>
                  </div>
                </div>
              </div>
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full gap-2" size="lg">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
              {saving ? "Wird gespeichert..." : "In Bestand übernehmen"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Ankauf;
