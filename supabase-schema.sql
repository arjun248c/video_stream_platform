-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create videos table
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);

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
