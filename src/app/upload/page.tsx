'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState('');
  const [error, setError] = useState('');
  const { isConfigured } = useAuth();

  const onDrop = async (acceptedFiles: File[]) => {
    if (!isConfigured || !supabase) {
      setError('Supabase is not configured. Please set up your environment variables.');
      return;
    }

    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (!file.type.startsWith('video/')) {
      setError('Please upload a video file');
      return;
    }

    if (!videoTitle.trim()) {
      setError('Please enter a video title');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            setUploadProgress(Math.round((progress.loaded / progress.total) * 100));
          },
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      // Save video metadata to database
      const { error: dbError } = await supabase
        .from('videos')
        .insert([
          {
            title: videoTitle,
            description: videoDescription,
            url: publicUrl,
            file_path: filePath
          },
        ]);

      if (dbError) {
        throw dbError;
      }

      setUploadedVideoUrl(publicUrl);
      setVideoTitle('');
      setVideoDescription('');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error uploading video';
      setError(errorMessage);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': []
    },
    disabled: uploading || !isConfigured,
    maxFiles: 1
  });

  if (!isConfigured) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Upload Video</h1>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p className="font-bold">Supabase Not Configured</p>
          <p>
            Please set up your Supabase environment variables to enable video uploads.
            See the <Link href="/SUPABASE_SETUP.md" className="underline">Supabase Setup Guide</Link> for instructions.
          </p>
        </div>
        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Upload Video</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {uploadedVideoUrl ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>Video uploaded successfully!</p>
          <Link
            href="/videos"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Go to videos page
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video Title
            </label>
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter video title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video Description
            </label>
            <textarea
              value={videoDescription}
              onChange={(e) => setVideoDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter video description"
              rows={4}
            />
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
            }`}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <div>
                <p className="mb-2">Uploading... {uploadProgress}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-lg mb-2">
                  {isDragActive
                    ? "Drop the video file here"
                    : "Drag and drop a video file here, or click to select"}
                </p>
                <p className="text-sm text-gray-500">
                  Supported formats: MP4, WebM, MOV, etc.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
