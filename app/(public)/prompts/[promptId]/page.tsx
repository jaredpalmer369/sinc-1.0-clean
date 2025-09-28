export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import ShareToggle from "@/components/ShareToggle";

type ExecutionRow = { id: string; output: string | null; created_at: string; };
type PromptRow = {
  id: string; user_id: string; title: string | null; description: string | null;
  content: string | null; is_public: boolean | null; use_count: number | null; created_at: string;
};

export default async function PromptDetail({ params }: { params: { promptId: string } }) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: prompt, error: pErr }, { data: executions, error: eErr }] = await Promise.all([
    supabase
      .from("prompts")
      .select("id,user_id,title,description,content,is_public,use_count,created_at")
      .eq("id", params.promptId)
      .maybeSingle<PromptRow>(),
    supabase
      .from("executions")
      .select("id,output,created_at")
      .eq("prompt_id", params.promptId)
      .order("created_at", { ascending: false })
      .limit(10) as unknown as Promise<{ data: ExecutionRow[] | null; error: any }>,
  ]);

  if (pErr) console.error("Prompt load error:", pErr);
  if (eErr) console.error("Executions load error:", eErr);

  if (!prompt) return notFound();

  const isOwner = !!user && user.id === prompt.user_id;
  if (!isOwner && !prompt.is_public) return notFound();

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <nav className="text-sm flex gap-4">
        <Link className="underline" href="/dashboard">← Dashboard</Link>
        <Link className="underline" href="/marketplace">Marketplace</Link>
        {prompt.is_public && <Link className="underline" href={`/marketplace/${prompt.id}`}>Public page</Link>}
      </nav>

      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{prompt.title || "(untitled)"}</h1>
          <p className="text-xs text-gray-500 mt-1">
            Created {new Date(prompt.created_at).toLocaleString()} • Uses: {prompt.use_count ?? 0}
          </p>
          {prompt.description && <p className="text-sm text-gray-700 mt-2">{prompt.description}</p>}
        </div>
        <div className="flex items-center gap-3">
          <RunPromptButton promptId={prompt.id} />
          {isOwner && <ShareToggle promptId={prompt.id} isPublic={Boolean(prompt.is_public)} />}
        </div>
      </header>

      {prompt.content && (
        <section>
          <h2 className="text-base font-medium mb-2">Prompt Content</h2>
          <pre className="text-sm whitespace-pre-wrap border rounded p-4 bg-gray-50">{prompt.content}</pre>
        </section>
      )}

      <section>
        <h2 className="text-base font-medium mb-2">Recent Runs</h2>
        {executions && executions.length > 0 ? (
          <ul className="space-y-3">
            {executions.map((ex) => (
              <li key={ex.id} className="border rounded p-3">
                <div className="text-xs text-gray-500 mb-2">{new Date(ex.created_at).toLocaleString()}</div>
                <pre className="text-sm whitespace-pre-wrap">{ex.output || "(no output)"}</pre>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600">No runs yet. Click “Run Prompt”.</p>
        )}
      </section>
    </main>
  );
}

/** Tiny client component to run & refresh */
function RunPromptButton({ promptId }: { promptId: string }) {
  "use client";
  const React = require("react");
  const { useRouter } = require("next/navigation");
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function run() {
    try {
      setLoading(true);
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptId }),
      });
      if (!res.ok) console.error("execute failed");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={run}
      disabled={loading}
      className="rounded bg-black text-white px-4 py-2 disabled:opacity-60"
      title="Run this prompt and refresh the page to show the latest output"
    >
      {loading ? "Running..." : "Run Prompt"}
    </button>
  );
}
