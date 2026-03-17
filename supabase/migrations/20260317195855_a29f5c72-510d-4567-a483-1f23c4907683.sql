
CREATE TABLE public.leads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_name text NOT NULL,
  sender_email text,
  sender_phone text,
  fahrzeug_id uuid REFERENCES public.fahrzeuge(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'Neu',
  quelle text NOT NULL DEFAULT 'E-Mail',
  prioritaet text NOT NULL DEFAULT 'Mittel',
  notizen jsonb DEFAULT '[]'::jsonb,
  ki_zusammenfassung text,
  erstellt_at timestamp with time zone NOT NULL DEFAULT now(),
  letzte_aktivitaet_at timestamp with time zone NOT NULL DEFAULT now(),
  anfrage_id uuid
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view leads" ON public.leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create leads" ON public.leads FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update leads" ON public.leads FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete leads" ON public.leads FOR DELETE TO authenticated USING (true);
