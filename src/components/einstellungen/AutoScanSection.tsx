import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AutoScanSectionProps {
  config: {
    aktiv: boolean; uhrzeit: string; email_bericht: boolean;
    email: string; radius_km: number; quellen: { mobile: boolean; autoscout: boolean; ebay: boolean };
  };
  onSave: (config: any) => void;
}

const RADIUS_MARKS = [25, 50, 100, 150, 200];

export function AutoScanSection({ config, onSave }: AutoScanSectionProps) {
  const [form, setForm] = useState({
    aktiv: true, uhrzeit: "06:00", email_bericht: true,
    email: "chef@autohaus.de", radius_km: 100,
    quellen: { mobile: true, autoscout: true, ebay: false },
    ...config,
  });

  const radiusIdx = RADIUS_MARKS.indexOf(form.radius_km) !== -1 ? RADIUS_MARKS.indexOf(form.radius_km) : 2;

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-5">
      <h3 className="text-[14px] font-medium text-foreground">Auto-Scan Konfiguration</h3>

      <div className="flex items-center justify-between py-2">
        <span className="text-[13px] text-foreground">Täglicher Auto-Scan aktiv</span>
        <Switch checked={form.aktiv} onCheckedChange={(c) => setForm({ ...form, aktiv: c })} />
      </div>

      <div className="space-y-2">
        <label className="text-[11px] text-muted-foreground">Scan-Uhrzeit</label>
        <Select value={form.uhrzeit} onValueChange={(v) => setForm({ ...form, uhrzeit: v })}>
          <SelectTrigger className="h-9 text-[12px] w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["04:00", "05:00", "06:00", "07:00", "08:00"].map((t) => (
              <SelectItem key={t} value={t}>{t} Uhr</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between py-2">
          <span className="text-[13px] text-foreground">Täglichen Bericht per E-Mail senden</span>
          <Switch checked={form.email_bericht} onCheckedChange={(c) => setForm({ ...form, email_bericht: c })} />
        </div>
        {form.email_bericht && (
          <div>
            <label className="text-[11px] text-muted-foreground mb-1 block">an:</label>
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-9 text-[12px]" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-[11px] text-muted-foreground">Suchradius</label>
        <Slider
          value={[radiusIdx]}
          onValueChange={(v) => setForm({ ...form, radius_km: RADIUS_MARKS[v[0]] })}
          max={4}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-[11px] text-muted-foreground">
          <span>25 km</span>
          <span className="text-[12px] font-medium text-foreground">{form.radius_km} km</span>
          <span>200 km</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[11px] text-muted-foreground">Quellen</label>
        <div className="flex items-center gap-4">
          {([["mobile", "Mobile.de"], ["autoscout", "AutoScout24"], ["ebay", "eBay Kleinanzeigen"]] as const).map(([key, label]) => (
            <label key={key} className="flex items-center gap-1.5 text-[12px] text-foreground cursor-pointer">
              <Checkbox
                checked={form.quellen[key]}
                onCheckedChange={(c) => setForm({ ...form, quellen: { ...form.quellen, [key]: !!c } })}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button size="sm" className="text-[13px]" onClick={() => onSave(form)}>Einstellungen speichern</Button>
      </div>
    </div>
  );
}
