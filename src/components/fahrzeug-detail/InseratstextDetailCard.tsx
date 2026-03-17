import { useState } from "react";
import { Pencil, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  beschreibung: string | null;
  onSave: (text: string) => void;
}

export function InseratstextDetailCard({ beschreibung, onSave }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(beschreibung || "");

  const handleSave = () => {
    onSave(draft);
    setEditing(false);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">Inseratstext</h3>
          <Badge variant="info" className="text-[9px] px-1.5 py-0">KI</Badge>
        </div>
        {!editing && beschreibung && (
          <button
            onClick={() => { setDraft(beschreibung || ""); setEditing(true); }}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {editing ? (
        <div>
          <Textarea
            rows={6}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="resize-none text-sm"
          />
          <div className="flex gap-2 mt-3 justify-end">
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setEditing(false)}>
              Abbrechen
            </Button>
            <Button size="sm" className="text-xs" onClick={handleSave}>
              Speichern
            </Button>
          </div>
        </div>
      ) : beschreibung ? (
        <p className="text-sm text-foreground leading-[1.8]">{beschreibung}</p>
      ) : (
        <div className="text-center py-6">
          <p className="text-xs text-muted-foreground mb-3">Noch kein Inseratstext vorhanden</p>
          <Button variant="outline" size="sm" disabled className="text-xs gap-1.5 opacity-60 cursor-not-allowed">
            <Sparkles className="w-3.5 h-3.5" />
            KI-Text generieren
            <Badge variant="secondary" className="text-[9px] px-1.5 py-0 ml-1">Bald verfügbar</Badge>
          </Button>
        </div>
      )}
    </div>
  );
}
