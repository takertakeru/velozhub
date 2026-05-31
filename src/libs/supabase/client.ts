import { createClient } from "@supabase/supabase-js";
import { env } from "@/env";
import type { Database } from "./types";

/**
 * Singleton Supabase client for the whole app.
 *
 * The session is persisted in localStorage and auto-refreshed, so the auth
 * provider in `src/features/auth` just wraps this client. The same instance is
 * reused for Postgres queries (via PostgREST) and Realtime subscriptions, which
 * keeps the access token in sync across both.
 */
export const supabase = createClient<Database>(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);
