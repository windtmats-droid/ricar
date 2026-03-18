import { useState, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Upload, X, Loader2, Save } from "lucide-react";
import { type Fahrzeug } from "@/lib/fahrzeuge-store";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Fahrzeug, "id" | "status" | "ankaufDatum" | "inseratEntwurf" | "inseratText" | "inseratPreis" | "verkaufsDatum"> & { id?: string }) => void;
  fahrzeug?: Fahrzeug | null;
  saving?: boolean;
}

const emptyForm = {
  marke: "", modell: "", typ: "", baujahr: "", erstzulassung: "", km: "",
  farbe: "", fin: "", kennzeichen: "", kraftstoff: "", getriebe: "",
  huBis: "", tuevBis: "", zustand: "Gut", notizen: "",
  einkaufspreis: "", aufbereitungskosten: "", transportkosten: "", sonstigeKosten: "",
};

export function FahrzeugFormModal({ open, onClose, onSave, fahrzeug, saving }: Props) {
  const [form, setForm] = useState(emptyForm);
  const [marge, setMarge] = useState(15);
  const [fotos, setFotos] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      if (fahrzeug) {
        setForm({
          marke: fahrzeug.marke, modell: fahrzeug.modell, typ: fahrzeug.typ,
          baujahr: fahrzeug.baujahr, erstzulassung: fahrzeug.erstzulassung, km: fahrzeug.km,
          farbe: fahrzeug.farbe, fin: fahrzeug.fin, kennzeichen: fahrzeug.kennzeichen,
          kraftstoff: fahrzeug.kraftstoff, getriebe: fahrzeug.getriebe,
          huBis: fahrzeug.huBis, tuevBis: fahrzeug.tuevBis, zustand: fahrzeug.zustand,
          notizen: fahrzeug.notizen,
          einkaufspreis: String(fahrzeug.einkaufspreis || ""),
          aufbereitungskosten: String(fahrzeug.aufbereitungskosten || ""),
          transportkosten: String(fahrzeug.transportkosten || ""),
          sonstigeKosten: String(fahrzeug.sonstigeKosten || ""),
        });
        setMarge(fahrzeug.marge || 15);
        setFotos(fahrzeug.fotos || []);
      } else {
        setForm(emptyForm);
        setMarge(15);
        setFotos([]);
      }
    }
  }, [open, fahrzeug]);

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
        if (ev.target?.result) setFotos((prev) => [...prev, ev.target!.result as string]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }, []);

  const handleSubmit = () => {
    onSave({
      ...(fahrzeug?.id ? { id: fahrzeug.id } : {}),
      marke: form.marke.trim(), modell: form.modell.trim(), typ: form.typ,
      baujahr: form.baujahr, erstzulassung: form.erstzulassung, km: form.km,
      farbe: form.farbe, fin: form.fin, kennzeichen: form.kennzeichen,
      kraftstoff: form.kraftstoff, getriebe: form.getriebe,
      huBis: form.huBis, tuevBis: form.tuevBis, zustand: form.zustand,
      notizen: form.notizen,
      einkaufspreis: ek, aufbereitungskosten: aufb, transportkosten: trans,
      sonstigeKosten: sonst, marge, gesamtkosten, empfohlenerVKPreis: empfohlenerVK,
      fotos,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{fahrzeug ? "Fahrzeug bearbeiten" : "Fahrzeug hinzufügen"}</DialogTitle>
          <DialogDescription>{fahrzeug ? "Fahrzeugdaten und Kalkulation bearbeiten." : "Neues Fahrzeug direkt in den Bestand aufnehmen."}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-[1fr_280px] gap-5">
          {/* Left: Fahrzeugdaten */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-foreground mb-3">Fahrzeugdaten</h3>
              <div className="grid grid-cols-3 gap-2.5">
                <div><Label className="text-[11px]">Marke *</Label><Input value={form.marke} onChange={(e) => u("marke", e.target.value)} placeholder="z.B. BMW" className="mt-1 h-8 text-xs" /></div>
                <div><Label className="text-[11px]">Modell *</Label><Input value={form.modell} onChange={(e) => u("modell", e.target.value)} placeholder="z.B. 320d" className="mt-1 h-8 text-xs" /></div>
                <div><Label className="text-[11px]">Typ/Variante</Label><Input value={form.typ} onChange={(e) => u("typ", e.target.value)} placeholder="z.B. Touring" className="mt-1 h-8 text-xs" /></div>
                <div><Label className="text-[11px]">Baujahr</Label><Input value={form.baujahr} onChange={(e) => u("baujahr", e.target.value)} placeholder="2021" className="mt-1 h-8 text-xs" /></div>
                <div><Label className="text-[11px]">Erstzulassung</Label><Input type="date" value={form.erstzulassung} onChange={(e) => u("erstzulassung", e.target.value)} className="mt-1 h-8 text-xs" /></div>
                <div><Label className="text-[11px]">Kilometerstand</Label><Input value={form.km} onChange={(e) => u("km", e.target.value)} placeholder="68.000" className="mt-1 h-8 text-xs" /></div>
                <div><Label className="text-[11px]">Farbe</Label><Input value={form.farbe} onChange={(e) => u("farbe", e.target.value)} placeholder="Schwarz" className="mt-1 h-8 text-xs" /></div>
                <div><Label className="text-[11px]">FIN</Label><Input value={form.fin} onChange={(e) => u("fin", e.target.value)} placeholder="Fahrgestellnr." className="mt-1 h-8 text-xs" /></div>
                <div><Label className="text-[11px]">Kennzeichen</Label><Input value={form.kennzeichen} onChange={(e) => u("kennzeichen", e.target.value)} placeholder="M-AB 1234" className="mt-1 h-8 text-xs" /></div>
                <div>
                  <Label className="text-[11px]">Kraftstoff</Label>
                  <Select value={form.kraftstoff} onValueChange={(v) => u("kraftstoff", v)}>
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
                  <Select value={form.getriebe} onValueChange={(v) => u("getriebe", v)}>
                    <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue placeholder="Wählen" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Automatik">Automatik</SelectItem>
                      <SelectItem value="Manuell">Manuell</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label className="text-[11px]">HU bis</Label><Input type="date" value={form.huBis} onChange={(e) => u("huBis", e.target.value)} className="mt-1 h-8 text-xs" /></div>
                <div><Label className="text-[11px]">TÜV bis</Label><Input type="date" value={form.tuevBis} onChange={(e) => u("tuevBis", e.target.value)} className="mt-1 h-8 text-xs" /></div>
                <div>
                  <Label className="text-[11px]">Zustand</Label>
                  <Select value={form.zustand} onValueChange={(v) => u("zustand", v)}>
                    <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sehr gut">Sehr gut</SelectItem>
                      <SelectItem value="Gut">Gut</SelectItem>
                      <SelectItem value="Akzeptabel">Akzeptabel</SelectItem>
                      <SelectItem value="Aufbereitung nötig">Aufbereitung nötig</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-2.5">
                <Label className="text-[11px]">Notizen</Label>
                <Textarea value={form.notizen} onChange={(e) => u("notizen", e.target.value)} placeholder="Anmerkungen..." className="mt-1 text-xs" rows={2} />
              </div>
            </div>

            {/* Fotos */}
            <div>
              <h3 className="text-xs font-semibold text-foreground mb-3">Fotos</h3>
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
          </div>

          {/* Right: Kalkulation */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-foreground mb-1">Kalkulation</h3>
            <div><Label className="text-[11px]">Einkaufspreis (€) *</Label><Input type="number" value={form.einkaufspreis} onChange={(e) => u("einkaufspreis", e.target.value)} placeholder="0" className="mt-1 h-8 text-xs" /></div>
            <div><Label className="text-[11px]">Aufbereitungskosten (€)</Label><Input type="number" value={form.aufbereitungskosten} onChange={(e) => u("aufbereitungskosten", e.target.value)} placeholder="0" className="mt-1 h-8 text-xs" /></div>
            <div><Label className="text-[11px]">Transportkosten (€)</Label><Input type="number" value={form.transportkosten} onChange={(e) => u("transportkosten", e.target.value)} placeholder="0" className="mt-1 h-8 text-xs" /></div>
            <div><Label className="text-[11px]">Sonstige Kosten (€)</Label><Input type="number" value={form.sonstigeKosten} onChange={(e) => u("sonstigeKosten", e.target.value)} placeholder="0" className="mt-1 h-8 text-xs" /></div>
            <div>
              <Label className="text-[11px]">Marge: {marge}%</Label>
              <Slider value={[marge]} onValueChange={(v) => setMarge(v[0])} min={5} max={40} step={1} className="mt-2" />
            </div>
            <div className="border-t border-border pt-3 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Gesamtkosten</span>
                <span className="font-medium">€ {gesamtkosten.toLocaleString("de-DE")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">Empf. VK</span>
                <span className="font-bold text-green-600 dark:text-green-400">€ {empfohlenerVK.toLocaleString("de-DE")}</span>
              </div>
            </div>

            <Button onClick={handleSubmit} disabled={saving || !form.marke.trim() || !form.modell.trim()} className="w-full gap-2 mt-4">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Wird gespeichert..." : fahrzeug ? "Änderungen speichern" : "In Bestand übernehmen"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
