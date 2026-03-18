export function KiPerformanceBanner() {
  return (
    <div className="rounded-xl p-4 px-5 text-primary-foreground" style={{ background: "linear-gradient(135deg, var(--accent-from, #2563eb), var(--accent-to, #1e40af))" }}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wider opacity-75 mb-2">KI-Performance diesen Monat</div>
          <div className="flex items-center gap-6">
            {[
              { value: "47 Std.", label: "gespart" },
              { value: "€ 2.115", label: "Personalkosten gespart" },
              { value: "134", label: "KI-Aktionen" },
              { value: "91%", label: "Automatisierungsgrad" },
            ].map((m) => (
              <div key={m.label}>
                <div className="text-[22px] font-semibold">{m.value}</div>
                <div className="text-[11px] opacity-75">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-[12px] opacity-85 space-y-1 text-right">
          <div>Inseratstexte: 31</div>
          <div>Markt-Scans: 47</div>
          <div>VIN-Recherchen: 28</div>
          <div>Dokumente: 28</div>
        </div>
      </div>
    </div>
  );
}
