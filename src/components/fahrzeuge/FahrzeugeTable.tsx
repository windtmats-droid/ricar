import { Pencil, Eye, Archive, AlertTriangle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export interface FahrzeugRow {
  id: string;
  marke: string;
  modell: string;
  baujahr: number | null;
  kraftstoff: string | null;
  getriebe: string | null;
  preis: number;
  km: number | null;
  status: string;
  vin: string | null;
  created_at: string;
  foto_url: string | null;
  standzeit: number;
}
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
  rows: FahrzeugRow[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleAll: (checked: boolean) => void;
  onArchive: (id: string) => void;
  allSelected: boolean;
}

const statusConfig: Record<string, { bg: string; text: string }> = {
  Aktiv: { bg: "bg-success/15", text: "text-success" },
  Entwurf: { bg: "bg-muted", text: "text-muted-foreground" },
  Archiviert: { bg: "bg-destructive/10", text: "text-destructive" },
};

function StandzeitCell({ days }: { days: number }) {
  const color = days <= 20 ? "text-success" : days <= 30 ? "text-warning" : "text-destructive";
  return (
    <span className={cn("text-xs font-medium flex items-center gap-1", color)}>
      {days} T.
      {days > 30 && <AlertTriangle className="w-3 h-3" />}
    </span>
  );
}

export function FahrzeugeTable({ rows, selectedIds, onToggleSelect, onToggleAll, onArchive, allSelected }: Props) {
  const navigate = useNavigate();

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="w-10 px-3 py-3">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(c) => onToggleAll(!!c)}
              />
            </th>
            <th className="text-[11px] uppercase text-muted-foreground font-semibold tracking-wider text-left px-3 py-3 w-14">Foto</th>
            <th className="text-[11px] uppercase text-muted-foreground font-semibold tracking-wider text-left px-3 py-3">Inserat</th>
            <th className="text-[11px] uppercase text-muted-foreground font-semibold tracking-wider text-left px-3 py-3 w-24">Status</th>
            <th className="text-[11px] uppercase text-muted-foreground font-semibold tracking-wider text-right px-3 py-3 w-28">Preis</th>
            <th className="text-[11px] uppercase text-muted-foreground font-semibold tracking-wider text-right px-3 py-3 w-28">Kilometer</th>
            <th className="text-[11px] uppercase text-muted-foreground font-semibold tracking-wider text-right px-3 py-3 w-24">Standzeit</th>
            <th className="text-[11px] uppercase text-muted-foreground font-semibold tracking-wider text-right px-3 py-3 w-28">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const sc = statusConfig[row.status] || statusConfig.Entwurf;
            const subtitleParts = [row.baujahr, row.kraftstoff, row.getriebe].filter(Boolean);
            return (
              <tr
                key={row.id}
                onClick={() => navigate(`/fahrzeuge/${row.id}`)}
                className="border-b border-border last:border-0 h-14 group hover:bg-[hsl(216,20%,97%)] transition-colors cursor-pointer"
              >
                <td className="px-3" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.has(row.id)}
                    onCheckedChange={() => onToggleSelect(row.id)}
                  />
                </td>
                <td className="px-3">
                  <div className="w-[52px] h-10 rounded-md bg-muted border border-border overflow-hidden">
                    {row.foto_url ? (
                      <img src={row.foto_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                  </div>
                </td>
                <td className="px-3">
                  <div className="text-[13px] font-medium text-foreground">{row.marke} {row.modell}</div>
                  {subtitleParts.length > 0 && (
                    <div className="text-[11px] text-muted-foreground">{subtitleParts.join(" · ")}</div>
                  )}
                </td>
                <td className="px-3">
                  <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full", sc.bg, sc.text)}>
                    {row.status}
                  </span>
                </td>
                <td className="px-3 text-right text-[13px] font-medium text-foreground">
                  € {row.preis.toLocaleString("de-DE")}
                </td>
                <td className="px-3 text-right text-[13px] text-muted-foreground">
                  {row.km ? `${row.km.toLocaleString("de-DE")} km` : "–"}
                </td>
                <td className="px-3 text-right">
                  <StandzeitCell days={row.standzeit} />
                </td>
                <td className="px-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => navigate(`/fahrzeuge/${row.id}/bearbeiten`)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => navigate(`/fahrzeuge/${row.id}`)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Inserat archivieren?</AlertDialogTitle>
                          <AlertDialogDescription>
                            {row.marke} {row.modell} wird als archiviert markiert. Dies kann jederzeit rückgängig gemacht werden.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onArchive(row.id)}>Archivieren</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
