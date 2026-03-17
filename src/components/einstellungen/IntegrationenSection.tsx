import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface IntegrationenSectionProps {
  mobilede: { user: string; pw: string; kundennr: string };
  n8nUrl: string;
  onSaveMobilede: (data: { user: string; pw: string; kundennr: string }) => void;
  onSaveN8n: (url: string) => void;
}

export function IntegrationenSection({ mobilede, n8nUrl, onSaveMobilede, onSaveN8n }: IntegrationenSectionProps) {
  const [mForm, setMForm] = useState(mobilede);
  const [showPw, setShowPw] = useState(false);
  const [webhook, setWebhook] = useState(n8nUrl);

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-6">
      <div>
        <h3 className="text-[14px] font-medium text-foreground">Plattform-Integrationen</h3>
        <p className="text-[12px] text-muted-foreground mt-0.5">Verbinde deine Fahrzeugbörsen für automatische Synchronisation</p>
      </div>

      {/* Mobile.de */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-[14px] font-bold shrink-0">M</div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-foreground">Mobile.de</div>
            <div className="text-[11px] text-muted-foreground">Inserate automatisch synchronisieren</div>
          </div>
          <Badge variant="secondary" className="text-[10px]">Nicht verbunden</Badge>
        </div>

        <div className="bg-primary/5 border-l-[3px] border-primary rounded-r-lg p-3 text-[11px] text-foreground leading-relaxed">
          <div className="font-medium mb-1">So aktivierst du die Inserats-Einbindung bei Mobile.de:</div>
          <ol className="list-decimal list-inside space-y-0.5 text-muted-foreground">
            <li>Mobile.de Händlerbereich öffnen</li>
            <li>Verkaufen → Datenexport → Inserats-Einbindung</li>
            <li>Nutzungsbedingungen akzeptieren → Passwort erstellen</li>
            <li>Zugangsdaten hier eintragen</li>
          </ol>
        </div>

        <div className="space-y-2">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Inserats-Einbindung Zugangsdaten</div>
          <Input placeholder="Mobile.de Benutzername" value={mForm.user} onChange={(e) => setMForm({ ...mForm, user: e.target.value })} className="h-9 text-[12px]" />
          <div className="relative">
            <Input type={showPw ? "text" : "password"} placeholder="Passwort" value={mForm.pw} onChange={(e) => setMForm({ ...mForm, pw: e.target.value })} className="h-9 text-[12px] pr-9" />
            <button onClick={() => setShowPw(!showPw)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          <Input placeholder="Mobile.de Kundennummer" value={mForm.kundennr} onChange={(e) => setMForm({ ...mForm, kundennr: e.target.value })} className="h-9 text-[12px]" />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-[12px] h-8">Verbindung testen</Button>
            <Button size="sm" className="text-[12px] h-8" onClick={() => onSaveMobilede(mForm)}>Speichern & Verbinden</Button>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground">Synchronisation alle 15 Minuten · Mobile.de ist das führende System</p>
      </div>

      <div className="h-px bg-border" />

      {/* AutoScout24 */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-warning/10 flex items-center justify-center text-warning text-[14px] font-bold shrink-0">AS</div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-foreground">AutoScout24</div>
            <div className="text-[11px] text-muted-foreground">AutoScout24 Partner API — Zugangsdaten beim Händler-Support anfragen</div>
          </div>
          <Badge variant="secondary" className="text-[10px]">Nicht verbunden</Badge>
        </div>
        <div className="space-y-2">
          <Input placeholder="API Key" disabled className="h-9 text-[12px]" />
          <Input placeholder="Partner ID" disabled className="h-9 text-[12px]" />
          <div className="relative w-fit">
            <Button size="sm" className="text-[12px] h-8" disabled>Verbinden</Button>
            <Badge variant="secondary" className="absolute -top-2 -right-16 text-[9px] px-1.5 py-0.5">Bald verfügbar</Badge>
          </div>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* n8n */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-foreground text-[12px] font-bold shrink-0">n8n</div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-foreground">n8n KI-Automation</div>
            <div className="text-[11px] text-muted-foreground">Webhook-URL für KI-Funktionen (Inseratstexte, Markt-Scan, Postfach-Bewertung)</div>
          </div>
          <Badge variant="secondary" className="text-[10px]">Nicht konfiguriert</Badge>
        </div>
        <Input placeholder="https://dein-n8n.de/webhook/..." value={webhook} onChange={(e) => setWebhook(e.target.value)} className="h-9 text-[12px]" />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-[12px] h-8">Webhook testen</Button>
          <Button size="sm" className="text-[12px] h-8" onClick={() => onSaveN8n(webhook)}>Speichern</Button>
        </div>
        <div className="bg-warning/5 border-l-[3px] border-warning rounded-r-lg p-3 text-[11px] text-muted-foreground">
          Dieser Webhook aktiviert alle KI-Funktionen. Ohne Webhook-URL sind KI-Buttons deaktiviert.
        </div>
      </div>
    </div>
  );
}
