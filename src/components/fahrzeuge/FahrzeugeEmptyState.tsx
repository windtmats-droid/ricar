import { Car, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Props {
  hasActiveFilter: boolean;
  onReset: () => void;
}

export function FahrzeugeEmptyState({ hasActiveFilter, onReset }: Props) {
  const navigate = useNavigate();

  return (
    <div className="bg-card border border-border rounded-xl py-16 flex flex-col items-center justify-center text-center">
      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
        <Car className="w-7 h-7 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-medium text-foreground">Keine Inserate gefunden</h3>
      <p className="text-xs text-muted-foreground mt-1">
        {hasActiveFilter
          ? "Filter anpassen oder neues Inserat erstellen"
          : "Erstelle dein erstes Inserat"}
      </p>
      <div className="flex gap-2 mt-4">
        {hasActiveFilter && (
          <Button variant="outline" size="sm" className="text-xs" onClick={onReset}>
            Filter zurücksetzen
          </Button>
        )}
        <Button size="sm" className="text-xs gap-1.5" onClick={() => navigate("/inserate/neu")}>
          <Plus className="w-3.5 h-3.5" /> Inserat erstellen
        </Button>
      </div>
    </div>
  );
}
