import { X, Phone, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type LeadRow, getStatusStyle, getPrioStyle, getQuelleStyle } from "@/data/leads";

interface LeadsKiDetailModalProps {
  open: boolean;
  onClose: () => void;
  leads: LeadRow[];
}

export function LeadsKiDetailModal({ open, onClose, leads }: LeadsKiDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[580px] rounded-[14px] p-7 gap-0">
        <DialogHeader className="space-y-1 pb-5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold">KI</span>
            <DialogTitle className="text-[16px] font-medium">KI-Tagesempfehlung</DialogTitle>
          </div>
          <DialogDescription className="text-[12px] text-muted-foreground">
            Heute priorisierte Leads — basierend auf Kaufwahrscheinlichkeit und Dringlichkeit
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2.5">
          {leads.map((lead) => {
            const prio = getPrioStyle(lead.prioritaet);
            return (
              <div key={lead.id} className="border rounded-[10px] p-3.5 bg-background">
                {/* Header */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[14px] font-semibold text-foreground">{lead.sender_name}</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${lead.prioritaet === "Hoch" ? "bg-[hsl(120,35%,92%)] text-[hsl(122,39%,34%)]" : lead.prioritaet === "Mittel" ? "bg-[hsl(45,100%,94%)] text-[hsl(24,100%,45%)]" : "bg-muted text-muted-foreground"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${prio.dot}`} />
                    {lead.prioritaet}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getQuelleStyle(lead.quelle)}`}>
                    {lead.quelle}
                  </span>
                </div>

                {/* Fahrzeug */}
                {lead.fahrzeug_label && (
                  <div className="mt-1.5 text-[12px] text-primary font-medium cursor-pointer hover:underline">
                    {lead.fahrzeug_label}{lead.fahrzeug_preis ? ` · € ${lead.fahrzeug_preis.toLocaleString("de-DE")}` : ""}
                  </div>
                )}

                {/* KI reasoning */}
                {lead.ki_zusammenfassung && (
                  <div className="mt-2.5 rounded-[6px] border-l-[3px] border-[hsl(122,39%,34%)] bg-[hsl(120,35%,96%)] px-3 py-2">
                    <p className="text-[11px] text-foreground/80 leading-relaxed">{lead.ki_zusammenfassung}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-2.5 flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-7 text-[11px] text-primary border-primary/30 hover:bg-primary/5">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Zur Anfrage
                  </Button>
                  {lead.sender_phone && (
                    <Button variant="outline" size="sm" className="h-7 text-[11px]">
                      <Phone className="w-3 h-3 mr-1" />
                      Anrufen
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-5 mt-5 border-t">
          <button className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">
            Alle Leads anzeigen
          </button>
          <Button variant="outline" size="sm" onClick={onClose} className="text-[12px]">
            Schließen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
