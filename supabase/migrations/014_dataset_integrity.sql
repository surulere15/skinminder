-- Migration 010: Dataset Integrity & Product Logging
-- Part of Phase 3 Moat Hardening

ALTER TABLE "skin_scans" 
ADD COLUMN "measurement_weight" NUMERIC DEFAULT 1.0,
ADD COLUMN "intervention_log" JSONB DEFAULT '[]'::JSONB;

COMMENT ON COLUMN "skin_scans"."measurement_weight" IS 'Cohort Confidence Weighting (0.2-1.0) based on capture quality.';
COMMENT ON COLUMN "skin_scans"."intervention_log" IS 'Verified product usage reported by the user after scan.';
