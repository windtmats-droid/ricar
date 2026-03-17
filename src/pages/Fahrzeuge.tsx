import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { FahrzeugeHeader } from "@/components/fahrzeuge/FahrzeugeHeader";
import { FahrzeugeFilterBar } from "@/components/fahrzeuge/FahrzeugeFilterBar";
import { FahrzeugeTable } from "@/components/fahrzeuge/FahrzeugeTable";
import { FahrzeugeBulkBar } from "@/components/fahrzeuge/FahrzeugeBulkBar";
import { FahrzeugeEmptyState } from "@/components/fahrzeuge/FahrzeugeEmptyState";
import { FahrzeugePagination } from "@/components/fahrzeuge/FahrzeugePagination";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface FahrzeugRow {
  id: string;
  marke: string;
  modell: string;
  baujahr: number | null;
  kraftstoff: string | null;
  getriebe: string | null;
  preis: number;
  km: number | null;
  status: string;
  vin: string | null;
  created_at: string;
  foto_url: string | null;
  standzeit: number;
}

export interface FahrzeugeFilters {
  search: string;
  status: string;
  marke: string;
  kraftstoff: string;
  preis: string;
}

const SAMPLE_DATA: FahrzeugRow[] = [
  { id: "s1", marke: "BMW", modell: "320d", baujahr: 2021, kraftstoff: "Diesel", getriebe: "Automatik", preis: 28500, km: 68000, status: "Aktiv", vin: null, created_at: new Date(Date.now() - 7 * 86400000).toISOString(), foto_url: null, standzeit: 7 },
  { id: "s2", marke: "Audi", modell: "A4 Avant", baujahr: 2020, kraftstoff: "Benzin", getriebe: "Automatik", preis: 32900, km: 45000, status: "Aktiv", vin: null, created_at: new Date(Date.now() - 18 * 86400000).toISOString(), foto_url: null, standzeit: 18 },
  { id: "s3", marke: "VW", modell: "Golf 8 GTI", baujahr: 2022, kraftstoff: "Benzin", getriebe: "Manuell", preis: 38500, km: 22000, status: "Aktiv", vin: null, created_at: new Date(Date.now() - 24 * 86400000).toISOString(), foto_url: null, standzeit: 24 },
  { id: "s4", marke: "Mercedes", modell: "C200", baujahr: 2019, kraftstoff: "Benzin", getriebe: "Automatik", preis: 24900, km: 91000, status: "Entwurf", vin: null, created_at: new Date(Date.now() - 31 * 86400000).toISOString(), foto_url: null, standzeit: 31 },
  { id: "s5", marke: "Opel", modell: "Insignia", baujahr: 2018, kraftstoff: "Diesel", getriebe: "Automatik", preis: 16400, km: 112000, status: "Aktiv", vin: null, created_at: new Date(Date.now() - 41 * 86400000).toISOString(), foto_url: null, standzeit: 41 },
];

const PAGE_SIZE = 10;

const Fahrzeuge = () => {
  const [filters, setFilters] = useState<FahrzeugeFilters>({
    search: "", status: "", marke: "", kraftstoff: "", preis: "",
  });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: dbFahrzeuge = [], isLoading } = useQuery({
    queryKey: ["fahrzeuge"],
    queryFn: async () => {
      const { data: fahrzeuge, error } = await supabase
        .from("fahrzeuge")
        .select("id, marke, modell, baujahr, kraftstoff, getriebe, preis, km, status, vin, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;

      // Fetch first photo for each
      const ids = (fahrzeuge || []).map((f) => f.id);
      let fotosMap: Record<string, string> = {};
      if (ids.length > 0) {
        const { data: fotos } = await supabase
          .from("fotos")
          .select("fahrzeug_id, storage_url")
          .in("fahrzeug_id", ids)
          .eq("reihenfolge", 0);
        if (fotos) {
          fotosMap = Object.fromEntries(fotos.map((f) => [f.fahrzeug_id, f.storage_url]));
        }
      }

      return (fahrzeuge || []).map((f) => {
        const days = Math.floor((Date.now() - new Date(f.created_at).getTime()) / 86400000);
        return {
          ...f,
          foto_url: fotosMap[f.id] || null,
          standzeit: days,
        } as FahrzeugRow;
      });
    },
  });

  const rows = dbFahrzeuge.length > 0 ? dbFahrzeuge : SAMPLE_DATA;

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (filters.status && r.status !== filters.status) return false;
      if (filters.marke && r.marke !== filters.marke) return false;
      if (filters.kraftstoff && r.kraftstoff !== filters.kraftstoff) return false;
      if (filters.preis) {
        if (filters.preis === "unter10" && r.preis >= 10000) return false;
        if (filters.preis === "10-20" && (r.preis < 10000 || r.preis >= 20000)) return false;
        if (filters.preis === "20-30" && (r.preis < 20000 || r.preis >= 30000)) return false;
        if (filters.preis === "ueber30" && r.preis < 30000) return false;
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const haystack = `${r.marke} ${r.modell} ${r.vin || ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [rows, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const archiveMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from("fahrzeuge")
        .update({ status: "Archiviert" })
        .in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fahrzeuge"] });
      setSelectedIds(new Set());
      toast({ title: "Fahrzeug(e) archiviert" });
    },
    onError: (err: Error) => {
      toast({ title: "Fehler", description: err.message, variant: "destructive" });
    },
  });

  const hasActiveFilter = !!(filters.status || filters.marke || filters.kraftstoff || filters.preis);
  const allMarken = [...new Set(rows.map((r) => r.marke))].sort();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <FahrzeugeHeader
          search={filters.search}
          onSearchChange={(v) => { setFilters((p) => ({ ...p, search: v })); setPage(1); }}
        />

        <FahrzeugeFilterBar
          filters={filters}
          setFilters={(f) => { setFilters(f); setPage(1); }}
          resultCount={filtered.length}
          hasActiveFilter={hasActiveFilter}
          allMarken={allMarken}
        />

        {selectedIds.size > 0 && (
          <FahrzeugeBulkBar
            count={selectedIds.size}
            onArchive={() => archiveMutation.mutate([...selectedIds])}
            onClear={() => setSelectedIds(new Set())}
          />
        )}

        {filtered.length === 0 && !isLoading ? (
          <FahrzeugeEmptyState hasActiveFilter={hasActiveFilter} onReset={() => setFilters({ search: "", status: "", marke: "", kraftstoff: "", preis: "" })} />
        ) : (
          <>
            <FahrzeugeTable
              rows={paginated}
              selectedIds={selectedIds}
              onToggleSelect={(id) => {
                setSelectedIds((prev) => {
                  const next = new Set(prev);
                  next.has(id) ? next.delete(id) : next.add(id);
                  return next;
                });
              }}
              onToggleAll={(checked) => {
                setSelectedIds(checked ? new Set(paginated.map((r) => r.id)) : new Set());
              }}
              onArchive={(id) => archiveMutation.mutate([id])}
              allSelected={paginated.length > 0 && paginated.every((r) => selectedIds.has(r.id))}
            />
            <FahrzeugePagination
              page={page}
              totalPages={totalPages}
              totalCount={filtered.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default Fahrzeuge;
