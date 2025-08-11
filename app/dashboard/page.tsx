import Link from "next/link";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n: string) => cookieStore.get(n)?.value } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return (
      <main className="max-w-3xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Welcome to Sinq!</h1>
        <p className="text-sm text-gray-600">Please sign in to view your dashboard.</p>
        <div className="flex gap-3">
          <Link className="rounded bg-black text-white px-4 py-2" href="/login">Sign in</Link>
          <Link className="rounded border px-4 py-2" href="/signup">Create account</Link>
        </div>
      </main>
    );
  }

  const { data: prompts } = await supabase
    .from("prompts")
    .select("id,title,created_at,is_public")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex gap-3">
          <Link className="rounded border px-3 py-2" href="/marketplace">Marketplace</Link>
          <Link className="rounded bg-black text-white px-3 py-2" href="/prompts/new">Create Prompt</Link>
        </div>
      </header>

      <section>
        <h2 className="text-base font-medium mb-3">Your Prompts</h2>
        {!prompts || prompts.length === 0 ? (
          <div className="border rounded p-6">
            <p className="text-sm text-gray-600 mb-3">No prompts yet.</p>
            <Link className="underline" href="/prompts/new">Create your first prompt →</Link>
          </div>
        ) : (
          <ul className="divide-y">
            {prompts.map((p) => (
              <li key={p.id} className="py-3 flex items-center justify-between">
                <div>
                  <Link className="underline" href={`/prompts/${p.id}`}>
                    {p.title || "(untitled)"}
                  </Link>
                  <div className="text-xs text-gray-500">
                    {new Date(p.created_at).toLocaleString()} • {p.is_public ? "Public" : "Private"}
                  </div>
                </div>
                <div className="flex gap-3 text-sm">
                  <Link className="underline" href={`/prompts/${p.id}`}>Open</Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
