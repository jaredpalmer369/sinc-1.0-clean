'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Image from 'next/image';

// Part 1: Navigation + Hero + Mic (Done)
// Part 2: Floating Background Particles

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        console.warn('Missing Supabase env vars');
        return;
      }

      const supabase = createBrowserClient(supabaseUrl, supabaseKey);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.push('/dashboard');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[Geist]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image className="dark:invert" src="/next.svg" alt="Sinq" width={180} height={37} priority />
        <h1 className="text-4xl font-bold tracking-tight">Welcome to Sinq!</h1>
        <p className="text-lg text-gray-500">Start by signing in or creating an account.</p>
      </main>
    </div>
  );
}
