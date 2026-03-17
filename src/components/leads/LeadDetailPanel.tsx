import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type LeadRow, getStatusStyle, getPrioStyle, formatTimeAgo, LEAD_STATUSES } from "@/data/leads";

interface LeadDetailPanelProps {
  lead: LeadRow;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
  onSaveNote: (id: string, note: string) => void;
}

export function LeadDetailPanel({ lead, onClose, onStatusChange, onSaveNote }: LeadDetailPanelProps) {
  const navigate = useNavigate();
  const [noteText, setNoteText] = useState("");
  const prio = getPrioStyle(lead.prioritaet);

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    onSaveNote(lead.id, noteText.trim());
    setNoteText("");
  };

  return (
    <div className="fixed right-0 top-0 bottom-0 w-[400px] bg-card border-l border-border z-50 overflow-y-auto shadow-xl">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border px-4 py-3 flex items-center justify-between z-10">
        <button onClick={onClose} className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Schließen
        </button>
        <span className="text-[14px] font-medium text-foreground">{lead.sender_name}</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Kontakt */}
        <div className="space-y-2">
          <h3 className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Kontakt</h3>
          <div className="space-y-1.5">
            <div className="text-[13px] font-medium text-foreground">{lead.sender_name}</div>
            {lead.sender_email && (
              <a href={`mailto:${lead.sender_email}`} className="text-[12px] text-primary hover:underline flex items-center gap-1">
                <Mail className="w-3 h-3" />{lead.sender_email}
              </a>
            )}
            {lead.sender_phone && <div className="text-[12px] text-muted-foreground">{lead.sender_phone}</div>}
          </div>
          <Button variant="outline" size="sm" className="text-[12px] h-8 w-full">Nachricht senden</Button>
        </div>

        {/* Fahrzeug */}
        {lead.fahrzeug_label && (
          <div className="space-y-2">
            <h3 className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Fahrzeug</h3>
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50">
              <div className="w-12 h-9 rounded bg-muted flex items-center justify-center text-muted-foreground text-[10px]">Foto</div>
              <div className="min-w-0 flex-1">
                <button onClick={() => lead.fahrzeug_id && navigate(`/fahrzeuge/${lead.fahrzeug_id}`)} className="text-[13px] text-primary font-medium hover:underline flex items-center gap-1">
                  {lead.fahrzeug_label} <ExternalLink className="w-3 h-3" />
                </button>
                {lead.fahrzeug_preis && <div className="text-[11px] text-muted-foreground">€{lead.fahrzeug_preis.toLocaleString("de-DE")}</div>}
              </div>
            </div>
          </div>
        )}

        {/* Status & Priorität */}
        <div className="space-y-2">
          <h3 className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Status & Priorität</h3>
          <Select value={lead.status} onValueChange={(v) => onStatusChange(lead.id, v)}>
            <SelectTrigger className={`h-8 text-[12px] font-medium ${getStatusStyle(lead.status)}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEAD_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`w-2 h-2 rounded-full ${prio.dot}`} />
            <span className={`text-[12px] font-medium ${prio.text}`}>Priorität: {lead.prioritaet}</span>
          </div>
        </div>

        {/* KI-Zusammenfassung */}
        {lead.ki_zusammenfassung && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">KI-Zusammenfassung</h3>
              <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-semibold">KI</span>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-[12px] text-foreground leading-relaxed">
              {lead.ki_zusammenfassung}
            </div>
          </div>
        )}

        {/* Notizen */}
        <div className="space-y-2">
          <h3 className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Notizen</h3>
          <Textarea
            placeholder="Notiz hinzufügen..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="text-[12px] min-h-[80px]"
          />
          <Button size="sm" className="text-[12px] h-8" onClick={handleSaveNote} disabled={!noteText.trim()}>Speichern</Button>
          {lead.notizen && lead.notizen.length > 0 && (
            <div className="space-y-2 mt-2">
              {lead.notizen.map((n, i) => (
                <div key={i} className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-1.5 shrink-0" />
                  <div>
                    <div className="text-[12px] text-foreground">{n.text}</div>
                    <div className="text-[10px] text-muted-foreground">{formatTimeAgo(n.timestamp)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Aktivität */}
        <div className="space-y-2">
          <h3 className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Aktivität</h3>
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <div>
                <div className="text-[12px] text-foreground">Lead erstellt</div>
                <div className="text-[10px] text-muted-foreground">{formatTimeAgo(lead.erstellt_at)}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <div>
                <div className="text-[12px] text-foreground">Anfrage erhalten</div>
                <div className="text-[10px] text-muted-foreground">{formatTimeAgo(lead.erstellt_at)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2 pt-2">
          <h3 className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Aktionen</h3>
          <Button variant="outline" size="sm" className="w-full text-[12px] h-8" onClick={() => navigate("/postfach")}>
            Zur Anfrage
          </Button>
          {lead.fahrzeug_id && (
            <Button variant="outline" size="sm" className="w-full text-[12px] h-8" onClick={() => navigate(`/fahrzeuge/${lead.fahrzeug_id}`)}>
              Zum Inserat
            </Button>
          )}
          <Button size="sm" className="w-full text-[12px] h-8 bg-[hsl(122,39%,34%)] hover:bg-[hsl(122,39%,28%)] text-white" onClick={() => onStatusChange(lead.id, "Gewonnen")}>
            Als Gewonnen markieren
          </Button>
          <Button variant="outline" size="sm" className="w-full text-[12px] h-8 border-destructive text-destructive hover:bg-destructive/10" onClick={() => onStatusChange(lead.id, "Verloren")}>
            Als Verloren markieren
          </Button>
        </div>
      </div>
    </div>
  );
}
