-- Add RLS policies for skin_regions table
ALTER TABLE skin_regions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own skin regions"
ON skin_regions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM skin_scans
    WHERE skin_scans.id = skin_regions.scan_id
    AND skin_scans.user_id = auth.uid()
  )
);

CREATE POLICY "System can insert skin regions"
ON skin_regions FOR INSERT
WITH CHECK (true);
