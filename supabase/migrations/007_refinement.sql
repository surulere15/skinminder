-- Refinement Migration
-- Adding indexes for high-frequency tracking and performance

-- Index for history lookups by time
CREATE INDEX IF NOT EXISTS idx_routine_history_recorded_at ON routine_history(recorded_at DESC);

-- Index for product lookups by brand
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);

-- Index for recommendation lookups by scan
CREATE INDEX IF NOT EXISTS idx_recommendations_scan_id ON recommendations(scan_id);

-- Constraint for profile to prevent negative age
ALTER TABLE profiles ADD CONSTRAINT check_age_positive CHECK (age >= 0);

-- ============================================================
-- PROD HARDENING: PPI ENGINE (Longitudinal Comparisons)
-- ============================================================

CREATE TABLE IF NOT EXISTS scan_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  baseline_scan_id UUID REFERENCES skin_scans(id),
  followup_scan_id UUID REFERENCES skin_scans(id),
  days_between INTEGER NOT NULL,
  
  -- Metrics Delta (Improvement normalized -1.0 to 1.0)
  hydration_delta NUMERIC,
  pigmentation_delta NUMERIC,
  texture_delta NUMERIC,
  oil_balance_delta NUMERIC,
  acne_delta NUMERIC,
  overall_improvement_score NUMERIC,
  
  -- Metadata
  confidence_level TEXT, -- low, moderate, high
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scan_comparisons_user_id ON scan_comparisons(user_id);
CREATE INDEX idx_scan_comparisons_baseline ON scan_comparisons(baseline_scan_id);
CREATE INDEX idx_scan_comparisons_followup ON scan_comparisons(followup_scan_id);

ALTER TABLE scan_comparisons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own comparisons" ON scan_comparisons FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- PROD HARDENING: PRECOMPUTED AGGREGATIONS (For Vendor SaaS)
-- ============================================================

-- Ingredient Demand (Precomputed)
CREATE TABLE IF NOT EXISTS ingredient_demand_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ingredient_name TEXT NOT NULL,
  demand_level TEXT, -- low, medium, high, critical
  match_score NUMERIC, -- 0-100
  customer_count INTEGER,
  trend_direction TEXT, -- up, down, stable
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Regional Skin Trends (Precomputed)
CREATE TABLE IF NOT EXISTS regional_skin_trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region TEXT NOT NULL,
  primary_skin_concern TEXT,
  top_matching_ingredient TEXT,
  scan_volume TEXT, -- low, moderate, high
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Product Performance (PPI Precomputed)
CREATE TABLE IF NOT EXISTS product_performance_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  efficacy_score NUMERIC, -- percentage improvement
  metric_name TEXT, -- e.g., "PIH Improvement"
  sample_size INTEGER,
  confidence_level TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Daily Platform Snapshots
CREATE TABLE IF NOT EXISTS daily_platform_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_matches INTEGER,
  top_concern TEXT,
  best_ingredient TEXT,
  active_protocols INTEGER,
  recorded_date DATE DEFAULT CURRENT_DATE UNIQUE
);

-- ============================================================
-- PROD HARDENING: DATA QUALITY & DRIFT TRACKING
-- ============================================================

ALTER TABLE skin_scans 
ADD COLUMN IF NOT EXISTS lighting_score NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS sharpness_score NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS exposure_normalized BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS device_info JSONB,
ADD COLUMN IF NOT EXISTS resolution TEXT;

CREATE INDEX IF NOT EXISTS idx_skin_scans_quality ON skin_scans(lighting_score, sharpness_score);
