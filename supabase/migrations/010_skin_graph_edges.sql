-- Skin Graph Data Model: Relational Edges
-- Extends the database to formalize relationships between scans, products, and outcomes.

-- 1. Product Node (Reference Catalog)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_name TEXT NOT NULL,
    product_name TEXT NOT NULL,
    ingredient_tags TEXT[], -- e.g. ['Niacinamide', 'Zinc']
    category TEXT, -- 'Cleanser', 'Serum', 'SPF'
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Used Product Edge (User -> USED_PRODUCT -> Product)
-- Records which product was used between a baseline and follow-up scan.
CREATE TABLE IF NOT EXISTS user_product_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    product_id UUID REFERENCES products(id),
    baseline_scan_id UUID REFERENCES skin_scans(id),
    followup_scan_id UUID REFERENCES skin_scans(id), -- Null until follow-up completes
    started_at TIMESTAMPTZ DEFAULT now(),
    notes TEXT
);

-- 3. SQL View for the "Skin Graph" Export
-- This view effectively flattens the graph relationships for analytical export/querying.
CREATE OR REPLACE VIEW skin_graph_export AS
SELECT 
    ss.user_id,
    ss.id as scan_id,
    ss.created_at as scan_timestamp,
    ss.skin_archetype,
    ss.environmental_context->>'humidity' as humidity,
    ss.environmental_context->>'uv_index' as uv_index,
    p.brand_name,
    p.product_name,
    p.ingredient_tags,
    sc.improvement_rate,
    sc.metrics_delta
FROM skin_scans ss
LEFT JOIN user_product_history uph ON ss.id = uph.baseline_scan_id
LEFT JOIN products p ON uph.product_id = p.id
LEFT JOIN scan_comparisons sc ON ss.id = sc.baseline_scan_id;

COMMENT ON VIEW skin_graph_export IS 'Flattend relationship view for analyzing Archetype -> Product -> Outcome correlations.';
