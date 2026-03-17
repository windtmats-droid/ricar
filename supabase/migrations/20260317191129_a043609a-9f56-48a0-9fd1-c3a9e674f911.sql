
-- Create fahrzeuge table
CREATE TABLE public.fahrzeuge (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  marke TEXT NOT NULL,
  modell TEXT NOT NULL,
  baujahr INTEGER,
  km INTEGER,
  kraftstoff TEXT,
  getriebe TEXT,
  farbe TEXT,
  tueren INTEGER,
  preis NUMERIC NOT NULL,
  vin TEXT,
  beschreibung TEXT,
  status TEXT NOT NULL DEFAULT 'Entwurf',
  autohaus_id UUID,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create fotos table
CREATE TABLE public.fotos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fahrzeug_id UUID NOT NULL REFERENCES public.fahrzeuge(id) ON DELETE CASCADE,
  storage_url TEXT NOT NULL,
  reihenfolge INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fahrzeuge ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fotos ENABLE ROW LEVEL SECURITY;

-- RLS policies for fahrzeuge (all authenticated users can CRUD)
CREATE POLICY "Authenticated users can view fahrzeuge"
  ON public.fahrzeuge FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create fahrzeuge"
  ON public.fahrzeuge FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update fahrzeuge"
  ON public.fahrzeuge FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete fahrzeuge"
  ON public.fahrzeuge FOR DELETE TO authenticated USING (true);

-- RLS policies for fotos
CREATE POLICY "Authenticated users can view fotos"
  ON public.fotos FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create fotos"
  ON public.fotos FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update fotos"
  ON public.fotos FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete fotos"
  ON public.fotos FOR DELETE TO authenticated USING (true);

-- Storage bucket for vehicle photos
INSERT INTO storage.buckets (id, name, public) VALUES ('fahrzeug-fotos', 'fahrzeug-fotos', true);

-- Storage policies
CREATE POLICY "Authenticated users can upload vehicle photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'fahrzeug-fotos');

CREATE POLICY "Anyone can view vehicle photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'fahrzeug-fotos');

CREATE POLICY "Authenticated users can delete vehicle photos"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'fahrzeug-fotos');

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_fahrzeuge_updated_at
  BEFORE UPDATE ON public.fahrzeuge
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
