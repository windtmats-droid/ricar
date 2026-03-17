import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { PhotoUploadCard } from "@/components/inserat/PhotoUploadCard";
import { FahrzeugdatenCard } from "@/components/inserat/FahrzeugdatenCard";
import { InseratstextCard } from "@/components/inserat/InseratstextCard";
import { VorschauCard } from "@/components/inserat/VorschauCard";
import { CanvaBildCard } from "@/components/inserat/CanvaBildCard";
import { AktionenCard } from "@/components/inserat/AktionenCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface FahrzeugFormData {
  marke: string;
  modell: string;
  baujahr: string;
  km: string;
  kraftstoff: string;
  getriebe: string;
  farbe: string;
  tueren: string;
  preis: string;
  vin: string;
  beschreibung: string;
  status: string;
}

const defaultForm: FahrzeugFormData = {
  marke: "",
  modell: "",
  baujahr: "",
  km: "",
  kraftstoff: "",
  getriebe: "",
  farbe: "",
  tueren: "",
  preis: "",
  vin: "",
  beschreibung: "",
  status: "Entwurf",
};

const InseratErstellen = () => {
  const [form, setForm] = useState<FahrzeugFormData>(defaultForm);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const updateField = useCallback((field: keyof FahrzeugFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handlePhotosAdded = useCallback((files: File[]) => {
    setPhotos((prev) => [...prev, ...files]);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPhotoPreviewUrls((prev) => [...prev, ...urls]);
  }, []);

  const handlePhotoRemove = useCallback((index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleSave = async (asDraft?: boolean) => {
    if (!form.marke.trim() || !form.modell.trim() || !form.preis.trim()) {
      toast({
        title: "Pflichtfelder fehlen",
        description: "Bitte Marke, Modell und Preis ausfüllen.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const status = asDraft ? "Entwurf" : form.status;

      const { data: fahrzeug, error: insertError } = await supabase
        .from("fahrzeuge")
        .insert({
          marke: form.marke.trim(),
          modell: form.modell.trim(),
          baujahr: form.baujahr ? parseInt(form.baujahr) : null,
          km: form.km ? parseInt(form.km) : null,
          kraftstoff: form.kraftstoff || null,
          getriebe: form.getriebe || null,
          farbe: form.farbe || null,
          tueren: form.tueren ? parseInt(form.tueren) : null,
          preis: parseFloat(form.preis),
          vin: form.vin || null,
          beschreibung: form.beschreibung || null,
          status,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Upload photos
      if (photos.length > 0 && fahrzeug) {
        const photoInserts = [];
        for (let i = 0; i < photos.length; i++) {
          const file = photos[i];
          const filePath = `${fahrzeug.id}/${Date.now()}-${i}-${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from("fahrzeug-fotos")
            .upload(filePath, file);

          if (uploadError) {
            console.error("Photo upload error:", uploadError);
            continue;
          }

          const { data: urlData } = supabase.storage
            .from("fahrzeug-fotos")
            .getPublicUrl(filePath);

          photoInserts.push({
            fahrzeug_id: fahrzeug.id,
            storage_url: urlData.publicUrl,
            reihenfolge: i,
          });
        }

        if (photoInserts.length > 0) {
          await supabase.from("fotos").insert(photoInserts);
        }
      }

      toast({
        title: "Inserat erfolgreich gespeichert",
        description: `${form.marke} ${form.modell} wurde als "${status}" angelegt.`,
      });
      navigate("/fahrzeuge");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unbekannter Fehler";
      toast({
        title: "Fehler beim Speichern",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Top bar */}
        <div className="mb-6">
          <h1 className="text-lg font-medium text-foreground">Inserat erstellen</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Neues Inserat anlegen und KI-Text generieren
          </p>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-[1fr_380px] gap-5">
          {/* Left column */}
          <div className="space-y-4">
            <PhotoUploadCard
              photoPreviewUrls={photoPreviewUrls}
              onPhotosAdded={handlePhotosAdded}
              onPhotoRemove={handlePhotoRemove}
            />
            <FahrzeugdatenCard form={form} updateField={updateField} />
            <InseratstextCard
              beschreibung={form.beschreibung}
              onChange={(v) => updateField("beschreibung", v)}
              fahrzeugDaten={{
                marke: form.marke,
                modell: form.modell,
                baujahr: form.baujahr,
                km: form.km,
                kraftstoff: form.kraftstoff,
                getriebe: form.getriebe,
                preis: form.preis,
              }}
            />
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <VorschauCard form={form} firstPhotoUrl={photoPreviewUrls[0]} />
            <CanvaBildCard />
            <AktionenCard
              status={form.status}
              onStatusChange={(v) => updateField("status", v)}
              onSave={() => handleSave(false)}
              onSaveDraft={() => handleSave(true)}
              saving={saving}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default InseratErstellen;
