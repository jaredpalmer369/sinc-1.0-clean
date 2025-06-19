import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { prompt } = await req.json()
  const res = NextResponse.next()

  if (!prompt || prompt.trim() === '') {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
  }

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // TODO: Replace with real execution logic (e.g. OpenAI call)
  const fakeResult = `Echo: ${prompt}`

  // Save to Supabase
  await supabase.from('prompt_runs').insert([
    {
      user_id: user.id,
      prompt,
      result: fakeResult,
    },
  ])

  return NextResponse.json({ result: fakeResult })
}
