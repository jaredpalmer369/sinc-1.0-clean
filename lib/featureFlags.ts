import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function isFlagEnabled(key: string) {
  // Check env var first
  const envKey = `NEXT_PUBLIC_${key.toUpperCase()}`;
  const envValue = process.env[envKey];
  if (envValue === "true") return true;
  if (envValue === "false") return false;

  // Fallback to DB flag
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

  const { data } = await supabase
    .from("app_flags")
    .select("enabled")
    .eq("key", key)
    .maybeSingle();

  return !!data?.enabled;
}
