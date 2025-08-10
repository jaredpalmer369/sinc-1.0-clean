"use client";

import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import ShareToggle from "@/components/ShareToggle";

export default async function DashboardPage() {
  const supabase = createClient();

  // Get prompts for this user
  const {
    data: prompts,
    error
  } = await supabase
    .from("prompts")
    .select("id, title, is_public, created_at")
    .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading prompts:", error);
  }

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

      {/* Prompt List */}
      <section>
        <h2 className="text-lg font-medium mb-3">Your Prompts</h2>
        <div className="space-y-2">
          {(prompts ?? []).map((p) => (
            <div
              key={p.id}
              className="border rounded p-3 flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-xs text-gray-500">
                  Created: {new Date(p.created_at).toLocaleString()}
                </p>
              </div>
              <ShareToggle promptId={p.id} isPublic={p.is_public} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
