import { createClient } from '@supabase/supabase-js';

// Check if environment variables are set and valid
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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

// Check if we have valid configuration
const hasValidConfig = isValidUrl(supabaseUrl) &&
                      supabaseAnonKey &&
                      supabaseAnonKey !== 'your-supabase-anon-key';

// Log warning if not configured
if (!hasValidConfig) {
  console.warn(
    'Supabase environment variables are not set or invalid. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file. See SUPABASE_SETUP.md for instructions.'
  );
}

// Only create the client if we have valid configuration
let supabaseClient = null;

if (hasValidConfig) {
  try {
    supabaseClient = createClient(supabaseUrl!, supabaseAnonKey!);
  } catch (error) {
    console.error('Error creating Supabase client:', error);
  }
}

export const supabase = supabaseClient;
