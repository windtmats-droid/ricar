import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { type TeamMember, getTeam } from "@/components/fahrzeuge/VerkaufModal";

function generateMemberId() {
  return `tm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function saveTeam(team: TeamMember[]) {
  localStorage.setItem("team", JSON.stringify(team));
}

const rolleColors: Record<string, string> = {
  "Verkäufer": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Geschäftsführer": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "Assistent": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "Sonstiges": "bg-muted text-muted-foreground",
};

const emptyForm = { vorname: "", nachname: "", rolle: "Verkäufer", email: "", telefon: "" };

export function TeamSection() {
  const [team, setTeam] = useState<TeamMember[]>(getTeam);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const persist = useCallback((updated: TeamMember[]) => {
    setTeam(updated);
    saveTeam(updated);
  }, []);

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (m: TeamMember) => {
    setForm({ vorname: m.vorname, nachname: m.nachname, rolle: m.rolle, email: m.email, telefon: m.telefon });
    setEditId(m.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.vorname.trim() || !form.nachname.trim()) return;
    if (editId) {
      persist(team.map(m => m.id === editId ? { ...m, ...form } : m));
    } else {
      persist([...team, { id: generateMemberId(), ...form }]);
    }
    setShowForm(false);
    setEditId(null);
  };

  const handleDelete = (id: string) => {
    persist(team.filter(m => m.id !== id));
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-medium text-foreground">Verkäufer / Team</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Team-Mitglieder verwalten — werden als Verkäufer im Verkaufs-Flow angezeigt</p>
        </div>
        <Button size="sm" className="gap-1.5 text-[12px] h-8" onClick={openAdd}>
          <Plus className="w-3.5 h-3.5" /> Mitglied hinzufügen
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="border border-border rounded-lg p-4 bg-muted/30 space-y-3">
          <h4 className="text-xs font-semibold text-foreground">{editId ? "Mitglied bearbeiten" : "Neues Mitglied"}</h4>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <Label className="text-[11px]">Vorname *</Label>
              <Input value={form.vorname} onChange={(e) => setForm(f => ({ ...f, vorname: e.target.value }))} className="mt-1 h-8 text-xs" />
            </div>
            <div>
              <Label className="text-[11px]">Nachname *</Label>
              <Input value={form.nachname} onChange={(e) => setForm(f => ({ ...f, nachname: e.target.value }))} className="mt-1 h-8 text-xs" />
            </div>
            <div>
              <Label className="text-[11px]">Rolle</Label>
              <Select value={form.rolle} onValueChange={(v) => setForm(f => ({ ...f, rolle: v }))}>
                <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Verkäufer">Verkäufer</SelectItem>
                  <SelectItem value="Geschäftsführer">Geschäftsführer</SelectItem>
                  <SelectItem value="Assistent">Assistent</SelectItem>
                  <SelectItem value="Sonstiges">Sonstiges</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[11px]">E-Mail</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} className="mt-1 h-8 text-xs" />
            </div>
            <div>
              <Label className="text-[11px]">Telefon</Label>
              <Input value={form.telefon} onChange={(e) => setForm(f => ({ ...f, telefon: e.target.value }))} className="mt-1 h-8 text-xs" />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <Button size="sm" className="text-xs gap-1" onClick={handleSave} disabled={!form.vorname.trim() || !form.nachname.trim()}>
              <Save className="w-3 h-3" /> Speichern
            </Button>
            <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => { setShowForm(false); setEditId(null); }}>
              <X className="w-3 h-3" /> Abbrechen
            </Button>
          </div>
        </div>
      )}

      {/* Team list */}
      {team.length === 0 && !showForm ? (
        <div className="text-center py-10 text-muted-foreground">
          <p className="text-sm">Noch keine Team-Mitglieder angelegt.</p>
          <p className="text-xs mt-1">Klicke auf „Mitglied hinzufügen", um zu starten.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {team.map((m) => (
            <div key={m.id} className="flex items-center justify-between px-4 py-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
                  {(m.vorname[0] || "").toUpperCase()}{(m.nachname[0] || "").toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-foreground">{m.vorname} {m.nachname}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {[m.email, m.telefon].filter(Boolean).join(" · ") || "Keine Kontaktdaten"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge className={`text-[10px] ${rolleColors[m.rolle] || rolleColors.Sonstiges}`}>{m.rolle}</Badge>
                <button onClick={() => openEdit(m)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(m.id)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
