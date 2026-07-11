export type ServiceRequest = {
  id: string;
  user_id: string | null;
  created_at: string;
  title: string;
  category: string;
  description: string;
  location: string;
  contact_email: string;
  budget_cents: number | null;
  status: "open" | "matched" | "closed" | string;
};

export type ProviderProfile = {
  id: string;
  user_id: string | null;
  created_at: string;
  display_name: string;
  category: string;
  bio: string;
  location: string;
  contact_email: string;
  hourly_rate_cents: number | null;
  is_paid: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_subscription_status: string | null;
  stripe_current_period_end: string | null;
  is_available: boolean;
};

export type LeadStatus = "new" | "contacted" | "won" | "lost";

export type Lead = {
  id: string;
  user_id: string | null;
  created_at: string;
  provider_profile_id: string;
  service_request_id: string;
  status: LeadStatus;
  note: string | null;
  match_score: number | null;
  match_score_source: string | null;
  match_score_confidence: number | null;
  match_score_review_status: string | null;
};

export type LeadWithRequest = Lead & {
  service_requests: ServiceRequest | null;
};
