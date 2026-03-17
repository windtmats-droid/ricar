import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Settings } from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { ScanKonfiguration } from "@/components/markt-scan/ScanKonfiguration";
import { ScanErgebnis } from "@/components/markt-scan/ScanErgebnis";
import { AutoScanTab } from "@/components/markt-scan/AutoScanTab";
import { supabase } from "@/integrations/supabase/client";

const SAMPLE_FAHRZEUGE = [
  { id: "s1", marke: "BMW", modell: "320d", baujahr: 2021 },
  { id: "s2", marke: "Audi", modell: "A4 Avant", baujahr: 2020 },
  { id: "s3", marke: "VW", modell: "Golf 8 GTI", baujahr: 2022 },
  { id: "s4", marke: "Mercedes", modell: "C200", baujahr: 2019 },
  { id: "s5", marke: "Opel", modell: "Insignia", baujahr: 2018 },
];

const MarktScan = () => {
  const [activeTab, setActiveTab] = useState<"manuell" | "auto">("manuell");

  const { data: dbFahrzeuge = [] } = useQuery({
    queryKey: ["fahrzeuge-select"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fahrzeuge")
        .select("id, marke, modell, baujahr")
        .order("marke");
      if (error) throw error;
      return data || [];
    },
  });

  const fahrzeuge = dbFahrzeuge.length > 0 ? dbFahrzeuge : SAMPLE_FAHRZEUGE;

  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar />
      <main className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-[18px] font-medium text-foreground">Markt-Scan</h1>
            <p className="text-[13px] text-muted-foreground mt-0.5">Marktpreise analysieren und Bestand optimieren</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-[hsl(122,39%,34%)]" />
              Letzter Auto-Scan: heute 06:00 Uhr
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 text-[12px] h-8">
              <Settings className="w-3.5 h-3.5" />
              Auto-Scan Einstellungen
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 bg-muted rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab("manuell")}
            className={`px-4 py-2 rounded-md text-[13px] font-medium transition-colors ${
              activeTab === "manuell" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Manueller Scan
          </button>
          <button
            onClick={() => setActiveTab("auto")}
            className={`px-4 py-2 rounded-md text-[13px] font-medium transition-colors ${
              activeTab === "auto" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Täglicher Auto-Scan
          </button>
        </div>

        {/* Content */}
        {activeTab === "manuell" ? (
          <div className="grid grid-cols-[2fr_3fr] gap-4">
            <ScanKonfiguration fahrzeuge={fahrzeuge} />
            <ScanErgebnis showResult={true} />
          </div>
        ) : (
          <AutoScanTab />
        )}
      </main>
    </div>
  );
};

export default MarktScan;
