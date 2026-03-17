import { Phone, ExternalLink, MessageCircle, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface LeadsKiDetailModalProps {
  open: boolean;
  onClose: () => void;
  leads: unknown[];
}

const KI_CARDS = [
  {
    name: "Klaus Weber",
    prio: "Hoch",
    prioClass: "bg-[hsl(120,35%,92%)] text-[hsl(122,39%,34%)]",
    prioDot: "bg-[hsl(122,39%,34%)]",
    quelle: "Mobile.de",
    quelleClass: "bg-primary/10 text-primary",
    fahrzeug: "BMW 320d 2021 · € 28.500",
    ki: "Konkrete Verfügbarkeitsanfrage vor 12 Min. Hohe Abschlussbereitschaft — sofort antworten.",
    actions: [
      { label: "Zur Anfrage", icon: ExternalLink, primary: true },
      { label: "Anrufen", icon: Phone, primary: false },
    ],
  },
  {
    name: "Thomas Becker",
    prio: "Hoch",
    prioClass: "bg-[hsl(120,35%,92%)] text-[hsl(122,39%,34%)]",
    prioDot: "bg-[hsl(122,39%,34%)]",
    quelle: "E-Mail",
    quelleClass: "bg-muted text-muted-foreground",
    fahrzeug: "VW Golf 8 GTI · € 38.500",
    ki: "Probefahrtwunsch geäußert — stärkster Kaufindikator. Seit 2 Std. keine Antwort.",
    actions: [
      { label: "Im Postfach anzeigen", icon: MessageCircle, primary: true },
      { label: "Anrufen", icon: Phone, primary: false },
    ],
  },
  {
    name: "Sandra Müller",
    prio: "Mittel",
    prioClass: "bg-[hsl(45,100%,94%)] text-[hsl(24,100%,45%)]",
    prioDot: "bg-[hsl(24,100%,45%)]",
    quelle: "AutoScout24",
    quelleClass: "bg-[hsl(45,100%,94%)]/60 text-[hsl(24,100%,45%)]",
    fahrzeug: "Audi A4 Avant · € 32.900",
    ki: "Frage zur Unfallfreiheit. Klärung könnte Kaufentscheidung beschleunigen.",
    actions: [
      { label: "Antwort senden", icon: ExternalLink, primary: true },
      { label: "Details", icon: Eye, primary: false },
    ],
  },
];

export function LeadsKiDetailModal({ open, onClose }: LeadsKiDetailModalProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[560px] rounded-[14px] p-7 gap-0">
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
          {KI_CARDS.map((card) => (
            <div key={card.name} className="border border-border rounded-[10px] p-3.5 bg-card">
              {/* Header */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[14px] font-semibold text-foreground">{card.name}</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${card.prioClass}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${card.prioDot}`} />
                  {card.prio}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${card.quelleClass}`}>
                  {card.quelle}
                </span>
              </div>

              {/* Fahrzeug */}
              <div className="mt-1.5 text-[12px] text-primary font-medium">
                {card.fahrzeug}
              </div>

              {/* KI reasoning box */}
              <div className="mt-2.5 rounded-[6px] border-l-[3px] border-[hsl(122,39%,34%)] bg-[hsl(138,76%,97%)] px-3 py-2">
                <p className="text-[12px] text-foreground/80 leading-relaxed">{card.ki}</p>
              </div>

              {/* Actions */}
              <div className="mt-2.5 flex items-center gap-2">
                {card.actions.map((action) => (
                  <Button
                    key={action.label}
                    variant="outline"
                    size="sm"
                    className={`h-7 text-[11px] ${action.primary ? "text-primary border-primary/30 hover:bg-primary/5" : ""}`}
                    onClick={() => {
                      if (action.label === "Im Postfach anzeigen") navigate("/postfach");
                    }}
                  >
                    <action.icon className="w-3 h-3 mr-1" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-5 mt-5 border-t border-border">
          <Button variant="outline" size="sm" onClick={onClose} className="text-[12px]">
            Schließen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
