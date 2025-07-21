import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email, source = 'landing-page' } = body

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return new NextResponse(
      JSON.stringify({ error: 'Invalid or missing email' }),
      {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': 'https://waitlist.sinqai.xyz',
          'Content-Type': 'application/json',
        },
      }
    )
  }

  try {
    const { data, error } = await supabase
      .from('waitlist')
      .insert([{ email, source }])

    if (error) {
      if (error.code === '23505') {
        return new NextResponse(
          JSON.stringify({ message: 'Email already registered' }),
          {
            status: 409,
            headers: {
              'Access-Control-Allow-Origin': 'https://waitlist.sinqai.xyz',
              'Content-Type': 'application/json',
            },
          }
        )
      }

      return new NextResponse(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': 'https://waitlist.sinqai.xyz',
            'Content-Type': 'application/json',
          },
        }
      )
    }

    return new NextResponse(
      JSON.stringify({ message: 'Successfully added to waitlist', data }),
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': 'https://waitlist.sinqai.xyz',
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (err: any) {
    console.error('Unexpected error:', err)
    return new NextResponse(
      JSON.stringify({ error: 'Unexpected server error' }),
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': 'https://waitlist.sinqai.xyz',
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
