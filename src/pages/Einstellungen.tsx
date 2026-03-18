import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { IntegrationenSection } from "@/components/einstellungen/IntegrationenSection";
import { TeamSection } from "@/components/einstellungen/TeamSection";
import { AutoScanSection } from "@/components/einstellungen/AutoScanSection";
import { ErscheinungsbildSection } from "@/components/einstellungen/ErscheinungsbildSection";
import { AutohausDatenSection } from "@/components/einstellungen/AutohausDatenSection";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "erscheinungsbild", label: "Erscheinungsbild" },
  { key: "autohaus", label: "Autohaus-Daten" },
  { key: "integrationen", label: "Integrationen" },
  { key: "team", label: "Team & Rollen" },
  { key: "autoscan", label: "Auto-Scan" },
] as const;

type TabKey = typeof TABS[number]["key"];

const Einstellungen = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("erscheinungsbild");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ["einstellungen"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("einstellungen")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (updates: Record<string, any>) => {
      if (settings?.id) {
        const { error } = await supabase.from("einstellungen").update(updates).eq("id", settings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("einstellungen").insert(updates);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["einstellungen"] });
      toast({ title: "Gespeichert" });
    },
    onError: (err: Error) => {
      toast({ title: "Fehler", description: err.message, variant: "destructive" });
    },
  });

  const scanConfig = (settings?.scan_config_json as any) || {};

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="mb-5">
          <h1 className="text-[18px] font-medium text-foreground">Einstellungen</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Verbindungen und Team verwalten</p>
        </div>

        <div className="flex gap-5">
          <div className="w-[220px] shrink-0">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "w-full text-left px-4 py-3 text-[13px] transition-colors border-l-[3px]",
                    activeTab === tab.key
                      ? "bg-accent text-accent-foreground font-medium border-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground border-transparent"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {activeTab === "erscheinungsbild" && <ErscheinungsbildSection />}
            {activeTab === "integrationen" && (
              <IntegrationenSection
                mobilede={{ user: settings?.mobilede_user || "", pw: settings?.mobilede_pw_encrypted || "", kundennr: settings?.mobilede_kundennr || "" }}
                n8nUrl={settings?.n8n_webhook_url || ""}
                onSaveMobilede={(d) => saveMutation.mutate({ mobilede_user: d.user, mobilede_pw_encrypted: d.pw, mobilede_kundennr: d.kundennr })}
                onSaveN8n={(url) => saveMutation.mutate({ n8n_webhook_url: url })}
              />
            )}
            {activeTab === "team" && <TeamSection />}
            {activeTab === "autoscan" && (
              <AutoScanSection config={scanConfig} onSave={(c) => saveMutation.mutate({ scan_config_json: c })} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Einstellungen;
