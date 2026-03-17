import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { KiSavings } from "@/components/dashboard/KiSavings";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { StandzeitChart } from "@/components/dashboard/StandzeitChart";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar />
      <main className="flex-1 p-6 overflow-auto">
        <DashboardTopBar />
        <div className="space-y-6">
          <MetricCards />
          <KiSavings />
          <div className="grid grid-cols-[3fr_2fr] gap-3">
            <ActivityFeed />
            <StandzeitChart />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
