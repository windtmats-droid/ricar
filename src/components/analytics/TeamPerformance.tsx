import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

const team = [
  { name: "Thomas Müller", sales: 7, revenue: "€ 108.500", conversion: "41%", standzeit: "19 T.", top: true },
  { name: "Anna Schmidt", sales: 3, revenue: "€ 52.400", conversion: "28%", standzeit: "26 T.", top: false },
  { name: "Peter Klein", sales: 2, revenue: "€ 23.600", conversion: "21%", standzeit: "31 T.", top: false },
];

export function TeamPerformance() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-[14px] font-medium">Team Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-[12px]">
          <thead>
            <tr className="text-muted-foreground border-b border-border">
              <th className="text-left py-2 font-medium">Mitarbeiter</th>
              <th className="text-right py-2 font-medium">Verkäufe</th>
              <th className="text-right py-2 font-medium">Umsatz</th>
              <th className="text-right py-2 font-medium">Konversion</th>
              <th className="text-right py-2 font-medium">Ø Standzeit</th>
            </tr>
          </thead>
          <tbody>
            {team.map((t) => (
              <tr key={t.name} className="border-b border-border last:border-0">
                <td className="py-2.5 font-medium text-foreground flex items-center gap-1.5">
                  {t.top && <Trophy className="w-3.5 h-3.5 text-warning" />}
                  {t.name}
                </td>
                <td className="text-right py-2.5">{t.sales}</td>
                <td className="text-right py-2.5">{t.revenue}</td>
                <td className="text-right py-2.5">{t.conversion}</td>
                <td className="text-right py-2.5">{t.standzeit}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 pt-3 border-t border-border text-[12px] text-muted-foreground">
          Team gesamt: 12 Verkäufe · € 184.500
        </div>
      </CardContent>
    </Card>
  );
}
