import { TrendingUp, Car, DollarSign, Users, Clock } from "lucide-react";

const kpis = [
  { label: "Umsatz", value: "€ 184.500", trend: "+18% ggü. Vormonat", icon: DollarSign },
  { label: "Verkaufte Fahrzeuge", value: "12", trend: "+3 ggü. Vormonat", icon: Car },
  { label: "Ø Verkaufspreis", value: "€ 15.375", trend: "+€ 820", icon: TrendingUp },
  { label: "Lead-Konversion", value: "34%", trend: "+6%", icon: Users },
  { label: "Ø Standzeit", value: "23 T.", trend: "–3 T.", icon: Clock },
];

export function AnalyticsKPIs() {
  return (
    <div className="grid grid-cols-5 gap-3">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="bg-muted rounded-lg p-3.5">
          <div className="flex items-center gap-2 mb-2">
            <kpi.icon className="w-4 h-4 text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground">{kpi.label}</span>
          </div>
          <div className="text-[20px] font-semibold text-foreground">{kpi.value}</div>
          <div className="text-[11px] text-success mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {kpi.trend}
          </div>
        </div>
      ))}
    </div>
  );
}
