import { Calendar, Gauge, Fuel, Cog, Palette, Phone, Mail, Building2 } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

interface Props {
  marke: string;
  modell: string;
  baujahr: string;
  km: string;
  kraftstoff: string;
  getriebe: string;
  farbe: string;
  inseratText: string;
  inseratPreis: string;
  fotos: string[];
}

function SpecPill({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  if (!label) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground">
      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      {label}
    </span>
  );
}

export function InseratVorschau({ marke, modell, baujahr, km, kraftstoff, getriebe, farbe, inseratText, inseratPreis, fotos }: Props) {
  const autohausRaw = localStorage.getItem("autohausData");
  const autohaus = autohausRaw ? JSON.parse(autohausRaw) : null;

  const hasData = marke.trim() || modell.trim();

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        Fahrzeugdaten eingeben, um Vorschau zu sehen
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Photo gallery */}
      {fotos.length > 0 ? (
        <div className="relative px-8">
          <Carousel className="w-full">
            <CarouselContent>
              {fotos.map((src, i) => (
                <CarouselItem key={i}>
                  <div className="aspect-[16/9] rounded-lg overflow-hidden bg-muted">
                    <img src={src} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {fotos.length > 1 && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>
          <p className="text-[10px] text-muted-foreground text-center mt-1.5">{fotos.length} Foto{fotos.length !== 1 ? "s" : ""}</p>
        </div>
      ) : (
        <div className="aspect-[16/9] rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-xs">
          Keine Fotos hochgeladen
        </div>
      )}

      {/* Title + Price */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">
          {marke} {modell} {baujahr ? `— ${baujahr}` : ""}
        </h2>
        {inseratPreis && (
          <p className="text-2xl font-bold text-primary">
            € {Number(inseratPreis).toLocaleString("de-DE")}
          </p>
        )}
      </div>

      {/* Spec pills */}
      <div className="flex flex-wrap gap-2">
        <SpecPill icon={Calendar} label={baujahr} />
        <SpecPill icon={Gauge} label={km ? `${Number(km).toLocaleString("de-DE")} km` : ""} />
        <SpecPill icon={Fuel} label={kraftstoff} />
        <SpecPill icon={Cog} label={getriebe} />
        <SpecPill icon={Palette} label={farbe} />
      </div>

      {/* Description */}
      {inseratText && (
        <div className="border-t border-border pt-4">
          <h3 className="text-xs font-semibold text-foreground mb-2">Beschreibung</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{inseratText}</p>
        </div>
      )}

      {/* Contact */}
      {autohaus && (
        <div className="border-t border-border pt-4">
          <h3 className="text-xs font-semibold text-foreground mb-3">Kontakt</h3>
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            {autohaus.firmenname && (
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                {autohaus.firmenname}
              </div>
            )}
            {autohaus.telefon && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                {autohaus.telefon}
              </div>
            )}
            {autohaus.email && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                {autohaus.email}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
