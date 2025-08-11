"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function NewPromptPage() {
  const supabase = createClient();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim() && !content.trim()) {
      setError("Please add a title or content.");
      return;
    }
    setSaving(true);

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr || !user) {
      setSaving(false);
      setError("You must be signed in.");
      return;
    }

    const { data, error: insertErr } = await supabase
      .from("prompts")
      .insert({
        user_id: user.id,
        title: title.trim() || "(untitled)",
        description: description.trim() || null,
        content: content,
        is_public: isPublic,
      })
      .select("id")
      .single();

    setSaving(false);

    if (insertErr || !data?.id) {
      setError(insertErr?.message || "Failed to create prompt.");
      return;
    }

    // Go straight to the prompt’s detail page
    router.push(`/prompts/${data.id}`);
  };

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Create Prompt</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="e.g., Product description generator"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={2}
            placeholder="Short summary shown in the marketplace"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Prompt Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded px-3 py-2 font-mono"
            rows={10}
            placeholder="Write the actual prompt here..."
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={() => setIsPublic((v) => !v)}
          />
          Share publicly (show in Marketplace)
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-black text-white px-4 py-2 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Create Prompt"}
          </button>
        </div>
      </form>
    </main>
  );
}
