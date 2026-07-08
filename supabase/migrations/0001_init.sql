create table if not exists service_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  title text not null,
  category text not null,
  description text not null,
  location text not null,
  budget_cents integer,
  status text not null default 'open'
);

alter table service_requests enable row level security;
drop policy if exists "service_requests_v1_read" on service_requests;
create policy "service_requests_v1_read" on service_requests for select using (true);
drop policy if exists "service_requests_v1_write" on service_requests;
create policy "service_requests_v1_write" on service_requests for all using (true) with check (true);

create table if not exists provider_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  display_name text not null,
  category text not null,
  bio text not null,
  location text not null,
  contact_email text not null,
  hourly_rate_cents integer,
  is_paid boolean not null default false,
  is_available boolean not null default true
);

alter table provider_profiles enable row level security;
drop policy if exists "provider_profiles_v1_read" on provider_profiles;
create policy "provider_profiles_v1_read" on provider_profiles for select using (true);
drop policy if exists "provider_profiles_v1_write" on provider_profiles;
create policy "provider_profiles_v1_write" on provider_profiles for all using (true) with check (true);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  provider_profile_id uuid not null references provider_profiles(id),
  service_request_id uuid not null references service_requests(id),
  status text not null default 'new',
  note text,
  match_score numeric,
  match_score_source text,
  match_score_confidence numeric,
  match_score_review_status text default 'unreviewed'
);

alter table leads enable row level security;
drop policy if exists "leads_v1_read" on leads;
create policy "leads_v1_read" on leads for select using (true);
drop policy if exists "leads_v1_write" on leads;
create policy "leads_v1_write" on leads for all using (true) with check (true);

create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  actor text,
  meta jsonb
);

alter table activities enable row level security;
drop policy if exists "activities_v1_read" on activities;
create policy "activities_v1_read" on activities for select using (true);
drop policy if exists "activities_v1_write" on activities;
create policy "activities_v1_write" on activities for all using (true) with check (true);

insert into provider_profiles (id, display_name, category, bio, location, contact_email, hourly_rate_cents, is_paid, is_available) values
  ('a1000000-0000-0000-0000-000000000001', 'Maria Santos', 'Cleaning', 'Professional home and office cleaner with 8 years experience.', 'Austin, TX', 'maria@example.com', 4500, true, true),
  ('a1000000-0000-0000-0000-000000000002', 'James Okafor', 'Plumbing', 'Licensed plumber. Emergency callouts welcome.', 'Austin, TX', 'james@example.com', 8000, false, true),
  ('a1000000-0000-0000-0000-000000000003', 'Lena Kim', 'Tutoring', 'Math and science tutor, grades 6-12, 5-star rated.', 'Remote', 'lena@example.com', 5500, true, true);

insert into service_requests (id, title, category, description, location, budget_cents, status) values
  ('b1000000-0000-0000-0000-000000000001', 'Deep clean 3-bed apartment before move-out', 'Cleaning', 'Need a thorough clean of a 3-bedroom apartment including oven and bathrooms. Available this weekend.', 'Austin, TX', 25000, 'open'),
  ('b1000000-0000-0000-0000-000000000002', 'Fix leaking kitchen tap urgently', 'Plumbing', 'Kitchen tap dripping constantly. Need someone this week.', 'Austin, TX', 15000, 'open'),
  ('b1000000-0000-0000-0000-000000000003', 'Weekly math tutoring for 8th grader', 'Tutoring', 'My son needs weekly 1-hour math sessions leading up to finals.', 'Remote', 8000, 'open'),
  ('b1000000-0000-0000-0000-000000000004', 'Office deep clean every Monday morning', 'Cleaning', 'Small 10-person office, needs weekly clean before staff arrive.', 'Austin, TX', 60000, 'open');

insert into leads (provider_profile_id, service_request_id, status, note) values
  ('a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'new', 'Available Saturday morning.'),
  ('a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000004', 'contacted', 'Sent pricing details.'),
  ('a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', 'new', 'Can come Wednesday.'),
  ('a1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000003', 'won', 'Sessions booked every Thursday.'),
  ('a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'new', null);

insert into activities (entity_type, entity_id, action, actor, meta) values
  ('lead', 'b1000000-0000-0000-0000-000000000001', 'lead_created', 'Maria Santos', '{"request_title":"Deep clean 3-bed apartment before move-out"}'),
  ('lead', 'b1000000-0000-0000-0000-000000000003', 'status_changed', 'Lena Kim', '{"from":"contacted","to":"won"}'),
  ('provider_profile', 'a1000000-0000-0000-0000-000000000001', 'payment_completed', 'Maria Santos', '{"plan":"monthly","amount_cents":2900}');