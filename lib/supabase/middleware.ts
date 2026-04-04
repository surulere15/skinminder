import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  // Skip auth when Supabase is not configured (development mode)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach((cookie) => request.cookies.set(cookie.name, cookie.value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach((cookie) =>
            supabaseResponse.cookies.set(cookie.name, cookie.value, cookie.options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Redirect unauthenticated users from app pages to login
  const isAppRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/scan') ||
    request.nextUrl.pathname.startsWith('/skin-twin') ||
    request.nextUrl.pathname.startsWith('/ingredients') ||
    request.nextUrl.pathname.startsWith('/routine') ||
    request.nextUrl.pathname.startsWith('/nutrition') ||
    request.nextUrl.pathname.startsWith('/consultant') ||
    request.nextUrl.pathname.startsWith('/history') ||
    request.nextUrl.pathname.startsWith('/settings') ||
    request.nextUrl.pathname.startsWith('/referrals') ||
    request.nextUrl.pathname.startsWith('/onboarding');

  if (!user && isAppRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users from auth pages to dashboard
  const isAuthRoute = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup';
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
