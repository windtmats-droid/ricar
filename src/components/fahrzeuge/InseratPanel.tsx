import { useState, useCallback, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Loader2, Sparkles, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { type Fahrzeug } from "@/lib/fahrzeuge-store";
import { InseratVorschau } from "./InseratVorschau";
import { SocialMediaVorschau } from "./SocialMediaVorschau";

interface Props {
  open: boolean;
  onClose: () => void;
  onPublish: (data: Partial<Fahrzeug> & { marke: string; modell: string }) => void;
  fahrzeug?: Fahrzeug | null;
}

export function InseratPanel({ open, onClose, onPublish, fahrzeug }: Props) {
  const [marke, setMarke] = useState("");
  const [modell, setModell] = useState("");
  const [baujahr, setBaujahr] = useState("");
  const [km, setKm] = useState("");
  const [kraftstoff, setKraftstoff] = useState("");
  const [getriebe, setGetriebe] = useState("");
  const [farbe, setFarbe] = useState("");
  const [inseratText, setInseratText] = useState("");
  const [inseratPreis, setInseratPreis] = useState("");
  const [fotos, setFotos] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState("bearbeiten");

  useEffect(() => {
    if (open) {
      setActiveTab("bearbeiten");
      if (fahrzeug) {
        setMarke(fahrzeug.marke);
        setModell(fahrzeug.modell);
        setBaujahr(fahrzeug.baujahr);
        setKm(fahrzeug.km);
        setKraftstoff(fahrzeug.kraftstoff);
        setGetriebe(fahrzeug.getriebe);
        setFarbe(fahrzeug.farbe);
        setInseratText(fahrzeug.inseratText || fahrzeug.inseratEntwurf || "");
        setInseratPreis(String(fahrzeug.inseratPreis || fahrzeug.empfohlenerVKPreis || ""));
        setFotos(fahrzeug.fotos || []);
      } else {
        setMarke(""); setModell(""); setBaujahr(""); setKm("");
        setKraftstoff(""); setGetriebe(""); setFarbe("");
        setInseratText(""); setInseratPreis(""); setFotos([]);
      }
    }
  }, [open, fahrzeug]);

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setFotos((prev) => [...prev, ev.target!.result as string]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const { data } = await supabase.functions.invoke("generate-description", {
        body: { marke, modell, baujahr, km, kraftstoff, getriebe, preis: inseratPreis },
      });
      if (data?.beschreibung) setInseratText(data.beschreibung);
    } catch (err) {
      console.error("KI-Text Fehler:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = () => {
    if (!marke.trim() || !modell.trim()) return;
    setPublishing(true);
    onPublish({
      ...(fahrzeug ? { id: fahrzeug.id } : {}),
      marke: marke.trim(),
      modell: modell.trim(),
      baujahr, km, kraftstoff, getriebe, farbe,
      inseratText,
      inseratPreis: parseFloat(inseratPreis) || 0,
      fotos,
    });
    setPublishing(false);
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>{fahrzeug?.status === "inseriert" ? "Inserat bearbeiten" : "Inserat erstellen"}</SheetTitle>
          <SheetDescription>
            {fahrzeug ? `${fahrzeug.marke} ${fahrzeug.modell}` : "Neues Inserat von Grund auf erstellen"}
          </SheetDescription>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="bearbeiten" className="flex-1 text-xs">Bearbeiten</TabsTrigger>
            <TabsTrigger value="vorschau" className="flex-1 text-xs">Vorschau</TabsTrigger>
            <TabsTrigger value="social" className="flex-1 text-xs">Social Media</TabsTrigger>
          </TabsList>

          {/* === EDIT TAB === */}
          <TabsContent value="bearbeiten">
            <div className="space-y-5">
              {/* Vehicle data */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-foreground">Fahrzeugdaten</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  <div><Label className="text-[11px]">Marke *</Label><Input value={marke} onChange={(e) => setMarke(e.target.value)} className="mt-1 h-8 text-xs" /></div>
                  <div><Label className="text-[11px]">Modell *</Label><Input value={modell} onChange={(e) => setModell(e.target.value)} className="mt-1 h-8 text-xs" /></div>
                  <div><Label className="text-[11px]">Baujahr</Label><Input value={baujahr} onChange={(e) => setBaujahr(e.target.value)} className="mt-1 h-8 text-xs" /></div>
                  <div><Label className="text-[11px]">Kilometerstand</Label><Input value={km} onChange={(e) => setKm(e.target.value)} className="mt-1 h-8 text-xs" /></div>
                  <div>
                    <Label className="text-[11px]">Kraftstoff</Label>
                    <Select value={kraftstoff} onValueChange={setKraftstoff}>
                      <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue placeholder="Wählen" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Benzin">Benzin</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Elektro">Elektro</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[11px]">Getriebe</Label>
                    <Select value={getriebe} onValueChange={setGetriebe}>
                      <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue placeholder="Wählen" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Automatik">Automatik</SelectItem>
                        <SelectItem value="Manuell">Manuell</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label className="text-[11px]">Farbe</Label><Input value={farbe} onChange={(e) => setFarbe(e.target.value)} className="mt-1 h-8 text-xs" /></div>
                  <div>
                    <Label className="text-[11px]">Verkaufspreis (€) *</Label>
                    <Input type="number" value={inseratPreis} onChange={(e) => setInseratPreis(e.target.value)} className="mt-1 h-8 text-xs" />
                  </div>
                </div>
              </div>

              {/* Fotos */}
              <div>
                <h3 className="text-xs font-semibold text-foreground mb-2">Fotos</h3>
                <div className="flex flex-wrap gap-2">
                  {fotos.map((src, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => setFotos((p) => p.filter((_, j) => j !== i))} className="absolute top-0.5 right-0.5 w-4 h-4 bg-background/80 rounded-full flex items-center justify-center">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                  <label className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[9px] text-muted-foreground mt-0.5">Hochladen</span>
                    <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* KI Inseratstext */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-foreground">Inseratstext</h3>
                  <Button variant="outline" size="sm" disabled={generating} onClick={handleGenerate} className="text-[11px] gap-1 h-7">
                    {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    {generating ? "Generiert..." : "✨ KI-Text neu generieren"}
                  </Button>
                </div>
                <Textarea value={inseratText} onChange={(e) => setInseratText(e.target.value)} rows={8} className="text-xs" placeholder="Inseratstext eingeben oder per KI generieren..." />
              </div>

              {/* Publishing toggles */}
              <div>
                <h3 className="text-xs font-semibold text-foreground mb-3">Veröffentlichung</h3>
                <div className="space-y-3">
                  {["AutoScout24 listen", "Mobile.de listen", "Social Media Post"].map((label) => (
                    <div key={label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{label}</span>
                        <Badge variant="secondary" className="text-[9px] px-1.5 py-0">Bald verfügbar</Badge>
                      </div>
                      <Switch disabled className="opacity-40" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Publish button */}
              <Button onClick={handlePublish} disabled={publishing || !marke.trim() || !modell.trim()} className="w-full gap-2" size="lg">
                {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Veröffentlichen
              </Button>
            </div>
          </TabsContent>

          {/* === VORSCHAU TAB === */}
          <TabsContent value="vorschau">
            <InseratVorschau
              marke={marke} modell={modell} baujahr={baujahr} km={km}
              kraftstoff={kraftstoff} getriebe={getriebe} farbe={farbe}
              inseratText={inseratText} inseratPreis={inseratPreis} fotos={fotos}
            />
          </TabsContent>

          {/* === SOCIAL MEDIA TAB === */}
          <TabsContent value="social">
            <SocialMediaVorschau
              marke={marke} modell={modell} baujahr={baujahr} km={km}
              kraftstoff={kraftstoff} inseratPreis={inseratPreis} fotos={fotos}
            />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
