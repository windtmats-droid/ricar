import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LEAD_STATUSES, LEAD_QUELLEN, LEAD_PRIORITAETEN } from "@/data/leads";

export interface LeadsFilters {
  search: string;
  status: string;
  quelle: string;
  prioritaet: string;
}

interface LeadsFilterBarProps {
  filters: LeadsFilters;
  setFilters: (f: LeadsFilters) => void;
  resultCount: number;
}

export function LeadsFilterBar({ filters, setFilters, resultCount }: LeadsFilterBarProps) {
  return (
    <div className="bg-card border border-border rounded-[10px] px-4 py-3 mb-4 flex items-center gap-3 flex-wrap">
      <div className="relative w-[220px]">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          placeholder="Name, Fahrzeug, E-Mail..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="pl-8 h-9 text-[12px]"
        />
      </div>

      <Select value={filters.status || "alle"} onValueChange={(v) => setFilters({ ...filters, status: v === "alle" ? "" : v })}>
        <SelectTrigger className="w-[150px] h-9 text-[12px]"><SelectValue placeholder="Alle Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="alle">Alle Status</SelectItem>
          {LEAD_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={filters.quelle || "alle"} onValueChange={(v) => setFilters({ ...filters, quelle: v === "alle" ? "" : v })}>
        <SelectTrigger className="w-[150px] h-9 text-[12px]"><SelectValue placeholder="Alle Quellen" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="alle">Alle Quellen</SelectItem>
          {LEAD_QUELLEN.map((q) => <SelectItem key={q} value={q}>{q}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={filters.prioritaet || "alle"} onValueChange={(v) => setFilters({ ...filters, prioritaet: v === "alle" ? "" : v })}>
        <SelectTrigger className="w-[140px] h-9 text-[12px]"><SelectValue placeholder="Priorität" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="alle">Alle</SelectItem>
          {LEAD_PRIORITAETEN.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
        </SelectContent>
      </Select>

      <span className="ml-auto text-[12px] text-muted-foreground">{resultCount} Leads</span>
    </div>
  );
}
