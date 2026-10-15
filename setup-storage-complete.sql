-- ============================================
-- Supabase Storage Policies for cake-images bucket
-- Run this as the project owner in Supabase SQL Editor
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access cake-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload access cake-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update access cake-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete access cake-images" ON storage.objects;
DROP POLICY IF EXISTS "Public bucket access" ON storage.buckets;

-- Enable RLS on storage if not already enabled
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public read access to cake-images bucket
-- This allows anyone to view images
CREATE POLICY "Public read access cake-images"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'cake-images');

-- Policy 2: Allow authenticated users to upload to cake-images bucket
-- This allows logged-in admins to upload images
CREATE POLICY "Authenticated upload access cake-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'cake-images');

-- Policy 3: Allow authenticated users to update images in cake-images bucket
-- This allows logged-in admins to replace/update images
CREATE POLICY "Authenticated update access cake-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'cake-images')
WITH CHECK (bucket_id = 'cake-images');

-- Policy 4: Allow authenticated users to delete images from cake-images bucket
-- This allows logged-in admins to delete images
CREATE POLICY "Authenticated delete access cake-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'cake-images');

-- Policy 5: Allow public read access to bucket info
-- This is needed for the bucket to be accessible
CREATE POLICY "Public bucket access"
ON storage.buckets FOR SELECT
TO anon
USING (true);

-- Policy 6: Allow authenticated users to read bucket info
CREATE POLICY "Authenticated bucket access"
ON storage.buckets FOR SELECT
TO authenticated
USING (true);

-- ============================================
-- Verify policies are created
-- ============================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('objects', 'buckets')
  AND schemaname = 'storage'
ORDER BY tablename, policyname;
