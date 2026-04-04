-- Final Product & Ingredient Seed for SkinMinder Production

-- Ingredients
INSERT INTO ingredients (name, function, description, benefits, skin_types_suited, is_irritant, irritant_severity) VALUES
('Niacinamide (Vitamin B3)', 'Stabilizer', 'A water-soluble vitamin that works with the natural substances in your skin to help visibly improve enlarged pores, uneven skin tone, and dullness.', ARRAY['Pore reduction', 'Brightening', 'Barrier repair'], ARRAY['oily', 'dry', 'combination', 'sensitive'], false, 'none'),
('Hyaluronic Acid', 'Humectant', 'A naturally occurring substance in the skin that has the stunning capacity to attract and hold onto 1000x its weight in moisture.', ARRAY['Deep hydration', 'Plumping', 'Fine line reduction'], ARRAY['all', 'dry', 'dehydrated'], false, 'none'),
('Retinol', 'Active', 'A gold-standard anti-aging ingredient that accelerates cell turnover and collagen production.', ARRAY['Wrinkle reduction', 'Texture smoothing', 'Acne control'], ARRAY['dry', 'oily', 'combination'], true, 'medium'),
('Salicylic Acid (BHA)', 'Exfoliant', 'A oil-soluble exfoliant that penetrates deep into pores to dissolve debris and sebum.', ARRAY['Unclogging pores', 'Oil control', 'Anti-inflammatory'], ARRAY['oily', 'acne-prone'], true, 'low');

-- Products
INSERT INTO products (name, brand, category, description, price, skin_targets, match_index) VALUES
('Glow Resilient Serum', 'SkinMinder Labs', 'serum', 'A high-performance stabilization serum powered by 10% Niacinamide and Peptides.', 65.00, ARRAY['dullness', 'uneven tone'], 98),
('Barrier Balance Cream', 'SkinMinder Labs', 'moisturizer', 'An ultra-nourishing lipid-replacement cream for compromised skin barriers.', 48.00, ARRAY['dryness', 'sensitivity'], 95),
('Mineral Silk SPF 50', 'SkinMinder Labs', 'sunscreen', 'A zinc-based, non-greasy mineral shield for all-day protection.', 38.00, ARRAY['uv protection'], 94),
('Double Action Cleanser', 'SkinMinder Labs', 'cleanser', 'A pH-balanced foaming oil cleanser that removes impurities without stripping.', 28.00, ARRAY['cleansing'], 92);

-- Community Stats
INSERT INTO community_stats (metric_name, metric_value, region) VALUES
('active_monitors', '15204', 'Global'),
('total_analyses', '142500', 'Global'),
('avg_skin_score', '74', 'Global');
