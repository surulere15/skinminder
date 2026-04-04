import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// ---------------------------------------------------------------------------
// SSR Route Handler Client (reads auth from cookies in App Router)
// ---------------------------------------------------------------------------
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: any[]) {
          try {
            cookiesToSet.forEach((cookie) =>
              cookieStore.set(cookie.name, cookie.value, cookie.options)
            );
          } catch {
            // The `setAll` method can fail in Server Components (read-only).
            // This is fine — we only need it in Route Handlers and Actions.
          }
        },
      },
    }
  );
}

// ---------------------------------------------------------------------------
// Service Role Client (admin operations, bypasses RLS)
// ---------------------------------------------------------------------------
let serviceClient: ReturnType<typeof createSupabaseClient> | null = null;

export function getServiceClient() {
  if (!serviceClient) {
    serviceClient = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return serviceClient;
}

// ---------------------------------------------------------------------------
// User Client (for client-side with explicit access token)
// ---------------------------------------------------------------------------
export function createUserClient(accessToken: string) {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
  );
}
