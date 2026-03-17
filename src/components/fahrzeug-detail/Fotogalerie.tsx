import { useState } from "react";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

interface Props {
  photos: string[];
}

export function Fotogalerie({ photos }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-medium text-foreground mb-4">Fotogalerie</h3>
        <div className="w-full h-[200px] bg-muted rounded-[10px] flex flex-col items-center justify-center text-muted-foreground">
          <ImageIcon className="w-10 h-10 mb-2 opacity-40" />
          <span className="text-xs">Keine Fotos vorhanden</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-medium text-foreground mb-4">Fotogalerie</h3>

      {/* Main photo */}
      <div className="relative w-full max-h-[280px] rounded-[10px] overflow-hidden bg-muted">
        <img
          src={photos[activeIndex]}
          alt={`Foto ${activeIndex + 1}`}
          className="w-full h-[280px] object-cover"
        />
        <span className="absolute top-3 right-3 bg-foreground/60 text-background text-[10px] font-medium px-2 py-0.5 rounded-full">
          {activeIndex + 1} / {photos.length} Fotos
        </span>
      </div>

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {photos.map((url, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "w-[72px] h-14 rounded-md overflow-hidden shrink-0 border-2 transition-colors",
                i === activeIndex ? "border-primary" : "border-transparent hover:border-border"
              )}
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
