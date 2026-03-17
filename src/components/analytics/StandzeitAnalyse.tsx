import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts";

const data = [
  { marke: "VW", tage: 15 },
  { marke: "BMW", tage: 18 },
  { marke: "Audi", tage: 22 },
  { marke: "Andere", tage: 24 },
  { marke: "Mercedes", tage: 28 },
  { marke: "Opel", tage: 38 },
];

const getColor = (days: number) =>
  days <= 20 ? "hsl(var(--success))" : days <= 30 ? "hsl(var(--warning))" : "hsl(var(--destructive))";

export function StandzeitAnalyse() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-[14px] font-medium">Ø Standzeit nach Marke</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" domain={[0, 45]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${v}T`} />
              <YAxis type="category" dataKey="marke" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={65} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => [`${v} Tage`, "Ø Standzeit"]}
              />
              <ReferenceLine x={30} stroke="hsl(var(--destructive))" strokeDasharray="4 4" label={{ value: "Ziel: 30T", fontSize: 10, fill: "hsl(var(--destructive))" }} />
              <Bar dataKey="tage" radius={[0, 4, 4, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.marke} fill={getColor(entry.tage)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
