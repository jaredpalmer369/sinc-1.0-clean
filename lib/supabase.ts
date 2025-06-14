// lib/supabase.ts

import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// These should be defined in your environment variables (.env.local and Vercel)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Server/client shared Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Component-specific helper (for use in client components)
export const supabaseClientComponent = () => createClientComponentClient()
