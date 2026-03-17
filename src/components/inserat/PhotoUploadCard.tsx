import { useCallback, useRef } from "react";
import { Upload, X } from "lucide-react";

interface Props {
  photoPreviewUrls: string[];
  onPhotosAdded: (files: File[]) => void;
  onPhotoRemove: (index: number) => void;
}

export function PhotoUploadCard({ photoPreviewUrls, onPhotosAdded, onPhotoRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (files.length) onPhotosAdded(files);
    },
    [onPhotosAdded]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length) onPhotosAdded(files);
      e.target.value = "";
    },
    [onPhotosAdded]
  );

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-medium text-foreground mb-4">Fahrzeugfotos</h3>

      {/* Drop zone */}
      <div
        className="border-2 border-dashed border-border rounded-lg bg-muted/50 p-8 text-center cursor-pointer hover:border-primary/40 transition-colors"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-foreground font-medium">
          Fotos hier ablegen oder klicken zum Auswählen
        </p>
        <p className="text-[11px] text-muted-foreground mt-1">
          JPG, PNG · max. 20 MB pro Datei · bis zu 30 Fotos
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Preview thumbnails */}
      {photoPreviewUrls.length > 0 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          {photoPreviewUrls.map((url, i) => (
            <div key={i} className="relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-border bg-muted">
              <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={(e) => { e.stopPropagation(); onPhotoRemove(i); }}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-foreground/70 flex items-center justify-center hover:bg-foreground/90 transition-colors"
              >
                <X className="w-3 h-3 text-background" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Placeholder thumbnails when no photos */}
      {photoPreviewUrls.length === 0 && (
        <div className="flex gap-2 mt-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="w-20 h-20 rounded-lg bg-muted border border-border" />
          ))}
        </div>
      )}
    </div>
  );
}
