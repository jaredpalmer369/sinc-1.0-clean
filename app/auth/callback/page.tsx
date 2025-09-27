// app/auth/callback/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";

export const dynamic = "force-dynamic";

type Search = { code?: string; error?: string; next?: string };

export default async function AuthCallbackPage({ searchParams }: { searchParams: Search }) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (setCookies) => setCookies.forEach((c) => cookieStore.set(c)),
      },
    }
  );

  if (searchParams.error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-8 text-zinc-200">
          <h1 className="text-xl font-semibold mb-2">Sign-in error</h1>
          <p className="mb-6 text-zinc-400">{decodeURIComponent(searchParams.error)}</p>
          <div className="flex gap-3">
            <a href="/login" className="px-4 py-2 rounded-lg border border-zinc-700">Try again</a>
            <a href="/" className="px-4 py-2 rounded-lg border border-zinc-700">Go home</a>
          </div>
        </div>
      </main>
    );
  }

  if (searchParams.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(searchParams.code);
    if (!error) redirect(searchParams.next ? decodeURIComponent(searchParams.next) : "/dashboard");
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-8 text-zinc-200">
          <h1 className="text-xl font-semibold mb-2">Verification failed</h1>
          <p className="mb-6 text-zinc-400">{error?.message}</p>
          <a href="/login" className="px-4 py-2 rounded-lg border border-zinc-700">Back to login</a>
        </div>
      </main>
    );
  }

  const { data } = await supabase.auth.getSession();
  if (data.session) redirect(searchParams.next ? decodeURIComponent(searchParams.next) : "/dashboard");
  redirect("/login");
}
