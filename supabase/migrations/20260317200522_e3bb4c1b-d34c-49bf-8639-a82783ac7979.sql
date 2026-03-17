
CREATE TABLE public.marktscans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fahrzeug_id uuid REFERENCES public.fahrzeuge(id) ON DELETE SET NULL,
  scan_typ text NOT NULL DEFAULT 'manuell',
  durchschnittspreis numeric,
  min_preis numeric,
  max_preis numeric,
  anzahl_angebote integer DEFAULT 0,
  quellen_json jsonb DEFAULT '[]'::jsonb,
  ergebnis_json jsonb DEFAULT '{}'::jsonb,
  erstellt_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.suchprofile (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  fahrzeugklasse text,
  preis_von numeric,
  preis_bis numeric,
  bj_von integer,
  bj_bis integer,
  km_von integer,
  km_bis integer,
  radius_km integer DEFAULT 100,
  plz text,
  autohaus_id uuid
);

CREATE TABLE public.preisalarme (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fahrzeug_id uuid REFERENCES public.fahrzeuge(id) ON DELETE CASCADE,
  eigener_preis numeric NOT NULL,
  marktpreis numeric NOT NULL,
  differenz numeric NOT NULL,
  empfehlung text,
  status text NOT NULL DEFAULT 'aktiv',
  erstellt_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.marktscans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suchprofile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preisalarme ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view marktscans" ON public.marktscans FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create marktscans" ON public.marktscans FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can view suchprofile" ON public.suchprofile FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create suchprofile" ON public.suchprofile FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update suchprofile" ON public.suchprofile FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete suchprofile" ON public.suchprofile FOR DELETE TO authenticated USING (true);
CREATE POLICY "Authenticated users can view preisalarme" ON public.preisalarme FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can update preisalarme" ON public.preisalarme FOR UPDATE TO authenticated USING (true);
