import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Function to validate URL
const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false;

  // Check if it's a placeholder value
  if (url === 'your-supabase-url') return false;

  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

export async function middleware(request: NextRequest) {
  // Check if Supabase is configured with real values
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Check if we have valid configuration
  const hasValidConfig = isValidUrl(supabaseUrl) &&
                        supabaseAnonKey &&
                        supabaseAnonKey !== 'your-supabase-anon-key';

  if (!hasValidConfig) {
    // If Supabase is not configured, redirect to home page with a query parameter
    const redirectUrl = new URL('/?setup=required', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  try {
    // Create a Supabase client configured to use cookies
    const supabase = createServerClient(
      supabaseUrl!,
      supabaseAnonKey!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: Record<string, unknown>) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Refresh session if expired
    const { data: { session } } = await supabase.auth.getSession();

    // If no session and trying to access protected routes
    if (!session && request.nextUrl.pathname.startsWith('/upload')) {
      const redirectUrl = new URL('/auth', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  } catch (error: unknown) {
    console.error('Error in middleware:', error);
    // If there's an error with Supabase, redirect to home page
    const redirectUrl = new URL('/?error=supabase', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ['/upload/:path*'],
};
