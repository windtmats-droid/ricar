import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Fahrzeug { id: string; marke: string; modell: string; preis: number }

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function LeadHinzufuegenModal({ open, onClose, onCreated }: Props) {
  const [fahrzeuge, setFahrzeuge] = useState<Fahrzeug[]>([]);
  const [saving, setSaving] = useState(false);

  const [vorname, setVorname] = useState("");
  const [nachname, setNachname] = useState("");
  const [telefon, setTelefon] = useState("");
  const [email, setEmail] = useState("");
  const [fahrzeugId, setFahrzeugId] = useState("");
  const [quelle, setQuelle] = useState("Telefonanruf");
  const [prioritaet, setPrioritaet] = useState("Mittel");
  const [status, setStatus] = useState("Neu");
  const [notizen, setNotizen] = useState("");

  useEffect(() => {
    if (!open) return;
    supabase.from("fahrzeuge").select("id, marke, modell, preis").then(({ data }) => {
      if (data) setFahrzeuge(data);
    });
  }, [open]);

  const reset = () => {
    setVorname(""); setNachname(""); setTelefon(""); setEmail("");
    setFahrzeugId(""); setQuelle("Telefonanruf"); setPrioritaet("Mittel");
    setStatus("Neu"); setNotizen("");
  };

  const handleSave = async () => {
    if (!vorname.trim() || !nachname.trim()) { toast.error("Vor- und Nachname sind erforderlich"); return; }
    if (!fahrzeugId) { toast.error("Bitte ein Fahrzeug auswählen"); return; }

    setSaving(true);
    const { error } = await supabase.from("leads").insert({
      sender_name: `${vorname.trim()} ${nachname.trim()}`,
      sender_email: email.trim() || null,
      sender_phone: telefon.trim() || null,
      fahrzeug_id: fahrzeugId,
      quelle,
      prioritaet,
      status,
      notizen: notizen.trim() ? [{ text: notizen.trim(), timestamp: new Date().toISOString() }] : [],
    });
    setSaving(false);

    if (error) { toast.error("Fehler beim Speichern"); return; }
    toast.success("Lead erfolgreich erstellt");
    reset();
    onCreated();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { reset(); onClose(); } }}>
      <DialogContent className="max-w-[520px] p-7 rounded-[14px]">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-[16px] font-medium">Neuen Lead erstellen</DialogTitle>
          <DialogDescription className="text-[12px]">Manueller Eintrag — z.B. bei Telefonanruf oder Walk-in</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Kontakt */}
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Kontakt</div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-[11px]">Vorname *</Label><Input value={vorname} onChange={(e) => setVorname(e.target.value)} className="h-9 text-[13px]" /></div>
              <div><Label className="text-[11px]">Nachname *</Label><Input value={nachname} onChange={(e) => setNachname(e.target.value)} className="h-9 text-[13px]" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div><Label className="text-[11px]">Telefon</Label><Input value={telefon} onChange={(e) => setTelefon(e.target.value)} className="h-9 text-[13px]" /></div>
              <div><Label className="text-[11px]">E-Mail</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-9 text-[13px]" /></div>
            </div>
          </div>

          {/* Fahrzeug */}
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Fahrzeug</div>
            <Select value={fahrzeugId} onValueChange={setFahrzeugId}>
              <SelectTrigger className="h-9 text-[13px]"><SelectValue placeholder="Fahrzeug auswählen... *" /></SelectTrigger>
              <SelectContent>
                {fahrzeuge.map((f) => (
                  <SelectItem key={f.id} value={f.id} className="text-[13px]">
                    {f.marke} {f.modell} · € {Number(f.preis).toLocaleString("de-DE")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Interesse */}
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Interesse</div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-[11px]">Quelle</Label>
                <Select value={quelle} onValueChange={setQuelle}>
                  <SelectTrigger className="h-9 text-[13px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Telefonanruf", "Walk-in", "Empfehlung", "Messe", "Sonstige"].map((q) => (
                      <SelectItem key={q} value={q} className="text-[13px]">{q}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[11px]">Priorität</Label>
                <Select value={prioritaet} onValueChange={setPrioritaet}>
                  <SelectTrigger className="h-9 text-[13px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Hoch", "Mittel", "Niedrig"].map((p) => (
                      <SelectItem key={p} value={p} className="text-[13px]">{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[11px]">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="h-9 text-[13px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Neu", "Kontaktiert"].map((s) => (
                      <SelectItem key={s} value={s} className="text-[13px]">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Notizen */}
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Notizen</div>
            <Textarea rows={3} value={notizen} onChange={(e) => setNotizen(e.target.value)} className="text-[13px] resize-none" placeholder="Was wurde besprochen? Besondere Wünsche?" />
          </div>
        </div>

        <DialogFooter className="border-t border-border pt-4 mt-2">
          <Button variant="outline" onClick={() => { reset(); onClose(); }} className="text-[13px]">Abbrechen</Button>
          <Button onClick={handleSave} disabled={saving} className="text-[13px]">{saving ? "Speichern..." : "Lead speichern"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
