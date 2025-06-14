import { cookies, headers } from 'next/headers';
import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

export const createClient = () =>
  createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies,
      headers,
    }
  );
