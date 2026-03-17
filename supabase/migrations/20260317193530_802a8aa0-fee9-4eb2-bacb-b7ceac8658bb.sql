
-- Add ausstattung_json column to fahrzeuge
ALTER TABLE public.fahrzeuge
ADD COLUMN ausstattung_json JSONB;

-- Create ki_aktionen table
CREATE TABLE public.ki_aktionen (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fahrzeug_id UUID REFERENCES public.fahrzeuge(id) ON DELETE CASCADE,
  aktion_typ TEXT NOT NULL,
  beschreibung TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ki_aktionen ENABLE ROW LEVEL SECURITY;

-- RLS policies for ki_aktionen (all authenticated users)
CREATE POLICY "Authenticated users can view ki_aktionen"
  ON public.ki_aktionen FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create ki_aktionen"
  ON public.ki_aktionen FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can delete ki_aktionen"
  ON public.ki_aktionen FOR DELETE TO authenticated USING (true);
