-- Migration 011: Phenotype Clustering Layer (Stage 1)
-- Enabling Population Intelligence & Research Clusters

CREATE TABLE IF NOT EXISTS "phenotypes" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "scan_phenotypes" (
    "scan_id" UUID REFERENCES "skin_scans"("id") ON DELETE CASCADE,
    "phenotype_id" TEXT REFERENCES "phenotypes"("id") ON DELETE CASCADE,
    "confidence" NUMERIC DEFAULT 1.0,
    PRIMARY KEY ("scan_id", "phenotype_id")
);

-- Seed Initial Rule-Based Phenotypes
INSERT INTO "phenotypes" ("id", "name", "description") VALUES
('UV_REACTIVE_MELANIN', 'UV Reactive Melanin', 'High pigmentation sensitivity under strong UV exposure'),
('BARRIER_DEHYDRATED', 'Barrier Dehydrated', 'Chronic moisture loss with inflammatory markers'),
('SEBUM_REACTIVE_HUMID', 'Humidity-Reactive Sebum', 'Excess lipid production triggered by tropical humidity'),
('TEXTURE_FRAGILE_AGING', 'Texture Fragile', 'Accelerated fine-line risk due to low elasticity');

COMMENT ON TABLE "phenotypes" IS 'Canonical list of research-grade skin phenotypes.';
COMMENT ON TABLE "scan_phenotypes" IS 'Junction table linking individual scans to collective phenotype clusters.';
