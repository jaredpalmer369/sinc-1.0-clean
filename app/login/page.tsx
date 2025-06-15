'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createBrowserClient<Database>();
    const { error } = await supabase.auth.signInWithOtp({ email });

    setLoading(false);

    if (error) {
      alert('Login error: ' + error.message);
    } else {
      alert('Check your email for the login link!');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Sign in</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="p-2 bg-blue-600 text-white rounded"
        >
          {loading ? 'Loading...' : 'Send Magic Link'}
        </button>
      </form>
    </div>
  );
}
