import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Send, Check, Archive, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import type { Anfrage } from "@/data/anfragen";

const sourceColor: Record<string, string> = {
  "Mobile.de": "bg-primary/10 text-primary",
  "AutoScout24": "bg-warning/15 text-warning",
  "E-Mail": "bg-muted text-muted-foreground",
};

interface Props {
  anfrage: Anfrage;
  onMarkRead: () => void;
  onArchive: () => void;
}

export function AnfrageDetail({ anfrage: a, onMarkRead, onArchive }: Props) {
  const [antwort, setAntwort] = useState(a.kiAntwort);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Reset antwort when anfrage changes
  const [prevId, setPrevId] = useState(a.id);
  if (a.id !== prevId) {
    setPrevId(a.id);
    setAntwort(a.kiAntwort);
  }

  const handleSend = () => {
    toast({ title: "Antwort gesendet", description: `Antwort an ${a.sender} wurde versendet.` });
  };

  const kb = a.kiBewertung;

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-foreground">{a.sender}</h2>
          <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", sourceColor[a.source])}>
            {a.source}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground mr-2">{a.timestamp}</span>
          {a.unread && (
            <Button variant="outline" size="sm" className="text-xs gap-1.5 h-7" onClick={onMarkRead}>
              <Check className="w-3 h-3" /> Als gelesen
            </Button>
          )}
          <Button variant="outline" size="sm" className="text-xs gap-1.5 h-7" onClick={onArchive}>
            <Archive className="w-3 h-3" /> Archivieren
          </Button>
        </div>
      </div>

      {/* KI-Bewertung Card */}
      <div className="bg-card border border-border rounded-[10px] p-4">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-medium text-foreground">KI-Bewertung</h3>
          <Badge variant="info" className="text-[9px] px-1.5 py-0">KI</Badge>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-[11px] text-muted-foreground mb-1">Kaufwahrscheinlichkeit</div>
            <div className={cn("text-lg font-medium", kb.kaufwahrscheinlichkeit.color)}>
              {kb.kaufwahrscheinlichkeit.wert}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{kb.kaufwahrscheinlichkeit.text}</div>
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground mb-1">Dringlichkeit</div>
            <div className={cn("text-lg font-medium", kb.dringlichkeit.color)}>
              {kb.dringlichkeit.wert}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{kb.dringlichkeit.text}</div>
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground mb-1">Preisbereitschaft</div>
            <div className={cn("text-lg font-medium", kb.preisbereitschaft.color)}>
              {kb.preisbereitschaft.wert}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{kb.preisbereitschaft.text}</div>
          </div>
        </div>

        <Separator className="my-3" />

        <div className="flex items-start gap-1.5">
          <span className="text-[12px] font-semibold text-foreground shrink-0">KI-Empfehlung:</span>
          <span className="text-[12px] text-success">{kb.empfehlung}</span>
        </div>
      </div>

      {/* Anfrage Card */}
      <div className="bg-card border border-border rounded-[10px] p-4">
        <h3 className="text-sm font-medium text-foreground mb-3">Anfrage von {a.sender}</h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground w-20 shrink-0">Fahrzeug</span>
            <button
              onClick={() => navigate(`/fahrzeuge/${a.fahrzeugId}`)}
              className="text-[12px] text-primary hover:underline"
            >
              {a.fahrzeug}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground w-20 shrink-0">Quelle</span>
            <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", sourceColor[a.source])}>
              {a.source}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground w-20 shrink-0">Eingegangen</span>
            <span className="text-[12px] text-foreground">17. März 2026, 09:42 Uhr</span>
          </div>
        </div>

        <Separator className="my-3" />

        <p className="text-sm text-foreground leading-[1.8] whitespace-pre-line">{a.fullMessage}</p>

        {/* Contact info */}
        {(a.telefon || a.email) && (
          <>
            <Separator className="my-3" />
            <div className="space-y-1.5">
              {a.telefon && (
                <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                  <Phone className="w-3 h-3" /> {a.telefon}
                </div>
              )}
              {a.email && (
                <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                  <Mail className="w-3 h-3" /> {a.email}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* KI-Antwort Card */}
      <div className="bg-card border border-border rounded-[10px] p-4">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-medium text-foreground">KI-Antwort</h3>
          <Badge variant="info" className="text-[9px] px-1.5 py-0">KI</Badge>
          <span className="text-[10px] text-muted-foreground">automatisch generiert</span>
        </div>

        <Textarea
          value={antwort}
          onChange={(e) => setAntwort(e.target.value)}
          className="min-h-[140px] text-sm leading-[1.8] resize-none"
        />

        <div className="flex items-center gap-2 mt-3">
          <Button size="sm" className="text-xs gap-1.5" onClick={handleSend}>
            <Send className="w-3.5 h-3.5" /> Antwort senden
          </Button>
          <Button variant="outline" size="sm" disabled className="text-xs gap-1.5 opacity-60 cursor-not-allowed">
            <Sparkles className="w-3.5 h-3.5" /> Neu generieren
            <Badge variant="secondary" className="text-[9px] px-1.5 py-0 ml-1">Bald verfügbar</Badge>
          </Button>
        </div>

        <p className="text-[11px] text-muted-foreground mt-2">
          Die KI-Antwort kann vor dem Versand bearbeitet werden. Der Text wird automatisch an den Ton Ihres Autohauses angepasst.
        </p>
      </div>
    </div>
  );
}
