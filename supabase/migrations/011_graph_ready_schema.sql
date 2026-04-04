-- Phase 21: Graph-Ready Relational Model
-- Extends the schema to a relationship-first structure for population-scale intelligence.

-- 1. Refined Public Users Table (Demographics Node)
-- Note: 'auth.users' handles authentication, this handles public profile/demographics.
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    region TEXT,
    country TEXT,
    age_range TEXT, -- '18-24', '25-34', etc.
    gender_optional TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Environmental Context Node
CREATE TABLE IF NOT EXISTS environments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city TEXT,
    country TEXT,
    temperature NUMERIC,
    humidity NUMERIC,
    uv_index NUMERIC,
    air_quality NUMERIC,
    captured_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Telemetry Upgrades for Scans
ALTER TABLE skin_scans 
ADD COLUMN IF NOT EXISTS environment_id UUID REFERENCES environments(id),
ADD COLUMN IF NOT EXISTS scan_duration_ms INTEGER,
ADD COLUMN IF NOT EXISTS network_latency_ms INTEGER,
ADD COLUMN IF NOT EXISTS device_type TEXT;

-- 4. Product Usage Edges (Renamed from user_product_history for clarity)
CREATE TABLE IF NOT EXISTS user_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    start_date DATE NOT NULL,
    end_date DATE, -- NULL means currently using
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Scan-to-Product Relationship (Temporal Edge)
CREATE TABLE IF NOT EXISTS scan_products (
    scan_id UUID REFERENCES skin_scans(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    usage_stage TEXT, -- 'baseline', 'during', 'post'
    PRIMARY KEY (scan_id, product_id)
);

-- 6. Regional Skin Mapping Node
CREATE TABLE IF NOT EXISTS skin_regions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID REFERENCES skin_scans(id) ON DELETE CASCADE,
    region_name TEXT NOT NULL, -- 'forehead', 'left_cheek', etc.
    hydration_score NUMERIC,
    pigmentation_score NUMERIC,
    texture_score NUMERIC,
    oil_balance_score NUMERIC,
    redness_index NUMERIC,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Optimized Graph Export View (V2)
CREATE OR REPLACE VIEW skin_graph_v2 AS
SELECT 
    p.id as user_id,
    p.region as user_region,
    s.id as scan_id,
    s.skin_archetype,
    e.humidity,
    e.uv_index,
    e.temperature,
    prod.product_name,
    prod.ingredient_tags,
    sc.improvement_rate,
    sc.metrics_delta,
    sp.usage_stage
FROM public.profiles p
JOIN skin_scans s ON p.id = s.user_id
LEFT JOIN environments e ON s.environment_id = e.id
LEFT JOIN scan_products sp ON s.id = sp.scan_id
LEFT JOIN products prod ON sp.product_id = prod.id
LEFT JOIN scan_comparisons sc ON s.id = sc.followup_scan_id;

COMMENT ON VIEW skin_graph_v2 IS 'Hardened graph export view for longitudinal efficacy analysis across environments.';
