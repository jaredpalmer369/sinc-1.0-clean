import { cookies } from "next/headers";
import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { isFlagEnabled } from "@/lib/featureFlags";

export const dynamic = "force-dynamic";

export default async function MarketplacePage({ searchParams }: { searchParams?: { search?: string } }) {
  const enabled = await isFlagEnabled("enable_marketplace");
  if (!enabled) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">Marketplace</h1>
        <p className="text-sm text-gray-600">Marketplace is currently disabled.</p>
      </main>
    );
  }

  const q = (searchParams?.search || "").trim();
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

  let query = supabase
    .from("prompts")
    .select("id,title,description,use_count,created_at")
    .eq("is_public", true)
    .order("use_count", { ascending: false });

  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  }

  const { data: prompts = [] } = await query;

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Prompt Marketplace</h1>
        <form className="flex gap-2" action="/marketplace">
          <input
            name="search"
            placeholder="Search prompts..."
            defaultValue={q}
            className="border rounded px-3 py-2"
          />
          <button className="rounded bg-black text-white px-4 py-2" type="submit">
            Search
          </button>
        </form>
      </header>

      <section className="space-y-3">
        {prompts.length === 0 && <p className="text-sm text-gray-600">No public prompts found.</p>}
        {prompts.map((p) => (
          <Link
            key={p.id}
            href={`/marketplace/${p.id}`}
            className="block border rounded p-4 hover:bg-gray-50"
          >
            <div className="font-medium">{p.title || "(untitled)"}</div>
            {p.description && (
              <div className="text-sm text-gray-600 mt-1 line-clamp-2">{p.description}</div>
            )}
            <div className="text-xs text-gray-500 mt-1">Uses: {p.use_count}</div>
          </Link>
        ))}
      </section>
    </main>
  );
}
