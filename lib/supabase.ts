import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { flowType: "implicit" } },
);

// Server Actions run without access to the browser's localStorage session,
// so callers must pass the user's access token to authenticate as them —
// otherwise every request hits RLS as an anonymous user.
export function createSupabaseClient(accessToken?: string) {
  if (!accessToken) return supabase;

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } },
  );
}
