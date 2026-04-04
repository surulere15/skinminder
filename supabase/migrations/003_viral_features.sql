-- SkinMinder Viral Features Migration
-- Adds: Glow Simulation, Skin DNA Profile, Community Insights

-- ============ SKIN DNA PROFILES ============
CREATE TABLE skin_dna_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  skin_type TEXT NOT NULL,
  hydration_level TEXT NOT NULL,        -- low, medium, high
  pigmentation_tendency TEXT NOT NULL,  -- low, moderate, high
  sensitivity_level TEXT NOT NULL,      -- low, moderate, high
  oil_tendency TEXT NOT NULL,           -- low, moderate, high
  strengths TEXT[] NOT NULL DEFAULT '{}',
  vulnerabilities TEXT[] NOT NULL DEFAULT '{}',
  skin_archetype TEXT,                  -- e.g., "The Resilient Glow", "The Sensitive Bloom"
  archetype_description TEXT,
  generated_from_scans INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE skin_dna_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own skin DNA" ON skin_dna_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own skin DNA" ON skin_dna_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own skin DNA" ON skin_dna_profiles FOR UPDATE USING (auth.uid() = user_id);

-- ============ GLOW SIMULATIONS ============
CREATE TABLE glow_simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  scan_id UUID REFERENCES skin_scans(id) ON DELETE CASCADE,
  current_scores JSONB NOT NULL,
  projected_scores JSONB NOT NULL,       -- scores after routine
  projected_weeks INTEGER NOT NULL,      -- timeframe (e.g., 6)
  routine_summary TEXT[] NOT NULL,
  improvement_narrative TEXT NOT NULL,
  confidence_level TEXT NOT NULL,        -- low, moderate, high
  disclaimer TEXT NOT NULL DEFAULT 'AI simulation of possible improvement. Results vary by individual.',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE glow_simulations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own glow sims" ON glow_simulations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own glow sims" ON glow_simulations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============ COMMUNITY INSIGHTS ============
-- Add location/climate fields to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS latitude NUMERIC;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS longitude NUMERIC;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS age_range TEXT;  -- '18-24', '25-34', '35-44', '45-54', '55+'

-- Aggregated community stats (refreshed periodically)
CREATE TABLE community_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region TEXT NOT NULL,                 -- country or city
  age_range TEXT,
  skin_type TEXT,
  sample_size INTEGER NOT NULL,
  avg_hydration NUMERIC,
  avg_pigmentation NUMERIC,
  avg_texture NUMERIC,
  avg_oil_balance NUMERIC,
  avg_skin_score NUMERIC,
  top_concerns TEXT[],
  common_routines TEXT[],
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE community_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view community stats" ON community_stats FOR SELECT USING (true);

-- Climate advice cache
CREATE TABLE climate_advice (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  climate_data JSONB NOT NULL,          -- temperature, humidity, uv_index, season
  advice TEXT[] NOT NULL,
  product_adjustments TEXT[],
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE climate_advice ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own climate advice" ON climate_advice FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own climate advice" ON climate_advice FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_skin_dna_user ON skin_dna_profiles(user_id);
CREATE INDEX idx_glow_sim_user ON glow_simulations(user_id);
CREATE INDEX idx_glow_sim_scan ON glow_simulations(scan_id);
CREATE INDEX idx_community_stats_region ON community_stats(region);
CREATE INDEX idx_community_stats_age ON community_stats(age_range);
CREATE INDEX idx_climate_advice_user ON climate_advice(user_id);
