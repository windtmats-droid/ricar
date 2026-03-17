import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface FahrzeugEditData {
  marke: string;
  modell: string;
  baujahr: number | null;
  km: number | null;
  kraftstoff: string | null;
  getriebe: string | null;
  farbe: string | null;
  tueren: number | null;
  preis: number;
  vin: string | null;
  status: string;
}

interface Props {
  fahrzeug: {
    marke: string;
    modell: string;
    baujahr: number | null;
    km: number | null;
    kraftstoff: string | null;
    getriebe: string | null;
    farbe: string | null;
    tueren: number | null;
    preis: number;
    vin: string | null;
    status: string;
    created_at: string;
  };
  standzeit: number;
  isEditing?: boolean;
  editData?: FahrzeugEditData;
  onEditChange?: (d: Partial<FahrzeugEditData>) => void;
}

function ReadRow({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-[12px] text-muted-foreground">{label}</span>
      <span className={cn("text-[13px] font-medium text-foreground", className)}>{value}</span>
    </div>
  );
}

function EditRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border last:border-0 gap-3">
      <span className="text-[12px] text-muted-foreground shrink-0 w-[100px]">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export function FahrzeugDatenCard({ fahrzeug: f, standzeit, isEditing, editData, onEditChange }: Props) {
  const standzeitColor = standzeit <= 20 ? "text-success" : standzeit <= 30 ? "text-warning" : "text-destructive";
  const createdDate = new Date(f.created_at).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });

  if (isEditing && editData && onEditChange) {
    return (
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-medium text-foreground mb-3">Inseratsdaten</h3>
        <div className="grid grid-cols-2 gap-x-6">
          <div className="space-y-0">
            <EditRow label="Marke"><Input value={editData.marke} onChange={(e) => onEditChange({ marke: e.target.value })} className="h-8 text-[13px]" /></EditRow>
            <EditRow label="Baujahr"><Input type="number" value={editData.baujahr ?? ""} onChange={(e) => onEditChange({ baujahr: e.target.value ? Number(e.target.value) : null })} className="h-8 text-[13px]" /></EditRow>
            <EditRow label="Kraftstoff">
              <Select value={editData.kraftstoff || ""} onValueChange={(v) => onEditChange({ kraftstoff: v })}>
                <SelectTrigger className="h-8 text-[13px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Benzin", "Diesel", "Elektro", "Hybrid", "Plug-in-Hybrid", "Erdgas", "Wasserstoff"].map((k) => (
                    <SelectItem key={k} value={k} className="text-[13px]">{k}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </EditRow>
            <EditRow label="Farbe"><Input value={editData.farbe ?? ""} onChange={(e) => onEditChange({ farbe: e.target.value })} className="h-8 text-[13px]" /></EditRow>
            <EditRow label="Preis (€)"><Input type="number" value={editData.preis ?? ""} onChange={(e) => onEditChange({ preis: Number(e.target.value) })} className="h-8 text-[13px]" /></EditRow>
            <EditRow label="Status">
              <Select value={editData.status} onValueChange={(v) => onEditChange({ status: v })}>
                <SelectTrigger className="h-8 text-[13px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Aktiv", "Entwurf", "Archiviert"].map((s) => (
                    <SelectItem key={s} value={s} className="text-[13px]">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </EditRow>
          </div>
          <div className="space-y-0">
            <EditRow label="Modell"><Input value={editData.modell} onChange={(e) => onEditChange({ modell: e.target.value })} className="h-8 text-[13px]" /></EditRow>
            <EditRow label="KM-Stand"><Input type="number" value={editData.km ?? ""} onChange={(e) => onEditChange({ km: e.target.value ? Number(e.target.value) : null })} className="h-8 text-[13px]" /></EditRow>
            <EditRow label="Getriebe">
              <Select value={editData.getriebe || ""} onValueChange={(v) => onEditChange({ getriebe: v })}>
                <SelectTrigger className="h-8 text-[13px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Automatik", "Schaltgetriebe", "Halbautomatik"].map((g) => (
                    <SelectItem key={g} value={g} className="text-[13px]">{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </EditRow>
            <EditRow label="Türen"><Input type="number" value={editData.tueren ?? ""} onChange={(e) => onEditChange({ tueren: e.target.value ? Number(e.target.value) : null })} className="h-8 text-[13px]" /></EditRow>
            <EditRow label="VIN"><Input value={editData.vin ?? ""} onChange={(e) => onEditChange({ vin: e.target.value })} className="h-8 text-[13px]" /></EditRow>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-medium text-foreground mb-3">Inseratsdaten</h3>
      <div className="grid grid-cols-2 gap-x-6">
        <div>
          <ReadRow label="Marke" value={f.marke} />
          <ReadRow label="Baujahr" value={f.baujahr?.toString() || "–"} />
          <ReadRow label="Kraftstoff" value={f.kraftstoff || "–"} />
          <ReadRow label="Farbe" value={f.farbe || "–"} />
          <ReadRow label="Preis" value={`€ ${f.preis.toLocaleString("de-DE")}`} className="text-primary font-semibold" />
          <ReadRow label="Status" value={f.status} />
        </div>
        <div>
          <ReadRow label="Modell" value={f.modell} />
          <ReadRow label="Kilometerstand" value={f.km ? `${f.km.toLocaleString("de-DE")} km` : "–"} />
          <ReadRow label="Getriebe" value={f.getriebe || "–"} />
          <ReadRow label="Türen" value={f.tueren?.toString() || "–"} />
          <ReadRow label="VIN" value={f.vin || "–"} />
          <ReadRow label="Erstellt am" value={createdDate} />
          <div className="flex items-center justify-between py-2">
            <span className="text-[12px] text-muted-foreground">Standzeit</span>
            <span className={cn("text-[13px] font-medium flex items-center gap-1", standzeitColor)}>
              {standzeit} Tage
              {standzeit > 30 && <AlertTriangle className="w-3 h-3" />}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
