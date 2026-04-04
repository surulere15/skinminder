-- Migration: Consistency Metadata
-- Implements storage for Capture Variability Bias mitigation.

ALTER TABLE skin_scans 
ADD COLUMN IF NOT EXISTS alignment_metadata JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS confidence_score NUMERIC DEFAULT 0;

-- Metadata structure for alignment_metadata:
-- {
--   "face_box": { "x": number, "y": number, "w": number, "h": number },
--   "face_angle": number,
--   "camera_distance": number,
--   "lighting_variance": number,
--   "white_balance_stats": { "r": number, "g": number, "b": number },
--   "shadow_gradient": number
-- }

COMMENT ON COLUMN skin_scans.alignment_metadata IS 'Metadata used to ensure capture consistency between baseline and follow-up scans.';
COMMENT ON COLUMN skin_scans.confidence_score IS 'Calculated reliability of the scan based on lighting, alignment, and stability.';
