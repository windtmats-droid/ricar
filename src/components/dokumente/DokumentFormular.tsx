import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import type { DokumentData, KaeuferData } from "@/pages/Dokumente";

interface Fahrzeug { id: string; marke: string; modell: string; baujahr: number | null; preis: number }
interface Lead { id: string; sender_name: string; sender_email: string | null; sender_phone: string | null }

interface Props {
  data: DokumentData;
  update: (p: Partial<DokumentData>) => void;
  updateKaeufer: (p: Partial<KaeuferData>) => void;
}

export function DokumentFormular({ data, update, updateKaeufer }: Props) {
  const [fahrzeuge, setFahrzeuge] = useState<Fahrzeug[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    supabase.from("fahrzeuge").select("id, marke, modell, baujahr, preis").then(({ data: d }) => {
      if (d) setFahrzeuge(d);
    });
  }, []);

  useEffect(() => {
    if (!data.fahrzeugId) return;
    supabase.from("leads").select("id, sender_name, sender_email, sender_phone").eq("fahrzeug_id", data.fahrzeugId).then(({ data: d }) => {
      if (d) setLeads(d);
    });
  }, [data.fahrzeugId]);

  const selectFahrzeug = (id: string) => {
    const f = fahrzeuge.find((x) => x.id === id);
    if (f) {
      update({
        fahrzeugId: id,
        fahrzeugLabel: `${f.marke} ${f.modell} ${f.baujahr || ""}`,
        fahrzeugPreis: Number(f.preis),
        verkaufspreis: Number(f.preis),
      });
    }
  };

  const selectLead = (id: string) => {
    const l = leads.find((x) => x.id === id);
    if (l) {
      const parts = l.sender_name.split(" ");
      updateKaeufer({
        vorname: parts[0] || "",
        nachname: parts.slice(1).join(" ") || "",
        email: l.sender_email || "",
        telefon: l.sender_phone || "",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-[14px] font-medium">Inserat & Käufer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Fahrzeug */}
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Inserat</div>
          <Select value={data.fahrzeugId || ""} onValueChange={selectFahrzeug}>
            <SelectTrigger className="h-9 text-[13px]"><SelectValue placeholder="Inserat auswählen..." /></SelectTrigger>
            <SelectContent>
              {fahrzeuge.map((f) => (
                <SelectItem key={f.id} value={f.id} className="text-[13px]">
                  {f.marke} {f.modell} {f.baujahr || ""} · € {Number(f.preis).toLocaleString("de-DE")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {data.fahrzeugId && data.fahrzeugLabel && (
            <div className="mt-2 flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
              <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center text-primary text-[11px] font-semibold">
                {data.fahrzeugLabel.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="text-[13px] font-medium text-foreground">{data.fahrzeugLabel}</div>
                <div className="text-[11px] text-muted-foreground">€ {data.fahrzeugPreis.toLocaleString("de-DE")}</div>
              </div>
            </div>
          )}
        </div>

        {/* Käufer */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Käufer</div>
            {leads.length > 0 && (
              <Select onValueChange={selectLead}>
                <SelectTrigger className="h-7 w-auto text-[11px] text-primary border-none bg-transparent px-1 gap-1">
                  <SelectValue placeholder="Aus Leads laden" />
                </SelectTrigger>
                <SelectContent>
                  {leads.map((l) => (
                    <SelectItem key={l.id} value={l.id} className="text-[12px]">{l.sender_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-[11px]">Vorname</Label><Input value={data.kaeufer.vorname} onChange={(e) => updateKaeufer({ vorname: e.target.value })} className="h-9 text-[13px]" /></div>
            <div><Label className="text-[11px]">Nachname</Label><Input value={data.kaeufer.nachname} onChange={(e) => updateKaeufer({ nachname: e.target.value })} className="h-9 text-[13px]" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div><Label className="text-[11px]">Straße</Label><Input value={data.kaeufer.strasse} onChange={(e) => updateKaeufer({ strasse: e.target.value })} className="h-9 text-[13px]" /></div>
            <div><Label className="text-[11px]">Hausnummer</Label><Input value={data.kaeufer.hausnummer} onChange={(e) => updateKaeufer({ hausnummer: e.target.value })} className="h-9 text-[13px]" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div><Label className="text-[11px]">PLZ</Label><Input value={data.kaeufer.plz} onChange={(e) => updateKaeufer({ plz: e.target.value })} className="h-9 text-[13px]" maxLength={5} /></div>
            <div><Label className="text-[11px]">Stadt</Label><Input value={data.kaeufer.stadt} onChange={(e) => updateKaeufer({ stadt: e.target.value })} className="h-9 text-[13px]" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div><Label className="text-[11px]">Telefon</Label><Input value={data.kaeufer.telefon} onChange={(e) => updateKaeufer({ telefon: e.target.value })} className="h-9 text-[13px]" /></div>
            <div><Label className="text-[11px]">E-Mail</Label><Input value={data.kaeufer.email} onChange={(e) => updateKaeufer({ email: e.target.value })} className="h-9 text-[13px]" /></div>
          </div>
          <div className="mt-2">
            <Label className="text-[11px]">Geburtsdatum</Label>
            <Input type="date" value={data.kaeufer.geburtsdatum} onChange={(e) => updateKaeufer({ geburtsdatum: e.target.value })} className="h-9 text-[13px]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
