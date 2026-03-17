import { type LeadRow, LEAD_STATUSES, getStatusStyle, getQuelleStyle, getPrioStyle, formatTimeAgo } from "@/data/leads";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface LeadsKanbanProps {
  leads: LeadRow[];
  onOpenDetail: (lead: LeadRow) => void;
}

const columnHeaderColor: Record<string, string> = {
  Gewonnen: "text-[hsl(122,39%,34%)]",
  Verloren: "text-destructive",
};

export function LeadsKanban({ leads, onOpenDetail }: LeadsKanbanProps) {
  const navigate = useNavigate();

  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {LEAD_STATUSES.map((status) => {
        const columnLeads = leads.filter((l) => l.status === status);
        return (
          <div key={status} className="min-w-[220px] flex-1">
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className={`text-[12px] uppercase font-semibold tracking-wider ${columnHeaderColor[status] || "text-muted-foreground"}`}>
                {status}
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                {columnLeads.length}
              </span>
            </div>
            <div className="space-y-2">
              {columnLeads.map((lead) => {
                const prio = getPrioStyle(lead.prioritaet);
                return (
                  <div
                    key={lead.id}
                    onClick={() => onOpenDetail(lead)}
                    className="bg-card border border-border rounded-[10px] p-3 cursor-pointer hover:shadow-sm transition-shadow hover:border-dashed"
                  >
                    <div className="text-[13px] font-medium text-foreground">{lead.sender_name}</div>
                    <button
                      onClick={(e) => { e.stopPropagation(); if (lead.fahrzeug_id) navigate(`/fahrzeuge/${lead.fahrzeug_id}`); }}
                      className="text-[12px] text-primary hover:underline mt-0.5"
                    >
                      {lead.fahrzeug_label}
                    </button>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${prio.dot}`} />
                        <span className={`text-[10px] font-medium ${prio.text}`}>{lead.prioritaet}</span>
                      </span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${getQuelleStyle(lead.quelle)}`}>
                        {lead.quelle}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-2">{formatTimeAgo(lead.letzte_aktivitaet_at)}</div>
                    <div className="flex items-center gap-2 mt-2.5">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-semibold">
                        {lead.sender_name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={(e) => { e.stopPropagation(); navigate("/postfach"); }}>
                        Antworten
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
