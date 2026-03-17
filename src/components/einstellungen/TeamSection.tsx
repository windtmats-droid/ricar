import { Pencil, Trash2, Plus, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const TEAM = [
  { name: "Thomas Müller", email: "t.mueller@autohaus.de", rolle: "Verkäufer", status: "Aktiv", isOwner: false },
  { name: "Max Mustermann", email: "m.mustermann@autohaus.de", rolle: "Chef", status: "Aktiv", isOwner: true },
];

const PENDING = [
  { email: "anna.schmidt@autohaus.de" },
];

export function TeamSection() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-medium text-foreground">Team verwalten</h3>
        <Button size="sm" className="gap-1.5 text-[12px] h-8"><Plus className="w-3.5 h-3.5" />Mitarbeiter einladen</Button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-9">Name</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-9">E-Mail</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-9">Rolle</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-9">Status</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-9 w-24">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TEAM.map((m) => (
              <TableRow key={m.email} className="h-11">
                <TableCell className="text-[12px] font-medium py-2">{m.name}</TableCell>
                <TableCell className="text-[12px] text-muted-foreground py-2">{m.email}</TableCell>
                <TableCell className="py-2"><Badge variant="info" className="text-[10px]">{m.rolle}</Badge></TableCell>
                <TableCell className="py-2"><Badge variant="success" className="text-[10px]">{m.status}</Badge></TableCell>
                <TableCell className="py-2">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                    {!m.isOwner && <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {PENDING.map((p) => (
              <TableRow key={p.email} className="h-11">
                <TableCell className="text-[12px] text-muted-foreground italic py-2" colSpan={2}>{p.email}</TableCell>
                <TableCell className="py-2" colSpan={2}><Badge variant="warning" className="text-[10px]">Einladung ausstehend</Badge></TableCell>
                <TableCell className="py-2">
                  <button className="text-[11px] text-primary hover:underline flex items-center gap-1">
                    <RotateCw className="w-3 h-3" />Erneut senden
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
