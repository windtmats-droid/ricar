import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

const FAHRZEUGKLASSEN = ["Kleinwagen", "Kompakt", "Mittelklasse", "SUV", "Geländewagen", "Sportwagen", "Van", "Transporter"];
const KRAFTSTOFFE = ["Benzin", "Diesel", "Elektro", "Hybrid"];
const GETRIEBE = ["Automatik", "Manuell"];
const RADIUS_MARKS = [25, 50, 100, 200, 500];

interface ScanKonfigurationProps {
  fahrzeuge: Array<{ id: string; marke: string; modell: string; baujahr: number | null }>;
}

export function ScanKonfiguration({ fahrzeuge }: ScanKonfigurationProps) {
  const [selectedFahrzeug, setSelectedFahrzeug] = useState("");
  const [marke, setMarke] = useState("");
  const [modell, setModell] = useState("");
  const [baujahr, setBaujahr] = useState("");
  const [kmVon, setKmVon] = useState("");
  const [kmBis, setKmBis] = useState("");
  const [kraftstoff, setKraftstoff] = useState("");
  const [getriebe, setGetriebe] = useState("");
  const [fahrzeugklasse, setFahrzeugklasse] = useState("");
  const [preisVon, setPreisVon] = useState("");
  const [preisBis, setPreisBis] = useState("");
  const [bjVon, setBjVon] = useState("");
  const [bjBis, setBjBis] = useState("");
  const [kmKlVon, setKmKlVon] = useState("");
  const [kmKlBis, setKmKlBis] = useState("");
  const [radiusIdx, setRadiusIdx] = useState(2);
  const [plz, setPlz] = useState("");
  const [quellen, setQuellen] = useState({ mobile: true, autoscout: true, ebay: false });

  const radiusLabel = RADIUS_MARKS[radiusIdx] === 500 ? "bundesweit" : `${RADIUS_MARKS[radiusIdx]} km Umkreis`;

  return (
    <div className="bg-card border border-border rounded-xl p-[18px] space-y-5">
      <h3 className="text-[13px] font-medium text-foreground">Scan konfigurieren</h3>

      {/* Section A - Einzelnes Fahrzeug */}
      <div className="space-y-3">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Fahrzeug aus Bestand</div>
        <Select value={selectedFahrzeug} onValueChange={setSelectedFahrzeug}>
          <SelectTrigger className="h-9 text-[12px]"><SelectValue placeholder="Fahrzeug auswählen..." /></SelectTrigger>
          <SelectContent>
            {fahrzeuge.map((f) => (
              <SelectItem key={f.id} value={f.id}>{f.marke} {f.modell} {f.baujahr || ""}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] text-muted-foreground">oder</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="Marke" value={marke} onChange={(e) => setMarke(e.target.value)} className="h-9 text-[12px]" />
          <Input placeholder="Modell" value={modell} onChange={(e) => setModell(e.target.value)} className="h-9 text-[12px]" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Input type="number" placeholder="Baujahr" value={baujahr} onChange={(e) => setBaujahr(e.target.value)} className="h-9 text-[12px]" />
          <Input type="number" placeholder="KM von" value={kmVon} onChange={(e) => setKmVon(e.target.value)} className="h-9 text-[12px]" />
          <Input type="number" placeholder="KM bis" value={kmBis} onChange={(e) => setKmBis(e.target.value)} className="h-9 text-[12px]" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Select value={kraftstoff} onValueChange={setKraftstoff}>
            <SelectTrigger className="h-9 text-[12px]"><SelectValue placeholder="Kraftstoff" /></SelectTrigger>
            <SelectContent>{KRAFTSTOFFE.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={getriebe} onValueChange={setGetriebe}>
            <SelectTrigger className="h-9 text-[12px]"><SelectValue placeholder="Getriebe" /></SelectTrigger>
            <SelectContent>{GETRIEBE.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">oder Fahrzeugklasse scannen</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Section B - Fahrzeugklasse */}
      <div className="space-y-3">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Fahrzeugklasse</div>
        <Select value={fahrzeugklasse} onValueChange={setFahrzeugklasse}>
          <SelectTrigger className="h-9 text-[12px]"><SelectValue placeholder="Fahrzeugklasse wählen..." /></SelectTrigger>
          <SelectContent>{FAHRZEUGKLASSEN.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
        </Select>
        <div className="grid grid-cols-2 gap-2">
          <Input type="number" placeholder="Preis von €" value={preisVon} onChange={(e) => setPreisVon(e.target.value)} className="h-9 text-[12px]" />
          <Input type="number" placeholder="Preis bis €" value={preisBis} onChange={(e) => setPreisBis(e.target.value)} className="h-9 text-[12px]" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input type="number" placeholder="KM von" value={kmKlVon} onChange={(e) => setKmKlVon(e.target.value)} className="h-9 text-[12px]" />
          <Input type="number" placeholder="KM bis" value={kmKlBis} onChange={(e) => setKmKlBis(e.target.value)} className="h-9 text-[12px]" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input type="number" placeholder="Baujahr von" value={bjVon} onChange={(e) => setBjVon(e.target.value)} className="h-9 text-[12px]" />
          <Input type="number" placeholder="Baujahr bis" value={bjBis} onChange={(e) => setBjBis(e.target.value)} className="h-9 text-[12px]" />
        </div>
      </div>

      {/* Umkreis */}
      <div className="space-y-3">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Suchradius</div>
        <Slider
          value={[radiusIdx]}
          onValueChange={(v) => setRadiusIdx(v[0])}
          max={4}
          step={1}
          className="w-full"
        />
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">25 km</span>
          <span className="text-[12px] font-medium text-foreground">{radiusLabel}</span>
          <span className="text-[11px] text-muted-foreground">bundesweit</span>
        </div>
        <Input placeholder="PLZ eingeben (z.B. 44135)" value={plz} onChange={(e) => setPlz(e.target.value)} className="h-9 text-[12px]" />
      </div>

      {/* Quellen */}
      <div className="space-y-2">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Quellen</div>
        <div className="flex items-center gap-4">
          {([["mobile", "Mobile.de"], ["autoscout", "AutoScout24"], ["ebay", "eBay Kleinanzeigen"]] as const).map(([key, label]) => (
            <label key={key} className="flex items-center gap-1.5 text-[12px] text-foreground cursor-pointer">
              <Checkbox
                checked={quellen[key]}
                onCheckedChange={(c) => setQuellen((prev) => ({ ...prev, [key]: !!c }))}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="space-y-2 pt-1">
        <div className="relative">
          <Button className="w-full gap-2 text-[13px]" disabled>
            <Sparkles className="w-4 h-4" />
            Scan starten
          </Button>
          <Badge variant="secondary" className="absolute -top-2 -right-2 text-[9px] px-1.5 py-0.5">Bald verfügbar</Badge>
        </div>
        <p className="text-[11px] text-muted-foreground text-center">Dauer ca. 30–60 Sekunden · KI analysiert Marktpreise</p>
      </div>
    </div>
  );
}
