import { cn } from "@/lib/utils";

const vehicles = [
  { name: "BMW 320d 2021", days: 7, pct: 17, color: "bg-success" },
  { name: "Audi A4 Avant 2020", days: 18, pct: 43, color: "bg-success" },
  { name: "VW Golf 8 GTI", days: 24, pct: 57, color: "bg-success" },
  { name: "Mercedes C200 2019", days: 31, pct: 74, color: "bg-warning" },
  { name: "Opel Insignia 2018", days: 41, pct: 98, color: "bg-destructive" },
];

export function StandzeitChart() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">Standzeit nach Fahrzeug</h3>
        <button className="text-xs text-primary hover:underline">Alle Fahrzeuge</button>
      </div>
      <div className="space-y-3 flex-1">
        {vehicles.map((v) => (
          <div key={v.name} className="flex items-center gap-3">
            <span className="text-[11px] text-foreground w-[140px] shrink-0 truncate">{v.name}</span>
            <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
              <div className={cn("h-full rounded-full", v.color)} style={{ width: `${v.pct}%` }} />
            </div>
            <span className="text-[11px] font-medium text-muted-foreground w-10 text-right shrink-0">{v.days} T.</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <span className="text-[10px] text-muted-foreground">Ziel: unter 30 Tage</span>
        <span className="text-[10px] font-medium text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
          2 Fahrzeuge überfällig
        </span>
      </div>
    </div>
  );
}
