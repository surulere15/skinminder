-- Row Level Security (RLS) Policies for Data Protection

-- Enable RLS on all user data tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skin_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE background_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_active_routine ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only access their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Skin Scans: Users can only access their own scans
CREATE POLICY "Users can view own scans" ON skin_scans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scans" ON skin_scans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scans" ON skin_scans
  FOR DELETE USING (auth.uid() = user_id);

-- Background Jobs: Users can only see their own jobs
CREATE POLICY "Users can view own jobs" ON background_jobs
  FOR SELECT USING (auth.uid() = user_id);

-- Push Subscriptions: Users can only manage their own subscriptions
CREATE POLICY "Users can manage own subscriptions" ON push_subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- Routine Versions: Users can only access their own routines
CREATE POLICY "Users can view own routines" ON routine_versions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own routines" ON routine_versions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Active Routine: Users can only access their own active routine
CREATE POLICY "Users can manage own active routine" ON user_active_routine
  FOR ALL USING (auth.uid() = user_id);

-- Public tables (no RLS needed)
-- ingredients, products, share_cards (some have their own RLS)

-- Analytics: Allow service role to read all for dashboards
-- This is handled at application level, not RLS

-- Create service role bypass function for admin operations
CREATE OR REPLACE FUNCTION auth.uid()
RETURNS uuid
AS $$
  -- This is handled by Supabase auth
  NULL
$$ LANGUAGE sql STABLE;

-- Note: Service role key bypasses RLS automatically in Supabase
-- Only use service role for admin operations, never expose to client