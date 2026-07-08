import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./env";

export function createPublicDatabaseClient() {
  const { url, anonKey } = getSupabaseEnv();

  if (!url || !anonKey) {
    throw new Error("Supabase is not configured. Run `vercel env pull .env.local`.");
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function createServerWriteClient() {
  const { url, anonKey, serviceRoleKey } = getSupabaseEnv();
  const key = serviceRoleKey || anonKey;

  if (!url || !key) {
    throw new Error("Supabase is not configured. Run `vercel env pull .env.local`.");
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
