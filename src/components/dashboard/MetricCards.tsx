import { FileText, UserPlus, Clock, Euro, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const metrics = [
  {
    label: "Aktive Inserate",
    value: "34",
    trend: "+4 diese Woche",
    trendVariant: "success" as const,
    icon: FileText,
    iconBg: "bg-primary/10 text-primary",
  },
  {
    label: "Offene Leads",
    value: "18",
    trend: "7 neu",
    trendVariant: "info" as const,
    icon: UserPlus,
    iconBg: "bg-success/10 text-success",
  },
  {
    label: "Ø Standzeit",
    value: "23 T.",
    trend: "–3 T. ggü. Feb",
    trendVariant: "success" as const,
    icon: Clock,
    iconBg: "bg-warning/10 text-warning",
  },
  {
    label: "Umsatz März",
    value: "€ 184k",
    trend: "+18% ggü. Feb",
    trendVariant: "success" as const,
    icon: Euro,
    iconBg: "bg-purple-100 text-purple-600",
  },
  {
    label: "Lead-Konversion",
    value: "34%",
    trend: "+6% ggü. Feb",
    trendVariant: "success" as const,
    icon: TrendingUp,
    iconBg: "bg-teal-100 text-teal-600",
  },
];

export function MetricCards() {
  return (
    <section>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Unternehmensübersicht
      </div>
      <div className="grid grid-cols-5 gap-3">
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
            <Badge variant={m.trendVariant} className="w-fit text-[10px] px-2 py-0.5">
              {m.trend}
            </Badge>
          </div>
        ))}
      </div>
    </section>
  );
}
