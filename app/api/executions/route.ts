export const dynamic = 'force-dynamic';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const supabase = createSupabaseServerClient();
  const { searchParams } = new URL(req.url);
  const promptId = searchParams.get('promptId');

  if (!promptId) {
    return NextResponse.json({ error: 'Missing promptId' }, { status: 400 });
  }

  // If prompt_id is a number in your DB, parse promptId to an integer
  const parsedPromptId = isNaN(Number(promptId)) ? promptId : Number(promptId);

  const { data: executions, error } = await supabase
    .from('executions')
    .select('*')
    .eq('prompt_id', parsedPromptId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch executions' }, { status: 500 });
  }

  return NextResponse.json({ executions });
}
