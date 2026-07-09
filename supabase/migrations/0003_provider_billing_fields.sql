alter table provider_profiles
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists stripe_subscription_status text,
  add column if not exists stripe_current_period_end timestamptz;

create index if not exists provider_profiles_stripe_customer_idx
  on provider_profiles (stripe_customer_id);

create index if not exists provider_profiles_stripe_subscription_idx
  on provider_profiles (stripe_subscription_id);
