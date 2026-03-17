import { Clock, FileText, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function KiSavings() {
  return (
    <section>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        KI-Ersparnis diesen Monat
      </div>
      <div className="grid grid-cols-3 gap-3">
        {/* Hero Card */}
        <div className="rounded-xl p-5 text-primary-foreground relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #185FA5 0%, #2484d4 100%)" }}
        >
          <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-wider opacity-80">Gesparte Zeit</div>
          <div className="text-[32px] font-medium mt-1 leading-tight">47 Stunden</div>
          <div className="text-xs opacity-70 mt-1">+12 Std. gegenüber Februar</div>
          <div className="border-t border-white/20 my-4" />
          <div className="text-[10px] uppercase tracking-wider opacity-70 font-medium">Gesparter Personalaufwand</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[22px] font-medium">€ 2.115,–</span>
            <span className="text-[10px] bg-white/20 rounded-full px-2 py-0.5">@ € 45/Std.</span>
          </div>
        </div>

        {/* KI-generierte Inserate */}
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="text-[11px] font-medium text-muted-foreground">KI-generierte Inserate</span>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-2xl font-medium text-foreground">31 / 34</span>
            <Badge variant="success" className="text-[10px]">91%</Badge>
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">3 Inserate noch manuell</div>
          <div className="mt-auto pt-4">
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: "91%", background: "#185FA5" }} />
            </div>
          </div>
        </div>

        {/* KI-Aktionen gesamt */}
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <span className="text-[11px] font-medium text-muted-foreground">KI-Aktionen gesamt</span>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-2xl font-medium text-foreground">134</span>
            <Badge variant="info" className="text-[10px]">+22 heute</Badge>
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">Ø 21 Min. gespart pro Aktion</div>
          <div className="grid grid-cols-2 gap-2 mt-auto pt-4">
            {[
              { label: "Inseratstexte", value: "31" },
              { label: "Markt-Scans", value: "47" },
              { label: "VIN-Recherchen", value: "28" },
              { label: "Dokumente", value: "28" },
            ].map((s) => (
              <div key={s.label} className="bg-muted rounded-lg px-2.5 py-2 text-center">
                <div className="text-[10px] text-muted-foreground">{s.label}</div>
                <div className="text-sm font-medium text-foreground">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
