import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface Props {
  ausstattung: Record<string, string[]> | null;
}

export function AusstattungCard({ ausstattung }: Props) {
  const hasData = ausstattung && Object.keys(ausstattung).length > 0;

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-medium text-foreground">Ausstattung</h3>
        <Badge variant="info" className="text-[9px] px-1.5 py-0">KI</Badge>
      </div>

      {hasData ? (
        <div className="space-y-4">
          {Object.entries(ausstattung!).map(([category, features]) => (
            <div key={category}>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {category}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {features.map((feature) => (
                  <span
                    key={feature}
                    className="text-[12px] bg-muted text-foreground px-2.5 py-1 rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-xs text-muted-foreground mb-3">Noch keine Ausstattungsliste</p>
          <Button variant="outline" size="sm" disabled className="text-xs gap-1.5 opacity-60 cursor-not-allowed">
            <Sparkles className="w-3.5 h-3.5" />
            Via VIN recherchieren
            <Badge variant="secondary" className="text-[9px] px-1.5 py-0 ml-1">Bald verfügbar</Badge>
          </Button>
        </div>
      )}
    </div>
  );
}
