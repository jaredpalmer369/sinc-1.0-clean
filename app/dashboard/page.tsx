import { cookies } from "next/headers";
import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { ShareToggle } from "@/components/ShareToggle";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
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

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if no user (middleware should also handle this)
  if (!user) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Please sign in</h1>
        <Link href="/login" className="underline">
          Go to login
        </Link>
      </main>
    );
  }

  // Get prompts for this user
  const { data: prompts } = await supabase
    .from("prompts")
    .select("id,title,is_public,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <nav className="text-sm space-x-4">
          <Link className="underline" href="/marketplace">
            Marketplace
          </Link>
          <Link className="underline" href="/">
            Landing
          </Link>
        </nav>
      </header>

      {/* Prompt list */}
      <section>
        <h2 className="text-lg font-medium mb-3">Your Prompts</h2>
        <div className="space-y-2">
          {(prompts ?? []).map((p) => (
            <div
              key={p.id}
              className="border rounded p-3 flex items-center justify-between"
            >
              <div>
                <div className="font-medium">{p.title || "(untitled)"}</div>
                <div className="text-xs text-gray-500">
                  Crea
