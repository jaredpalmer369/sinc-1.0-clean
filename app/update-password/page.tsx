'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-sm mx-auto mt-20">
      <input
        type="password"
        placeholder="New Password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        className="w-full p-2 border border-gray-300 rounded"
      />
      <button type="submit" className="w-full bg-black text-white p-2 rounded">
        Update Password
      </button>
      {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
    </form>
  );
}
