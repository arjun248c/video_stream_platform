-- Create policies for videos table
-- Allow anyone to read videos
CREATE POLICY "Allow public read access" ON videos
  FOR SELECT USING (true);

-- Allow authenticated users to insert their own videos
CREATE POLICY "Allow authenticated users to insert their own videos" ON videos
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own videos
CREATE POLICY "Allow users to update their own videos" ON videos
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Allow users to delete their own videos
CREATE POLICY "Allow users to delete their own videos" ON videos
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
