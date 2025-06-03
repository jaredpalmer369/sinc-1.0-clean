import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

export const createRouteHandlerSupabaseClient = () =>
  createRouteHandlerClient<Database>({ cookies })
