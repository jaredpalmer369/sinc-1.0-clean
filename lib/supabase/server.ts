import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';

// Create an adapter that conforms to Supabase's expected cookie interface
export const createSupabaseServerClient = () => {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // Supabase doesn't require set support in most cases — skip in server components
        },
        remove(name: string, options: any) {
          // Supabase doesn't require remove support in most cases — skip in server components
        },
      },
    }
  );
};

