// app/prompts/page.tsx
export const dynamic = "force-dynamic";

export default function PromptsIndex() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-xl font-semibold">Prompts</h1>
      <p className="text-sm text-gray-600 mt-2">
        Open a prompt from your Dashboard list, or visit /prompts/test to verify routing.
      </p>
    </main>
  );
}
