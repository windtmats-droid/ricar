import { useState, useEffect } from "react";
import { Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const AUTOHAUS_KEY = "autohausData";

export interface AutohausData {
  firmenname: string;
  inhaber: string;
  strasse: string;
  hausnr: string;
  plz: string;
  ort: string;
  telefon: string;
  email: string;
  website: string;
  steuernummer: string;
  ustid: string;
  iban: string;
  bic: string;
  bankname: string;
  naechsteRechnungsnr: number;
  rechnungsnrPraefix: string;
}

export const defaultAutohausData: AutohausData = {
  firmenname: "", inhaber: "", strasse: "", hausnr: "", plz: "", ort: "",
  telefon: "", email: "", website: "", steuernummer: "", ustid: "",
  iban: "", bic: "", bankname: "",
  naechsteRechnungsnr: 1001, rechnungsnrPraefix: "RE-2026-",
};

export function loadAutohausData(): AutohausData {
  try {
    const raw = localStorage.getItem(AUTOHAUS_KEY);
    if (raw) return { ...defaultAutohausData, ...JSON.parse(raw) };
  } catch {}
  return { ...defaultAutohausData };
}

export function saveAutohausData(d: AutohausData) {
  localStorage.setItem(AUTOHAUS_KEY, JSON.stringify(d));
}

export function AutohausDatenSection() {
  const [form, setForm] = useState<AutohausData>(loadAutohausData);
  const { toast } = useToast();

  const update = (key: keyof AutohausData, val: string | number) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleSave = () => {
    saveAutohausData(form);
    toast({ title: "Gespeichert", description: "Autohaus-Daten wurden gespeichert." });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-5">
      <div className="flex items-center gap-2">
        <Building2 className="w-4 h-4 text-muted-foreground" />
        <div>
          <h3 className="text-[14px] font-medium text-foreground">Autohaus-Daten</h3>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            Werden automatisch in Kaufverträgen, Rechnungen und Übergabeprotokollen verwendet
          </p>
        </div>
      </div>

      {/* Firma */}
      <div className="space-y-1">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Unternehmen</div>
        <div className="space-y-3">
          <Field label="Firmenname *" value={form.firmenname} onChange={(v) => update("firmenname", v)} />
          <Field label="Inhaber / Geschäftsführer" value={form.inhaber} onChange={(v) => update("inhaber", v)} />
          <div className="grid grid-cols-[1fr_100px] gap-2">
            <Field label="Straße" value={form.strasse} onChange={(v) => update("strasse", v)} />
            <Field label="Hausnr." value={form.hausnr} onChange={(v) => update("hausnr", v)} />
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-2">
            <Field label="PLZ" value={form.plz} onChange={(v) => update("plz", v)} maxLength={5} />
            <Field label="Ort" value={form.ort} onChange={(v) => update("ort", v)} />
          </div>
        </div>
      </div>

      {/* Kontakt */}
      <div className="space-y-1">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Kontakt</div>
        <div className="space-y-3">
          <Field label="Telefon" value={form.telefon} onChange={(v) => update("telefon", v)} />
          <Field label="E-Mail" value={form.email} onChange={(v) => update("email", v)} type="email" />
          <Field label="Website" value={form.website} onChange={(v) => update("website", v)} />
        </div>
      </div>

      {/* Steuer */}
      <div className="space-y-1">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Steuer</div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Field label="Steuernummer" value={form.steuernummer} onChange={(v) => update("steuernummer", v)} />
            <Field label="USt-IdNr." value={form.ustid} onChange={(v) => update("ustid", v)} />
          </div>
        </div>
      </div>

      {/* Bank */}
      <div className="space-y-1">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Bankverbindung</div>
        <div className="space-y-3">
          <Field label="IBAN" value={form.iban} onChange={(v) => update("iban", v)} />
          <div className="grid grid-cols-2 gap-2">
            <Field label="BIC" value={form.bic} onChange={(v) => update("bic", v)} />
            <Field label="Bankname" value={form.bankname} onChange={(v) => update("bankname", v)} />
          </div>
        </div>
      </div>

      {/* Rechnungsnummer */}
      <div className="space-y-1">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Rechnungsnummern</div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Field label="Rechnungsnummer-Präfix" value={form.rechnungsnrPraefix} onChange={(v) => update("rechnungsnrPraefix", v)} placeholder="RE-2026-" />
            <div>
              <label className="text-[11px] text-muted-foreground mb-1 block">Nächste Nummer</label>
              <Input
                type="number"
                value={form.naechsteRechnungsnr}
                onChange={(e) => update("naechsteRechnungsnr", parseInt(e.target.value) || 0)}
                className="h-9 text-[12px]"
              />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Nächste Rechnung wird automatisch als <span className="font-mono font-medium text-foreground">{form.rechnungsnrPraefix}{form.naechsteRechnungsnr}</span> nummeriert
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button size="sm" className="text-[13px]" onClick={handleSave}>Speichern</Button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", maxLength, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; maxLength?: number; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-[11px] text-muted-foreground mb-1 block">{label}</label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="h-9 text-[12px]" maxLength={maxLength} placeholder={placeholder} />
    </div>
  );
}
