-- SkinMinder Share & Referral Migration

-- ============ SHARE CODES ============
CREATE TABLE share_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  scan_id UUID REFERENCES skin_scans(id) ON DELETE CASCADE,
  share_code TEXT UNIQUE NOT NULL,
  card_type TEXT NOT NULL DEFAULT 'report',  -- 'report' or 'before_after'
  scan_id_before UUID REFERENCES skin_scans(id),  -- for before/after cards
  card_image_url TEXT,
  card_data JSONB NOT NULL,                  -- cached card content
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE share_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own share cards" ON share_cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own share cards" ON share_cards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anyone can view shared cards by code" ON share_cards FOR SELECT USING (true);

-- ============ REFERRALS ============
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES profiles(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0;

-- Generate referral codes for existing users
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.referral_code := LOWER(SUBSTRING(MD5(NEW.id::TEXT || NOW()::TEXT) FROM 1 FOR 8));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_referral_code
  BEFORE INSERT ON profiles
  FOR EACH ROW
  WHEN (NEW.referral_code IS NULL)
  EXECUTE FUNCTION generate_referral_code();

-- Referral tracking
CREATE TABLE referral_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(referrer_id, referred_id)
);

ALTER TABLE referral_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own referrals" ON referral_events FOR SELECT USING (auth.uid() = referrer_id);

-- Indexes
CREATE INDEX idx_share_cards_code ON share_cards(share_code);
CREATE INDEX idx_share_cards_user ON share_cards(user_id);
CREATE INDEX idx_referral_events_referrer ON referral_events(referrer_id);
CREATE INDEX idx_profiles_referral_code ON profiles(referral_code);
