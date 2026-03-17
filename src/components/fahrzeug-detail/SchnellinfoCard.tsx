import { cn } from "@/lib/utils";

interface Props {
  standzeit: number;
  preis: number;
}

export function SchnellinfoCard({ standzeit, preis }: Props) {
  const color = standzeit <= 20 ? "text-success" : standzeit <= 30 ? "text-warning" : "text-destructive";
  const barColor = standzeit <= 20 ? "bg-success" : standzeit <= 30 ? "bg-warning" : "bg-destructive";
  const pct = Math.min((standzeit / 45) * 100, 100);

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-medium text-foreground mb-4">Schnellinfo</h3>

      {/* Standzeit */}
      <div className="mb-5">
        <div className={cn("text-2xl font-medium", color)}>{standzeit} Tage</div>
        <div className="text-[11px] text-muted-foreground mt-0.5">im Bestand</div>
        <div className="w-full h-2 bg-muted rounded-full mt-3 overflow-hidden">
          <div className={cn("h-full rounded-full transition-all", barColor)} style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
          <span>0 T.</span>
          <span>45 T.</span>
        </div>
      </div>

      {/* Preis */}
      <div>
        <div className="text-2xl font-medium text-primary">
          € {preis.toLocaleString("de-DE")}
        </div>
        <button className="text-[11px] text-primary hover:underline mt-0.5">
          Preis bearbeiten
        </button>
      </div>
    </div>
  );
}
