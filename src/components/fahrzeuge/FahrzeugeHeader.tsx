import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
}

export function FahrzeugeHeader({ search, onSearchChange }: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h1 className="text-lg font-medium text-foreground">Inserate</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Inseratsbestand verwalten</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Marke, Modell, VIN..."
            className="w-[220px] h-9 pl-8 text-xs"
          />
        </div>
        <Button variant="outline" size="sm" className="text-xs gap-1.5">
          <Filter className="w-3.5 h-3.5" /> Filter
        </Button>
        <Button size="sm" className="text-xs gap-1.5" onClick={() => navigate("/inserate/neu")}>
          <Plus className="w-3.5 h-3.5" /> Inserat erstellen
        </Button>
      </div>
    </div>
  );
}
