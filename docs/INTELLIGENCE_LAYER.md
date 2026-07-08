# Intelligence Layer — my-helper

## Messy Input → Structured Data
A requester types a free-text description. We extract:
```json
{
  "inferred_category": "Plumbing",
  "inferred_urgency": "high",
  "inferred_budget_range": "$100–$200",
  "source": "gpt-4o-mini",
  "confidence": 0.87,
  "review_status": "unreviewed"
}
```
Stored in `service_requests.meta` (jsonb) alongside the plain fields — the plain fields always win for display.

## Events to Track
- Request posted
- Provider viewed a request (future)
- Lead created (interest expressed)
- Lead status changed
- Payment completed

## Match Scoring (v1 — rule-based)
`match_score` on `leads` row, computed at lead creation:
- Same category: +50
- Same location or Remote: +30
- Budget ≥ provider hourly rate: +20
Max = 100. Stored with `match_score_source = 'rule-based-v1'`, `match_score_confidence = 1.0`.

## What Gets Ranked
Provider lead inbox ordered by `match_score DESC`, then `created_at DESC`.

## v1 vs Later
- **v1**: rule-based scoring only, no AI calls
- **Next**: GPT extracts category + urgency from request description on save
- **Later**: embedding-based semantic matching across provider bios and request descriptions
