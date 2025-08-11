"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${location.origin}/dashboard` }});
    setLoading(false);
    setMsg(error ? error.message : "Magic link sent! Check your email.");
  };

  return (
    <main className="mx-auto max-w-md px-6 py-16 space-y-8">
      <h1 className="text-2xl font-semibold">Create your account</h1>
      <form onSubmit={handleSignup} className="space-y-3">
        <input
          type="email"
          required
          value={email}
          onChange={e=>setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-xl border px-4 py-2"
        />
        <button disabled={loading} className="w-full rounded-xl bg-black px-4 py-2 text-white">
          {loading ? "Sending..." : "Send magic link"}
        </button>
      </form>
      <p className="text-sm text-neutral-600">
        Already have an account? <Link className="underline" href="/login">Log in</Link>
      </p>
    </main>
  );
}
