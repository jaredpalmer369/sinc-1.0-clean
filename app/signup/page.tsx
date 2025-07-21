'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/signup-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      router.push('/thanks');
    } else {
      alert('Submission failed, please try again.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <label htmlFor="email" className="block mb-2 font-medium">
          Email:
        </label>
        <input
          id="email"
          type="email"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-900"
        >
          Join Waitlist
        </button>
      </form>
    </div>
  );
}
