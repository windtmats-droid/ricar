
CREATE TABLE public.kalkulationen (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fahrzeug_id UUID REFERENCES public.fahrzeuge(id) ON DELETE SET NULL,
  ankaufspreis NUMERIC NOT NULL DEFAULT 0,
  aufbereitungskosten_json JSONB DEFAULT '[]'::jsonb,
  provision_prozent NUMERIC DEFAULT 0,
  ueberfuehrung NUMERIC DEFAULT 0,
  marge_prozent NUMERIC DEFAULT 15,
  mindestpreis NUMERIC DEFAULT 0,
  empfohlener_vk NUMERIC DEFAULT 0,
  markt_avg NUMERIC,
  notizen TEXT,
  erstellt_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  autohaus_id UUID
);

ALTER TABLE public.kalkulationen ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view kalkulationen" ON public.kalkulationen FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create kalkulationen" ON public.kalkulationen FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update kalkulationen" ON public.kalkulationen FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete kalkulationen" ON public.kalkulationen FOR DELETE TO authenticated USING (true);
