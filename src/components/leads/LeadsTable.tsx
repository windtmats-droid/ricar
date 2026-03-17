import { Eye, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type LeadRow, getStatusStyle, getQuelleStyle, getPrioStyle, formatTimeAgo, LEAD_STATUSES } from "@/data/leads";

interface LeadsTableProps {
  rows: LeadRow[];
  selectedIds: Set<string>;
  allSelected: boolean;
  onToggleSelect: (id: string) => void;
  onToggleAll: (checked: boolean) => void;
  onOpenDetail: (lead: LeadRow) => void;
  onStatusChange: (id: string, status: string) => void;
}

export function LeadsTable({ rows, selectedIds, allSelected, onToggleSelect, onToggleAll, onOpenDetail, onStatusChange }: LeadsTableProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10 px-3">
              <Checkbox checked={allSelected} onCheckedChange={(c) => onToggleAll(!!c)} />
            </TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Name</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Inserat</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Status</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Priorität</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Quelle</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Letzte Aktivität</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider font-semibold w-24">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((lead) => {
            const prio = getPrioStyle(lead.prioritaet);
            return (
              <TableRow
                key={lead.id}
                className="h-[52px] group cursor-pointer"
                onClick={() => onOpenDetail(lead)}
              >
                <TableCell className="px-3" onClick={(e) => e.stopPropagation()}>
                  <Checkbox checked={selectedIds.has(lead.id)} onCheckedChange={() => onToggleSelect(lead.id)} />
                </TableCell>
                <TableCell>
                  <div className="text-[13px] font-medium text-foreground">{lead.sender_name}</div>
                  <div className="text-[11px] text-muted-foreground">{lead.sender_email}</div>
                </TableCell>
                <TableCell>
                  <button
                    onClick={(e) => { e.stopPropagation(); if (lead.fahrzeug_id) navigate(`/fahrzeuge/${lead.fahrzeug_id}`); }}
                    className="text-left"
                  >
                    <div className="text-[13px] text-primary hover:underline">{lead.fahrzeug_label}</div>
                    {lead.fahrzeug_preis && <div className="text-[11px] text-muted-foreground">€{lead.fahrzeug_preis.toLocaleString("de-DE")}</div>}
                  </button>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Select value={lead.status} onValueChange={(v) => onStatusChange(lead.id, v)}>
                    <SelectTrigger className={`h-7 w-[120px] border-0 text-[11px] font-medium px-2 ${getStatusStyle(lead.status)}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAD_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${prio.dot}`} />
                    <span className={`text-[12px] font-medium ${prio.text}`}>{lead.prioritaet}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getQuelleStyle(lead.quelle)}`}>
                    {lead.quelle}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-[12px] text-muted-foreground">{formatTimeAgo(lead.letzte_aktivitaet_at)}</span>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onOpenDetail(lead)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => navigate("/postfach")} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground">
                      <MessageCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
