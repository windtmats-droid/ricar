import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Mobile.de", value: 31, color: "hsl(var(--primary))" },
  { name: "AutoScout24", value: 14, color: "hsl(38 92% 40%)" },
  { name: "E-Mail direkt", value: 8, color: "hsl(var(--muted-foreground))" },
  { name: "Sonstige", value: 1, color: "hsl(var(--border))" },
];
const total = data.reduce((s, d) => s + d.value, 0);

export function AnfragenQuelle() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-[14px] font-medium">Anfragen nach Quelle</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={2} stroke="hsl(var(--card))">
                {data.map((d) => <Cell key={d.name} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-[18px] font-medium text-foreground">{total}</div>
              <div className="text-[11px] text-muted-foreground">gesamt</div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-2 justify-center">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5 text-[11px]">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-muted-foreground">{d.name}</span>
              <span className="font-medium text-foreground">{d.value} ({Math.round((d.value / total) * 100)}%)</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
