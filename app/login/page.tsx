'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (!error) {
      router.push('/check-email');
    } else {
      alert('Login failed');
    }
  };

  return (
    <main className="min-h-screen p-6 flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-2xl mb-4">Login</h1>
      <input
        type="email"
        className="border border-gray-500 rounded p-2 mb-4 text-black"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        className="bg-blue-600 px-4 py-2 rounded"
        onClick={handleLogin}
      >
        Send Magic Link
      </button>
    </main>
  );
}
