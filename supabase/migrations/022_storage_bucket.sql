-- Create Supabase Storage bucket for scan images
-- Run this in Supabase SQL Editor or via the Dashboard

-- Create the 'scans' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'scans',
  'scans',
  true,
  10485760, -- 10MB max
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- RLS policies for the scans bucket
-- Allow authenticated users to upload their own scans
CREATE POLICY "Users can upload their own scans"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'scans'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to read their own scans
CREATE POLICY "Users can read their own scans"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'scans'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own scans
CREATE POLICY "Users can delete their own scans"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'scans'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access to scan images (for sharing)
CREATE POLICY "Anyone can view scan images"
ON storage.objects FOR SELECT
USING (bucket_id = 'scans');
