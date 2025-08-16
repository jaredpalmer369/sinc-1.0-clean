// app/marketplace/page.tsx
import { isFlagEnabled } from "@/lib/featureFlags";
import Link from "next/link";

export default async function MarketplacePage() {
  const enabled = await isFlagEnabled("marketplace_enabled");

  if (!enabled) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">Marketplace Coming Soon</h1>
        <p className="mt-2 text-gray-600">
          This feature is currently disabled. Check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Prompt Marketplace</h1>
      <p className="mb-6 text-gray-600">
        Browse and share community prompts. Pick one to view details.
      </p>
      <ul className="space-y-2">
        <li>
          <Link href="/marketplace/example-prompt" className="text-blue-600 hover:underline">
            Example Prompt
          </Link>
        </li>
        {/* Later: map real data from Supabase */}
      </ul>
    </div>
  );
}
