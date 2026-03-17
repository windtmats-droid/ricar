import { ChevronDown, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardTopBar() {
  const today = new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-lg font-medium text-foreground">Dashboard</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{today}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="text-xs gap-1.5">
          Diesen Monat <ChevronDown className="w-3.5 h-3.5" />
        </Button>
        <Button variant="outline" size="sm" className="text-xs gap-1.5">
          <Upload className="w-3.5 h-3.5" /> Export
        </Button>
        <Button size="sm" className="text-xs gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Inserat erstellen
        </Button>
      </div>
    </div>
  );
}
