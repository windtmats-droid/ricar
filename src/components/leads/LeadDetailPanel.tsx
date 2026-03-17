import { useState, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, Mail, Phone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type LeadRow, getStatusStyle, getPrioStyle, getQuelleStyle, formatTimeAgo, LEAD_STATUSES } from "@/data/leads";

interface LeadDetailPanelProps {
  lead: LeadRow;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
  onSaveNote: (id: string, note: string) => void;
}

export const LeadDetailPanel = forwardRef<HTMLDivElement, LeadDetailPanelProps>(
  ({ lead, onClose, onStatusChange, onSaveNote }, ref) => {
    const navigate = useNavigate();
    const [noteText, setNoteText] = useState("");
    const prio = getPrioStyle(lead.prioritaet);

    const handleSaveNote = () => {
      if (!noteText.trim()) return;
      onSaveNote(lead.id, noteText.trim());
      setNoteText("");
    };

    return (
      <div
        ref={ref}
        className="w-[380px] shrink-0 bg-card border-l border-border h-full overflow-y-auto animate-slide-in-right z-50"
      >
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-4 py-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[16px] font-medium text-foreground truncate">{lead.sender_name}</span>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${getQuelleStyle(lead.quelle)}`}>
              {lead.quelle}
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
            Schließen
          </button>
        </div>

        <div className="p-4 space-y-5">
          {/* KONTAKT */}
          <div className="space-y-2">
            <h3 className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Kontakt</h3>
            <div className="space-y-1.5">
              <div className="text-[13px] font-medium text-foreground">{lead.sender_name}</div>
              {lead.sender_email && (
                <a href={`mailto:${lead.sender_email}`} className="text-[12px] text-primary hover:underline flex items-center gap-1">
                  <Mail className="w-3 h-3" />{lead.sender_email}
                </a>
              )}
              {lead.sender_phone && (
                <a href={`tel:${lead.sender_phone}`} className="text-[12px] text-muted-foreground hover:text-foreground flex items-center gap-1">
                  <Phone className="w-3 h-3" />{lead.sender_phone}
                </a>
              )}
            </div>
            <div className="flex gap-2">
              {lead.sender_phone && (
                <Button variant="outline" size="sm" className="text-[11px] h-7 flex-1" asChild>
                  <a href={`tel:${lead.sender_phone}`}>Anrufen</a>
                </Button>
              )}
              {lead.sender_email && (
                <Button variant="outline" size="sm" className="text-[11px] h-7 flex-1" asChild>
                  <a href={`mailto:${lead.sender_email}`}>E-Mail senden</a>
                </Button>
              )}
            </div>
          </div>

          {/* FAHRZEUG */}
          {lead.fahrzeug_label && (
            <div className="space-y-2">
              <h3 className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Fahrzeug</h3>
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50">
                <div className="w-12 h-9 rounded bg-muted flex items-center justify-center text-muted-foreground text-[10px]">Foto</div>
                <div className="min-w-0 flex-1">
                  <button
                    onClick={() => lead.fahrzeug_id && navigate(`/fahrzeuge/${lead.fahrzeug_id}`)}
                    className="text-[13px] text-primary font-medium hover:underline flex items-center gap-1"
                  >
                    {lead.fahrzeug_label} <ExternalLink className="w-3 h-3" />
                  </button>
                  {lead.fahrzeug_preis && (
                    <div className="text-[11px] text-muted-foreground">€{lead.fahrzeug_preis.toLocaleString("de-DE")}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STATUS */}
          <div className="space-y-2">
            <h3 className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Status</h3>
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

          {/* KI-ZUSAMMENFASSUNG */}
          {lead.ki_zusammenfassung && (
            <div className="space-y-2">
              <h3 className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">KI-Zusammenfassung</h3>
              <div className="bg-primary/5 border border-primary/15 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[9px] font-bold">KI</span>
                </div>
                <p className="text-[12px] text-foreground leading-relaxed italic">
                  {lead.ki_zusammenfassung}
                </p>
              </div>
            </div>
          )}

          {/* NOTIZEN */}
          <div className="space-y-2">
            <h3 className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Notizen</h3>
            <Textarea
              placeholder="Notiz hinzufügen..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="text-[12px] min-h-[80px]"
            />
            <Button size="sm" className="text-[12px] h-8" onClick={handleSaveNote} disabled={!noteText.trim()}>
              Speichern
            </Button>
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

          {/* AKTIONEN */}
          <div className="space-y-2 pt-2">
            <h3 className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Aktionen</h3>
            <Button
              size="sm"
              className="w-full text-[12px] h-8 bg-[hsl(122,39%,34%)] hover:bg-[hsl(122,39%,28%)] text-white"
              onClick={() => onStatusChange(lead.id, "Gewonnen")}
            >
              Als Gewonnen markieren
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-[12px] h-8 border-destructive text-destructive hover:bg-destructive/10"
              onClick={() => onStatusChange(lead.id, "Verloren")}
            >
              Als Verloren markieren
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-[12px] h-8"
              onClick={() => navigate("/postfach")}
            >
              Zur Anfrage im Postfach
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

LeadDetailPanel.displayName = "LeadDetailPanel";
