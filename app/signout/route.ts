import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient()
    await supabase.auth.signOut()

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/login`)
  } catch (error) {
    console.error('Signout error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST() {
  return GET()
}
