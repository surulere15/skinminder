-- Phase 22: Retail Stations Schema
-- Enables tracking of physical scan locations (Salons, Clinics, Stores).

-- 1. Stations Table
CREATE TABLE IF NOT EXISTS retail_stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES auth.users(id), -- The business owner
    name TEXT NOT NULL, -- e.g. "Salon Lagos Central"
    location_type TEXT DEFAULT 'salon', -- salon, clinic, store, spa
    address JSONB,
    metadata JSONB, -- { device_type: 'iPad Pro', ring_light: true }
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Station Sessions
-- Tracks usage of a specific kiosk separate from individual scans.
CREATE TABLE IF NOT EXISTS station_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    station_id UUID REFERENCES retail_stations(id),
    staff_id TEXT, -- Optional staff member assisting
    started_at TIMESTAMPTZ DEFAULT now(),
    ended_at TIMESTAMPTZ,
    scan_count INTEGER DEFAULT 0
);

-- 3. Scan Handoffs (Offline -> Online)
-- Stores the claim token to bridge an anonymous station scan to a user account.
CREATE TABLE IF NOT EXISTS scan_handoffs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID REFERENCES skin_scans(id),
    claim_token TEXT UNIQUE NOT NULL, -- Short-lived code for QR
    expires_at TIMESTAMPTZ NOT NULL,
    claimed_at TIMESTAMPTZ,
    claimed_by_user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Update skin_scans to link to stations
ALTER TABLE skin_scans 
ADD COLUMN IF NOT EXISTS station_id UUID REFERENCES retail_stations(id);

-- 5. Indexing for performance
CREATE INDEX IF NOT EXISTS idx_scans_station ON skin_scans(station_id);
CREATE INDEX IF NOT EXISTS idx_handoff_token ON scan_handoffs(claim_token);
