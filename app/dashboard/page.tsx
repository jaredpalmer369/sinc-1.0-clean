export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect('/login');
  }

  return (
    <main className="p-4">
      <h1 className="text-xl font-semibold">Welcome, {session.user.email}</h1>
      <p className="mt-2">You're now viewing the dashboard.</p>
    </main>
  );
}
