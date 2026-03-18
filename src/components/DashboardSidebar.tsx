import {
  LayoutDashboard,
  Car,
  ShoppingCart,
  Tag,
  Users,
  ScanSearch,
  BarChart3,
  FileText,
  Zap,
  Mail,
  Settings,
  LogOut,
  Sparkles,
  Calculator,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { useAppearance } from "@/hooks/useAppearance";

const navSections = [
  {
    label: "Übersicht",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    ],
  },
  {
    label: "Künstliche Intelligenz",
    items: [
      { icon: Sparkles, label: "KI-Assistent", path: "/chat" },
    ],
  },
  {
    label: "Fahrzeugverwaltung",
    items: [
      { icon: ShoppingCart, label: "Ankauf", path: "/ankauf" },
      { icon: Car, label: "Fahrzeuge", path: "/fahrzeuge" },
      { icon: Tag, label: "Verkauf", path: "/verkauf" },
    ],
  },
  {
    label: "Kommunikation",
    items: [
      { icon: Mail, label: "Postfach", path: "/postfach", badge: "12", badgeColor: "bg-primary/10 text-primary" },
      { icon: Users, label: "Leads & CRM", path: "/leads", badge: "7", badgeColor: "bg-warning/15 text-warning" },
    ],
  },
  {
    label: "Analyse",
    items: [
      { icon: BarChart3, label: "Analytics", path: "/analytics" },
      { icon: ScanSearch, label: "Markt-Scan", path: "/markt-scan" },
    ],
  },
  {
    label: "Verwaltung",
    items: [
      { icon: FileText, label: "Dokumente", path: "/dokumente" },
      { icon: Calculator, label: "Kalkulation", path: "/kalkulation" },
      { icon: Settings, label: "Einstellungen", path: "/einstellungen" },
    ],
  },
];

export function DashboardSidebar() {
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const { logo, gradientStyle } = useAppearance();

  const displayName = profile
    ? `${profile.vorname || ""} ${profile.nachname || ""}`.trim() || profile.email || "Benutzer"
    : "Benutzer";

  const initials = profile
    ? `${(profile.vorname || "")[0] || ""}${(profile.nachname || "")[0] || ""}`.toUpperCase() || "U"
    : "U";

  const rolleLabel = profile?.rolle === "chef" ? "Chef" : "Verkäufer";

  return (
    <aside className="w-[210px] h-screen bg-card border-r border-border flex flex-col shrink-0 overflow-y-auto">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-2.5">
        {logo ? (
          <img src={logo} alt="Logo" className="h-10 w-auto max-w-[140px] object-contain" />
        ) : (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={gradientStyle}>
            <Zap className="w-4 h-4" />
          </div>
        )}
        {!logo && <span className="text-[15px] font-semibold text-foreground">AutoDealer KI</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-2 space-y-5">
        {navSections.map((section) => (
          <div key={section.label}>
            <div className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {section.label}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] transition-colors relative",
                      isActive
                        ? "text-white font-medium border-l-[3px] border-white/30 pl-2"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    style={isActive ? { background: "linear-gradient(to right, var(--accent-from, #2563eb), var(--accent-to, #1e40af))" } : undefined}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", item.badgeColor)}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-medium text-foreground truncate">{displayName}</div>
            <div className="text-[10px] text-muted-foreground">{rolleLabel}</div>
          </div>
        </div>
        <button
          onClick={signOut}
          className="mt-2.5 w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Abmelden
        </button>
      </div>
    </aside>
  );
}
