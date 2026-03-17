
CREATE TABLE public.einstellungen (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  autohaus_id uuid,
  profil_json jsonb DEFAULT '{}'::jsonb,
  mobilede_user text,
  mobilede_pw_encrypted text,
  mobilede_kundennr text,
  autoscout_api_key text,
  autoscout_partner_id text,
  n8n_webhook_url text,
  benachrichtigungen_json jsonb DEFAULT '{"neue_anfrage": true, "preisalarm": true, "markt_scan_bericht": true, "lead_erinnerung": false, "standzeit_warnung": true}'::jsonb,
  scan_config_json jsonb DEFAULT '{"aktiv": true, "uhrzeit": "06:00", "email_bericht": true, "email": "", "radius_km": 100, "quellen": {"mobile": true, "autoscout": true, "ebay": false}}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.einstellungen ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view einstellungen" ON public.einstellungen FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create einstellungen" ON public.einstellungen FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update einstellungen" ON public.einstellungen FOR UPDATE TO authenticated USING (true);
