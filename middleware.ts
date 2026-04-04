import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const ALLOWED_ORIGINS = [
  'https://skinminder.ai',
  'https://www.skinminder.ai',
  'http://localhost:3000',
  'http://localhost:8081',
  'exp://localhost:8081',
  process.env.NEXT_PUBLIC_APP_URL,
].filter(Boolean) as string[];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  // CORS headers for API routes (mobile app needs cross-origin access)
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin') || '';

    if (ALLOWED_ORIGINS.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Max-Age', '86400');
    }

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : '',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Max-Age': '86400',
        },
      });
    }
  }

  // Skip auth when Supabase is not configured (development mode)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return response;
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

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/scan/:path*',
    '/skin-twin/:path*',
    '/ingredients/:path*',
    '/routine/:path*',
    '/nutrition/:path*',
    '/consultant/:path*',
    '/history/:path*',
    '/settings/:path*',
    '/referrals/:path*',
    '/onboarding/:path*',
    '/login',
    '/signup',
  ],
};
