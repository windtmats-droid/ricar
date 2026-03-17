import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

interface Props {
  items: { beschreibung: string; created_at: string }[];
}

export function VerlaufCard({ items }: Props) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-medium text-foreground mb-4">Verlauf</h3>

      <div className="space-y-0">
        {items.map((item, i) => (
          <div key={i} className="flex gap-3 relative pb-4 last:pb-0">
            {/* Timeline line */}
            {i < items.length - 1 && (
              <div className="absolute left-[5px] top-3 w-px h-full bg-border" />
            )}
            {/* Dot */}
            <div className="w-[11px] h-[11px] rounded-full bg-border border-2 border-card mt-0.5 shrink-0 z-10" />
            <div className="min-w-0">
              <div className="text-[12px] text-foreground">{item.beschreibung}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: de })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
