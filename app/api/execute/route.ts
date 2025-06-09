import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  const { promptId } = await req.json()

  // Get the prompt content
  const { data: prompt, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('id', promptId)
    .single()

  if (error || !prompt) {
    return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
  }

  const user_id = prompt.user_id

  // Simulate OpenAI response for now
  const output = `Executed result of prompt: "${prompt.title}"\n\n${prompt.content}`

  // Save to executions table
  const { error: execError } = await supabase.from('executions').insert({
    user_id,
    prompt_id: promptId,
    output
  })

  if (execError) {
    return NextResponse.json({ error: 'Failed to save execution' }, { status: 500 })
  }

  return NextResponse.json({ output })
}
