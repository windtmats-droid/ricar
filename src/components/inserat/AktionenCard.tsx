import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  status: string;
  onStatusChange: (value: string) => void;
  onSave: () => void;
  onSaveDraft: () => void;
  saving: boolean;
}

export function AktionenCard({ status, onStatusChange, onSave, onSaveDraft, saving }: Props) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-medium text-foreground mb-4">Veröffentlichen</h3>

      <div className="space-y-1.5 mb-4">
        <Label className="text-[12px] font-medium text-foreground">Status</Label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["Entwurf", "Aktiv", "Archiviert"].map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Button className="w-full" onClick={onSave} disabled={saving}>
          {saving ? "Speichert…" : "Inserat speichern"}
        </Button>
        <Button variant="outline" className="w-full" onClick={onSaveDraft} disabled={saving}>
          Als Entwurf speichern
        </Button>
      </div>

      <p className="text-[11px] text-muted-foreground mt-3">
        Das Inserat kann nach dem Speichern jederzeit bearbeitet werden
      </p>
    </div>
  );
}
