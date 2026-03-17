export function CanvaBildCard() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-medium text-foreground mb-4">Titelbild (Canva)</h3>

      <div className="aspect-video border-2 border-dashed border-border rounded-lg bg-muted/40 flex flex-col items-center justify-center opacity-60">
        <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-primary-foreground font-bold text-sm mb-2">
          C
        </div>
        <p className="text-xs font-medium text-muted-foreground">
          Canva-Titelbild wird automatisch erstellt
        </p>
        <p className="text-[10px] text-muted-foreground mt-1 px-4 text-center">
          Nach der Veröffentlichung generiert die KI ein professionelles Titelbild
        </p>
      </div>
    </div>
  );
}
