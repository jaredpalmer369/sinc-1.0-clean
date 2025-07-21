export const dynamic = 'force-dynamic';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function NewPromptPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect('/login');
  }

  return (
    <main className="p-4">
      <h1 className="text-xl font-semibold">Create a New Prompt</h1>
      {/* Add your prompt form here */}
    </main>
  );
}
