import { Plus, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { KiChat } from "@/hooks/useKiChats";

interface ChatSidebarProps {
  chats: KiChat[];
  activeChatId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  chatLimitReached: boolean;
}

export function ChatSidebar({ chats, activeChatId, onSelect, onCreate, onDelete, chatLimitReached }: ChatSidebarProps) {
  return (
    <div className="w-56 border-r border-border bg-card flex flex-col shrink-0">
      <div className="p-3 border-b border-border">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-[12px] h-8 gap-1.5"
          onClick={onCreate}
          disabled={chatLimitReached}
          title={chatLimitReached ? "Max. 5 Chats erreicht" : undefined}
        >
          <Plus className="w-3.5 h-3.5" />
          Neuer Chat
        </Button>
        {chatLimitReached && (
          <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
            Max. 5 Chats — lösche einen um einen neuen zu erstellen.
          </p>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelect(chat.id)}
            className={`w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12px] transition-colors group ${
              chat.id === activeChatId
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
            <span className="flex-1 truncate">{chat.titel}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(chat.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-destructive/10 hover:text-destructive transition-opacity"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </button>
        ))}
        {chats.length === 0 && (
          <p className="text-[11px] text-muted-foreground text-center py-4">Noch keine Chats</p>
        )}
      </div>
    </div>
  );
}
