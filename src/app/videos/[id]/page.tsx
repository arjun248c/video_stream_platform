'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ReactPlayer from 'react-player';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  created_at: string;
}

export default function VideoPage({ params }: { params: { id: string } }) {
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isConfigured } = useAuth();

  useEffect(() => {
    async function fetchVideo() {
      // If Supabase is not configured, don't try to fetch the video
      if (!isConfigured || !supabase) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) {
          throw error;
        }

        setVideo(data);
      } catch (error: any) {
        setError(error.message || 'Error fetching video');
      } finally {
        setLoading(false);
      }
    }

    fetchVideo();
  }, [params.id, isConfigured]);

  if (!isConfigured) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p className="font-bold">Supabase Not Configured</p>
          <p>
            Please set up your Supabase environment variables to enable video playback.
            See the <Link href="/SUPABASE_SETUP.md" className="underline">Supabase Setup Guide</Link> for instructions.
          </p>
        </div>
        <div className="mt-4">
          <Link href="/videos" className="text-blue-600 hover:underline">
            ← Back to videos
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Video not found'}
        </div>
        <Link
          href="/videos"
          className="text-blue-600 hover:underline"
        >
          ← Back to videos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Link
        href="/videos"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back to videos
      </Link>

      <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
      <p className="text-gray-500 mb-6">
        {new Date(video.created_at).toLocaleDateString()}
      </p>

      <div className="aspect-video mb-6 bg-black rounded-lg overflow-hidden">
        <ReactPlayer
          url={video.url}
          width="100%"
          height="100%"
          controls
          playing
        />
      </div>

      {video.description && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="whitespace-pre-line">{video.description}</p>
        </div>
      )}
    </div>
  );
}
