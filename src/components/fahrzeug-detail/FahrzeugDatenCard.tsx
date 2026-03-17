import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

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
}

function Row({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-[12px] text-muted-foreground">{label}</span>
      <span className={cn("text-[13px] font-medium text-foreground", className)}>{value}</span>
    </div>
  );
}

export function FahrzeugDatenCard({ fahrzeug: f, standzeit }: Props) {
  const standzeitColor = standzeit <= 20 ? "text-success" : standzeit <= 30 ? "text-warning" : "text-destructive";

  const createdDate = new Date(f.created_at).toLocaleDateString("de-DE", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-medium text-foreground mb-3">Fahrzeugdaten</h3>
      <div className="grid grid-cols-2 gap-x-6">
        <div>
          <Row label="Marke" value={f.marke} />
          <Row label="Baujahr" value={f.baujahr?.toString() || "–"} />
          <Row label="Kraftstoff" value={f.kraftstoff || "–"} />
          <Row label="Farbe" value={f.farbe || "–"} />
          <Row label="Preis" value={`€ ${f.preis.toLocaleString("de-DE")}`} className="text-primary font-semibold" />
          <Row label="Status" value={f.status} />
        </div>
        <div>
          <Row label="Modell" value={f.modell} />
          <Row label="Kilometerstand" value={f.km ? `${f.km.toLocaleString("de-DE")} km` : "–"} />
          <Row label="Getriebe" value={f.getriebe || "–"} />
          <Row label="Türen" value={f.tueren?.toString() || "–"} />
          <Row label="VIN" value={f.vin || "–"} />
          <Row label="Erstellt am" value={createdDate} />
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
