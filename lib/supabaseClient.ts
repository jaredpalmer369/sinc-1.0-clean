'use client'

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

export const supabase = createBrowserSupabaseClient<Database>()
