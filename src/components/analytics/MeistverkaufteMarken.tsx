import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const brands = [
  { rank: 1, name: "BMW", count: 4, revenue: "€ 72.000", pct: 100 },
  { rank: 2, name: "Audi", count: 3, revenue: "€ 48.000", pct: 75 },
  { rank: 3, name: "VW", count: 2, revenue: "€ 31.000", pct: 50 },
  { rank: 4, name: "Mercedes", count: 2, revenue: "€ 24.500", pct: 50 },
  { rank: 5, name: "Sonstige", count: 1, revenue: "€ 9.000", pct: 25 },
];

export function MeistverkaufteMarken() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-[14px] font-medium">Meistverkaufte Marken</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {brands.map((b) => (
          <div key={b.name} className="flex items-center gap-3">
            <span className="text-[13px] text-muted-foreground w-4 text-right">{b.rank}.</span>
            <span className="text-[13px] font-medium text-foreground w-[80px]">{b.name}</span>
            <span className="text-[11px] text-muted-foreground w-[85px]">{b.count} Fzg. · {b.revenue}</span>
            <div className="flex-1">
              <Progress value={b.pct} className={`h-2 ${b.name === "Sonstige" ? "[&>div]:bg-muted-foreground" : ""}`} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
