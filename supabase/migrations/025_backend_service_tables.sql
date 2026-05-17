-- Migration 025: Backend Service Tables
-- Adds tables required for the v4 modular monolith backend services

-- Partner/Brand management
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  api_key TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product matches (links scans to recommended products)
CREATE TABLE IF NOT EXISTS product_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID REFERENCES skin_scans(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  vendor_id UUID REFERENCES partners(id),
  product_id TEXT NOT NULL,
  product_name TEXT,
  match_score FLOAT DEFAULT 0,
  converted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scan-product edges (knowledge graph)
CREATE TABLE IF NOT EXISTS scan_product_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID REFERENCES skin_scans(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  product_id TEXT NOT NULL,
  phase TEXT NOT NULL,
  role TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Environmental context for scans
CREATE TABLE IF NOT EXISTS scan_environments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID REFERENCES skin_scans(id) ON DELETE CASCADE,
  humidity FLOAT,
  uv_index FLOAT,
  temperature FLOAT,
  pollution TEXT,
  location TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Station handoff tokens (retail kiosks)
CREATE TABLE IF NOT EXISTS station_handoff_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID REFERENCES skin_scans(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  claimed BOOLEAN DEFAULT FALSE,
  claimed_by UUID REFERENCES auth.users(id),
  claimed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Station scan registrations
CREATE TABLE IF NOT EXISTS station_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID REFERENCES skin_scans(id) ON DELETE CASCADE,
  station_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  claimed_by UUID REFERENCES auth.users(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_matches_vendor ON product_matches(vendor_id);
CREATE INDEX IF NOT EXISTS idx_product_matches_scan ON product_matches(scan_id);
CREATE INDEX IF NOT EXISTS idx_scan_product_edges_scan ON scan_product_edges(scan_id);
CREATE INDEX IF NOT EXISTS idx_scan_environments_scan ON scan_environments(scan_id);
CREATE INDEX IF NOT EXISTS idx_station_handoff_tokens_token ON station_handoff_tokens(token);
CREATE INDEX IF NOT EXISTS idx_station_scans_station ON station_scans(station_id);

-- RLS Policies
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_product_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_environments ENABLE ROW LEVEL SECURITY;
ALTER TABLE station_handoff_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE station_scans ENABLE ROW LEVEL SECURITY;

-- Partners: only service role can read (API key lookup)
CREATE POLICY "Partners service read" ON partners
  FOR SELECT USING (true);

-- Product matches: users can read their own
CREATE POLICY "Users read own matches" ON product_matches
  FOR SELECT USING (auth.uid() = user_id);

-- Scan-product edges: users can read their own
CREATE POLICY "Users read own edges" ON scan_product_edges
  FOR SELECT USING (auth.uid() = user_id);

-- Scan environments: users can read their own
CREATE POLICY "Users read own environments" ON scan_environments
  FOR SELECT USING (
    scan_id IN (SELECT id FROM skin_scans WHERE user_id = auth.uid())
  );

-- Station tokens: service role only
CREATE POLICY "Service manage tokens" ON station_handoff_tokens
  FOR ALL USING (true);

-- Station scans: service role only
CREATE POLICY "Service manage station scans" ON station_scans
  FOR ALL USING (true);
