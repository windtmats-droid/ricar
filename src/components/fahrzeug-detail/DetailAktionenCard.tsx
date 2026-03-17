import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
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
  id: string;
  onSetDraft: () => void;
  onArchive: () => void;
}

export function DetailAktionenCard({ id, onSetDraft, onArchive }: Props) {
  const navigate = useNavigate();

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-medium text-foreground mb-4">Aktionen</h3>

      <div className="space-y-2">
        <Button className="w-full text-xs" onClick={() => navigate(`/inserate/neu?id=${id}`)}>
          Inserat bearbeiten
        </Button>
        <Button variant="outline" className="w-full text-xs" onClick={onSetDraft}>
          Als Entwurf setzen
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full text-xs border-destructive/40 text-destructive hover:bg-destructive/10"
            >
              Archivieren
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Fahrzeug archivieren?</AlertDialogTitle>
              <AlertDialogDescription>Das Fahrzeug wird als archiviert markiert.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
              <AlertDialogAction onClick={onArchive}>Archivieren</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Separator className="my-4" />

      <Button
        variant="outline"
        className="w-full text-xs"
        onClick={() => navigate(`/leads?fahrzeug=${id}`)}
      >
        Zur Lead-Übersicht
      </Button>
    </div>
  );
}
