import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const supabase = createServerComponentClient({ cookies })
  const { prompt, promptId } = await req.json()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const start = Date.now()

  // 🧠 Send to OpenAI
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await res.json()
  const latency = Date.now() - start

  if (!res.ok) {
    console.error('OpenAI Error:', data)
    return NextResponse.json({ error: 'OpenAI call failed' }, { status: 500 })
  }

  const output = data.choices?.[0]?.message?.content || ''
  const tokens_used = data.usage?.total_tokens || null

  // 💾 Save execution to prompt_outputs
  const { error: insertError } = await supabase.from('prompt_outputs').insert({
    user_id: session.user.id,
    prompt_id: promptId,
    output_text: output,
    tokens_used,
    latency_ms: latency,
    created_at: new Date().toISOString(),
  })

  if (insertError) {
    console.error('Supabase insert error:', insertError)
    return NextResponse.json({ error: 'Failed to save output' }, { status: 500 })
  }

  // 🔁 Increment run_count via RPC
  const { error: updateError } = await supabase.rpc('increment_run_count', {
    prompt_id_input: promptId,
  })

  if (updateError) {
    console.error('Run count update error:', updateError)
  }

  return NextResponse.json({ result: output })
}
