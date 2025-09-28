import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function GET(
  req: NextRequest,
  { params }: { params: { provider: "google" | "github" } }
) {
  const provider = params.provider;
  if (!["google", "github"].includes(provider)) {
    return NextResponse.json({ error: "Unsupported provider" }, { status: 400 });
  }

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (setCookies) => setCookies.forEach((c) => cookieStore.set(c)),
      },
    }
  );

  const origin = new URL(req.url).origin;
  const redirectTo = process.env.SITE_URL ? `${process.env.SITE_URL}/auth/callback` : `${origin}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo },
  });
  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, origin));
  }
  // Redirect user to provider auth url
  return NextResponse.redirect(data.url);
}
