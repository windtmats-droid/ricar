import { useState } from "react";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProfilSectionProps {
  profil: Record<string, string>;
  onSave: (profil: Record<string, string>) => void;
}

export function ProfilSection({ profil, onSave }: ProfilSectionProps) {
  const [form, setForm] = useState<Record<string, string>>({
    name: "Autohaus Muster GmbH",
    inhaber: "Max Mustermann",
    strasse: "Musterstraße 1",
    plz: "44135",
    stadt: "Dortmund",
    telefon: "+49 231 1234567",
    email: "info@autohaus-muster.de",
    website: "www.autohaus-muster.de",
    steuernummer: "123/456/78901",
    ustid: "DE123456789",
    ...profil,
  });

  const update = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-5">
      <div>
        <h3 className="text-[14px] font-medium text-foreground">Autohaus-Profil</h3>
        <p className="text-[12px] text-muted-foreground mt-0.5">Diese Daten erscheinen in Kaufverträgen und E-Mail-Signaturen</p>
      </div>

      {/* Logo */}
      <div>
        <div className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">Logo</div>
        <div className="w-[120px] h-[120px] rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors">
          <Upload className="w-5 h-5 text-muted-foreground mb-1" />
          <span className="text-[11px] text-muted-foreground">Logo hochladen</span>
        </div>
      </div>

      <div className="space-y-3">
        <Field label="Autohaus Name *" value={form.name} onChange={(v) => update("name", v)} />
        <Field label="Inhaber / Geschäftsführer" value={form.inhaber} onChange={(v) => update("inhaber", v)} />
        <Field label="Straße + Hausnummer" value={form.strasse} onChange={(v) => update("strasse", v)} />
        <div className="grid grid-cols-[120px_1fr] gap-2">
          <div>
            <label className="text-[11px] text-muted-foreground mb-1 block">PLZ</label>
            <Input value={form.plz} onChange={(e) => update("plz", e.target.value)} className="h-9 text-[12px]" maxLength={5} />
          </div>
          <div>
            <label className="text-[11px] text-muted-foreground mb-1 block">Stadt</label>
            <Input value={form.stadt} onChange={(e) => update("stadt", e.target.value)} className="h-9 text-[12px]" />
          </div>
        </div>
        <Field label="Telefon" value={form.telefon} onChange={(v) => update("telefon", v)} />
        <Field label="E-Mail" value={form.email} onChange={(v) => update("email", v)} type="email" />
        <Field label="Website" value={form.website} onChange={(v) => update("website", v)} />
        <Field label="Steuernummer" value={form.steuernummer} onChange={(v) => update("steuernummer", v)} />
        <Field label="USt-IdNr." value={form.ustid} onChange={(v) => update("ustid", v)} />
      </div>

      <div className="flex justify-end">
        <Button size="sm" className="text-[13px]" onClick={() => onSave(form)}>Profil speichern</Button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-[11px] text-muted-foreground mb-1 block">{label}</label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="h-9 text-[12px]" />
    </div>
  );
}
