-- ============================================================================
-- SkinMinder: Complete Production Schema
-- Consumer Beauty AI Platform
-- Migration: 001_complete_schema.sql
-- Generated: 2026-03-09
--
-- This is the canonical, consolidated schema for SkinMinder.
-- It replaces and supersedes the incremental migrations in supabase/migrations/.
--
-- Prerequisites:
--   - Supabase project with auth.users enabled
--   - PostgreSQL 15+ with pgcrypto extension
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- trigram matching for fuzzy search
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- composite GIN indexes

-- ============================================================================
-- CUSTOM TYPES (ENUMS)
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('consumer', 'seller', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE routine_type AS ENUM ('morning', 'night', 'weekly');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE evidence_level AS ENUM ('anecdotal', 'emerging', 'moderate', 'strong', 'clinical');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE severity_level AS ENUM ('none', 'mild', 'moderate', 'severe', 'critical');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE consent_type AS ENUM ('data_processing', 'marketing', 'analytics', 'third_party_sharing', 'biometric_data');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE message_role AS ENUM ('user', 'assistant', 'system');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE card_type AS ENUM ('report', 'before_after', 'skin_twin', 'glow_simulation');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE seller_category AS ENUM ('skincare', 'supplements', 'tools', 'wellness', 'mixed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE product_category AS ENUM (
    'cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen',
    'mask', 'exfoliator', 'eye_cream', 'body_lotion', 'lip_care',
    'spot_treatment', 'oil', 'mist', 'supplement', 'tool', 'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE ingredient_category AS ENUM (
    'humectant', 'emollient', 'exfoliant', 'antioxidant', 'anti_inflammatory',
    'antimicrobial', 'retinoid', 'peptide', 'vitamin', 'mineral',
    'sunscreen_agent', 'brightening_agent', 'preservative', 'fragrance',
    'solvent', 'surfactant', 'botanical', 'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- 1. PROFILES
-- Extends Supabase auth.users with skin & demographic data
-- ============================================================================

CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  skin_type       TEXT CHECK (skin_type IN ('oily', 'dry', 'combination', 'normal', 'sensitive')),
  age             INTEGER CHECK (age >= 13 AND age <= 120),
  gender          TEXT CHECK (gender IN ('male', 'female', 'non_binary', 'prefer_not_to_say')),
  age_range       TEXT CHECK (age_range IN ('13-17', '18-24', '25-34', '35-44', '45-54', '55+')),
  city            TEXT,
  country         TEXT,
  latitude        NUMERIC(10, 7),
  longitude       NUMERIC(10, 7),
  referral_code   TEXT UNIQUE,
  referred_by     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  referral_count  INTEGER NOT NULL DEFAULT 0,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  role            user_role NOT NULL DEFAULT 'consumer',
  avatar_url      TEXT,
  display_name    TEXT,
  timezone        TEXT DEFAULT 'UTC',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE profiles IS 'User profiles extending Supabase auth.users with skin type, demographics, and referral tracking.';

-- ============================================================================
-- 2. USER PREFERENCES
-- Beauty goals, concerns, notification and consent settings
-- ============================================================================

CREATE TABLE user_preferences (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  beauty_goals        TEXT[] NOT NULL DEFAULT '{}',
  skin_concerns       TEXT[] NOT NULL DEFAULT '{}',
  preferred_brands    TEXT[] NOT NULL DEFAULT '{}',
  avoided_ingredients TEXT[] NOT NULL DEFAULT '{}',
  notification_email  BOOLEAN NOT NULL DEFAULT TRUE,
  notification_push   BOOLEAN NOT NULL DEFAULT TRUE,
  notification_sms    BOOLEAN NOT NULL DEFAULT FALSE,
  data_consent        BOOLEAN NOT NULL DEFAULT FALSE,
  marketing_consent   BOOLEAN NOT NULL DEFAULT FALSE,
  language            TEXT NOT NULL DEFAULT 'en',
  measurement_system  TEXT NOT NULL DEFAULT 'metric' CHECK (measurement_system IN ('metric', 'imperial')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE user_preferences IS 'User beauty preferences, notification settings, and consent flags.';

-- ============================================================================
-- 3. CONSENT RECORDS
-- GDPR/CCPA-compliant consent audit trail
-- ============================================================================

CREATE TABLE consent_records (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  consent_type  consent_type NOT NULL,
  granted       BOOLEAN NOT NULL,
  granted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at    TIMESTAMPTZ,
  ip_address    TEXT,
  user_agent    TEXT,
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE consent_records IS 'Immutable audit log of user consent grants and revocations for regulatory compliance.';

-- ============================================================================
-- 4. SKIN SCANS
-- AI-analyzed skin photos with metric scores
-- ============================================================================

CREATE TABLE skin_scans (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  image_url             TEXT NOT NULL,
  body_area             TEXT NOT NULL CHECK (body_area IN (
    'face', 'forehead', 'cheeks', 'chin', 'nose', 'neck',
    'chest', 'back', 'arms', 'legs', 'hands', 'full_body'
  )),
  hydration_score       NUMERIC(5, 2) CHECK (hydration_score >= 0 AND hydration_score <= 100),
  pigmentation_score    NUMERIC(5, 2) CHECK (pigmentation_score >= 0 AND pigmentation_score <= 100),
  texture_score         NUMERIC(5, 2) CHECK (texture_score >= 0 AND texture_score <= 100),
  oil_balance           NUMERIC(5, 2) CHECK (oil_balance >= 0 AND oil_balance <= 100),
  irritation_indicator  NUMERIC(5, 2) CHECK (irritation_indicator >= 0 AND irritation_indicator <= 100),
  elasticity_indicator  NUMERIC(5, 2) CHECK (elasticity_indicator >= 0 AND elasticity_indicator <= 100),
  acne_tendency         NUMERIC(5, 2) CHECK (acne_tendency >= 0 AND acne_tendency <= 100),
  overall_score         INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  estimated_skin_age    INTEGER CHECK (estimated_skin_age >= 10 AND estimated_skin_age <= 120),
  primary_concerns      TEXT[] DEFAULT '{}',
  analysis_raw          JSONB,
  model_version         TEXT,
  processing_time_ms    INTEGER,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE skin_scans IS 'AI-powered skin scan results with individual metric scores and raw analysis data.';

-- ============================================================================
-- 5. SKIN SCAN METRICS
-- Granular per-metric results with confidence
-- ============================================================================

CREATE TABLE skin_scan_metrics (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id       UUID NOT NULL REFERENCES skin_scans(id) ON DELETE CASCADE,
  metric_name   TEXT NOT NULL,
  metric_value  NUMERIC(7, 4) NOT NULL,
  confidence    NUMERIC(5, 4) CHECK (confidence >= 0 AND confidence <= 1),
  unit          TEXT,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE skin_scan_metrics IS 'Individual metrics extracted from skin scans with confidence scores.';

-- ============================================================================
-- 6. SKIN SCAN OBSERVATIONS
-- Qualitative observations from scan analysis
-- ============================================================================

CREATE TABLE skin_scan_observations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id           UUID NOT NULL REFERENCES skin_scans(id) ON DELETE CASCADE,
  observation_type  TEXT NOT NULL CHECK (observation_type IN (
    'concern', 'strength', 'recommendation', 'warning', 'trend'
  )),
  description       TEXT NOT NULL,
  severity          severity_level NOT NULL DEFAULT 'none',
  area              TEXT,
  confidence        NUMERIC(5, 4) CHECK (confidence >= 0 AND confidence <= 1),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE skin_scan_observations IS 'Qualitative observations and findings from AI skin scan analysis.';

-- ============================================================================
-- 7. SKIN PROFILES (Skin Twin)
-- Aggregated skin identity built from scan history
-- ============================================================================

CREATE TABLE skin_profiles (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  skin_type               TEXT NOT NULL CHECK (skin_type IN ('oily', 'dry', 'combination', 'normal', 'sensitive')),
  hydration_level         TEXT NOT NULL CHECK (hydration_level IN ('low', 'medium', 'high')),
  pigmentation_tendency   TEXT NOT NULL CHECK (pigmentation_tendency IN ('low', 'moderate', 'high')),
  sensitivity_level       TEXT NOT NULL CHECK (sensitivity_level IN ('low', 'moderate', 'high')),
  oil_tendency            TEXT NOT NULL CHECK (oil_tendency IN ('low', 'moderate', 'high')),
  elasticity_level        TEXT NOT NULL CHECK (elasticity_level IN ('low', 'moderate', 'high')) DEFAULT 'moderate',
  strengths               TEXT[] NOT NULL DEFAULT '{}',
  vulnerabilities         TEXT[] NOT NULL DEFAULT '{}',
  skin_archetype          TEXT,
  archetype_description   TEXT,
  generated_from_scans    INTEGER NOT NULL DEFAULT 1,
  last_scan_id            UUID REFERENCES skin_scans(id) ON DELETE SET NULL,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE skin_profiles IS 'Skin Twin identity profile aggregated from scan history. One per user.';

-- ============================================================================
-- 8. SKIN ROUTINES
-- Personalized morning/night/weekly routines
-- ============================================================================

CREATE TABLE skin_routines (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  routine_type    routine_type NOT NULL,
  name            TEXT,
  steps           JSONB NOT NULL DEFAULT '[]',
  difficulty_level difficulty_level NOT NULL DEFAULT 'beginner',
  concern_focus   TEXT[] NOT NULL DEFAULT '{}',
  estimated_time_minutes INTEGER,
  active          BOOLEAN NOT NULL DEFAULT TRUE,
  source          TEXT DEFAULT 'ai' CHECK (source IN ('ai', 'manual', 'template')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE skin_routines IS 'Personalized skincare routines with step-by-step instructions.';
COMMENT ON COLUMN skin_routines.steps IS 'JSON array of {order, product_name, category, duration_seconds, instructions, optional}.';

-- ============================================================================
-- 9. INGREDIENTS
-- Cosmetic ingredient knowledge base
-- ============================================================================

CREATE TABLE ingredients (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL UNIQUE,
  function            TEXT,
  benefits            TEXT[] NOT NULL DEFAULT '{}',
  skin_types_suited   TEXT[] NOT NULL DEFAULT '{}',
  is_irritant         BOOLEAN NOT NULL DEFAULT FALSE,
  irritant_severity   severity_level,
  comedogenic_rating  INTEGER CHECK (comedogenic_rating >= 0 AND comedogenic_rating <= 5),
  description         TEXT,
  category            ingredient_category,
  inci_name           TEXT,
  aliases             TEXT[] DEFAULT '{}',
  safety_rating       NUMERIC(3, 1) CHECK (safety_rating >= 0 AND safety_rating <= 10),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE ingredients IS 'Curated cosmetic ingredient knowledge base with safety and compatibility data.';

-- ============================================================================
-- 10. INGREDIENT BENEFITS
-- Detailed benefit records for each ingredient
-- ============================================================================

CREATE TABLE ingredient_benefits (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ingredient_id   UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  benefit         TEXT NOT NULL,
  mechanism       TEXT,
  evidence_level  evidence_level NOT NULL DEFAULT 'emerging',
  source_url      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE ingredient_benefits IS 'Scientific benefits of ingredients with evidence levels.';

-- ============================================================================
-- 11. INGREDIENT RISKS
-- Known risks and contraindications
-- ============================================================================

CREATE TABLE ingredient_risks (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ingredient_id       UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  risk_type           TEXT NOT NULL CHECK (risk_type IN (
    'irritation', 'allergy', 'photosensitivity', 'drug_interaction',
    'pregnancy_risk', 'comedogenic', 'drying', 'other'
  )),
  description         TEXT NOT NULL,
  severity            severity_level NOT NULL DEFAULT 'mild',
  affected_skin_types TEXT[] NOT NULL DEFAULT '{}',
  precautions         TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE ingredient_risks IS 'Known risks, contraindications, and precautions for ingredients.';

-- ============================================================================
-- 12. SELLER PROFILES
-- Marketplace seller accounts
-- ============================================================================

CREATE TABLE seller_profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  business_name   TEXT NOT NULL,
  description     TEXT,
  logo_url        TEXT,
  website         TEXT,
  category        seller_category NOT NULL DEFAULT 'skincare',
  verified        BOOLEAN NOT NULL DEFAULT FALSE,
  verified_at     TIMESTAMPTZ,
  commission_rate NUMERIC(5, 4) NOT NULL DEFAULT 0.15 CHECK (commission_rate >= 0 AND commission_rate <= 1),
  stripe_account_id TEXT,
  contact_email   TEXT,
  phone           TEXT,
  address_line1   TEXT,
  address_city    TEXT,
  address_country TEXT,
  rating          NUMERIC(3, 2) CHECK (rating >= 0 AND rating <= 5),
  total_sales     INTEGER NOT NULL DEFAULT 0,
  active          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE seller_profiles IS 'Marketplace seller accounts with business details and verification status.';

-- ============================================================================
-- 13. PRODUCT CATALOGS
-- Seller-organized product collections
-- ============================================================================

CREATE TABLE product_catalogs (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id           UUID NOT NULL REFERENCES seller_profiles(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  catalog_description TEXT,
  sort_order          INTEGER NOT NULL DEFAULT 0,
  active              BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE product_catalogs IS 'Seller-organized product collections for storefront display.';

-- ============================================================================
-- 14. SELLER PRODUCTS
-- Products listed by sellers in the marketplace
-- ============================================================================

CREATE TABLE seller_products (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_id      UUID REFERENCES product_catalogs(id) ON DELETE SET NULL,
  seller_id       UUID NOT NULL REFERENCES seller_profiles(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  brand           TEXT,
  description     TEXT,
  category        product_category NOT NULL DEFAULT 'other',
  ingredients     TEXT[] NOT NULL DEFAULT '{}',
  skin_targets    TEXT[] NOT NULL DEFAULT '{}',
  image_url       TEXT,
  images          TEXT[] DEFAULT '{}',
  price           NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  currency        TEXT NOT NULL DEFAULT 'USD',
  sku             TEXT,
  barcode         TEXT,
  volume_ml       NUMERIC(8, 2),
  active          BOOLEAN NOT NULL DEFAULT TRUE,
  featured        BOOLEAN NOT NULL DEFAULT FALSE,
  rating          NUMERIC(3, 2) CHECK (rating >= 0 AND rating <= 5),
  review_count    INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE seller_products IS 'Products listed by marketplace sellers with ingredients and skin targeting.';

-- Composite unique constraint on seller + SKU
CREATE UNIQUE INDEX idx_seller_products_sku ON seller_products(seller_id, sku) WHERE sku IS NOT NULL;

-- ============================================================================
-- 15. PRODUCT INGREDIENTS
-- Maps products to ingredients with list position
-- ============================================================================

CREATE TABLE product_ingredients (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      UUID NOT NULL REFERENCES seller_products(id) ON DELETE CASCADE,
  ingredient_id   UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  position        INTEGER NOT NULL CHECK (position >= 1),
  concentration   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (product_id, ingredient_id),
  UNIQUE (product_id, position)
);

COMMENT ON TABLE product_ingredients IS 'Maps products to ingredients preserving INCI list order.';

-- ============================================================================
-- 16. RECOMMENDATION LOGS
-- AI product recommendations tied to scans
-- ============================================================================

CREATE TABLE recommendation_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  scan_id         UUID REFERENCES skin_scans(id) ON DELETE SET NULL,
  product_id      UUID REFERENCES seller_products(id) ON DELETE SET NULL,
  reason          TEXT,
  match_score     NUMERIC(5, 4) CHECK (match_score >= 0 AND match_score <= 1),
  algorithm_version TEXT,
  clicked         BOOLEAN NOT NULL DEFAULT FALSE,
  purchased       BOOLEAN NOT NULL DEFAULT FALSE,
  dismissed       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE recommendation_logs IS 'AI-generated product recommendations with match scores and engagement tracking.';

-- ============================================================================
-- 17. SUPPLEMENT RECOMMENDATIONS
-- AI-suggested supplements based on skin analysis
-- ============================================================================

CREATE TABLE supplement_recommendations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  scan_id             UUID REFERENCES skin_scans(id) ON DELETE SET NULL,
  supplement_name     TEXT NOT NULL,
  reason              TEXT NOT NULL,
  dosage_suggestion   TEXT,
  frequency           TEXT,
  duration_weeks      INTEGER,
  priority            INTEGER DEFAULT 0,
  disclaimer          TEXT NOT NULL DEFAULT 'Consult a healthcare professional before starting any supplement.',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE supplement_recommendations IS 'AI-suggested dietary supplements based on skin scan analysis.';

-- ============================================================================
-- 18. NUTRITION RECOMMENDATIONS
-- Dietary advice based on skin analysis
-- ============================================================================

CREATE TABLE nutrition_recommendations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  scan_id         UUID REFERENCES skin_scans(id) ON DELETE SET NULL,
  food_items      TEXT[] NOT NULL DEFAULT '{}',
  fruits          TEXT[] NOT NULL DEFAULT '{}',
  herbs           TEXT[] NOT NULL DEFAULT '{}',
  hydration_tips  TEXT[] NOT NULL DEFAULT '{}',
  lifestyle_tips  TEXT[] NOT NULL DEFAULT '{}',
  foods_to_avoid  TEXT[] NOT NULL DEFAULT '{}',
  daily_water_ml  INTEGER,
  disclaimer      TEXT NOT NULL DEFAULT 'General wellness guidance. Not a substitute for professional dietary advice.',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE nutrition_recommendations IS 'Dietary and nutrition advice generated from skin scan analysis.';

-- ============================================================================
-- 19. HERB RECOMMENDATIONS
-- Herbal/botanical recommendations
-- ============================================================================

CREATE TABLE herb_recommendations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  scan_id           UUID REFERENCES skin_scans(id) ON DELETE SET NULL,
  herb_name         TEXT NOT NULL,
  benefit           TEXT NOT NULL,
  usage_suggestion  TEXT,
  preparation       TEXT,
  cautions          TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE herb_recommendations IS 'Herbal and botanical recommendations tied to skin analysis.';

-- ============================================================================
-- 20. AI CONVERSATIONS
-- Chat conversation threads
-- ============================================================================

CREATE TABLE ai_conversations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title         TEXT,
  context       JSONB DEFAULT '{}',
  scan_id       UUID REFERENCES skin_scans(id) ON DELETE SET NULL,
  model_used    TEXT,
  message_count INTEGER NOT NULL DEFAULT 0,
  archived      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE ai_conversations IS 'AI consultant chat conversation threads.';

-- ============================================================================
-- 21. AI MESSAGES
-- Individual messages within conversations
-- ============================================================================

CREATE TABLE ai_messages (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id   UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role              message_role NOT NULL,
  content           TEXT NOT NULL,
  context           JSONB DEFAULT '{}',
  token_count       INTEGER,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE ai_messages IS 'Individual messages in AI consultant conversations.';

-- ============================================================================
-- 22. SHARE CARDS
-- Shareable skin report cards with unique codes
-- ============================================================================

CREATE TABLE share_cards (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  scan_id         UUID NOT NULL REFERENCES skin_scans(id) ON DELETE CASCADE,
  share_code      TEXT NOT NULL UNIQUE,
  card_type       card_type NOT NULL DEFAULT 'report',
  scan_id_before  UUID REFERENCES skin_scans(id) ON DELETE SET NULL,
  card_image_url  TEXT,
  card_data       JSONB NOT NULL DEFAULT '{}',
  view_count      INTEGER NOT NULL DEFAULT 0,
  expires_at      TIMESTAMPTZ,
  active          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE share_cards IS 'Shareable skin report cards with unique share codes for viral distribution.';

-- ============================================================================
-- 23. GLOW SIMULATIONS
-- AI-projected skin improvement forecasts
-- ============================================================================

CREATE TABLE glow_simulations (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  scan_id                 UUID NOT NULL REFERENCES skin_scans(id) ON DELETE CASCADE,
  current_scores          JSONB NOT NULL,
  projected_scores        JSONB NOT NULL,
  projected_weeks         INTEGER NOT NULL CHECK (projected_weeks > 0 AND projected_weeks <= 52),
  routine_summary         TEXT[] NOT NULL DEFAULT '{}',
  improvement_narrative   TEXT NOT NULL,
  confidence_level        TEXT NOT NULL CHECK (confidence_level IN ('low', 'moderate', 'high')),
  disclaimer              TEXT NOT NULL DEFAULT 'AI simulation of possible improvement. Individual results vary based on consistency, genetics, and lifestyle factors.',
  model_version           TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE glow_simulations IS 'AI-projected skin improvement simulations based on recommended routines.';

-- ============================================================================
-- 24. PROGRESS SNAPSHOTS
-- Periodic skin progress summaries
-- ============================================================================

CREATE TABLE progress_snapshots (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  snapshot_data   JSONB NOT NULL,
  period          TEXT NOT NULL CHECK (period IN ('weekly', 'monthly', 'quarterly', 'yearly')),
  period_start    DATE,
  period_end      DATE,
  scan_count      INTEGER NOT NULL DEFAULT 0,
  summary         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE progress_snapshots IS 'Periodic skin progress summaries aggregated from scan history.';

-- ============================================================================
-- 25. COMMUNITY STATS
-- Aggregated anonymized community skin data
-- ============================================================================

CREATE TABLE community_stats (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region          TEXT NOT NULL,
  age_range       TEXT,
  skin_type       TEXT,
  sample_size     INTEGER NOT NULL CHECK (sample_size >= 0),
  avg_metrics     JSONB NOT NULL DEFAULT '{}',
  top_concerns    TEXT[] NOT NULL DEFAULT '{}',
  common_routines TEXT[] DEFAULT '{}',
  season          TEXT CHECK (season IN ('spring', 'summer', 'autumn', 'winter')),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE community_stats IS 'Aggregated anonymized community skin metrics by region and demographics.';

-- ============================================================================
-- 26. CLIMATE ADVICE
-- Weather/climate-based skincare guidance
-- ============================================================================

CREATE TABLE climate_advice (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  climate_data        JSONB NOT NULL,
  advice              TEXT[] NOT NULL DEFAULT '{}',
  product_adjustments TEXT[] DEFAULT '{}',
  uv_index            NUMERIC(4, 1),
  humidity_percent    NUMERIC(5, 2),
  temperature_c       NUMERIC(5, 2),
  generated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE climate_advice IS 'Personalized skincare advice based on local climate and weather conditions.';
COMMENT ON COLUMN climate_advice.climate_data IS 'Raw climate data: {temperature, humidity, uv_index, season, air_quality}.';

-- ============================================================================
-- 27. REFERRAL EVENTS
-- Tracks referral conversions
-- ============================================================================

CREATE TABLE referral_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id   UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  reward_granted BOOLEAN NOT NULL DEFAULT FALSE,
  reward_type   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE referral_events IS 'Tracks user referral conversions and reward status.';

-- ============================================================================
-- 28. STOREFRONT CONFIG
-- Seller storefront customization
-- ============================================================================

CREATE TABLE storefront_config (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id           UUID NOT NULL UNIQUE REFERENCES seller_profiles(id) ON DELETE CASCADE,
  theme               JSONB NOT NULL DEFAULT '{"primary_color": "#6366f1", "layout": "grid"}',
  custom_url          TEXT UNIQUE,
  tagline             TEXT,
  featured_products   UUID[] DEFAULT '{}',
  banner_image_url    TEXT,
  social_links        JSONB DEFAULT '{}',
  seo_title           TEXT,
  seo_description     TEXT,
  active              BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE storefront_config IS 'Seller storefront customization: theme, URL, branding, and featured products.';

-- ============================================================================
-- 29. ROUTINE HISTORY
-- Legacy routine logging (retained for backward compatibility)
-- ============================================================================

CREATE TABLE routine_history (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  routine_id    UUID REFERENCES skin_routines(id) ON DELETE SET NULL,
  products_used UUID[] DEFAULT '{}',
  notes         TEXT,
  mood          TEXT CHECK (mood IN ('great', 'good', 'neutral', 'bad', 'terrible')),
  completed     BOOLEAN NOT NULL DEFAULT TRUE,
  recorded_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE routine_history IS 'Daily routine completion log with optional mood tracking.';

-- ============================================================================
-- 30. PRODUCT REVIEWS
-- User reviews of seller products
-- ============================================================================

CREATE TABLE product_reviews (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id    UUID NOT NULL REFERENCES seller_products(id) ON DELETE CASCADE,
  rating        INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title         TEXT,
  body          TEXT,
  skin_type     TEXT,
  verified_purchase BOOLEAN NOT NULL DEFAULT FALSE,
  helpful_count INTEGER NOT NULL DEFAULT 0,
  reported      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (user_id, product_id)
);

COMMENT ON TABLE product_reviews IS 'User reviews and ratings for marketplace products.';

-- ============================================================================
-- 31. WAITLIST
-- Pre-launch or feature waitlist
-- ============================================================================

CREATE TABLE waitlist (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL UNIQUE,
  name          TEXT,
  skin_type     TEXT,
  source        TEXT,
  referral_code TEXT,
  converted     BOOLEAN NOT NULL DEFAULT FALSE,
  converted_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE waitlist IS 'Pre-launch and feature waitlist registrations.';


-- ============================================================================
-- ROW LEVEL SECURITY: ENABLE ON ALL TABLES
-- ============================================================================

ALTER TABLE profiles                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences          ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_records           ENABLE ROW LEVEL SECURITY;
ALTER TABLE skin_scans                ENABLE ROW LEVEL SECURITY;
ALTER TABLE skin_scan_metrics         ENABLE ROW LEVEL SECURITY;
ALTER TABLE skin_scan_observations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE skin_profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE skin_routines             ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients               ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredient_benefits       ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredient_risks          ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_catalogs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_products           ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_ingredients       ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_logs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplement_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE herb_recommendations      ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations          ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages               ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_cards               ENABLE ROW LEVEL SECURITY;
ALTER TABLE glow_simulations          ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_snapshots        ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_stats           ENABLE ROW LEVEL SECURITY;
ALTER TABLE climate_advice            ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_events           ENABLE ROW LEVEL SECURITY;
ALTER TABLE storefront_config         ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_history           ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews           ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist                  ENABLE ROW LEVEL SECURITY;


-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- ---------------------------------------------------------------------------
-- PROFILES: Users manage own profile
-- ---------------------------------------------------------------------------

CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow service role to read any profile (for referral lookups etc.)
CREATE POLICY "profiles_service_select"
  ON profiles FOR SELECT
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ---------------------------------------------------------------------------
-- USER PREFERENCES: Users manage own preferences
-- ---------------------------------------------------------------------------

CREATE POLICY "user_preferences_select_own"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_preferences_insert_own"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_preferences_update_own"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_preferences_delete_own"
  ON user_preferences FOR DELETE
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- CONSENT RECORDS: Users can view own, insert only (immutable audit log)
-- ---------------------------------------------------------------------------

CREATE POLICY "consent_records_select_own"
  ON consent_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "consent_records_insert_own"
  ON consent_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- No UPDATE or DELETE policies: consent records are immutable

-- ---------------------------------------------------------------------------
-- SKIN SCANS: Users manage own scans
-- ---------------------------------------------------------------------------

CREATE POLICY "skin_scans_select_own"
  ON skin_scans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "skin_scans_insert_own"
  ON skin_scans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "skin_scans_delete_own"
  ON skin_scans FOR DELETE
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- SKIN SCAN METRICS: Inherits access via scan ownership
-- ---------------------------------------------------------------------------

CREATE POLICY "skin_scan_metrics_select_own"
  ON skin_scan_metrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM skin_scans
      WHERE skin_scans.id = skin_scan_metrics.scan_id
      AND skin_scans.user_id = auth.uid()
    )
  );

CREATE POLICY "skin_scan_metrics_insert_own"
  ON skin_scan_metrics FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM skin_scans
      WHERE skin_scans.id = skin_scan_metrics.scan_id
      AND skin_scans.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- SKIN SCAN OBSERVATIONS: Inherits access via scan ownership
-- ---------------------------------------------------------------------------

CREATE POLICY "skin_scan_observations_select_own"
  ON skin_scan_observations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM skin_scans
      WHERE skin_scans.id = skin_scan_observations.scan_id
      AND skin_scans.user_id = auth.uid()
    )
  );

CREATE POLICY "skin_scan_observations_insert_own"
  ON skin_scan_observations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM skin_scans
      WHERE skin_scans.id = skin_scan_observations.scan_id
      AND skin_scans.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- SKIN PROFILES: Users manage own Skin Twin
-- ---------------------------------------------------------------------------

CREATE POLICY "skin_profiles_select_own"
  ON skin_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "skin_profiles_insert_own"
  ON skin_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "skin_profiles_update_own"
  ON skin_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- SKIN ROUTINES: Users manage own routines
-- ---------------------------------------------------------------------------

CREATE POLICY "skin_routines_select_own"
  ON skin_routines FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "skin_routines_insert_own"
  ON skin_routines FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "skin_routines_update_own"
  ON skin_routines FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "skin_routines_delete_own"
  ON skin_routines FOR DELETE
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- INGREDIENTS: Public read access
-- ---------------------------------------------------------------------------

CREATE POLICY "ingredients_select_public"
  ON ingredients FOR SELECT
  USING (true);

CREATE POLICY "ingredients_admin_insert"
  ON ingredients FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "ingredients_admin_update"
  ON ingredients FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ---------------------------------------------------------------------------
-- INGREDIENT BENEFITS: Public read access
-- ---------------------------------------------------------------------------

CREATE POLICY "ingredient_benefits_select_public"
  ON ingredient_benefits FOR SELECT
  USING (true);

CREATE POLICY "ingredient_benefits_admin_insert"
  ON ingredient_benefits FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ---------------------------------------------------------------------------
-- INGREDIENT RISKS: Public read access
-- ---------------------------------------------------------------------------

CREATE POLICY "ingredient_risks_select_public"
  ON ingredient_risks FOR SELECT
  USING (true);

CREATE POLICY "ingredient_risks_admin_insert"
  ON ingredient_risks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ---------------------------------------------------------------------------
-- SELLER PROFILES: Public read, sellers manage own
-- ---------------------------------------------------------------------------

CREATE POLICY "seller_profiles_select_public"
  ON seller_profiles FOR SELECT
  USING (true);

CREATE POLICY "seller_profiles_insert_own"
  ON seller_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "seller_profiles_update_own"
  ON seller_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- PRODUCT CATALOGS: Public read, sellers manage own
-- ---------------------------------------------------------------------------

CREATE POLICY "product_catalogs_select_public"
  ON product_catalogs FOR SELECT
  USING (true);

CREATE POLICY "product_catalogs_insert_own"
  ON product_catalogs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM seller_profiles
      WHERE seller_profiles.id = product_catalogs.seller_id
      AND seller_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "product_catalogs_update_own"
  ON product_catalogs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM seller_profiles
      WHERE seller_profiles.id = product_catalogs.seller_id
      AND seller_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "product_catalogs_delete_own"
  ON product_catalogs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM seller_profiles
      WHERE seller_profiles.id = product_catalogs.seller_id
      AND seller_profiles.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- SELLER PRODUCTS: Public read, sellers manage own
-- ---------------------------------------------------------------------------

CREATE POLICY "seller_products_select_public"
  ON seller_products FOR SELECT
  USING (true);

CREATE POLICY "seller_products_insert_own"
  ON seller_products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM seller_profiles
      WHERE seller_profiles.id = seller_products.seller_id
      AND seller_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "seller_products_update_own"
  ON seller_products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM seller_profiles
      WHERE seller_profiles.id = seller_products.seller_id
      AND seller_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "seller_products_delete_own"
  ON seller_products FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM seller_profiles
      WHERE seller_profiles.id = seller_products.seller_id
      AND seller_profiles.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- PRODUCT INGREDIENTS: Public read, sellers manage own (via product ownership)
-- ---------------------------------------------------------------------------

CREATE POLICY "product_ingredients_select_public"
  ON product_ingredients FOR SELECT
  USING (true);

CREATE POLICY "product_ingredients_insert_own"
  ON product_ingredients FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM seller_products
      JOIN seller_profiles ON seller_profiles.id = seller_products.seller_id
      WHERE seller_products.id = product_ingredients.product_id
      AND seller_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "product_ingredients_delete_own"
  ON product_ingredients FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM seller_products
      JOIN seller_profiles ON seller_profiles.id = seller_products.seller_id
      WHERE seller_products.id = product_ingredients.product_id
      AND seller_profiles.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- RECOMMENDATION LOGS: Users view own
-- ---------------------------------------------------------------------------

CREATE POLICY "recommendation_logs_select_own"
  ON recommendation_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "recommendation_logs_insert_own"
  ON recommendation_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "recommendation_logs_update_own"
  ON recommendation_logs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- SUPPLEMENT RECOMMENDATIONS: Users view own
-- ---------------------------------------------------------------------------

CREATE POLICY "supplement_recommendations_select_own"
  ON supplement_recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "supplement_recommendations_insert_own"
  ON supplement_recommendations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- NUTRITION RECOMMENDATIONS: Users view own
-- ---------------------------------------------------------------------------

CREATE POLICY "nutrition_recommendations_select_own"
  ON nutrition_recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "nutrition_recommendations_insert_own"
  ON nutrition_recommendations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- HERB RECOMMENDATIONS: Users view own
-- ---------------------------------------------------------------------------

CREATE POLICY "herb_recommendations_select_own"
  ON herb_recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "herb_recommendations_insert_own"
  ON herb_recommendations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- AI CONVERSATIONS: Users manage own
-- ---------------------------------------------------------------------------

CREATE POLICY "ai_conversations_select_own"
  ON ai_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "ai_conversations_insert_own"
  ON ai_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ai_conversations_update_own"
  ON ai_conversations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ai_conversations_delete_own"
  ON ai_conversations FOR DELETE
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- AI MESSAGES: Users manage own (via conversation ownership)
-- ---------------------------------------------------------------------------

CREATE POLICY "ai_messages_select_own"
  ON ai_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM ai_conversations
      WHERE ai_conversations.id = ai_messages.conversation_id
      AND ai_conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "ai_messages_insert_own"
  ON ai_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_conversations
      WHERE ai_conversations.id = ai_messages.conversation_id
      AND ai_conversations.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- SHARE CARDS: Users manage own + public read by share_code
-- ---------------------------------------------------------------------------

CREATE POLICY "share_cards_select_own"
  ON share_cards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "share_cards_select_public"
  ON share_cards FOR SELECT
  USING (active = TRUE);

CREATE POLICY "share_cards_insert_own"
  ON share_cards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "share_cards_update_own"
  ON share_cards FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- GLOW SIMULATIONS: Users view own
-- ---------------------------------------------------------------------------

CREATE POLICY "glow_simulations_select_own"
  ON glow_simulations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "glow_simulations_insert_own"
  ON glow_simulations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- PROGRESS SNAPSHOTS: Users manage own
-- ---------------------------------------------------------------------------

CREATE POLICY "progress_snapshots_select_own"
  ON progress_snapshots FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "progress_snapshots_insert_own"
  ON progress_snapshots FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- COMMUNITY STATS: Public read
-- ---------------------------------------------------------------------------

CREATE POLICY "community_stats_select_public"
  ON community_stats FOR SELECT
  USING (true);

-- Admin-only write
CREATE POLICY "community_stats_admin_insert"
  ON community_stats FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "community_stats_admin_update"
  ON community_stats FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ---------------------------------------------------------------------------
-- CLIMATE ADVICE: Users view own
-- ---------------------------------------------------------------------------

CREATE POLICY "climate_advice_select_own"
  ON climate_advice FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "climate_advice_insert_own"
  ON climate_advice FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- REFERRAL EVENTS: Users view own referrals
-- ---------------------------------------------------------------------------

CREATE POLICY "referral_events_select_own"
  ON referral_events FOR SELECT
  USING (auth.uid() = referrer_id);

CREATE POLICY "referral_events_insert_service"
  ON referral_events FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- ---------------------------------------------------------------------------
-- STOREFRONT CONFIG: Public read, sellers manage own
-- ---------------------------------------------------------------------------

CREATE POLICY "storefront_config_select_public"
  ON storefront_config FOR SELECT
  USING (true);

CREATE POLICY "storefront_config_insert_own"
  ON storefront_config FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM seller_profiles
      WHERE seller_profiles.id = storefront_config.seller_id
      AND seller_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "storefront_config_update_own"
  ON storefront_config FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM seller_profiles
      WHERE seller_profiles.id = storefront_config.seller_id
      AND seller_profiles.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- ROUTINE HISTORY: Users manage own
-- ---------------------------------------------------------------------------

CREATE POLICY "routine_history_select_own"
  ON routine_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "routine_history_insert_own"
  ON routine_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- PRODUCT REVIEWS: Public read, users manage own
-- ---------------------------------------------------------------------------

CREATE POLICY "product_reviews_select_public"
  ON product_reviews FOR SELECT
  USING (true);

CREATE POLICY "product_reviews_insert_own"
  ON product_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "product_reviews_update_own"
  ON product_reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "product_reviews_delete_own"
  ON product_reviews FOR DELETE
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- WAITLIST: Service role only (no authenticated user access needed)
-- ---------------------------------------------------------------------------

CREATE POLICY "waitlist_insert_anon"
  ON waitlist FOR INSERT
  WITH CHECK (true);

CREATE POLICY "waitlist_select_admin"
  ON waitlist FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );


-- ============================================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================================

-- ---------------------------------------------------------------------------
-- updated_at auto-update trigger function
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION trigger_set_updated_at IS 'Automatically sets updated_at to NOW() on row update.';

-- Apply updated_at trigger to all tables with updated_at column
CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON skin_profiles
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON skin_routines
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON ingredients
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON seller_profiles
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON product_catalogs
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON seller_products
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON ai_conversations
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON storefront_config
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON product_reviews
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ---------------------------------------------------------------------------
-- Auto-create profile on Supabase auth.users insert
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, role)
  VALUES (NEW.id, 'consumer')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

COMMENT ON FUNCTION handle_new_user IS 'Auto-creates a profile and default preferences when a new user signs up.';

-- Drop existing trigger if present, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ---------------------------------------------------------------------------
-- Referral code generation trigger
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
DECLARE
  candidate TEXT;
  retries INTEGER := 0;
BEGIN
  IF NEW.referral_code IS NOT NULL THEN
    RETURN NEW;
  END IF;

  LOOP
    -- Generate an 8-character alphanumeric code
    candidate := LOWER(
      SUBSTRING(
        ENCODE(gen_random_bytes(6), 'base64')
        FROM 1 FOR 8
      )
    );
    -- Remove non-alphanumeric characters from base64
    candidate := REGEXP_REPLACE(candidate, '[^a-z0-9]', '', 'g');
    -- Pad if too short after cleanup
    IF LENGTH(candidate) < 6 THEN
      candidate := candidate || LOWER(SUBSTRING(MD5(random()::TEXT) FROM 1 FOR (8 - LENGTH(candidate))));
    END IF;
    candidate := SUBSTRING(candidate FROM 1 FOR 8);

    -- Check uniqueness
    EXIT WHEN NOT EXISTS (SELECT 1 FROM profiles WHERE referral_code = candidate);

    retries := retries + 1;
    IF retries > 10 THEN
      -- Fallback: use UUID fragment
      candidate := REPLACE(gen_random_uuid()::TEXT, '-', '');
      candidate := SUBSTRING(candidate FROM 1 FOR 8);
      EXIT;
    END IF;
  END LOOP;

  NEW.referral_code := candidate;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION generate_referral_code IS 'Generates a unique 8-char alphanumeric referral code for new profiles.';

CREATE TRIGGER set_referral_code
  BEFORE INSERT ON profiles
  FOR EACH ROW
  WHEN (NEW.referral_code IS NULL)
  EXECUTE FUNCTION generate_referral_code();

-- ---------------------------------------------------------------------------
-- Increment referral count on referral_events insert
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION handle_referral_event()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET referral_count = referral_count + 1
  WHERE id = NEW.referrer_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

COMMENT ON FUNCTION handle_referral_event IS 'Increments the referral_count on the referrer profile when a new referral event is recorded.';

CREATE TRIGGER on_referral_event_created
  AFTER INSERT ON referral_events
  FOR EACH ROW
  EXECUTE FUNCTION handle_referral_event();

-- ---------------------------------------------------------------------------
-- Increment view_count on share card access
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION increment_share_card_views(p_share_code TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE share_cards
  SET view_count = view_count + 1
  WHERE share_code = p_share_code AND active = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

COMMENT ON FUNCTION increment_share_card_views IS 'Atomically increments the view counter on a share card.';

-- ---------------------------------------------------------------------------
-- Increment conversation message count on ai_messages insert
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION handle_new_ai_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE ai_conversations
  SET message_count = message_count + 1,
      updated_at = NOW()
  WHERE id = NEW.conversation_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_ai_message_created
  AFTER INSERT ON ai_messages
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_ai_message();

-- ---------------------------------------------------------------------------
-- Update product review aggregates on review changes
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION handle_product_review_change()
RETURNS TRIGGER AS $$
DECLARE
  target_product_id UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_product_id := OLD.product_id;
  ELSE
    target_product_id := NEW.product_id;
  END IF;

  UPDATE seller_products
  SET rating = sub.avg_rating,
      review_count = sub.cnt,
      updated_at = NOW()
  FROM (
    SELECT
      product_id,
      AVG(rating)::NUMERIC(3, 2) AS avg_rating,
      COUNT(*)::INTEGER AS cnt
    FROM product_reviews
    WHERE product_id = target_product_id
    GROUP BY product_id
  ) sub
  WHERE seller_products.id = sub.product_id;

  -- Handle case where all reviews are deleted
  IF NOT FOUND AND TG_OP = 'DELETE' THEN
    UPDATE seller_products
    SET rating = NULL, review_count = 0, updated_at = NOW()
    WHERE id = target_product_id;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_product_review_change
  AFTER INSERT OR UPDATE OR DELETE ON product_reviews
  FOR EACH ROW
  EXECUTE FUNCTION handle_product_review_change();


-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------
CREATE INDEX idx_profiles_skin_type       ON profiles(skin_type);
CREATE INDEX idx_profiles_role            ON profiles(role);
CREATE INDEX idx_profiles_referral_code   ON profiles(referral_code);
CREATE INDEX idx_profiles_referred_by     ON profiles(referred_by);
CREATE INDEX idx_profiles_country         ON profiles(country);
CREATE INDEX idx_profiles_city_country    ON profiles(city, country);
CREATE INDEX idx_profiles_age_range       ON profiles(age_range);
CREATE INDEX idx_profiles_created_at      ON profiles(created_at DESC);
CREATE INDEX idx_profiles_onboarding      ON profiles(onboarding_completed) WHERE NOT onboarding_completed;

-- ---------------------------------------------------------------------------
-- User Preferences
-- ---------------------------------------------------------------------------
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_user_preferences_goals   ON user_preferences USING GIN(beauty_goals);
CREATE INDEX idx_user_preferences_concerns ON user_preferences USING GIN(skin_concerns);
CREATE INDEX idx_user_preferences_brands  ON user_preferences USING GIN(preferred_brands);

-- ---------------------------------------------------------------------------
-- Consent Records
-- ---------------------------------------------------------------------------
CREATE INDEX idx_consent_records_user_id      ON consent_records(user_id);
CREATE INDEX idx_consent_records_type         ON consent_records(consent_type);
CREATE INDEX idx_consent_records_user_type    ON consent_records(user_id, consent_type);
CREATE INDEX idx_consent_records_granted_at   ON consent_records(granted_at DESC);

-- ---------------------------------------------------------------------------
-- Skin Scans
-- ---------------------------------------------------------------------------
CREATE INDEX idx_skin_scans_user_id           ON skin_scans(user_id);
CREATE INDEX idx_skin_scans_created_at        ON skin_scans(created_at DESC);
CREATE INDEX idx_skin_scans_user_created      ON skin_scans(user_id, created_at DESC);
CREATE INDEX idx_skin_scans_body_area         ON skin_scans(body_area);
CREATE INDEX idx_skin_scans_overall_score     ON skin_scans(overall_score);
CREATE INDEX idx_skin_scans_primary_concerns  ON skin_scans USING GIN(primary_concerns);

-- ---------------------------------------------------------------------------
-- Skin Scan Metrics
-- ---------------------------------------------------------------------------
CREATE INDEX idx_skin_scan_metrics_scan_id    ON skin_scan_metrics(scan_id);
CREATE INDEX idx_skin_scan_metrics_name       ON skin_scan_metrics(metric_name);
CREATE INDEX idx_skin_scan_metrics_scan_name  ON skin_scan_metrics(scan_id, metric_name);

-- ---------------------------------------------------------------------------
-- Skin Scan Observations
-- ---------------------------------------------------------------------------
CREATE INDEX idx_skin_scan_observations_scan_id  ON skin_scan_observations(scan_id);
CREATE INDEX idx_skin_scan_observations_type     ON skin_scan_observations(observation_type);
CREATE INDEX idx_skin_scan_observations_severity ON skin_scan_observations(severity);

-- ---------------------------------------------------------------------------
-- Skin Profiles
-- ---------------------------------------------------------------------------
CREATE INDEX idx_skin_profiles_user_id        ON skin_profiles(user_id);
CREATE INDEX idx_skin_profiles_skin_type      ON skin_profiles(skin_type);
CREATE INDEX idx_skin_profiles_archetype      ON skin_profiles(skin_archetype);
CREATE INDEX idx_skin_profiles_strengths      ON skin_profiles USING GIN(strengths);
CREATE INDEX idx_skin_profiles_vulnerabilities ON skin_profiles USING GIN(vulnerabilities);

-- ---------------------------------------------------------------------------
-- Skin Routines
-- ---------------------------------------------------------------------------
CREATE INDEX idx_skin_routines_user_id        ON skin_routines(user_id);
CREATE INDEX idx_skin_routines_type           ON skin_routines(routine_type);
CREATE INDEX idx_skin_routines_active         ON skin_routines(user_id, active) WHERE active = TRUE;
CREATE INDEX idx_skin_routines_concern_focus  ON skin_routines USING GIN(concern_focus);

-- ---------------------------------------------------------------------------
-- Ingredients
-- ---------------------------------------------------------------------------
CREATE INDEX idx_ingredients_name             ON ingredients(name);
CREATE INDEX idx_ingredients_name_trgm        ON ingredients USING GIN(name gin_trgm_ops);
CREATE INDEX idx_ingredients_category         ON ingredients(category);
CREATE INDEX idx_ingredients_is_irritant      ON ingredients(is_irritant) WHERE is_irritant = TRUE;
CREATE INDEX idx_ingredients_benefits         ON ingredients USING GIN(benefits);
CREATE INDEX idx_ingredients_skin_types       ON ingredients USING GIN(skin_types_suited);
CREATE INDEX idx_ingredients_comedogenic      ON ingredients(comedogenic_rating);
CREATE INDEX idx_ingredients_aliases          ON ingredients USING GIN(aliases);

-- ---------------------------------------------------------------------------
-- Ingredient Benefits
-- ---------------------------------------------------------------------------
CREATE INDEX idx_ingredient_benefits_ingredient_id ON ingredient_benefits(ingredient_id);
CREATE INDEX idx_ingredient_benefits_evidence      ON ingredient_benefits(evidence_level);

-- ---------------------------------------------------------------------------
-- Ingredient Risks
-- ---------------------------------------------------------------------------
CREATE INDEX idx_ingredient_risks_ingredient_id    ON ingredient_risks(ingredient_id);
CREATE INDEX idx_ingredient_risks_type             ON ingredient_risks(risk_type);
CREATE INDEX idx_ingredient_risks_severity         ON ingredient_risks(severity);
CREATE INDEX idx_ingredient_risks_skin_types       ON ingredient_risks USING GIN(affected_skin_types);

-- ---------------------------------------------------------------------------
-- Seller Profiles
-- ---------------------------------------------------------------------------
CREATE INDEX idx_seller_profiles_user_id      ON seller_profiles(user_id);
CREATE INDEX idx_seller_profiles_category     ON seller_profiles(category);
CREATE INDEX idx_seller_profiles_verified     ON seller_profiles(verified) WHERE verified = TRUE;
CREATE INDEX idx_seller_profiles_active       ON seller_profiles(active) WHERE active = TRUE;
CREATE INDEX idx_seller_profiles_rating       ON seller_profiles(rating DESC NULLS LAST);
CREATE INDEX idx_seller_profiles_business_name ON seller_profiles USING GIN(business_name gin_trgm_ops);

-- ---------------------------------------------------------------------------
-- Product Catalogs
-- ---------------------------------------------------------------------------
CREATE INDEX idx_product_catalogs_seller_id   ON product_catalogs(seller_id);
CREATE INDEX idx_product_catalogs_active      ON product_catalogs(seller_id, active) WHERE active = TRUE;

-- ---------------------------------------------------------------------------
-- Seller Products
-- ---------------------------------------------------------------------------
CREATE INDEX idx_seller_products_seller_id    ON seller_products(seller_id);
CREATE INDEX idx_seller_products_catalog_id   ON seller_products(catalog_id);
CREATE INDEX idx_seller_products_category     ON seller_products(category);
CREATE INDEX idx_seller_products_brand        ON seller_products(brand);
CREATE INDEX idx_seller_products_active       ON seller_products(active) WHERE active = TRUE;
CREATE INDEX idx_seller_products_featured     ON seller_products(featured) WHERE featured = TRUE;
CREATE INDEX idx_seller_products_price        ON seller_products(price);
CREATE INDEX idx_seller_products_rating       ON seller_products(rating DESC NULLS LAST);
CREATE INDEX idx_seller_products_ingredients  ON seller_products USING GIN(ingredients);
CREATE INDEX idx_seller_products_skin_targets ON seller_products USING GIN(skin_targets);
CREATE INDEX idx_seller_products_name_trgm    ON seller_products USING GIN(name gin_trgm_ops);
CREATE INDEX idx_seller_products_created_at   ON seller_products(created_at DESC);

-- ---------------------------------------------------------------------------
-- Product Ingredients
-- ---------------------------------------------------------------------------
CREATE INDEX idx_product_ingredients_product_id    ON product_ingredients(product_id);
CREATE INDEX idx_product_ingredients_ingredient_id ON product_ingredients(ingredient_id);
CREATE INDEX idx_product_ingredients_position      ON product_ingredients(product_id, position);

-- ---------------------------------------------------------------------------
-- Recommendation Logs
-- ---------------------------------------------------------------------------
CREATE INDEX idx_recommendation_logs_user_id     ON recommendation_logs(user_id);
CREATE INDEX idx_recommendation_logs_scan_id     ON recommendation_logs(scan_id);
CREATE INDEX idx_recommendation_logs_product_id  ON recommendation_logs(product_id);
CREATE INDEX idx_recommendation_logs_score       ON recommendation_logs(match_score DESC NULLS LAST);
CREATE INDEX idx_recommendation_logs_created_at  ON recommendation_logs(created_at DESC);
CREATE INDEX idx_recommendation_logs_user_created ON recommendation_logs(user_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- Supplement Recommendations
-- ---------------------------------------------------------------------------
CREATE INDEX idx_supplement_recs_user_id     ON supplement_recommendations(user_id);
CREATE INDEX idx_supplement_recs_scan_id     ON supplement_recommendations(scan_id);
CREATE INDEX idx_supplement_recs_created_at  ON supplement_recommendations(created_at DESC);

-- ---------------------------------------------------------------------------
-- Nutrition Recommendations
-- ---------------------------------------------------------------------------
CREATE INDEX idx_nutrition_recs_user_id     ON nutrition_recommendations(user_id);
CREATE INDEX idx_nutrition_recs_scan_id     ON nutrition_recommendations(scan_id);
CREATE INDEX idx_nutrition_recs_food_items  ON nutrition_recommendations USING GIN(food_items);
CREATE INDEX idx_nutrition_recs_fruits      ON nutrition_recommendations USING GIN(fruits);
CREATE INDEX idx_nutrition_recs_herbs       ON nutrition_recommendations USING GIN(herbs);

-- ---------------------------------------------------------------------------
-- Herb Recommendations
-- ---------------------------------------------------------------------------
CREATE INDEX idx_herb_recs_user_id     ON herb_recommendations(user_id);
CREATE INDEX idx_herb_recs_scan_id     ON herb_recommendations(scan_id);
CREATE INDEX idx_herb_recs_herb_name   ON herb_recommendations(herb_name);

-- ---------------------------------------------------------------------------
-- AI Conversations
-- ---------------------------------------------------------------------------
CREATE INDEX idx_ai_conversations_user_id      ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_created_at   ON ai_conversations(created_at DESC);
CREATE INDEX idx_ai_conversations_user_created ON ai_conversations(user_id, created_at DESC);
CREATE INDEX idx_ai_conversations_scan_id      ON ai_conversations(scan_id);
CREATE INDEX idx_ai_conversations_archived     ON ai_conversations(user_id, archived) WHERE NOT archived;

-- ---------------------------------------------------------------------------
-- AI Messages
-- ---------------------------------------------------------------------------
CREATE INDEX idx_ai_messages_conversation_id   ON ai_messages(conversation_id);
CREATE INDEX idx_ai_messages_created_at        ON ai_messages(created_at);
CREATE INDEX idx_ai_messages_conv_created       ON ai_messages(conversation_id, created_at);
CREATE INDEX idx_ai_messages_role              ON ai_messages(role);

-- ---------------------------------------------------------------------------
-- Share Cards
-- ---------------------------------------------------------------------------
CREATE INDEX idx_share_cards_user_id       ON share_cards(user_id);
CREATE INDEX idx_share_cards_scan_id       ON share_cards(scan_id);
CREATE INDEX idx_share_cards_share_code    ON share_cards(share_code);
CREATE INDEX idx_share_cards_card_type     ON share_cards(card_type);
CREATE INDEX idx_share_cards_active        ON share_cards(active) WHERE active = TRUE;
CREATE INDEX idx_share_cards_created_at    ON share_cards(created_at DESC);

-- ---------------------------------------------------------------------------
-- Glow Simulations
-- ---------------------------------------------------------------------------
CREATE INDEX idx_glow_simulations_user_id    ON glow_simulations(user_id);
CREATE INDEX idx_glow_simulations_scan_id    ON glow_simulations(scan_id);
CREATE INDEX idx_glow_simulations_created_at ON glow_simulations(created_at DESC);

-- ---------------------------------------------------------------------------
-- Progress Snapshots
-- ---------------------------------------------------------------------------
CREATE INDEX idx_progress_snapshots_user_id      ON progress_snapshots(user_id);
CREATE INDEX idx_progress_snapshots_period        ON progress_snapshots(period);
CREATE INDEX idx_progress_snapshots_user_period   ON progress_snapshots(user_id, period, created_at DESC);
CREATE INDEX idx_progress_snapshots_created_at    ON progress_snapshots(created_at DESC);

-- ---------------------------------------------------------------------------
-- Community Stats
-- ---------------------------------------------------------------------------
CREATE INDEX idx_community_stats_region       ON community_stats(region);
CREATE INDEX idx_community_stats_age_range    ON community_stats(age_range);
CREATE INDEX idx_community_stats_skin_type    ON community_stats(skin_type);
CREATE INDEX idx_community_stats_composite    ON community_stats(region, age_range, skin_type);
CREATE INDEX idx_community_stats_updated_at   ON community_stats(updated_at DESC);
CREATE INDEX idx_community_stats_top_concerns ON community_stats USING GIN(top_concerns);

-- ---------------------------------------------------------------------------
-- Climate Advice
-- ---------------------------------------------------------------------------
CREATE INDEX idx_climate_advice_user_id       ON climate_advice(user_id);
CREATE INDEX idx_climate_advice_generated_at  ON climate_advice(generated_at DESC);
CREATE INDEX idx_climate_advice_user_generated ON climate_advice(user_id, generated_at DESC);

-- ---------------------------------------------------------------------------
-- Referral Events
-- ---------------------------------------------------------------------------
CREATE INDEX idx_referral_events_referrer_id  ON referral_events(referrer_id);
CREATE INDEX idx_referral_events_referred_id  ON referral_events(referred_id);
CREATE INDEX idx_referral_events_created_at   ON referral_events(created_at DESC);

-- ---------------------------------------------------------------------------
-- Storefront Config
-- ---------------------------------------------------------------------------
CREATE INDEX idx_storefront_config_seller_id  ON storefront_config(seller_id);
CREATE INDEX idx_storefront_config_custom_url ON storefront_config(custom_url) WHERE custom_url IS NOT NULL;
CREATE INDEX idx_storefront_config_active     ON storefront_config(active) WHERE active = TRUE;
CREATE INDEX idx_storefront_config_featured   ON storefront_config USING GIN(featured_products);

-- ---------------------------------------------------------------------------
-- Routine History
-- ---------------------------------------------------------------------------
CREATE INDEX idx_routine_history_user_id      ON routine_history(user_id);
CREATE INDEX idx_routine_history_routine_id   ON routine_history(routine_id);
CREATE INDEX idx_routine_history_recorded_at  ON routine_history(recorded_at DESC);
CREATE INDEX idx_routine_history_user_recorded ON routine_history(user_id, recorded_at DESC);

-- ---------------------------------------------------------------------------
-- Product Reviews
-- ---------------------------------------------------------------------------
CREATE INDEX idx_product_reviews_user_id      ON product_reviews(user_id);
CREATE INDEX idx_product_reviews_product_id   ON product_reviews(product_id);
CREATE INDEX idx_product_reviews_rating       ON product_reviews(rating);
CREATE INDEX idx_product_reviews_product_rating ON product_reviews(product_id, rating DESC);
CREATE INDEX idx_product_reviews_created_at   ON product_reviews(created_at DESC);

-- ---------------------------------------------------------------------------
-- Waitlist
-- ---------------------------------------------------------------------------
CREATE INDEX idx_waitlist_email       ON waitlist(email);
CREATE INDEX idx_waitlist_created_at  ON waitlist(created_at DESC);
CREATE INDEX idx_waitlist_converted   ON waitlist(converted) WHERE NOT converted;


-- ============================================================================
-- STORAGE BUCKETS (Supabase Storage)
-- Run these separately if using Supabase Storage
-- ============================================================================

-- INSERT INTO storage.buckets (id, name, public) VALUES ('skin-scans', 'skin-scans', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('share-cards', 'share-cards', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('seller-logos', 'seller-logos', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('storefront-banners', 'storefront-banners', true);

-- Storage policies (uncomment and run separately):
-- CREATE POLICY "Users can upload own scan images"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'skin-scans' AND auth.uid()::TEXT = (storage.foldername(name))[1]);
--
-- CREATE POLICY "Users can view own scan images"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'skin-scans' AND auth.uid()::TEXT = (storage.foldername(name))[1]);
--
-- CREATE POLICY "Public read for product images"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'product-images');
--
-- CREATE POLICY "Sellers can upload product images"
--   ON storage.objects FOR INSERT
--   WITH CHECK (
--     bucket_id = 'product-images'
--     AND EXISTS (
--       SELECT 1 FROM seller_profiles WHERE user_id = auth.uid()
--     )
--   );


-- ============================================================================
-- DONE
-- Schema contains:
--   31 tables
--   16 custom enum types
--   70+ RLS policies
--   7 trigger functions (updated_at, handle_new_user, generate_referral_code,
--     handle_referral_event, increment_share_card_views, handle_new_ai_message,
--     handle_product_review_change)
--   11 auto-update triggers (updated_at on all relevant tables)
--   4 event triggers (auth signup, referral, message count, review aggregates)
--   150+ performance indexes (B-tree, GIN, trigram)
--   CHECK constraints on all bounded numeric/text columns
-- ============================================================================
