-- Scan comparisons table for durable PPI
CREATE TABLE IF NOT EXISTS scan_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  baseline_scan_id UUID REFERENCES skin_scans(id),
  followup_scan_id UUID REFERENCES skin_scans(id),
  days_between INTEGER,
  hydration_delta NUMERIC,
  pigmentation_delta NUMERIC,
  texture_delta NUMERIC,
  oil_balance_delta NUMERIC,
  overall_improvement NUMERIC,
  confidence_score NUMERIC,
  narrative TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE scan_comparisons ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own comparisons" ON scan_comparisons FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own comparisons" ON scan_comparisons FOR INSERT WITH CHECK (auth.uid() = user_id);

-- PPI outcomes (aggregated for products/brands)
CREATE TABLE IF NOT EXISTS ppi_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  average_improvement NUMERIC,
  sample_size INTEGER,
  confidence_level TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE ppi_outcomes ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Publicly readable for brand dashboard)
CREATE POLICY "Anyone can view ppi_outcomes" ON ppi_outcomes FOR SELECT USING (true);

-- Indexes for performance
CREATE INDEX idx_scan_comparisons_user_id ON scan_comparisons(user_id);
CREATE INDEX idx_scan_comparisons_baseline ON scan_comparisons(baseline_scan_id);
CREATE INDEX idx_scan_comparisons_followup ON scan_comparisons(followup_scan_id);
CREATE INDEX idx_ppi_outcomes_product_id ON ppi_outcomes(product_id);
