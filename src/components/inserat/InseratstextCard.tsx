import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface Props {
  beschreibung: string;
  onChange: (value: string) => void;
}

export function InseratstextCard({ beschreibung, onChange }: Props) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-medium text-foreground mb-4">Inseratstext</h3>

      <Textarea
        rows={5}
        value={beschreibung}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Beschreibung manuell eingeben oder per KI generieren lassen..."
        className="resize-none"
      />

      <Button
        variant="outline"
        disabled
        className="w-full mt-3 text-xs gap-1.5 opacity-60 cursor-not-allowed"
      >
        <Sparkles className="w-3.5 h-3.5" />
        KI-Beschreibung generieren
        <Badge variant="secondary" className="text-[9px] px-1.5 py-0 ml-1">
          Bald verfügbar
        </Badge>
      </Button>

      <p className="text-[11px] text-muted-foreground mt-2">
        Die KI erstellt automatisch einen professionellen Inseratstext auf Basis der Fahrzeugdaten und Fotos
      </p>
    </div>
  );
}
