import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Loader2 } from "lucide-react";
import { type Fahrzeug } from "@/lib/fahrzeuge-store";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    verkaufspreis: number;
    kaeuferName: string;
    kaeuferTelefon: string;
    kaeuferEmail: string;
    verkaufsDatum: string;
    zahlungsart: string;
    verkaufsNotizen: string;
  }) => void;
  fahrzeug: Fahrzeug | null;
}

export function VerkaufModal({ open, onClose, onConfirm, fahrzeug }: Props) {
  const [verkaufspreis, setVerkaufspreis] = useState("");
  const [kaeuferName, setKaeuferName] = useState("");
  const [kaeuferTelefon, setKaeuferTelefon] = useState("");
  const [kaeuferEmail, setKaeuferEmail] = useState("");
  const [verkaufsDatum, setVerkaufsDatum] = useState("");
  const [zahlungsart, setZahlungsart] = useState("");
  const [notizen, setNotizen] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && fahrzeug) {
      setVerkaufspreis(String(fahrzeug.inseratPreis || fahrzeug.empfohlenerVKPreis || ""));
      setKaeuferName("");
      setKaeuferTelefon("");
      setKaeuferEmail("");
      setVerkaufsDatum(new Date().toISOString().split("T")[0]);
      setZahlungsart("");
      setNotizen("");
    }
  }, [open, fahrzeug]);

  const handleSubmit = () => {
    setSaving(true);
    onConfirm({
      verkaufspreis: parseFloat(verkaufspreis) || 0,
      kaeuferName,
      kaeuferTelefon,
      kaeuferEmail,
      verkaufsDatum,
      zahlungsart,
      verkaufsNotizen: notizen,
    });
    setSaving(false);
  };

  if (!fahrzeug) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Verkauf abschließen</DialogTitle>
          <DialogDescription className="text-xs">
            {fahrzeug.marke} {fahrzeug.modell} {fahrzeug.baujahr}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          <div>
            <Label className="text-[11px]">Verkaufspreis (€) *</Label>
            <Input
              type="number"
              value={verkaufspreis}
              onChange={(e) => setVerkaufspreis(e.target.value)}
              className="mt-1 h-8 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <Label className="text-[11px]">Käufer Name</Label>
              <Input value={kaeuferName} onChange={(e) => setKaeuferName(e.target.value)} className="mt-1 h-8 text-xs" />
            </div>
            <div>
              <Label className="text-[11px]">Käufer Telefon</Label>
              <Input value={kaeuferTelefon} onChange={(e) => setKaeuferTelefon(e.target.value)} className="mt-1 h-8 text-xs" />
            </div>
          </div>

          <div>
            <Label className="text-[11px]">Käufer E-Mail</Label>
            <Input type="email" value={kaeuferEmail} onChange={(e) => setKaeuferEmail(e.target.value)} className="mt-1 h-8 text-xs" />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <Label className="text-[11px]">Verkaufsdatum</Label>
              <Input type="date" value={verkaufsDatum} onChange={(e) => setVerkaufsDatum(e.target.value)} className="mt-1 h-8 text-xs" />
            </div>
            <div>
              <Label className="text-[11px]">Zahlungsart</Label>
              <Select value={zahlungsart} onValueChange={setZahlungsart}>
                <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue placeholder="Wählen" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bar">Bar</SelectItem>
                  <SelectItem value="Überweisung">Überweisung</SelectItem>
                  <SelectItem value="Finanzierung">Finanzierung</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-[11px]">Notizen</Label>
            <Textarea value={notizen} onChange={(e) => setNotizen(e.target.value)} rows={3} className="mt-1 text-xs" placeholder="Zusätzliche Notizen zum Verkauf..." />
          </div>

          <Button onClick={handleSubmit} disabled={saving || !verkaufspreis} className="w-full gap-2 mt-2" size="lg">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            Verkauf abschließen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
