-- Add consent logging to skin_scans
ALTER TABLE skin_scans ADD COLUMN IF NOT EXISTS consent_version TEXT DEFAULT 'v1.0';
ALTER TABLE skin_scans ADD COLUMN IF NOT EXISTS consented_at TIMESTAMPTZ DEFAULT NOW();

COMMENT ON COLUMN skin_scans.consent_version IS 'Version of privacy consent accepted at time of scan';
COMMENT ON COLUMN skin_scans.consented_at IS 'Timestamp when the user consented to the specific scan';
