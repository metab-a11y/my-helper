# Data Model — my-helper

## service_requests
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | gen_random_uuid() |
| user_id | uuid nullable | set at lock-down sprint |
| created_at | timestamptz | default now() |
| title | text | required |
| category | text | e.g. Cleaning, Plumbing |
| description | text | job details |
| location | text | city or Remote |
| budget_cents | integer | nullable |
| status | text | open / matched / closed |

## provider_profiles
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | set at lock-down sprint |
| created_at | timestamptz | |
| display_name | text | |
| category | text | |
| bio | text | |
| location | text | |
| contact_email | text | shown only to paid providers |
| hourly_rate_cents | integer | |
| is_paid | boolean | default false; set by Stripe webhook |
| is_available | boolean | default true |

## leads
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| created_at | timestamptz | |
| provider_profile_id | uuid FK → provider_profiles | |
| service_request_id | uuid FK → service_requests | |
| status | text | new / contacted / won / lost |
| note | text | provider's private note |
| match_score | numeric | **AI field** |
| match_score_source | text | e.g. rule-based-v1 |
| match_score_confidence | numeric | 0–1 |
| match_score_review_status | text | unreviewed / approved / rejected |

## activities
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| created_at | timestamptz | |
| entity_type | text | service_request / lead / provider_profile |
| entity_id | uuid | FK by convention |
| action | text | lead_created / status_changed / payment_completed |
| actor | text | display name or system |
| meta | jsonb | extra context |

## RLS
- v1: permissive read + write on all tables (demo works without login)
- Lock-down sprint: owner-scoped `auth.uid() = user_id` policies replace v1 policies
