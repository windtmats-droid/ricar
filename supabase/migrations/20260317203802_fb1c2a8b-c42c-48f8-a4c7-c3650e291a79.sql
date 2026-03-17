
CREATE TABLE public.dokumente (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fahrzeug_id UUID REFERENCES public.fahrzeuge(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  typ TEXT NOT NULL DEFAULT 'kaufvertrag',
  dok_nummer TEXT NOT NULL DEFAULT '',
  kaeufer_json JSONB DEFAULT '{}'::jsonb,
  verkaufspreis NUMERIC DEFAULT 0,
  zahlungsart TEXT DEFAULT 'Überweisung',
  uebergabedatum DATE DEFAULT CURRENT_DATE,
  gewaehrleistung TEXT DEFAULT 'Keine',
  bemerkungen TEXT,
  pdf_url TEXT,
  status TEXT NOT NULL DEFAULT 'entwurf',
  erstellt_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  autohaus_id UUID
);

ALTER TABLE public.dokumente ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view dokumente" ON public.dokumente FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create dokumente" ON public.dokumente FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update dokumente" ON public.dokumente FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete dokumente" ON public.dokumente FOR DELETE TO authenticated USING (true);
