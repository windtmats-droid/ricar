import { BarChart3, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function MarktvergleichCard() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-medium text-foreground">Marktvergleich</h3>
        <Badge variant="info" className="text-[9px] px-1.5 py-0">KI</Badge>
      </div>

      <div className="bg-muted rounded-lg py-8 flex flex-col items-center justify-center text-center">
        <BarChart3 className="w-8 h-8 text-muted-foreground/40 mb-2" />
        <p className="text-xs text-muted-foreground mb-3">Noch kein Marktscan durchgeführt</p>
        <Button variant="outline" size="sm" disabled className="text-xs gap-1.5 opacity-60 cursor-not-allowed">
          <Sparkles className="w-3.5 h-3.5" />
          Marktscan starten
          <Badge variant="secondary" className="text-[9px] px-1.5 py-0 ml-1">Bald verfügbar</Badge>
        </Button>
      </div>
    </div>
  );
}
