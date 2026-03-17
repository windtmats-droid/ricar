import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const feedItems = [
  {
    dot: "bg-primary",
    text: "Inseratstext generiert: BMW 320d 2021",
    pills: [
      { label: "KI", variant: "info" as const },
      { label: "33 Min. gespart", variant: "success" as const },
    ],
    meta: "vor 12 Min. · Thomas Müller",
  },
  {
    dot: "bg-success",
    text: "Neuer Lead: Klaus Weber — Audi A4 Avant",
    pills: [],
    meta: "vor 34 Min.",
  },
  {
    dot: "bg-primary",
    text: "VIN-Recherche: VW Golf 8 GTI — 47 Merkmale",
    pills: [
      { label: "KI", variant: "info" as const },
      { label: "8 Min. gespart", variant: "success" as const },
    ],
    meta: "vor 1 Std.",
  },
  {
    dot: "bg-primary",
    text: "Markt-Scan: Mercedes C200 — Ø € 28.400",
    pills: [
      { label: "KI", variant: "info" as const },
      { label: "15 Min. gespart", variant: "success" as const },
    ],
    meta: "vor 2 Std.",
  },
  {
    dot: "bg-warning",
    text: "Standzeit-Warnung: Opel Insignia 2018 — 41 Tage",
    pills: [],
    meta: "vor 3 Std.",
  },
];

export function ActivityFeed() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">Aktivitäts-Feed</h3>
        <button className="text-xs text-primary hover:underline">Alle anzeigen</button>
      </div>
      <div className="space-y-4">
        {feedItems.map((item, i) => (
          <div key={i} className="flex gap-3">
            <div className="pt-1.5 shrink-0">
              <div className={cn("w-2 h-2 rounded-full", item.dot)} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[12px] text-foreground">{item.text}</span>
                {item.pills.map((p) => (
                  <Badge key={p.label} variant={p.variant} className="text-[9px] px-1.5 py-0">
                    {p.label}
                  </Badge>
                ))}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{item.meta}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
