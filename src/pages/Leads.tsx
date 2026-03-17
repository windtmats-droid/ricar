import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { LeadsHeader } from "@/components/leads/LeadsHeader";
import { LeadsKiBanner } from "@/components/leads/LeadsKiBanner";
import { LeadsFilterBar, type LeadsFilters } from "@/components/leads/LeadsFilterBar";
import { LeadsTable } from "@/components/leads/LeadsTable";
import { LeadsKanban } from "@/components/leads/LeadsKanban";
import { LeadDetailPanel } from "@/components/leads/LeadDetailPanel";
import { LeadHinzufuegenModal } from "@/components/leads/LeadHinzufuegenModal";
import { LeadsKiDetailModal } from "@/components/leads/LeadsKiDetailModal";
import { FahrzeugePagination } from "@/components/fahrzeuge/FahrzeugePagination";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { type LeadRow, SAMPLE_LEADS } from "@/data/leads";

const PAGE_SIZE = 10;

const Leads = () => {
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [filters, setFilters] = useState<LeadsFilters>({ search: "", status: "", quelle: "", prioritaet: "" });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedLead, setSelectedLead] = useState<LeadRow | null>(null);
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: dbLeads = [] } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("letzte_aktivitaet_at", { ascending: false });
      if (error) throw error;
      return (data || []).map((l): LeadRow => ({
        id: l.id,
        sender_name: l.sender_name,
        sender_email: l.sender_email,
        sender_phone: l.sender_phone,
        fahrzeug_id: l.fahrzeug_id,
        fahrzeug_label: null,
        fahrzeug_preis: null,
        status: l.status,
        quelle: l.quelle,
        prioritaet: l.prioritaet,
        notizen: (l.notizen as Array<{ text: string; timestamp: string }>) || [],
        ki_zusammenfassung: l.ki_zusammenfassung,
        erstellt_at: l.erstellt_at,
        letzte_aktivitaet_at: l.letzte_aktivitaet_at,
        anfrage_id: l.anfrage_id,
      }));
    },
  });

  const leads = dbLeads.length > 0 ? dbLeads : SAMPLE_LEADS;

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (filters.status && l.status !== filters.status) return false;
      if (filters.quelle && l.quelle !== filters.quelle) return false;
      if (filters.prioritaet && l.prioritaet !== filters.prioritaet) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const haystack = `${l.sender_name} ${l.sender_email || ""} ${l.fahrzeug_label || ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [leads, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      // Only update if it's a real UUID
      if (id.match(/^[0-9a-f]{8}-/)) {
        const { error } = await supabase.from("leads").update({ status, letzte_aktivitaet_at: new Date().toISOString() }).eq("id", id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast({ title: "Status aktualisiert" });
    },
  });

  const handleStatusChange = (id: string, status: string) => {
    statusMutation.mutate({ id, status });
    // Optimistic update for sample data
    if (selectedLead?.id === id) {
      setSelectedLead({ ...selectedLead, status });
    }
  };

  const handleSaveNote = (id: string, note: string) => {
    const newNote = { text: note, timestamp: new Date().toISOString() };
    if (id.match(/^[0-9a-f]{8}-/)) {
      const lead = leads.find((l) => l.id === id);
      const updatedNotizen = [...(lead?.notizen || []), newNote];
      supabase.from("leads").update({ notizen: updatedNotizen }).eq("id", id).then(() => {
        queryClient.invalidateQueries({ queryKey: ["leads"] });
      });
    }
    // Optimistic update
    if (selectedLead?.id === id) {
      setSelectedLead({ ...selectedLead, notizen: [...selectedLead.notizen, newNote] });
    }
    toast({ title: "Notiz gespeichert" });
  };

  const priorityLeads = leads.filter((l) => l.prioritaet === "Hoch").slice(0, 3);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <LeadsHeader viewMode={viewMode} onViewModeChange={setViewMode} onAddLead={() => setShowAddModal(true)} />
        <LeadsKiBanner priorityNames={priorityLeads.map((l) => l.sender_name)} />
        <LeadsFilterBar filters={filters} setFilters={(f) => { setFilters(f); setPage(1); }} resultCount={filtered.length} />

        {viewMode === "list" ? (
          <>
            <LeadsTable
              rows={paginated}
              selectedIds={selectedIds}
              allSelected={paginated.length > 0 && paginated.every((r) => selectedIds.has(r.id))}
              onToggleSelect={(id) => {
                setSelectedIds((prev) => {
                  const next = new Set(prev);
                  next.has(id) ? next.delete(id) : next.add(id);
                  return next;
                });
              }}
              onToggleAll={(checked) => setSelectedIds(checked ? new Set(paginated.map((r) => r.id)) : new Set())}
              onOpenDetail={setSelectedLead}
              onStatusChange={handleStatusChange}
            />
            <FahrzeugePagination
              page={page}
              totalPages={totalPages}
              totalCount={filtered.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          </>
        ) : (
          <LeadsKanban leads={filtered} onOpenDetail={setSelectedLead} />
        )}
      </main>

      {selectedLead && (
        <LeadDetailPanel
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onStatusChange={handleStatusChange}
          onSaveNote={handleSaveNote}
        />
      )}

      <LeadHinzufuegenModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCreated={() => queryClient.invalidateQueries({ queryKey: ["leads"] })}
      />
    </div>
  );
};

export default Leads;
