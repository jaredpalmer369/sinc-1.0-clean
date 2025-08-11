"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${location.origin}/dashboard` }});
    setLoading(false);
    setMsg(error ? error.message : "Magic link sent! Check your email.");
  };

  const oauth = async (provider: "github" | "google") => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${location.origin}/dashboard` }});
  };

  return (
    <main className="mx-auto max-w-md px-6 py-16 space-y-8">
      <h1 className="text-2xl font-semibold">Log in</h1>

      <form onSubmit={handleEmailLogin} className="space-y-3">
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

      <div className="flex items-center gap-3">
        <button onClick={()=>oauth("github")} className="flex-1 rounded-xl border px-4 py-2">Continue with GitHub</button>
        <button onClick={()=>oauth("google")} className="flex-1 rounded-xl border px-4 py-2">Google</button>
      </div>

      {msg && <p className="text-sm text-neutral-600">{msg}</p>}

      <p className="text-sm text-neutral-600">
        New here? <Link className="underline" href="/signup">Create an account</Link>
      </p>
    </main>
  );
}
