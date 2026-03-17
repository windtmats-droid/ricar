import type { FahrzeugFormData } from "@/pages/InseratErstellen";

interface Props {
  form: FahrzeugFormData;
  firstPhotoUrl?: string;
}

export function VorschauCard({ form, firstPhotoUrl }: Props) {
  const hasData = form.marke.trim() || form.modell.trim();

  const subtitleParts = [
    form.baujahr,
    form.km ? `${Number(form.km).toLocaleString("de-DE")} km` : "",
    form.kraftstoff,
  ].filter(Boolean);

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-medium text-foreground mb-4">Vorschau</h3>

      <div className="border border-border rounded-lg min-h-[200px] overflow-hidden">
        {!hasData ? (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground text-xs">
            Vorschau erscheint nach Dateneingabe
          </div>
        ) : (
          <div>
            {/* Photo */}
            <div className="aspect-[16/9] bg-muted">
              {firstPhotoUrl ? (
                <img src={firstPhotoUrl} alt="Vorschau" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                  Kein Foto
                </div>
              )}
            </div>
            {/* Info */}
            <div className="p-3.5">
              <h4 className="text-base font-medium text-foreground">
                {form.marke} {form.modell}
              </h4>
              {subtitleParts.length > 0 && (
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  {subtitleParts.join(" · ")}
                </p>
              )}
              {form.preis && (
                <p className="text-xl font-medium text-primary mt-2">
                  € {Number(form.preis).toLocaleString("de-DE")}
                </p>
              )}
              {form.beschreibung && (
                <p className="text-[12px] text-muted-foreground mt-2 line-clamp-3">
                  {form.beschreibung.slice(0, 100)}
                  {form.beschreibung.length > 100 && "…"}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
