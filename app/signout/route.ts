import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.signOut()

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/login`)
  } catch (error) {
    console.error('Signout error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
