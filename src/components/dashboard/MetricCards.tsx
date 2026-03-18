import { Car, Package, Tag, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { getFahrzeuge, getStandzeit } from "@/lib/fahrzeuge-store";

export function MetricCards() {
  const metrics = useMemo(() => {
    const all = getFahrzeuge();
    const bestand = all.filter((f) => f.status !== "verkauft");
    const inseriert = all.filter((f) => f.status === "inseriert");
    const standzeiten = bestand.map(getStandzeit);
    const avgStandzeit = standzeiten.length > 0 ? Math.round(standzeiten.reduce((a, b) => a + b, 0) / standzeiten.length) : 0;
    const maxStandzeit = standzeiten.length > 0 ? Math.max(...standzeiten) : 0;
    const longestVehicle = bestand.find((f) => getStandzeit(f) === maxStandzeit);

    return [
      {
        label: "Fahrzeuge im Bestand",
        value: String(bestand.length),
        trend: `${inseriert.length} davon inseriert`,
        trendVariant: "info" as const,
        icon: Package,
        iconBg: "bg-primary/10 text-primary",
      },
      {
        label: "Davon inseriert",
        value: String(inseriert.length),
        trend: bestand.length > 0 ? `${Math.round((inseriert.length / bestand.length) * 100)}% des Bestands` : "–",
        trendVariant: "info" as const,
        icon: Tag,
        iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      },
      {
        label: "Ø Standzeit",
        value: `${avgStandzeit} T.`,
        trend: avgStandzeit <= 20 ? "Im grünen Bereich" : avgStandzeit <= 30 ? "Leicht erhöht" : "Zu hoch",
        trendVariant: avgStandzeit <= 20 ? "success" as const : avgStandzeit <= 30 ? "warning" as const : "destructive" as const,
        icon: Clock,
        iconBg: "bg-warning/10 text-warning",
      },
      {
        label: "Längste Standzeit",
        value: `${maxStandzeit} T.`,
        trend: longestVehicle ? `${longestVehicle.marke} ${longestVehicle.modell}` : "–",
        trendVariant: maxStandzeit > 30 ? "destructive" as const : "info" as const,
        icon: AlertTriangle,
        iconBg: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
      },
    ];
  }, []);

  return (
    <section>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Bestandsübersicht
      </div>
      <div className="grid grid-cols-4 gap-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] text-muted-foreground font-medium">{m.label}</div>
                <div className="text-2xl font-medium text-foreground mt-1">{m.value}</div>
              </div>
              <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0", m.iconBg)}>
                <m.icon className="w-4 h-4" />
              </div>
            </div>
            <Badge variant={m.trendVariant === "warning" ? "secondary" : m.trendVariant === "destructive" ? "destructive" : m.trendVariant} className="w-fit text-[10px] px-2 py-0.5">
              {m.trend}
            </Badge>
          </div>
        ))}
      </div>
    </section>
  );
}
