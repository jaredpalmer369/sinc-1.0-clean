export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const res = NextResponse.next();

  if (!prompt || prompt.trim() === '') {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // TODO: Replace with real execution logic (e.g. OpenAI call)
  const fakeResult = `Echo: ${prompt}`;

  // Save to Supabase
  const { error: insertError } = await supabase.from('prompt_runs').insert({
    user_id: user.id,
    prompt,
    result: fakeResult,
  });

  if (insertError) {
    return NextResponse.json({ error: 'Failed to save prompt run' }, { status: 500 });
  }

  return NextResponse.json({ result: fakeResult });
}
