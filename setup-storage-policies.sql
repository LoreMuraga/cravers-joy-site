-- Enable RLS on storage
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Allow public read access to cake-images bucket
CREATE POLICY "Public read access cake-images"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'cake-images');

-- Allow authenticated users to upload to cake-images bucket
CREATE POLICY "Authenticated upload access cake-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'cake-images');

-- Allow authenticated users to update/delete in cake-images bucket
CREATE POLICY "Authenticated update access cake-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'cake-images');

CREATE POLICY "Authenticated delete access cake-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'cake-images');

-- Allow public read access to bucket info
CREATE POLICY "Public bucket access"
ON storage.buckets FOR SELECT
TO anon
USING (true);
