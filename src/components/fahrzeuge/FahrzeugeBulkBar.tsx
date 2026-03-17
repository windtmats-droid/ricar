import { Button } from "@/components/ui/button";

interface Props {
  count: number;
  onArchive: () => void;
  onClear: () => void;
}

export function FahrzeugeBulkBar({ count, onArchive, onClear }: Props) {
  return (
    <div className="bg-card border border-border border-t-2 border-t-primary rounded-lg px-4 py-2.5 flex items-center gap-3 mb-3">
      <span className="text-xs font-medium text-foreground">{count} Inserate ausgewählt</span>
      <div className="flex-1" />
      <Button variant="outline" size="sm" className="text-xs h-7">Status ändern</Button>
      <Button variant="outline" size="sm" className="text-xs h-7" onClick={onArchive}>Archivieren</Button>
      <Button variant="ghost" size="sm" className="text-xs h-7" onClick={onClear}>Auswahl aufheben</Button>
    </div>
  );
}
