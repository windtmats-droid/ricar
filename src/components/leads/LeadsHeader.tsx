import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeadsHeaderProps {
  viewMode: "list" | "kanban";
  onViewModeChange: (mode: "list" | "kanban") => void;
  onAddLead: () => void;
}

export function LeadsHeader({ viewMode, onViewModeChange }: LeadsHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h1 className="text-[18px] font-medium text-foreground">Leads & CRM</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">Kundenanfragen und Verkaufschancen verwalten</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => onViewModeChange("list")}
            className={`px-3 py-1.5 text-[12px] font-medium transition-colors ${
              viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            Liste
          </button>
          <button
            onClick={() => onViewModeChange("kanban")}
            className={`px-3 py-1.5 text-[12px] font-medium transition-colors ${
              viewMode === "kanban" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            Kanban
          </button>
        </div>
        <Button size="sm" className="gap-1.5 text-[13px]">
          <Plus className="w-4 h-4" />
          Lead hinzufügen
        </Button>
      </div>
    </div>
  );
}
