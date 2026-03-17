import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  { label: "Anfragen eingegangen", count: 53, pct: 100 },
  { label: "Kontaktiert", count: 41, pct: 77 },
  { label: "Angebot gemacht", count: 28, pct: 53 },
  { label: "Probefahrt", count: 18, pct: 34 },
  { label: "Gewonnen", count: 12, pct: 23 },
];

export function ConversionFunnel() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-[14px] font-medium">Conversion Funnel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-3">
            <span className="text-[12px] text-muted-foreground w-[130px] shrink-0">{step.label}</span>
            <div className="flex-1 h-7 bg-muted rounded overflow-hidden">
              <div
                className={`h-full rounded flex items-center justify-end pr-2 text-[11px] font-medium text-primary-foreground ${
                  i === steps.length - 1 ? "bg-success" : "bg-primary"
                }`}
                style={{ width: `${step.pct}%`, opacity: 1 - i * 0.12 }}
              >
                {step.count}
              </div>
            </div>
            <span className="text-[11px] text-muted-foreground w-[36px] text-right">{step.pct}%</span>
          </div>
        ))}
        <div className="pt-2 text-[12px] text-muted-foreground flex items-center gap-2">
          Konversionsrate: 23% · Branchendurchschnitt: ~18%
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-success/10 text-success">+5%</span>
        </div>
      </CardContent>
    </Card>
  );
}
