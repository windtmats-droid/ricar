import { useState, useEffect, useRef, useCallback } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Sparkles, Send, Bot, Plus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFahrzeuge } from "@/lib/fahrzeuge-store";
import { useAppearance } from "@/hooks/useAppearance";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const WELCOME_MESSAGE = `Hallo! 👋 Ich bin dein AutoDealer KI-Assistent. Ich kenne deinen gesamten Fahrzeugbestand und helfe dir sofort weiter.

Du kannst mich zum Beispiel fragen:
• Welches Fahrzeug steht am längsten im Bestand?
• Wie hoch ist unsere durchschnittliche Marge?
• Welche Fahrzeuge haben unter 50.000 km?
• Hat der BMW 320d Apple CarPlay?
• Wie viel Kapital ist aktuell im Bestand gebunden?`;

const SUGGESTION_CHIPS = [
  { label: "🕐 Längste Standzeit", message: "Welches Fahrzeug steht am längsten im Bestand?" },
  { label: "💰 Ø Marge", message: "Wie hoch ist unsere durchschnittliche Marge?" },
  { label: "🚗 Alle Inserate", message: "Zeige mir alle inserierten Fahrzeuge." },
  { label: "📊 Kapital im Bestand", message: "Wie viel Kapital ist aktuell im Bestand gebunden?" },
  { label: "🔍 Unter 50k km", message: "Welche Fahrzeuge haben unter 50.000 km Laufleistung?" },
];

const CHAT_HISTORY_KEY = "chatHistory";
const MAX_CONTEXT_MESSAGES = 20;

function generateId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function buildSystemContext(): string {
  const fahrzeuge = JSON.parse(localStorage.getItem("fahrzeuge") || "[]");
  const autohausData = JSON.parse(localStorage.getItem("autohausData") || "{}");
  const today = new Date().toISOString().split("T")[0];

  return `Du bist ein intelligenter KI-Assistent für das Autohaus "${autohausData.firmenname || "AutoDealer"}". Du hast Zugriff auf alle aktuellen Fahrzeugdaten und antwortest immer auf Deutsch, präzise und hilfreich.

HEUTIGES DATUM: ${today}

FAHRZEUGBESTAND (${fahrzeuge.length} Fahrzeuge):
${JSON.stringify(fahrzeuge, null, 2)}

UNTERNEHMENS-DATEN:
${JSON.stringify(autohausData, null, 2)}

Berechne Standzeiten selbst (heute minus ankaufDatum in Tagen). Formatiere Preise mit € und Tausendertrennzeichen. Wenn du Fahrzeuge nennst, gib immer Marke, Modell, Baujahr und Kennzeichen an. Antworte strukturiert mit Bullet Points oder Tabellen wenn sinnvoll. Halte Antworten präzise und praxisorientiert.`;
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 max-w-[85%]">
      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
        <Bot className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Chat() {
  const { gradientStyle } = useAppearance();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fahrzeuge = getFahrzeuge();
  const bestandCount = fahrzeuge.filter((f) => f.status !== "verkauft").length;

  // Load chat history
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHAT_HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ChatMessage[];
        setMessages(parsed);
        if (parsed.some((m) => m.role === "user")) setShowChips(false);
      }
    } catch {}
  }, []);

  // Save chat history
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 96) + "px";
    }
  }, [input]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      setShowChips(false);
      setInput("");

      const userMsg: ChatMessage = {
        id: generateId(),
        role: "user",
        content: trimmed,
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setIsLoading(true);

      try {
        const contextMessages = updatedMessages
          .slice(-MAX_CONTEXT_MESSAGES)
          .map((m) => ({ role: m.role, content: m.content }));

        const systemContext = buildSystemContext();

        const { data, error } = await supabase.functions.invoke("chat-assistant", {
          body: { messages: contextMessages, systemContext },
        });

        if (error) throw error;

        const assistantMsg: ChatMessage = {
          id: generateId(),
          role: "assistant",
          content: data?.response || "Entschuldigung, ich konnte keine Antwort generieren.",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err: any) {
        console.error("Chat error:", err);
        const errorMsg: ChatMessage = {
          id: generateId(),
          role: "assistant",
          content: "⚠️ Es ist ein Fehler aufgetreten. Bitte versuche es erneut.",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setShowChips(true);
    localStorage.removeItem(CHAT_HISTORY_KEY);
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="border-b border-border bg-card px-6 py-4 flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white" style={gradientStyle}>
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[15px] font-semibold text-foreground">KI-Assistent</h1>
            <p className="text-[12px] text-muted-foreground">Frag mich alles über deinen Fahrzeugbestand</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
              {bestandCount} Fahrzeuge im Bestand
            </span>
            <Button variant="outline" size="sm" className="text-[12px] h-8 gap-1.5" onClick={clearChat}>
              <Plus className="w-3.5 h-3.5" />
              Neues Gespräch
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {/* Welcome message */}
          <div className="flex items-end gap-2 max-w-[85%]">
            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <div>
              <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 text-[13px] text-foreground">
                <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2 [&>ul]:mb-2 [&>ul]:list-disc [&>ul]:pl-4">
                  {WELCOME_MESSAGE}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* No vehicles banner */}
          {fahrzeuge.length === 0 && (
            <div className="flex items-center gap-2 bg-warning/10 border border-warning/20 rounded-lg px-4 py-3 max-w-[85%] ml-9">
              <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
              <span className="text-[12px] text-warning">
                Noch keine Fahrzeuge im Bestand — füge Fahrzeuge über Ankauf hinzu damit ich dir helfen kann.
              </span>
            </div>
          )}

          {/* Suggestion chips */}
          {showChips && (
            <div className="flex flex-wrap gap-2 ml-9">
              {SUGGESTION_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => sendMessage(chip.message)}
                  className="text-[12px] px-3 py-1.5 rounded-full border border-border bg-card hover:bg-muted text-foreground transition-colors"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          )}

          {/* Chat messages */}
          {messages.map((msg) => (
            <div key={msg.id} className={msg.role === "user" ? "flex justify-end" : "flex items-end gap-2 max-w-[85%]"}>
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              )}
              <div>
                <div
                  className={
                    msg.role === "user"
                      ? "max-w-[75%] ml-auto rounded-2xl rounded-br-sm px-4 py-3 text-[13px] text-white"
                      : "bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 text-[13px] text-foreground"
                  }
                  style={msg.role === "user" ? gradientStyle : undefined}
                >
                  {msg.role === "assistant" ? (
                    <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2 [&>ul]:mb-2 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:mb-2 [&>ol]:list-decimal [&>ol]:pl-4">
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    <span className="whitespace-pre-wrap">{msg.content}</span>
                  )}
                </div>
                <div className="text-[10px] text-muted-foreground mt-1 px-1">{formatTime(msg.timestamp)}</div>
              </div>
            </div>
          ))}

          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="border-t border-border bg-card px-6 py-3 shrink-0">
          <div className="flex items-end gap-2 max-w-4xl mx-auto">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nachricht eingeben..."
              rows={1}
              className="flex-1 resize-none rounded-xl border border-input bg-background px-4 py-2.5 text-[13px] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{ maxHeight: 96 }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 disabled:opacity-40 transition-opacity"
              style={gradientStyle}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
