import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { FahrzeugDetailHeader } from "@/components/fahrzeug-detail/FahrzeugDetailHeader";
import { Fotogalerie } from "@/components/fahrzeug-detail/Fotogalerie";
import { FahrzeugDatenCard, type FahrzeugEditData } from "@/components/fahrzeug-detail/FahrzeugDatenCard";
import { InseratstextDetailCard } from "@/components/fahrzeug-detail/InseratstextDetailCard";
import { AusstattungCard } from "@/components/fahrzeug-detail/AusstattungCard";
import { SchnellinfoCard } from "@/components/fahrzeug-detail/SchnellinfoCard";
import { MarktvergleichCard } from "@/components/fahrzeug-detail/MarktvergleichCard";
import { VerlaufCard } from "@/components/fahrzeug-detail/VerlaufCard";
import { DetailAktionenCard } from "@/components/fahrzeug-detail/DetailAktionenCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";

const SAMPLE_FAHRZEUG = {
  id: "sample",
  marke: "BMW",
  modell: "320d",
  baujahr: 2021,
  km: 68000,
  kraftstoff: "Diesel",
  getriebe: "Automatik",
  farbe: "Schwarz Metallic",
  tueren: 4,
  preis: 28500,
  vin: "WBA3A5C50DF595596",
  beschreibung: "Gepflegter BMW 320d mit umfangreicher Ausstattung. Scheckheftgepflegt, Nichtraucherfahrzeug. LED-Scheinwerfer, Navigationssystem Professional, Sportsitze mit Lederausstattung, Park Distance Control vorne und hinten, Rückfahrkamera.",
  status: "Aktiv",
  autohaus_id: null,
  created_by: null,
  created_at: new Date(Date.now() - 24 * 86400000).toISOString(),
  updated_at: new Date(Date.now() - 12 * 86400000).toISOString(),
  ausstattung_json: {
    Sicherheit: ["ABS", "ESP", "6 Airbags", "Spurhalteassistent", "Notbremsassistent"],
    Komfort: ["Klimaautomatik", "Sitzheizung", "Lederausstattung", "Elektrische Sitze", "Tempomat"],
    Infotainment: ["Navigation Professional", "Apple CarPlay", "Bluetooth", "DAB+ Radio", "Harman Kardon"],
    Exterieur: ["LED-Scheinwerfer", "M Sportpaket", "18\" Alufelgen", "PDC vorne/hinten", "Rückfahrkamera"],
  },
};

const SAMPLE_FOTOS: string[] = [];

const SAMPLE_VERLAUF = [
  { beschreibung: "Inserat erstellt", created_at: new Date(Date.now() - 24 * 86400000).toISOString() },
  { beschreibung: "KI-Text generiert", created_at: new Date(Date.now() - 24 * 86400000).toISOString() },
  { beschreibung: "Preis geändert: €29.500 → €28.500", created_at: new Date(Date.now() - 12 * 86400000).toISOString() },
  { beschreibung: "3 Anfragen erhalten", created_at: new Date(Date.now() - 7 * 86400000).toISOString() },
];

const FahrzeugDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<FahrzeugEditData | null>(null);
  const [editBeschreibung, setEditBeschreibung] = useState("");

  const isValidUuid = id ? /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) : false;

  const { data: fahrzeug, isLoading } = useQuery({
    queryKey: ["fahrzeug", id],
    queryFn: async () => {
      if (!id || !isValidUuid) return null;
      const { data, error } = await supabase
        .from("fahrzeuge")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id && isValidUuid,
  });

  const { data: fotos = [] } = useQuery({
    queryKey: ["fahrzeug-fotos", id],
    queryFn: async () => {
      if (!id || !isValidUuid) return [];
      const { data, error } = await supabase
        .from("fotos")
        .select("*")
        .eq("fahrzeug_id", id)
        .order("reihenfolge", { ascending: true });
      if (error) throw error;
      return (data || []).map((f) => f.storage_url);
    },
    enabled: !!id && isValidUuid,
  });

  const { data: verlauf = [] } = useQuery({
    queryKey: ["ki-aktionen", id],
    queryFn: async () => {
      if (!id || !isValidUuid) return [];
      const { data, error } = await supabase
        .from("ki_aktionen")
        .select("beschreibung, created_at")
        .eq("fahrzeug_id", id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!id && isValidUuid,
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: Record<string, unknown>) => {
      if (!id) throw new Error("No ID");
      const { error } = await supabase.from("fahrzeuge").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fahrzeug", id] });
      queryClient.invalidateQueries({ queryKey: ["fahrzeuge"] });
    },
    onError: (err: Error) => {
      toast({ title: "Fehler", description: err.message, variant: "destructive" });
    },
  });

  const handleArchive = () => {
    updateMutation.mutate({ status: "Archiviert" }, {
      onSuccess: () => {
        toast({ title: "Fahrzeug archiviert" });
        navigate("/fahrzeuge");
      },
    });
  };

  const handleSetDraft = () => {
    updateMutation.mutate({ status: "Entwurf" }, {
      onSuccess: () => toast({ title: "Status auf Entwurf gesetzt" }),
    });
  };

  const handleSaveBeschreibung = (text: string) => {
    updateMutation.mutate({ beschreibung: text }, {
      onSuccess: () => toast({ title: "Inseratstext gespeichert" }),
    });
  };

  // Use DB data or fallback to sample
  const f = fahrzeug || SAMPLE_FAHRZEUG;
  const photoUrls = fotos.length > 0 ? fotos : SAMPLE_FOTOS;
  const timeline = verlauf.length > 0 ? verlauf : SAMPLE_VERLAUF;
  const standzeit = Math.floor((Date.now() - new Date(f.created_at).getTime()) / 86400000);
  const ausstattung = (f as Record<string, unknown>).ausstattung_json as Record<string, string[]> | null;

  if (isLoading) {
    return (
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 p-6 flex items-center justify-center overflow-y-auto">
          <div className="text-sm text-muted-foreground">Laden…</div>
        </main>
      </div>
    );
  }

  if (!fahrzeug && id && id !== "sample") {
    // No DB record found, show sample
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <FahrzeugDetailHeader
          marke={f.marke}
          modell={f.modell}
          baujahr={f.baujahr}
          status={f.status}
          id={id || "sample"}
          onArchive={handleArchive}
        />

        <div className="grid grid-cols-[1fr_380px] gap-5 mt-5">
          {/* Left column */}
          <div className="space-y-4">
            <Fotogalerie photos={photoUrls} />
            <FahrzeugDatenCard fahrzeug={f} standzeit={standzeit} />
            <InseratstextDetailCard
              beschreibung={f.beschreibung}
              onSave={handleSaveBeschreibung}
            />
            <AusstattungCard ausstattung={ausstattung} />
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <SchnellinfoCard standzeit={standzeit} preis={f.preis} />
            <MarktvergleichCard />
            <VerlaufCard items={timeline} />
            <DetailAktionenCard
              id={id || "sample"}
              onSetDraft={handleSetDraft}
              onArchive={handleArchive}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default FahrzeugDetail;
