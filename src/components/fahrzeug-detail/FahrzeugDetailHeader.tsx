import { ArrowLeft, Pencil, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
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

const statusConfig: Record<string, { bg: string; text: string }> = {
  Aktiv: { bg: "bg-success/15", text: "text-success" },
  Entwurf: { bg: "bg-muted", text: "text-muted-foreground" },
  Archiviert: { bg: "bg-destructive/10", text: "text-destructive" },
};

interface Props {
  marke: string;
  modell: string;
  baujahr: number | null;
  status: string;
  id: string;
  onArchive: () => void;
}

export function FahrzeugDetailHeader({ marke, modell, baujahr, status, id, onArchive }: Props) {
  const navigate = useNavigate();
  const sc = statusConfig[status] || statusConfig.Entwurf;

  return (
    <div>
      <button
        onClick={() => navigate("/fahrzeuge")}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Fahrzeuge
      </button>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-medium text-foreground">
            {marke} {modell} {baujahr || ""}
          </h1>
          <span className={cn("text-[11px] font-medium px-2.5 py-0.5 rounded-full", sc.bg, sc.text)}>
            {status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1.5"
            onClick={() => navigate(`/fahrzeuge/${id}/bearbeiten`)}
          >
            <Pencil className="w-3.5 h-3.5" /> Bearbeiten
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10"
              >
                <Archive className="w-3.5 h-3.5" /> Archivieren
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Fahrzeug archivieren?</AlertDialogTitle>
                <AlertDialogDescription>
                  {marke} {modell} wird als archiviert markiert.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                <AlertDialogAction onClick={onArchive}>Archivieren</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
