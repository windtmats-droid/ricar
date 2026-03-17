import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { AnfragenListe } from "@/components/postfach/AnfragenListe";
import { AnfrageDetail } from "@/components/postfach/AnfrageDetail";
import { SAMPLE_ANFRAGEN, type Anfrage } from "@/data/anfragen";
import { Inbox } from "lucide-react";

type FilterTab = "Alle" | "Ungelesen" | "Mobile.de" | "AutoScout24" | "E-Mail";

const Postfach = () => {
  const [anfragen, setAnfragen] = useState<Anfrage[]>(SAMPLE_ANFRAGEN);
  const [selectedId, setSelectedId] = useState<string>("a1");
  const [activeTab, setActiveTab] = useState<FilterTab>("Alle");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return anfragen.filter((a) => {
      if (activeTab === "Ungelesen" && !a.unread) return false;
      if (activeTab === "Mobile.de" && a.source !== "Mobile.de") return false;
      if (activeTab === "AutoScout24" && a.source !== "AutoScout24") return false;
      if (activeTab === "E-Mail" && a.source !== "E-Mail") return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = `${a.sender} ${a.fahrzeug} ${a.preview}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [anfragen, activeTab, search]);

  const selected = anfragen.find((a) => a.id === selectedId) || null;

  const handleMarkRead = (id: string) => {
    setAnfragen((prev) => prev.map((a) => a.id === id ? { ...a, unread: false } : a));
  };

  const handleArchive = (id: string) => {
    setAnfragen((prev) => prev.filter((a) => a.id !== id));
    if (selectedId === id) setSelectedId("");
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 min-h-screen overflow-hidden">
        {/* Left panel */}
        <AnfragenListe
          anfragen={filtered}
          selectedId={selectedId}
          onSelect={(id) => { setSelectedId(id); handleMarkRead(id); }}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          search={search}
          onSearchChange={setSearch}
          unreadCount={anfragen.filter((a) => a.unread).length}
        />

        {/* Right panel */}
        {selected ? (
          <AnfrageDetail
            anfrage={selected}
            onMarkRead={() => handleMarkRead(selected.id)}
            onArchive={() => handleArchive(selected.id)}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
              <Inbox className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-medium text-foreground">Anfrage auswählen</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Klicke links auf eine Anfrage um Details zu sehen
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Postfach;
