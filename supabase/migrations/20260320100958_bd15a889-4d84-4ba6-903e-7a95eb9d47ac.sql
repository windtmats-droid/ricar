
CREATE TABLE public.ki_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  autohaus_id uuid,
  erstellt_von uuid NOT NULL,
  titel text NOT NULL DEFAULT 'Neuer Chat',
  nachrichten jsonb NOT NULL DEFAULT '[]'::jsonb,
  erstellt_at timestamptz NOT NULL DEFAULT now(),
  aktualisiert_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ki_chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chats"
  ON public.ki_chats FOR SELECT TO authenticated
  USING (erstellt_von = auth.uid());

CREATE POLICY "Users can create own chats"
  ON public.ki_chats FOR INSERT TO authenticated
  WITH CHECK (erstellt_von = auth.uid());

CREATE POLICY "Users can update own chats"
  ON public.ki_chats FOR UPDATE TO authenticated
  USING (erstellt_von = auth.uid());

CREATE POLICY "Users can delete own chats"
  ON public.ki_chats FOR DELETE TO authenticated
  USING (erstellt_von = auth.uid());

CREATE TRIGGER update_ki_chats_updated_at
  BEFORE UPDATE ON public.ki_chats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
