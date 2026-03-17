import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BenachrichtigungenSectionProps {
  config: Record<string, boolean>;
  email: string;
  onSave: (config: Record<string, boolean>, email: string) => void;
}

const TOGGLES = [
  { key: "neue_anfrage", label: "Neue Anfrage im Postfach" },
  { key: "preisalarm", label: "Preisalarm (Fahrzeug über Markt)" },
  { key: "markt_scan_bericht", label: "Täglicher Markt-Scan Bericht" },
  { key: "lead_erinnerung", label: "Lead-Erinnerung (kein Kontakt seit 3 Tagen)" },
  { key: "standzeit_warnung", label: "Standzeit-Warnung (über 30 Tage)" },
];

export function BenachrichtigungenSection({ config, email: initialEmail, onSave }: BenachrichtigungenSectionProps) {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    neue_anfrage: true, preisalarm: true, markt_scan_bericht: true,
    lead_erinnerung: false, standzeit_warnung: true, ...config,
  });
  const [email, setEmail] = useState(initialEmail || "chef@autohaus-muster.de");

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-5">
      <h3 className="text-[14px] font-medium text-foreground">Benachrichtigungen</h3>

      <div className="space-y-1">
        {TOGGLES.map((t) => (
          <div key={t.key} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
            <span className="text-[13px] text-foreground">{t.label}</span>
            <Switch checked={toggles[t.key]} onCheckedChange={(c) => setToggles((p) => ({ ...p, [t.key]: c }))} />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-[11px] text-muted-foreground">E-Mail für Benachrichtigungen</label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} className="h-9 text-[12px]" type="email" />
      </div>

      <div className="flex justify-end">
        <Button size="sm" className="text-[13px]" onClick={() => onSave(toggles, email)}>Speichern</Button>
      </div>
    </div>
  );
}
