import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Exact public paths (always allowed)
 * Add any additional public routes (marketing/legal) here.
 */
const PUBLIC_PATHS = new Set<string>([
  "/",               // marketing handoff
  "/login",
  "/signup",
  "/auth/callback",  // must remain public for magic link/OAuth
  "/terms",
  "/privacy",
]);

/**
 * Public prefixes (always allowed)
 * Keep /api/auth open so login/signup can function.
 */
const PUBLIC_PREFIXES = ["/api/auth"];

/**
 * Protected prefixes (require session)
 * NOTE: You explicitly asked to NOT protect /prompts right now.
 */
const PROTECTED_PREFIXES = ["/dashboard", "/marketplace"];

function isExactPublic(pathname: string) {
  return PUBLIC_PATHS.has(pathname);
}
function startsWithAny(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Fast-path: ignore static files and Next internals
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.startsWith("/assets/") ||
    /\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|map)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Public routes and auth APIs are always allowed
  if (isExactPublic(pathname) || startsWithAny(pathname, PUBLIC_PREFIXES)) {
    return NextResponse.next();
  }

  // If not a protected area, let it pass (e.g., /prompts while you debug)
  const isProtected = startsWithAny(pathname, PROTECTED_PREFIXES);
  if (!isProtected) {
    return NextResponse.next();
  }

  // Build mutable response for Supabase cookie bridge
  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookies) => cookies.forEach((c) => res.cookies.set(c)),
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login", req.url);
    // Preserve the original path + query so you can route back after login
    const redirectedFrom = pathname + (search || "");
    loginUrl.searchParams.set("redirectedFrom", redirectedFrom);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated → proceed
  return res;
}

/**
 * Run on all app routes except Next internals and common static assets.
 * We do NOT exclude /api here because we allow /api/auth explicitly above.
 */
export const config = {
  matcher: [
    "/((?!_next/|static/|assets/|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|map)$).*)",
  ],
};
