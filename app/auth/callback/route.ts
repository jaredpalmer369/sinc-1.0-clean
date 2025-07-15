// import { createRouteHandlerClient } from '@/lib/supabase'
// import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  // Temporarily disable auth callback
  console.log('Auth callback temporarily disabled')

  // if (code) {
  //   const supabase = createRouteHandlerClient()
  //   await supabase.auth.exchangeCodeForSession(code)
  // }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
} 