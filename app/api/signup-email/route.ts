import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 🔁 Dynamic CORS header generator
function getCorsHeaders(origin: string) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
  }
}

// ✅ Preflight (OPTIONS) handler
export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin') || '*'
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  })
}

// ✅ POST handler
export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin') || '*'
  const corsHeaders = getCorsHeaders(origin)

  try {
    const body = await req.json()
    const { email, source = origin } = body

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return new NextResponse(JSON.stringify({ error: 'Invalid or missing email' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data, error } = await supabase
      .from('waitlist')
      .insert([{ email, source }])

    if (error) {
      const status = error.code === '23505' ? 409 : 500
      return new NextResponse(
        JSON.stringify({
          error: error.code === '23505' ? 'Email already registered' : error.message,
        }),
        {
          status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    return new NextResponse(
      JSON.stringify({ message: 'Successfully added to waitlist', data }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (err: any) {
    console.error('Unexpected error:', err)
    return new NextResponse(JSON.stringify({ error: 'Unexpected server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}
