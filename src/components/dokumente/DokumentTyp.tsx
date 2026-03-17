import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DokumentData } from "@/pages/Dokumente";

interface Props {
  data: DokumentData;
  update: (p: Partial<DokumentData>) => void;
}

const types = [
  { value: "kaufvertrag" as const, icon: FileText, title: "Kaufvertrag", desc: "KI generiert rechtssicheren Vertrag", badge: true },
  { value: "rechnung" as const, icon: Receipt, title: "Rechnung", desc: "Automatisch nummeriert", badge: false },
];

export function DokumentTyp({ data, update }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-[14px] font-medium">Dokument erstellen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {types.map((t) => (
            <button
              key={t.value}
              onClick={() => update({ typ: t.value })}
              className={cn(
                "flex flex-col items-start gap-2 p-4 rounded-lg border-2 transition-colors text-left",
                data.typ === t.value ? "border-primary bg-accent" : "border-border hover:border-muted-foreground/30"
              )}
            >
              <div className="flex items-center gap-2">
                <t.icon className="w-5 h-5 text-primary" />
                <span className="text-[14px] font-medium text-foreground">{t.title}</span>
                {t.badge && <Badge className="bg-primary/10 text-primary text-[9px] hover:bg-primary/10">KI</Badge>}
              </div>
              <span className="text-[12px] text-muted-foreground">{t.desc}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
