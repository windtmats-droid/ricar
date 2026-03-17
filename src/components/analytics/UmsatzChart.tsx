import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, ComposedChart, ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Okt", umsatz: 142000, avgPreis: 13200 },
  { month: "Nov", umsatz: 128000, avgPreis: 12800 },
  { month: "Dez", umsatz: 165000, avgPreis: 14100 },
  { month: "Jan", umsatz: 98000, avgPreis: 13900 },
  { month: "Feb", umsatz: 156000, avgPreis: 14500 },
  { month: "Mär", umsatz: 184500, avgPreis: 15375 },
];

export function UmsatzChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-[14px] font-medium">Umsatzentwicklung</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `€${(v / 1000).toFixed(1)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                formatter={(value: number, name: string) => [
                  `€ ${value.toLocaleString("de-DE")}`,
                  name === "umsatz" ? "Umsatz" : "Ø Preis",
                ]}
              />
              <Legend formatter={(v) => (v === "umsatz" ? "Umsatz" : "Ø Preis")} wrapperStyle={{ fontSize: 12 }} />
              <Bar yAxisId="left" dataKey="umsatz" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="avgPreis" stroke="hsl(var(--warning))" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
