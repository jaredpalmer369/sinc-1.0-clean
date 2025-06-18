import { createClient } from '@/lib/supabase/server'

export const createRouteHandlerSupabaseClient = () => createClient()
