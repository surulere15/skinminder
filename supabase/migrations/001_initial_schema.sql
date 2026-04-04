-- SkinMinder Database Schema
-- Run this in your Supabase SQL Editor

-- Users extended profile (Supabase Auth handles core user)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  skin_type TEXT,
  age INTEGER,
  gender TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skin scans
CREATE TABLE skin_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  body_area TEXT NOT NULL,
  hydration_score NUMERIC,
  pigmentation_score NUMERIC,
  texture_score NUMERIC,
  oil_balance NUMERIC,
  irritation_probability NUMERIC,
  skin_score INTEGER,
  skin_age_estimate INTEGER,
  primary_concerns TEXT[],
  analysis_raw JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products catalog
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID,
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT,
  ingredients TEXT[],
  skin_targets TEXT[],
  image_url TEXT,
  price NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ingredient knowledge base
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  function TEXT,
  benefits TEXT[],
  skin_types_suited TEXT[],
  is_irritant BOOLEAN DEFAULT FALSE,
  irritant_severity TEXT,
  description TEXT
);

-- User routine history
CREATE TABLE routine_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  products_used UUID[],
  notes TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recommendations log
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  scan_id UUID REFERENCES skin_scans(id),
  product_id UUID REFERENCES products(id),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Consultant chat history
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  context JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skin_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Products and ingredients are public read
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own scans" ON skin_scans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scans" ON skin_scans FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Anyone can view ingredients" ON ingredients FOR SELECT USING (true);

CREATE POLICY "Users can view own routines" ON routine_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own routines" ON routine_history FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own recommendations" ON recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recommendations" ON recommendations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own chats" ON chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chats" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Indexes for performance
CREATE INDEX idx_skin_scans_user_id ON skin_scans(user_id);
CREATE INDEX idx_skin_scans_created_at ON skin_scans(created_at DESC);
CREATE INDEX idx_products_skin_targets ON products USING GIN(skin_targets);
CREATE INDEX idx_products_ingredients ON products USING GIN(ingredients);
CREATE INDEX idx_ingredients_name ON ingredients(name);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX idx_recommendations_user_id ON recommendations(user_id);
