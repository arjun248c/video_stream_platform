# Supabase Setup Guide for VideoStream Platform

This guide will walk you through setting up Supabase for the VideoStream platform.

## 1. Create a Supabase Account and Project

1. Go to [Supabase](https://supabase.com) and sign up for an account if you don't have one.
2. Create a new project:
   - Click on "New Project"
   - Enter a name for your project (e.g., "VideoStream")
   - Set a secure database password
   - Choose a region closest to your users
   - Click "Create new project"

## 2. Get Your API Keys

1. Once your project is created, go to the project dashboard
2. In the left sidebar, click on "Project Settings" (the gear icon)
3. Click on "API" in the settings menu
4. You'll find your project URL and anon/public key here
5. Copy these values to use in your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 3. Set Up Database Schema

1. In the Supabase dashboard, go to the "SQL Editor" section
2. Click "New Query"
3. Paste the contents of the `supabase-schema.sql` file from this project
4. Click "Run" to execute the SQL commands

## 4. Set Up Storage

The SQL commands will create a storage bucket for videos, but you should verify:

1. Go to the "Storage" section in the Supabase dashboard
2. You should see a bucket named "videos"
3. If not, create it manually:
   - Click "New Bucket"
   - Name it "videos"
   - Check "Public bucket" to allow public access to videos
   - Click "Create bucket"

## 5. Configure Authentication

1. Go to the "Authentication" section in the Supabase dashboard
2. Under "Providers", ensure "Email" is enabled
3. Optionally, you can configure additional providers like Google, GitHub, etc.
4. Under "URL Configuration":
   - Set your site URL (e.g., http://localhost:3000 for development)
   - Add redirect URLs (e.g., http://localhost:3000/auth/callback)

## 6. Test Your Setup

After completing the above steps and configuring your application with the correct environment variables, you should be able to:

1. Sign up and sign in users
2. Upload videos to the storage bucket
3. Store video metadata in the database
4. Retrieve and play videos

## Troubleshooting

If you encounter issues:

1. Check that your environment variables are correctly set
2. Verify that the SQL schema was properly executed
3. Ensure the storage bucket is properly configured
4. Check the Supabase dashboard logs for any errors
