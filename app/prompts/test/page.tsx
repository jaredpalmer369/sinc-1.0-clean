// app/prompts/test/page.tsx
export const dynamic = "force-dynamic";

export default function PromptsTest() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-xl font-semibold">OK: /prompts/test</h1>
      <p className="text-sm text-gray-600 mt-2">
        If you can see this, /prompts/* is NOT being redirected by middleware or a layout.
      </p>
    </main>
  );
}
