import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://waitlist.sinqai.xyz',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email, source = 'waitlist.sinqai.xyz' } = body

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return new NextResponse(JSON.stringify({ error: 'Invalid or missing email' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  try {
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
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        }
      )
    }

    return new NextResponse(
      JSON.stringify({ message: 'Successfully added to waitlist', data }),
      {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    )
  } catch (err: any) {
    console.error('Unexpected error:', err)
    return new NextResponse(JSON.stringify({ error: 'Unexpected server error' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }
}
