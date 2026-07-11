import { createServerWriteClient } from "./supabase";
import type { LeadStatus, ProviderProfile, ServiceRequest } from "./types";

type CreateRequestInput = {
  title: string;
  category: string;
  description: string;
  location: string;
  contactEmail: string;
  budgetCents: number | null;
};

type CreateProviderInput = {
  displayName: string;
  category: string;
  bio: string;
  location: string;
  contactEmail: string;
  hourlyRateCents: number | null;
};

function requireText(value: string, label: string) {
  const trimmed = value.trim();
  if (!trimmed) throw new Error(`${label} is required.`);
  return trimmed;
}

export function computeMatchScore(request: ServiceRequest, provider: ProviderProfile) {
  let score = 0;

  if (request.category.toLowerCase() === provider.category.toLowerCase()) score += 50;
  if (
    request.location.toLowerCase() === provider.location.toLowerCase() ||
    request.location.toLowerCase() === "remote" ||
    provider.location.toLowerCase() === "remote"
  ) {
    score += 30;
  }
  if (
    typeof request.budget_cents === "number" &&
    typeof provider.hourly_rate_cents === "number" &&
    request.budget_cents >= provider.hourly_rate_cents
  ) {
    score += 20;
  }

  return Math.min(score, 100);
}

export async function createServiceRequest(input: CreateRequestInput) {
  const supabase = createServerWriteClient();
  const payload = {
    title: requireText(input.title, "Title"),
    category: requireText(input.category, "Category"),
    description: requireText(input.description, "Description"),
    location: requireText(input.location, "Location"),
    contact_email: requireText(input.contactEmail, "Contact email"),
    budget_cents: input.budgetCents,
    status: "open",
  };

  const { data, error } = await supabase
    .from("service_requests")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  await supabase.from("activities").insert({
    entity_type: "service_request",
    entity_id: data.id,
    action: "request_posted",
    actor: data.contact_email,
    meta: { title: data.title, category: data.category },
  });

  return data as ServiceRequest;
}

export async function createProviderProfile(input: CreateProviderInput) {
  const supabase = createServerWriteClient();
  const payload = {
    display_name: requireText(input.displayName, "Display name"),
    category: requireText(input.category, "Category"),
    bio: requireText(input.bio, "Bio"),
    location: requireText(input.location, "Location"),
    contact_email: requireText(input.contactEmail, "Contact email"),
    hourly_rate_cents: input.hourlyRateCents,
    is_available: true,
  };

  const { data, error } = await supabase
    .from("provider_profiles")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  await supabase.from("activities").insert({
    entity_type: "provider_profile",
    entity_id: data.id,
    action: "provider_created",
    actor: data.display_name,
    meta: { category: data.category, location: data.location },
  });

  return data as ProviderProfile;
}

export async function insertLead({
  providerProfileId,
  serviceRequestId,
  note,
}: {
  providerProfileId: string;
  serviceRequestId: string;
  note?: string;
}) {
  const supabase = createServerWriteClient();

  const { data: provider, error: providerError } = await supabase
    .from("provider_profiles")
    .select("*")
    .eq("id", providerProfileId)
    .single();
  if (providerError || !provider) throw new Error(providerError?.message || "Provider not found.");

  const { data: request, error: requestError } = await supabase
    .from("service_requests")
    .select("*")
    .eq("id", serviceRequestId)
    .single();
  if (requestError || !request) throw new Error(requestError?.message || "Request not found.");

  const score = computeMatchScore(request as ServiceRequest, provider as ProviderProfile);
  const { data: existingLeads, error: existingError } = await supabase
    .from("leads")
    .select("*")
    .eq("provider_profile_id", providerProfileId)
    .eq("service_request_id", serviceRequestId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (existingError) throw new Error(existingError.message);
  if (existingLeads?.[0]) {
    return { lead: existingLeads[0], provider: provider as ProviderProfile, wasCreated: false };
  }

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .insert({
      provider_profile_id: providerProfileId,
      service_request_id: serviceRequestId,
      status: "new",
      note: note?.trim() || null,
      match_score: score,
      match_score_source: "rule-based-v1",
      match_score_confidence: 1.0,
      match_score_review_status: "unreviewed",
    })
    .select("*")
    .single();

  if (leadError) throw new Error(leadError.message);

  await supabase.from("activities").insert({
    entity_type: "lead",
    entity_id: lead.id,
    action: "lead_created",
    actor: provider.display_name,
    meta: {
      request_title: request.title,
      provider_profile_id: providerProfileId,
      service_request_id: serviceRequestId,
      match_score: score,
    },
  });

  return { lead, provider: provider as ProviderProfile, wasCreated: true };
}

export async function updateLeadStatus({
  leadId,
  status,
}: {
  leadId: string;
  status: LeadStatus;
}) {
  if (!["new", "contacted", "won", "lost"].includes(status)) {
    throw new Error("Unsupported lead status.");
  }

  const supabase = createServerWriteClient();
  const { data: before, error: beforeError } = await supabase
    .from("leads")
    .select("*, provider_profiles(display_name)")
    .eq("id", leadId)
    .single();

  if (beforeError || !before) throw new Error(beforeError?.message || "Lead not found.");

  const { data: lead, error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", leadId)
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  await supabase.from("activities").insert({
    entity_type: "lead",
    entity_id: leadId,
    action: "status_changed",
    actor: before.provider_profiles?.display_name || "Provider",
    meta: { from: before.status, to: status },
  });

  return lead;
}

export async function setProviderPaid({
  providerProfileId,
  stripeCustomerId,
  stripeSessionId,
  stripeSubscriptionId,
  stripeSubscriptionStatus,
  stripeCurrentPeriodEnd,
  actor = "Stripe",
}: {
  providerProfileId: string;
  stripeCustomerId?: string | null;
  stripeSessionId?: string;
  stripeSubscriptionId?: string | null;
  stripeSubscriptionStatus?: string | null;
  stripeCurrentPeriodEnd?: string | null;
  actor?: string;
}) {
  const supabase = createServerWriteClient();
  const updatePayload: Record<string, string | boolean | null> = { is_paid: true };

  if (stripeCustomerId !== undefined) updatePayload.stripe_customer_id = stripeCustomerId;
  if (stripeSubscriptionId !== undefined) {
    updatePayload.stripe_subscription_id = stripeSubscriptionId;
  }
  if (stripeSubscriptionStatus !== undefined) {
    updatePayload.stripe_subscription_status = stripeSubscriptionStatus;
  }
  if (stripeCurrentPeriodEnd !== undefined) {
    updatePayload.stripe_current_period_end = stripeCurrentPeriodEnd;
  }

  const { data: provider, error } = await supabase
    .from("provider_profiles")
    .update(updatePayload)
    .eq("id", providerProfileId)
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  await supabase.from("activities").insert({
    entity_type: "provider_profile",
    entity_id: providerProfileId,
    action: "payment_completed",
    actor,
    meta: {
      stripe_customer_id: stripeCustomerId,
      stripe_session_id: stripeSessionId,
      stripe_subscription_id: stripeSubscriptionId,
      stripe_subscription_status: stripeSubscriptionStatus,
      plan: "monthly",
    },
  });

  return provider as ProviderProfile;
}

export async function recordProviderSubscriptionStatus({
  stripeSubscriptionId,
  stripeSubscriptionStatus,
  stripeCurrentPeriodEnd,
}: {
  stripeSubscriptionId: string;
  stripeSubscriptionStatus: string;
  stripeCurrentPeriodEnd?: string | null;
}) {
  const supabase = createServerWriteClient();

  const { data: provider, error } = await supabase
    .from("provider_profiles")
    .update({
      stripe_subscription_status: stripeSubscriptionStatus,
      stripe_current_period_end: stripeCurrentPeriodEnd,
    })
    .eq("stripe_subscription_id", stripeSubscriptionId)
    .select("*")
    .maybeSingle();

  if (error) throw new Error(error.message);

  if (provider) {
    await supabase.from("activities").insert({
      entity_type: "provider_profile",
      entity_id: provider.id,
      action: "subscription_status_changed",
      actor: "Stripe webhook",
      meta: {
        stripe_subscription_id: stripeSubscriptionId,
        stripe_subscription_status: stripeSubscriptionStatus,
      },
    });
  }

  return provider as ProviderProfile | null;
}
