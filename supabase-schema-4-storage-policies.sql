-- Set up storage policies
-- Allow anyone to read from the videos bucket
CREATE POLICY "Allow public read access for videos" ON storage.objects
  FOR SELECT USING (bucket_id = 'videos');

-- Allow authenticated users to upload to the videos bucket
CREATE POLICY "Allow authenticated users to upload videos" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'videos' AND
    auth.uid() = owner
  );

-- Allow users to update their own videos in the bucket
CREATE POLICY "Allow users to update their own videos" ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id = 'videos' AND
    auth.uid() = owner
  );

-- Allow users to delete their own videos from the bucket
CREATE POLICY "Allow users to delete their own videos" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'videos' AND
    auth.uid() = owner
  );
