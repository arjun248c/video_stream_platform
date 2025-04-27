'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';

export default function Navigation() {
  const { user, signOut, isLoading, isConfigured } = useAuth();

  return (
    <>
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            VideoStream
          </Link>
          <div className="space-x-4">
            <Link href="/videos" className="hover:text-gray-300">
              Browse Videos
            </Link>

            {isConfigured && !isLoading && (
              <>
                {user ? (
                  <>
                    <Link href="/upload" className="hover:text-gray-300">
                      Upload
                    </Link>
                    <button
                      onClick={signOut}
                      className="hover:text-gray-300"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link href="/auth" className="hover:text-gray-300">
                    Sign In
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </nav>

      {!isConfigured && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <div className="container mx-auto">
            <p className="font-bold">Supabase Not Configured</p>
            <p>
              Please set up your Supabase environment variables. See the{' '}
              <Link href="/SUPABASE_SETUP.md" className="underline">
                Supabase Setup Guide
              </Link>{' '}
              for instructions.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
