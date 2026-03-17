import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Anfrage } from "@/data/anfragen";

type FilterTab = "Alle" | "Ungelesen" | "Mobile.de" | "AutoScout24" | "E-Mail";
const TABS: FilterTab[] = ["Alle", "Ungelesen", "Mobile.de", "AutoScout24", "E-Mail"];

const sourceColor: Record<string, string> = {
  "Mobile.de": "bg-primary/10 text-primary",
  "AutoScout24": "bg-warning/15 text-warning",
  "E-Mail": "bg-muted text-muted-foreground",
};

const bewertungColor: Record<string, string> = {
  Hoch: "bg-success/15 text-success",
  Mittel: "bg-warning/15 text-warning",
  Niedrig: "bg-muted text-muted-foreground",
};

interface Props {
  anfragen: Anfrage[];
  selectedId: string;
  onSelect: (id: string) => void;
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  search: string;
  onSearchChange: (v: string) => void;
  unreadCount: number;
}

export function AnfragenListe({
  anfragen, selectedId, onSelect, activeTab, onTabChange, search, onSearchChange, unreadCount,
}: Props) {
  return (
    <div className="w-[320px] bg-card border-r border-border flex flex-col shrink-0">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-medium text-foreground">Postfach</h2>
          <Badge variant="info" className="text-[10px]">{unreadCount} neu</Badge>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={cn(
                "text-[11px] px-2.5 py-1 rounded-full font-medium transition-colors",
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Anfrage suchen..."
            className="h-9 pl-8 text-xs"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {anfragen.length === 0 && (
          <div className="text-center py-8 text-xs text-muted-foreground">Keine Anfragen gefunden</div>
        )}
        {anfragen.map((a) => (
          <button
            key={a.id}
            onClick={() => onSelect(a.id)}
            className={cn(
              "w-full text-left px-3.5 py-3 border-b border-border/50 transition-colors relative",
              selectedId === a.id
                ? "bg-accent border-l-2 border-l-primary"
                : "hover:bg-muted/50"
            )}
          >
            {/* Unread dot */}
            {a.unread && (
              <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
            )}

            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className={cn("text-[13px] truncate", a.unread ? "font-medium text-foreground" : "text-foreground")}>
                    {a.sender}
                  </span>
                  <span className={cn("text-[9px] font-medium px-1.5 py-0.5 rounded-full shrink-0", sourceColor[a.source])}>
                    {a.source}
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{a.fahrzeug}</div>
                <div className="text-[12px] text-muted-foreground mt-1 truncate">{a.preview}</div>
              </div>
              <div className="text-right shrink-0 ml-2">
                <div className="text-[11px] text-muted-foreground">{a.timestamp}</div>
              </div>
            </div>

            <div className="flex justify-end mt-1.5">
              <span className={cn("text-[9px] font-medium px-1.5 py-0.5 rounded-full", bewertungColor[a.bewertung])}>
                {a.bewertung}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
