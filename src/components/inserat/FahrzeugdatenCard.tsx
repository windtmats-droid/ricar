import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { FahrzeugFormData } from "@/pages/InseratErstellen";

interface Props {
  form: FahrzeugFormData;
  updateField: (field: keyof FahrzeugFormData, value: string) => void;
}

function RequiredLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label className="text-[12px] font-medium text-foreground">
      {children} <span className="text-destructive">*</span>
    </Label>
  );
}

function OptionalLabel({ children }: { children: React.ReactNode }) {
  return <Label className="text-[12px] font-medium text-foreground">{children}</Label>;
}

export function FahrzeugdatenCard({ form, updateField }: Props) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-medium text-foreground mb-4">Fahrzeugdaten</h3>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {/* Row 1 */}
        <div className="space-y-1.5">
          <RequiredLabel>Marke</RequiredLabel>
          <Input
            value={form.marke}
            onChange={(e) => updateField("marke", e.target.value)}
            placeholder="z.B. BMW"
            className="h-9"
          />
        </div>
        <div className="space-y-1.5">
          <RequiredLabel>Modell</RequiredLabel>
          <Input
            value={form.modell}
            onChange={(e) => updateField("modell", e.target.value)}
            placeholder="z.B. 320d"
            className="h-9"
          />
        </div>

        {/* Row 2 */}
        <div className="space-y-1.5">
          <OptionalLabel>Baujahr</OptionalLabel>
          <Input
            type="number"
            value={form.baujahr}
            onChange={(e) => updateField("baujahr", e.target.value)}
            placeholder="z.B. 2021"
            className="h-9"
            min={1900}
            max={2099}
          />
        </div>
        <div className="space-y-1.5">
          <OptionalLabel>Kilometerstand</OptionalLabel>
          <div className="relative">
            <Input
              type="number"
              value={form.km}
              onChange={(e) => updateField("km", e.target.value)}
              placeholder="z.B. 45000"
              className="h-9 pr-10"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">
              km
            </span>
          </div>
        </div>

        {/* Row 3 */}
        <div className="space-y-1.5">
          <OptionalLabel>Kraftstoff</OptionalLabel>
          <Select value={form.kraftstoff} onValueChange={(v) => updateField("kraftstoff", v)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Auswählen" />
            </SelectTrigger>
            <SelectContent>
              {["Benzin", "Diesel", "Elektro", "Hybrid", "Gas"].map((k) => (
                <SelectItem key={k} value={k}>{k}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <OptionalLabel>Getriebe</OptionalLabel>
          <Select value={form.getriebe} onValueChange={(v) => updateField("getriebe", v)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Auswählen" />
            </SelectTrigger>
            <SelectContent>
              {["Manuell", "Automatik"].map((g) => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Row 4 */}
        <div className="space-y-1.5">
          <OptionalLabel>Farbe</OptionalLabel>
          <Input
            value={form.farbe}
            onChange={(e) => updateField("farbe", e.target.value)}
            placeholder="z.B. Schwarz"
            className="h-9"
          />
        </div>
        <div className="space-y-1.5">
          <OptionalLabel>Türen</OptionalLabel>
          <Select value={form.tueren} onValueChange={(v) => updateField("tueren", v)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Auswählen" />
            </SelectTrigger>
            <SelectContent>
              {["2", "3", "4", "5"].map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Row 5 - Price full width */}
        <div className="col-span-2 space-y-1.5">
          <RequiredLabel>Preis in €</RequiredLabel>
          <Input
            type="number"
            value={form.preis}
            onChange={(e) => updateField("preis", e.target.value)}
            placeholder="z.B. 28500"
            className="h-11 text-lg font-medium"
          />
        </div>
      </div>

      {/* VIN Section */}
      <div className="mt-6 pt-5 border-t border-border">
        <div className="flex items-center gap-1.5 mb-1.5">
          <OptionalLabel>Fahrgestellnummer (VIN)</OptionalLabel>
          <Info className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
        <Input
          value={form.vin}
          onChange={(e) => updateField("vin", e.target.value)}
          placeholder="z.B. WBA3A5C50DF595596"
          className="h-9"
        />
        <div className="mt-3 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            disabled
            className="text-xs gap-1.5 opacity-60 cursor-not-allowed"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Ausstattung per KI recherchieren
            <Badge variant="secondary" className="text-[9px] px-1.5 py-0 ml-1">
              Bald verfügbar
            </Badge>
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">
          Die KI analysiert die VIN und ergänzt automatisch die vollständige Ausstattungsliste
        </p>
      </div>
    </div>
  );
}
