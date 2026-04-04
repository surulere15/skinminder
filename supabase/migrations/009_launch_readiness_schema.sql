-- Launch Readiness Schema Upgrades
ALTER TABLE skin_scans ADD COLUMN IF NOT EXISTS face_hash TEXT;
ALTER TABLE skin_scans ADD COLUMN IF NOT EXISTS brightness_score NUMERIC;
ALTER TABLE skin_scans ADD COLUMN IF NOT EXISTS sharpness_score NUMERIC;
ALTER TABLE skin_scans ADD COLUMN IF NOT EXISTS tilt_angle NUMERIC;
ALTER TABLE skin_scans ADD COLUMN IF NOT EXISTS face_coverage NUMERIC;
ALTER TABLE skin_scans ADD COLUMN IF NOT EXISTS device_info JSONB;
ALTER TABLE skin_scans ADD COLUMN IF NOT EXISTS face_box_coordinates JSONB;
ALTER TABLE skin_scans ADD COLUMN IF NOT EXISTS skin_archetype TEXT;
ALTER TABLE skin_scans ADD COLUMN IF NOT EXISTS interpretation_raw JSONB;
ALTER TABLE skin_scans ADD COLUMN IF NOT EXISTS skin_regional_metrics JSONB;
ALTER TABLE skin_scans ADD COLUMN IF NOT EXISTS environmental_context JSONB;

-- Index for face_hash to detect duplicates/spam
CREATE INDEX IF NOT EXISTS idx_skin_scans_face_hash ON skin_scans(face_hash);

COMMENT ON COLUMN skin_scans.face_hash IS 'Perceptual hash or pixel hash of the face region for duplicate detection';
COMMENT ON COLUMN skin_scans.device_info IS 'Stores camera resolution, device model, and OS version';
