-- LuxEvents Migration 001: booking_enabled + analytics
-- Run in: Supabase Dashboard > SQL Editor > New Query

ALTER TABLE providers
  ADD COLUMN IF NOT EXISTS booking_enabled boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS contact_email   text,
  ADD COLUMN IF NOT EXISTS contact_phone   text;

CREATE TABLE IF NOT EXISTS provider_analytics (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id uuid NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  event_type  text NOT NULL CHECK (event_type IN (
    'profile_view','contact_click','book_click',
    'website_click','phone_click','instagram_click'
  )),
  session_id  text,
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pa_provider ON provider_analytics(provider_id);
CREATE INDEX IF NOT EXISTS idx_pa_created  ON provider_analytics(created_at);

ALTER TABLE provider_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can track events"
  ON provider_analytics FOR INSERT WITH CHECK (true);

CREATE POLICY "Providers read own analytics"
  ON provider_analytics FOR SELECT
  USING (
    provider_id IN (SELECT id FROM providers WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

UPDATE providers SET commission_rate = 0.10 WHERE subscription_plan = 'starter';
UPDATE providers SET commission_rate = 0.07 WHERE subscription_plan = 'professional';
