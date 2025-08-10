import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { isFlagEnabled } from "@/lib/featureFlags";

export const dynamic = "force-dynamic";

export default async function PublicPromptDetail({ params }: { params: { id: string } }) {
  const enabled = await isFlagEnabled("enable_marketplace");
  if (!enabled) notFound();

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: prompt } = await supabase
    .from("prompts")
    .select("id,title,description,content,is_public,use_count,created_at")
    .eq("id", params.id)
    .eq("is_public", true)
    .maybeSingle();

  if (!prompt) notFound();

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <nav className="text-sm">
        <Link href="/marketplace" className="underline">← Back to Marketplace</Link>
      </nav>
      <header>
        <h1 className="text-2xl font-semibold">{prompt.title || "(untitled)"}</h1>
        <p className="text-xs text-gray-500 mt-1">
          Public prompt • Uses: {prompt.use_count} • {new Date(prompt.created_at).toLocaleString()}
        </p>
      </header>
      {prompt.description && <p className="text-sm text-gray-700">{prompt.description}</p>}
      {prompt.content && (
        <pre className="text-sm whitespace-pre-wrap border rounded p-4 bg-gray-50">{prompt.content}</pre>
      )}
      <button className="rounded bg-black text-white px-4 py-2" disabled>
        Use this prompt (coming soon)
      </button>
    </main>
  );
}
