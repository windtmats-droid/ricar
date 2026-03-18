import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Loader2, Settings } from "lucide-react";
import { type Fahrzeug } from "@/lib/fahrzeuge-store";
import { Link } from "react-router-dom";

export interface TeamMember {
  id: string;
  vorname: string;
  nachname: string;
  rolle: string;
  email: string;
  telefon: string;
}

export function getTeam(): TeamMember[] {
  try {
    return JSON.parse(localStorage.getItem("team") || "[]");
  } catch { return []; }
}

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    verkaufspreis: number;
    verkaeuferId: string;
    verkaufsDatum: string;
    verkaufsNotizen: string;
  }) => void;
  fahrzeug: Fahrzeug | null;
}

export function VerkaufModal({ open, onClose, onConfirm, fahrzeug }: Props) {
  const [verkaufspreis, setVerkaufspreis] = useState("");
  const [verkaeuferId, setVerkaeuferId] = useState("");
  const [verkaufsDatum, setVerkaufsDatum] = useState("");
  const [notizen, setNotizen] = useState("");
  const [saving, setSaving] = useState(false);
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    if (open) {
      setTeam(getTeam());
      if (fahrzeug) {
        setVerkaufspreis(String(fahrzeug.inseratPreis || fahrzeug.empfohlenerVKPreis || ""));
        setVerkaeuferId("");
        setVerkaufsDatum(new Date().toISOString().split("T")[0]);
        setNotizen("");
      }
    }
  }, [open, fahrzeug]);

  const handleSubmit = () => {
    setSaving(true);
    onConfirm({
      verkaufspreis: parseFloat(verkaufspreis) || 0,
      verkaeuferId,
      verkaufsDatum,
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
          {/* Verkäufer */}
          <div>
            <Label className="text-[11px]">Verkäufer</Label>
            {team.length === 0 ? (
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                <Settings className="w-3.5 h-3.5" />
                <span>Kein Verkäufer angelegt.</span>
                <Link to="/einstellungen" className="text-primary hover:underline ml-1">In Einstellungen anlegen →</Link>
              </div>
            ) : (
              <Select value={verkaeuferId} onValueChange={setVerkaeuferId}>
                <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue placeholder="Verkäufer wählen" /></SelectTrigger>
                <SelectContent>
                  {team.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.vorname} {m.nachname} — {m.rolle}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div>
            <Label className="text-[11px]">Verkaufspreis (€) *</Label>
            <Input type="number" value={verkaufspreis} onChange={(e) => setVerkaufspreis(e.target.value)} className="mt-1 h-8 text-xs" />
          </div>

          <div>
            <Label className="text-[11px]">Verkaufsdatum</Label>
            <Input type="date" value={verkaufsDatum} onChange={(e) => setVerkaufsDatum(e.target.value)} className="mt-1 h-8 text-xs" />
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
