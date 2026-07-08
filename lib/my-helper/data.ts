import { createPublicDatabaseClient } from "./supabase";
import type { LeadWithRequest, ProviderProfile, ServiceRequest } from "./types";

export async function listOpenRequests() {
  const supabase = createPublicDatabaseClient();
  const { data, error } = await supabase
    .from("service_requests")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []) as ServiceRequest[];
}

export async function getRequest(id: string) {
  const supabase = createPublicDatabaseClient();
  const { data, error } = await supabase
    .from("service_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data as ServiceRequest;
}

export async function listProviders() {
  const supabase = createPublicDatabaseClient();
  const { data, error } = await supabase
    .from("provider_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []) as ProviderProfile[];
}

export async function getProvider(id: string) {
  const supabase = createPublicDatabaseClient();
  const { data, error } = await supabase
    .from("provider_profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data as ProviderProfile;
}

export async function listLeadsForProvider(providerProfileId: string) {
  const supabase = createPublicDatabaseClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*, service_requests(*)")
    .eq("provider_profile_id", providerProfileId)
    .order("match_score", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []) as LeadWithRequest[];
}
