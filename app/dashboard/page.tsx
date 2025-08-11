import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

type PromptRow = {
  id: string;
  title: string | null;
  created_at: string;
  is_public: boolean | null;
};

export default async function DashboardPage() {
  const supabase = createClient();

  // Redirect unauthenticated users to /login
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="mb-4 text-2xl font-semibold">Please sign in</h1>
        <Link className="underline" href="/login">Go to login</Link>
      </main>
    );
  }

  const { data: prompts } = await supabase
    .from("prompts")
    .select("id,title,created_at,is_public")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-8">
      {/* Top bar */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <nav className="text-sm text-gray-600">
            <Link className="underline" href="/marketplace">Marketplace</Link>
            <span className="px-2">·</span>
            <a className="underline" href="/">Landing</a>
          </nav>
        </div>
        <div className="flex gap-2">
          <Link
            className="rounded border px-3 py-2"
            href="/prompts/new"
          >
            + New Prompt
          </Link>
          <Link
            className="rounded border px-3 py-2"
            href="/signout"
          >
            Sign out
          </Link>
        </div>
      </header>

      {/* Your prompts */}
      <section>
        <h2 className="mb-3 text-lg font-medium">Your Prompts</h2>

        {!prompts?.length ? (
          <div className="rounded border p-4">
            <p className="mb-3">No prompts yet.</p>
            <Link className="underline" href="/prompts/new">Create your first prompt →</Link>
          </div>
        ) : (
          <ul className="divide-y">
            {prompts.map((p: PromptRow) => (
              <li key={p.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <Link
                    href={`/prompts/${p.id}`}
                    className="truncate underline"
                    title={p.title ?? "Untitled prompt"}
                  >
                    {p.title ?? "Untitled prompt"}
                  </Link>
                  <div className="text-xs text-gray-500">
                    {new Date(p.created_at).toLocaleString()} {p.is_public ? "· Public" : ""}
                  </div>
                </div>
                <Link
                  href={`/prompts/${p.id}`}
                  className="shrink-0 rounded border px-3 py-1 text-sm"
                >
                  Open
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
