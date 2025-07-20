
import AuthForm from '@/components/auth/AuthForm'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Get started with your free account
          </p>
        </div>
        <AuthForm type="signup" />
      </div>
    </div>
  )
} 'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/login`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (!error) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSignup} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl mb-4 font-bold">Sign Up</h2>
        {submitted ? (
          <p className="text-green-600">Check your email for a confirmation link.</p>
        ) : (
          <>
            <input
              className="w-full p-2 border border-gray-300 rounded mb-3"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="w-full p-2 border border-gray-300 rounded mb-3"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 transition">
              Sign Up
            </button>
            <p className="text-sm text-center mt-4">
              Already have an account?{' '}
              <a href="/login" className="text-blue-500 underline">
                Sign In
              </a>
            </p>
          </>
        )}
      </form>
    </div>
  );
}
