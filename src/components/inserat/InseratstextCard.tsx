import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

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

const WEBHOOK_URL = "http://91.99.97.102:5678/webhook/5e77672c-77e2-4941-8b13-436cefbf51a6";

export function InseratstextCard({ beschreibung, onChange, getFormData }: Props) {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!getFormData) return;
    const daten = getFormData();
    console.log("KI-Request Daten:", daten);
    setLoading(true);
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(daten),
      });
      const data = await res.json();
      const text = data?.content?.[0]?.text;
      if (text) onChange(text);
    } catch (err) {
      console.error("KI-Beschreibung Fehler:", err);
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
