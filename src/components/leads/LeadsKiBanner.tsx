import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeadsKiBannerProps {
  priorityNames: string[];
  onShowDetails: () => void;
}

export function LeadsKiBanner({ priorityNames, onShowDetails }: LeadsKiBannerProps) {
  return (
    <div className="mb-4 rounded-[10px] px-[18px] py-[14px] flex items-center justify-between gap-4"
      style={{ background: "linear-gradient(135deg, hsl(211, 72%, 37%) 0%, hsl(211, 60%, 50%) 100%)" }}>
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-white/70">KI-Tagesempfehlung</div>
          <div className="text-[15px] font-medium text-white mt-0.5">
            {priorityNames.length} Leads sollten heute priorisiert werden
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {priorityNames.map((name) => (
          <span key={name} className="px-2.5 py-1 rounded-full bg-white/20 text-white text-[11px] font-medium">
            {name}
          </span>
        ))}
        <Button variant="outline" size="sm" onClick={onShowDetails} className="ml-2 border-white/40 text-white bg-transparent hover:bg-white/10 text-[12px] h-8">
          Details anzeigen
        </Button>
        <span className="ml-1 px-2 py-0.5 rounded-full bg-white text-primary text-[10px] font-semibold">KI</span>
      </div>
    </div>
  );
}
