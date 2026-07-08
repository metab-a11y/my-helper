# Agentic Layer — my-helper

## Risk Levels & Actions

### Low — auto-execute (no approval needed)
- Tag a service request with an inferred category on save
- Compute and store `match_score` when a lead is created
- Log an activity row on any state change

### Medium — light approval (builder confirms)
- Mark a request as `matched` when a lead reaches `contacted` status
- Surface a "you have 3 new matching requests" nudge to a provider

### High — always requires explicit approval
- Send an email to a requester on behalf of a provider ← **never auto-send**
- Trigger a Stripe charge or subscription change

### Critical — human-only, no agent involvement
- Issue a refund
- Delete a provider profile or service request
- Any action with legal or financial finality

## Named Tools (approved list)
- `insert_lead` — creates a lead row + activity row
- `update_lead_status` — changes lead status + logs activity
- `compute_match_score` — runs rule-based scoring, writes to lead row
- `create_checkout_session` — server-side Stripe session creation
- `set_provider_paid` — called by webhook only, sets `is_paid = true`

## Audit Log Fields (activities table)
`entity_type`, `entity_id`, `action`, `actor`, `created_at`, `meta (jsonb)`

## v1 vs Later
- **v1**: only `insert_lead`, `update_lead_status`, `compute_match_score`, `create_checkout_session`, `set_provider_paid`
- **Later**: email nudge tool (high risk, approval gate added)
