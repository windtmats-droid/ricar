import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FahrzeugDaten {
  marke: string;
  modell: string;
  baujahr: string;
  km: string;
  kraftstoff: string;
  getriebe: string;
  preis: string;
}

interface Props {
  beschreibung: string;
  onChange: (value: string) => void;
  getFormData?: () => FahrzeugDaten;
}

export function InseratstextCard({ beschreibung, onChange, getFormData }: Props) {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!getFormData) return;
    const daten = getFormData();
    console.log("Sending to edge function:", JSON.stringify(daten, null, 2));
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-description", {
        body: daten,
      });
      console.log("Edge function raw response:", JSON.stringify(data));
      if (error) {
        alert("Edge Function Fehler: " + JSON.stringify(error));
        throw error;
      }
      if (!data) {
        alert("Keine Antwort von der Edge Function erhalten (data ist null/undefined)");
        return;
      }
      const text = data?.beschreibung;
      if (text) {
        onChange(text);
      } else {
        alert("Kein 'beschreibung' Feld in Antwort. Erhaltene Daten: " + JSON.stringify(data).substring(0, 500));
      }
    } catch (err) {
      console.error("KI-Beschreibung Fehler:", err);
      alert("Fehler beim Generieren: " + (err instanceof Error ? err.message : JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-medium text-foreground mb-4">Inseratstext</h3>

      <Textarea
        rows={5}
        value={beschreibung}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Beschreibung manuell eingeben oder per KI generieren lassen..."
        className="resize-none"
      />

      <Button
        variant="outline"
        disabled={loading}
        onClick={handleGenerate}
        className="w-full mt-3 text-xs gap-1.5"
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
        {loading ? "Wird generiert…" : "KI-Beschreibung generieren"}
      </Button>

      <p className="text-[11px] text-muted-foreground mt-2">
        Die KI erstellt automatisch einen professionellen Inseratstext auf Basis der Fahrzeugdaten und Fotos
      </p>
    </div>
  );
}
