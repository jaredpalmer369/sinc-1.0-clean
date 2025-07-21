'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      setUserEmail(session.user.email);
    };

    getUser();
  }, []);

  return (
    <main className="min-h-screen p-6 flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-2xl mb-4">Welcome to your Dashboard</h1>
      {userEmail ? (
        <p className="text-lg">Logged in as: {userEmail}</p>
      ) : (
        <p>Loading user session...</p>
      )}
    </main>
  );
}
