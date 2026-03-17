import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useAuth } from "@/components/auth/AuthProvider";
import { Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnalyticsKPIs } from "@/components/analytics/AnalyticsKPIs";
import { KiPerformanceBanner } from "@/components/analytics/KiPerformanceBanner";
import { UmsatzChart } from "@/components/analytics/UmsatzChart";
import { ConversionFunnel } from "@/components/analytics/ConversionFunnel";
import { StandzeitAnalyse } from "@/components/analytics/StandzeitAnalyse";
import { AnfragenQuelle } from "@/components/analytics/AnfragenQuelle";
import { TeamPerformance } from "@/components/analytics/TeamPerformance";
import { MeistverkaufteMarken } from "@/components/analytics/MeistverkaufteMarken";
import { KiZeitersparnis } from "@/components/analytics/KiZeitersparnis";

const periods = ["Diese Woche", "Diesen Monat", "Dieses Jahr"] as const;

const Analytics = () => {
  const [period, setPeriod] = useState<string>("Diesen Monat");

  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar />
      <main className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[18px] font-medium text-foreground">Analytics</h1>
            <p className="text-[13px] text-muted-foreground">Geschäftsentwicklung und KI-Performance im Überblick</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-muted rounded-lg p-0.5">
              {periods.map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 text-[12px] rounded-md transition-colors ${
                    period === p
                      ? "bg-card text-foreground font-medium shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" className="text-[12px] gap-1.5">
              <Download className="w-3.5 h-3.5" /> Export
            </Button>
            <Button variant="outline" size="sm" className="text-[12px] gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Bericht per E-Mail
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <AnalyticsKPIs />
          <KiPerformanceBanner />

          <div className="grid grid-cols-[3fr_2fr] gap-4">
            <UmsatzChart />
            <ConversionFunnel />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StandzeitAnalyse />
            <AnfragenQuelle />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TeamPerformance />
            <MeistverkaufteMarken />
          </div>

          <KiZeitersparnis />
        </div>
      </main>
    </div>
  );
};

export default Analytics;
