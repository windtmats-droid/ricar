import { useRef } from "react";
import { Palette, Sun, Moon, Upload, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppearance, GRADIENT_OPTIONS, type AccentGradient } from "@/hooks/useAppearance";

export function ErscheinungsbildSection() {
  const { darkMode, setDarkMode, accent, setAccent, logo, uploadLogo, removeLogo } = useAppearance();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadLogo(file);
    e.target.value = "";
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-6">
      <div className="flex items-center gap-2">
        <Palette className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-[14px] font-medium text-foreground">Erscheinungsbild</h3>
      </div>

      {/* Dark Mode */}
      <div className="space-y-2">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Darstellungsmodus</div>
        <div className="flex items-center justify-between bg-muted/50 rounded-lg px-4 py-3">
          <div className="flex items-center gap-2.5">
            {darkMode ? <Moon className="w-4 h-4 text-muted-foreground" /> : <Sun className="w-4 h-4 text-warning" />}
            <span className="text-[13px] text-foreground">{darkMode ? "Dunkler Modus" : "Heller Modus"}</span>
          </div>
          <Switch checked={darkMode} onCheckedChange={setDarkMode} />
        </div>
      </div>

      {/* Accent Gradient */}
      <div className="space-y-2">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Akzentfarbe</div>
        <div className="flex gap-3 flex-wrap">
          {GRADIENT_OPTIONS.map((g) => (
            <button
              key={g.key}
              onClick={() => setAccent(g.key)}
              className={cn(
                "w-10 h-10 rounded-lg transition-all bg-gradient-to-br",
                g.classes,
                accent === g.key
                  ? "ring-2 ring-offset-2 ring-foreground/40 scale-110"
                  : "hover:scale-105 opacity-80 hover:opacity-100"
              )}
              title={g.label}
            />
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground">
          Wird auf Sidebar-Header, Buttons und Badges angewendet
        </p>
      </div>

      {/* Logo Upload */}
      <div className="space-y-2">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Logo</div>
        {logo ? (
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-lg border border-border bg-muted flex items-center justify-center overflow-hidden">
              <img src={logo} alt="Logo" className="max-w-full max-h-full object-contain" />
            </div>
            <Button variant="outline" size="sm" className="text-[12px] h-8 gap-1.5" onClick={removeLogo}>
              <X className="w-3.5 h-3.5" />
              Entfernen
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-lg border-2 border-dashed border-border bg-muted/50 flex items-center justify-center">
              <Upload className="w-5 h-5 text-muted-foreground/50" />
            </div>
            <Button variant="outline" size="sm" className="text-[12px] h-8 gap-1.5" onClick={() => fileRef.current?.click()}>
              <Upload className="w-3.5 h-3.5" />
              Logo hochladen
            </Button>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleFile} />
        <p className="text-[11px] text-muted-foreground">PNG oder JPG, max. 2 MB. Wird oben links in der Sidebar angezeigt.</p>
      </div>
    </div>
  );
}
