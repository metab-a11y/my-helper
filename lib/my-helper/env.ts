export function getSupabaseEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

export function hasSupabaseEnv() {
  const env = getSupabaseEnv();
  return Boolean(env.url && env.anonKey);
}

export function getStripeEnv() {
  return {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  };
}

export function getAppUrl(origin?: string | null) {
  return origin || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}
