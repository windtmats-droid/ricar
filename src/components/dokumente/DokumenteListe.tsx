import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ClipboardList, Receipt, Download, Trash2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GeneratedDocument {
  id: string;
  typ: "kaufvertrag" | "uebergabe" | "rechnung";
  nummer: string;
  kunde: string;
  datum: string;
  pdfData: string;
}

interface Props {
  docs: GeneratedDocument[];
  onDelete: (id: string) => void;
}

const typeConfig = {
  kaufvertrag: { icon: FileText, label: "Kaufvertrag", color: "text-primary" },
  uebergabe: { icon: ClipboardList, label: "Übergabeprotokoll", color: "text-amber-600" },
  rechnung: { icon: Receipt, label: "Rechnung", color: "text-emerald-600" },
};

export function DokumenteListe({ docs, onDelete }: Props) {
  const openPdf = (pdfData: string) => {
    const win = window.open();
    if (win) {
      win.document.write(`<iframe width="100%" height="100%" src="${pdfData}" style="border:none; position:absolute; inset:0;"></iframe>`);
    }
  };

  const downloadPdf = (doc: GeneratedDocument) => {
    const link = document.createElement("a");
    link.href = doc.pdfData;
    link.download = `${doc.nummer}.pdf`;
    link.click();
  };

  return (
    <Card className="h-fit sticky top-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-[14px] font-medium">Erstellte Dokumente</CardTitle>
        <p className="text-[11px] text-muted-foreground">{docs.length} Dokument{docs.length !== 1 ? "e" : ""}</p>
      </CardHeader>
      <CardContent className="space-y-0">
        {docs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-[12px]">Noch keine Dokumente erstellt</p>
          </div>
        )}
        {docs.map((doc) => {
          const cfg = typeConfig[doc.typ];
          const Icon = cfg.icon;
          return (
            <div key={doc.id} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={cn("w-4 h-4 shrink-0", cfg.color)} />
                <div className="min-w-0">
                  <div className="text-[13px] font-medium text-foreground truncate">{cfg.label} {doc.nummer}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{doc.kunde} · {doc.datum}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openPdf(doc.pdfData)} title="Vorschau">
                  <Eye className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => downloadPdf(doc)} title="Download">
                  <Download className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDelete(doc.id)} title="Löschen">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
