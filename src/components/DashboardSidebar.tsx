import {
  LayoutDashboard,
  Car,
  PlusSquare,
  Users,
  ScanSearch,
  BarChart3,
  Calculator,
  FileText,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navSections = [
  {
    label: "Hauptmenü",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", active: true },
      { icon: Car, label: "Fahrzeuge", badge: "34", badgeColor: "bg-primary/10 text-primary" },
      { icon: PlusSquare, label: "Inserat erstellen" },
      { icon: Users, label: "Leads & CRM", badge: "7", badgeColor: "bg-warning/15 text-warning" },
    ],
  },
  {
    label: "Analyse",
    items: [
      { icon: ScanSearch, label: "Markt-Scan" },
      { icon: BarChart3, label: "Analytics" },
    ],
  },
  {
    label: "Verwaltung",
    items: [
      { icon: Calculator, label: "Kalkulation" },
      { icon: FileText, label: "Dokumente" },
    ],
  },
];

export function DashboardSidebar() {
  return (
    <aside className="w-[210px] min-h-screen bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Zap className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="text-[15px] font-semibold text-foreground">AutoDealer KI</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-2 space-y-5">
        {navSections.map((section) => (
          <div key={section.label}>
            <div className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {section.label}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <button
                  key={item.label}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] transition-colors relative",
                    item.active
                      ? "bg-accent text-accent-foreground font-medium border-l-[3px] border-primary pl-2"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", item.badgeColor)}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="px-4 py-4 border-t border-border flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
          TM
        </div>
        <div className="min-w-0">
          <div className="text-[12px] font-medium text-foreground truncate">Thomas Müller</div>
          <div className="text-[10px] text-muted-foreground">Verkäufer</div>
        </div>
      </div>
    </aside>
  );
}
