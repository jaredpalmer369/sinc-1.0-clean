import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const supabase = createClient()

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const promptId = searchParams.get('promptId')

  if (!promptId) {
    return NextResponse.json({ error: 'Missing promptId' }, { status: 400 })
  }

  const { data: executions, error } = await supabase
    .from('executions')
    .select('*')
    .eq('prompt_id', promptId)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch executions' }, { status: 500 })
  }

  return NextResponse.json({ executions })
}
