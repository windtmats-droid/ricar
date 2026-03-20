import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import type { Json } from "@/integrations/supabase/types";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface KiChat {
  id: string;
  autohaus_id: string | null;
  erstellt_von: string;
  titel: string;
  nachrichten: ChatMessage[];
  erstellt_at: string;
  aktualisiert_at: string;
}

const MAX_CHATS = 5;

export function useKiChats() {
  const { user, profile } = useAuth();
  const [chats, setChats] = useState<KiChat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatLimitReached, setChatLimitReached] = useState(false);

  const autohausId = profile?.autohaus_name ?? null;

  const loadChats = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("ki_chats")
      .select("*")
      .eq("erstellt_von", user.id)
      .order("aktualisiert_at", { ascending: false });

    if (data) {
      const mapped: KiChat[] = data.map((row) => ({
        ...row,
        nachrichten: (row.nachrichten as unknown as ChatMessage[]) || [],
      }));
      setChats(mapped);
      setChatLimitReached(mapped.length >= MAX_CHATS);
      if (!activeChatId && mapped.length > 0) {
        setActiveChatId(mapped[0].id);
      }
    }
    setLoading(false);
  }, [user, activeChatId]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  const createChat = useCallback(async (): Promise<string | null> => {
    if (!user) return null;

    // Check per-user limit
    const { count } = await supabase
      .from("ki_chats")
      .select("*", { count: "exact", head: true })
      .eq("erstellt_von", user.id);

    if ((count ?? 0) >= MAX_CHATS) {
      setChatLimitReached(true);
      return null;
    }

    const { data, error } = await supabase
      .from("ki_chats")
      .insert({
        autohaus_id: null,
        erstellt_von: user.id,
        titel: "Neuer Chat",
        nachrichten: [] as unknown as Json,
      })
      .select()
      .single();

    if (error || !data) return null;

    const newChat: KiChat = {
      ...data,
      nachrichten: [],
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setChatLimitReached((count ?? 0) + 1 >= MAX_CHATS);
    return newChat.id;
  }, [user]);

  const updateChatMessages = useCallback(
    async (chatId: string, messages: ChatMessage[], titel?: string) => {
      const updatePayload: Record<string, unknown> = {
        nachrichten: messages as unknown as Json,
      };
      if (titel) updatePayload.titel = titel;

      await supabase
        .from("ki_chats")
        .update(updatePayload)
        .eq("id", chatId)
        .eq("erstellt_von", user?.id ?? "");

      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? { ...c, nachrichten: messages, ...(titel ? { titel } : {}), aktualisiert_at: new Date().toISOString() }
            : c
        )
      );
    },
    [user]
  );

  const deleteChat = useCallback(
    async (chatId: string) => {
      if (!user) return;
      await supabase
        .from("ki_chats")
        .delete()
        .eq("id", chatId)
        .eq("erstellt_von", user.id);

      setChats((prev) => {
        const remaining = prev.filter((c) => c.id !== chatId);
        setChatLimitReached(remaining.length >= MAX_CHATS);
        return remaining;
      });

      if (activeChatId === chatId) {
        setActiveChatId((prev) => {
          const remaining = chats.filter((c) => c.id !== chatId);
          return remaining.length > 0 ? remaining[0].id : null;
        });
      }
    },
    [user, activeChatId, chats]
  );

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null;

  return {
    chats,
    activeChat,
    activeChatId,
    setActiveChatId,
    loading,
    chatLimitReached,
    createChat,
    updateChatMessages,
    deleteChat,
  };
}
