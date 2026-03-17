import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const actions = [
  { label: "Inseratstexte", count: 31, hours: "17 Std.", per: "@ 33 Min./Inserat" },
  { label: "Markt-Scans", count: 47, hours: "12 Std.", per: "@ 15 Min./Scan" },
  { label: "VIN-Recherchen", count: 28, hours: "7 Std.", per: "@ 15 Min./VIN" },
  { label: "Dokumente", count: 28, hours: "11 Std.", per: "@ 24 Min./Dok." },
];

export function KiZeitersparnis() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-[14px] font-medium">KI-Zeitersparnis im Detail</CardTitle>
          <Badge className="bg-primary/10 text-primary text-[10px] hover:bg-primary/10">KI</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3 mb-3">
          {actions.map((a) => (
            <div key={a.label} className="bg-muted rounded-lg p-3">
              <div className="text-[13px] font-medium text-foreground">{a.label}</div>
              <div className="text-[11px] text-muted-foreground mt-1">{a.count} Aktionen</div>
              <div className="text-[18px] font-semibold text-foreground mt-1">{a.hours}</div>
              <div className="text-[11px] text-muted-foreground">{a.per}</div>
            </div>
          ))}
        </div>
        <div className="bg-accent rounded-lg border-l-[3px] border-primary px-4 py-3 text-[12px] text-foreground">
          Gesamt: <span className="font-medium">47 Stunden</span> gespart · entspricht <span className="font-medium">€ 2.115</span> Personalkosten (@ €45/Std.) · ROI gegenüber Software-Abo: <span className="font-medium">7,1x</span>
        </div>
      </CardContent>
    </Card>
  );
}
