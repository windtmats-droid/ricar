import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface Props {
  marke: string;
  modell: string;
  baujahr: string;
  km: string;
  kraftstoff: string;
  inseratPreis: string;
  fotos: string[];
}

export function SocialMediaVorschau({ marke, modell, baujahr, km, kraftstoff, inseratPreis, fotos }: Props) {
  const [copied, setCopied] = useState(false);

  const autohausRaw = localStorage.getItem("autohausData");
  const autohaus = autohausRaw ? JSON.parse(autohausRaw) : null;
  const logoRaw = localStorage.getItem("uploadedLogo");

  const hasData = marke.trim() || modell.trim();
  const priceStr = inseratPreis ? `${Number(inseratPreis).toLocaleString("de-DE")} €` : "";
  const kmStr = km ? `${Number(km).toLocaleString("de-DE")} km` : "";

  const caption = [
    `🚗 ${marke} ${modell}`.trim(),
    [baujahr ? `${baujahr}` : "", kmStr, priceStr].filter(Boolean).join(" | "),
    "🔥 Jetzt anfragen!",
    autohaus?.telefon || "",
    `#autohaus #gebrauchtwagen${marke ? ` #${marke.toLowerCase().replace(/\s/g, "")}` : ""}`,
  ]
    .filter(Boolean)
    .join(baujahr || km || inseratPreis ? " — " : " ")
    .replace(" — 🔥", "\n🔥")
    .replace(" — #", "\n#");

  const formattedCaption = `🚗 ${marke} ${modell}`.trim() +
    (baujahr || kmStr || priceStr ? ` — ${[baujahr, kmStr, priceStr].filter(Boolean).join(" | ")}` : "") +
    `\n🔥 Jetzt anfragen!${autohaus?.telefon ? ` ${autohaus.telefon}` : ""}` +
    `\n#autohaus #gebrauchtwagen${marke ? ` #${marke.toLowerCase().replace(/\s/g, "")}` : ""}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedCaption);
    setCopied(true);
    toast.success("Caption kopiert!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        Fahrzeugdaten eingeben, um Social-Media-Vorschau zu sehen
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-foreground">Instagram / Social Media Post</h3>

      {/* Square card */}
      <div className="relative aspect-square max-w-[360px] mx-auto rounded-xl overflow-hidden bg-muted shadow-lg">
        {/* Background */}
        {fotos[0] ? (
          <img src={fotos[0]} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30" />
        )}

        {/* Dark gradient overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Logo top-right */}
        {logoRaw && (
          <div className="absolute top-3 right-3 w-10 h-10 rounded-full overflow-hidden bg-background/80 p-1 shadow-md">
            <img src={logoRaw} alt="Logo" className="w-full h-full object-contain" />
          </div>
        )}

        {/* Bottom overlay content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          {/* Spec pills */}
          <div className="flex flex-wrap gap-1.5">
            {kmStr && (
              <span className="rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium text-white">
                {kmStr}
              </span>
            )}
            {baujahr && (
              <span className="rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium text-white">
                {baujahr}
              </span>
            )}
            {kraftstoff && (
              <span className="rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium text-white">
                {kraftstoff}
              </span>
            )}
          </div>

          {/* Title + Price */}
          <div>
            <p className="text-white font-semibold text-base leading-tight drop-shadow-md">
              {marke} {modell}
            </p>
            {priceStr && (
              <p className="text-white/90 font-bold text-xl mt-0.5 drop-shadow-md">
                {priceStr}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Caption */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-foreground">Caption</h4>
        <div className="bg-muted rounded-lg p-3 text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
          {formattedCaption}
        </div>
        <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 text-xs h-8">
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Kopiert!" : "Caption kopieren"}
        </Button>
      </div>
    </div>
  );
}
