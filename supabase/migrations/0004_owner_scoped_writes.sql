-- Lock-down sprint: keep public browsing, require authenticated ownership for writes.

drop policy if exists "service_requests_v1_write" on service_requests;
drop policy if exists "provider_profiles_v1_write" on provider_profiles;
drop policy if exists "leads_v1_write" on leads;
drop policy if exists "activities_v1_write" on activities;

drop policy if exists "service_requests_owner_insert" on service_requests;
drop policy if exists "service_requests_owner_update" on service_requests;
drop policy if exists "provider_profiles_owner_insert" on provider_profiles;
drop policy if exists "provider_profiles_owner_update" on provider_profiles;
drop policy if exists "leads_owner_insert" on leads;
drop policy if exists "leads_owner_update" on leads;
drop policy if exists "activities_owner_insert" on activities;

create policy "service_requests_owner_insert"
  on service_requests for insert
  with check (auth.uid() = user_id);

create policy "service_requests_owner_update"
  on service_requests for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "provider_profiles_owner_insert"
  on provider_profiles for insert
  with check (auth.uid() = user_id);

create policy "provider_profiles_owner_update"
  on provider_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "leads_owner_insert"
  on leads for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from provider_profiles
      where provider_profiles.id = leads.provider_profile_id
        and provider_profiles.user_id = auth.uid()
    )
  );

create policy "leads_owner_update"
  on leads for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "activities_owner_insert"
  on activities for insert
  with check (auth.uid() = user_id);
