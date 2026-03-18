import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FahrzeugeFilters {
  search: string;
  status: string;
  marke: string;
  kraftstoff: string;
  preis: string;
}

interface Props {
  filters: FahrzeugeFilters;
  setFilters: (f: FahrzeugeFilters) => void;
  resultCount: number;
  hasActiveFilter: boolean;
  allMarken: string[];
}

export function FahrzeugeFilterBar({ filters, setFilters, resultCount, hasActiveFilter, allMarken }: Props) {
  const update = (key: keyof FahrzeugeFilters, value: string) => {
    setFilters({ ...filters, [key]: value === "__all__" ? "" : value });
  };

  return (
    <div className="bg-card border border-border rounded-[10px] px-4 py-3 flex items-center gap-3 mb-4">
      <Select value={filters.status || "__all__"} onValueChange={(v) => update("status", v)}>
        <SelectTrigger className="h-8 w-[130px] text-xs">
          <SelectValue placeholder="Alle Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Alle Status</SelectItem>
          <SelectItem value="Aktiv">Aktiv</SelectItem>
          <SelectItem value="Entwurf">Entwurf</SelectItem>
          <SelectItem value="Archiviert">Archiviert</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.marke || "__all__"} onValueChange={(v) => update("marke", v)}>
        <SelectTrigger className="h-8 w-[130px] text-xs">
          <SelectValue placeholder="Alle Marken" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Alle Marken</SelectItem>
          {allMarken.map((m) => (
            <SelectItem key={m} value={m}>{m}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.kraftstoff || "__all__"} onValueChange={(v) => update("kraftstoff", v)}>
        <SelectTrigger className="h-8 w-[130px] text-xs">
          <SelectValue placeholder="Kraftstoff" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Alle</SelectItem>
          {["Benzin", "Diesel", "Elektro", "Hybrid"].map((k) => (
            <SelectItem key={k} value={k}>{k}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.preis || "__all__"} onValueChange={(v) => update("preis", v)}>
        <SelectTrigger className="h-8 w-[120px] text-xs">
          <SelectValue placeholder="Preis" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Alle</SelectItem>
          <SelectItem value="unter10">unter €10k</SelectItem>
          <SelectItem value="10-20">€10k–20k</SelectItem>
          <SelectItem value="20-30">€20k–30k</SelectItem>
          <SelectItem value="ueber30">über €30k</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex-1" />

      <span className="text-[12px] text-muted-foreground shrink-0">{resultCount} Inserate</span>

      {hasActiveFilter && (
        <button
          onClick={() => setFilters({ search: "", status: "", marke: "", kraftstoff: "", preis: "" })}
          className="text-[12px] text-primary hover:underline shrink-0"
        >
          Filter zurücksetzen
        </button>
      )}
    </div>
  );
}
