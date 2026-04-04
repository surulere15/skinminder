-- Community Statistics View (Top Concerns)
CREATE OR REPLACE VIEW community_stats AS
SELECT 
  concern,
  count(*) as frequency
FROM (
  SELECT unnest(primary_concerns) as concern
  FROM skin_scans
) sub
GROUP BY concern
ORDER BY frequency DESC;

-- Ingredient Demand View (Aggregated from product recommendations)
CREATE OR REPLACE VIEW ingredient_demand_stats AS
SELECT 
  ingredient,
  count(*) as demand_count
FROM (
  SELECT unnest(p.ingredients) as ingredient
  FROM recommendations r
  JOIN products p ON r.product_id = p.id
) sub
GROUP BY ingredient
ORDER BY demand_count DESC;

-- Archetype Distribution View
CREATE OR REPLACE VIEW archetype_distribution AS
SELECT 
  archetype,
  count(*) as user_count
FROM (
  SELECT (analysis_raw->>'skin_archetype') as archetype
  FROM skin_scans
  WHERE analysis_raw->>'skin_archetype' IS NOT NULL
) sub
GROUP BY archetype
ORDER BY user_count DESC;

-- Product Performance Intelligence (PPI) View
-- Aggregates average improvement rates per product based on scan comparisons
CREATE OR REPLACE VIEW product_performance_stats AS
SELECT 
  r.product_id,
  p.name as product_name,
  avg(sc.overall_improvement) as avg_improvement,
  count(sc.id) as sample_size
FROM scan_comparisons sc
JOIN recommendations r ON sc.baseline_scan_id = r.scan_id
JOIN products p ON r.product_id = p.id
GROUP BY r.product_id, p.name
ORDER BY avg_improvement DESC;
