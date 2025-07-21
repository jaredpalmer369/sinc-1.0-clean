import { createSupabaseServerClient } from '@/lib/supabase/server'

export const createRouteHandlerSupabaseClient = () => createSupabaseServerClient()
