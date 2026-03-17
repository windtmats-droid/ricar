import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  beschreibung: string | null;
  onSave: (text: string) => void;
  isEditing?: boolean;
  editBeschreibung?: string;
  onEditBeschreibungChange?: (text: string) => void;
}

export function InseratstextDetailCard({ beschreibung, onSave, isEditing, editBeschreibung, onEditBeschreibungChange }: Props) {
  // Legacy standalone editing (when not in page-level edit mode)
  const [localEditing, setLocalEditing] = useState(false);
  const [localDraft, setLocalDraft] = useState(beschreibung || "");

  const handleLocalSave = () => {
    onSave(localDraft);
    setLocalEditing(false);
  };

  // Page-level edit mode
  if (isEditing && onEditBeschreibungChange !== undefined) {
    return (
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-medium text-foreground">Inseratstext</h3>
          <Badge variant="info" className="text-[9px] px-1.5 py-0">KI</Badge>
        </div>
        <Textarea
          rows={6}
          value={editBeschreibung ?? ""}
          onChange={(e) => onEditBeschreibungChange(e.target.value)}
          className="resize-none text-sm"
          placeholder="Inseratstext eingeben..."
        />
      </div>
    );
  }

  // Read-only / local edit mode
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">Inseratstext</h3>
          <Badge variant="info" className="text-[9px] px-1.5 py-0">KI</Badge>
        </div>
      </div>

      {localEditing ? (
        <div>
          <Textarea rows={6} value={localDraft} onChange={(e) => setLocalDraft(e.target.value)} className="resize-none text-sm" />
          <div className="flex gap-2 mt-3 justify-end">
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setLocalEditing(false)}>Abbrechen</Button>
            <Button size="sm" className="text-xs" onClick={handleLocalSave}>Speichern</Button>
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
