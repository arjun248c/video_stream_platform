'use client';

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function Home() {
  const searchParams = useSearchParams();
  const setupRequired = searchParams.get('setup') === 'required';
  const supabaseError = searchParams.get('error') === 'supabase';
  const { isConfigured } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      {setupRequired && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8 w-full max-w-3xl text-left">
          <p className="font-bold">Supabase Setup Required</p>
          <p>
            Please set up your Supabase environment variables to enable full functionality.
            See the <Link href="/SUPABASE_SETUP.md" className="underline">Supabase Setup Guide</Link> for instructions.
          </p>
        </div>
      )}

      {supabaseError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 w-full max-w-3xl text-left">
          <p className="font-bold">Supabase Connection Error</p>
          <p>
            There was an error connecting to Supabase. Please check your configuration and try again.
          </p>
        </div>
      )}

      <h1 className="text-4xl font-bold mb-6">Welcome to VideoStream</h1>
      <p className="text-xl mb-8 max-w-2xl">
        A platform where you can upload and stream videos online. Share your content with the world!
      </p>
      <div className="flex gap-4">
        <Link
          href="/videos"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Browse Videos
        </Link>
        <Link
          href="/upload"
          className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Upload Video
        </Link>
      </div>

      {!isConfigured && (
        <div className="mt-12 p-6 bg-gray-100 rounded-lg max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
          <ol className="list-decimal list-inside text-left space-y-2">
            <li>Create a <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase</a> account</li>
            <li>Create a new Supabase project</li>
            <li>Copy your Supabase URL and anon key from the project settings</li>
            <li>Add these values to your <code className="bg-gray-200 px-2 py-1 rounded">.env.local</code> file</li>
            <li>Run the SQL commands from <code className="bg-gray-200 px-2 py-1 rounded">supabase-schema.sql</code> in the Supabase SQL editor</li>
            <li>Restart the development server</li>
          </ol>
          <p className="mt-4 text-sm text-gray-600">
            For detailed instructions, see the <Link href="/SUPABASE_SETUP.md" className="text-blue-600 hover:underline">Supabase Setup Guide</Link>.
          </p>
        </div>
      )}
    </div>
  );
}
