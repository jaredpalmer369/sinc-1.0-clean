import { createMiddlewareClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import type { Database } from '@/types/supabase';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createMiddlewareClient<Database>({ req, res });

  await supabase.auth.getSession(); // ensures session cookie is handled

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/prompts/:path*', '/signout'],
};
