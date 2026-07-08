# Security — my-helper

## Secret Handling
- `STRIPE_SECRET_KEY` and `SUPABASE_SERVICE_ROLE_KEY` live only in Vercel environment variables — never imported in any `app/` or `components/` file
- Stripe Checkout sessions created in `/api/checkout` (server route only)
- Stripe webhook validated with `STRIPE_WEBHOOK_SECRET` before any DB write
- Frontend uses only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Permission Model
- **v1 (demo)**: permissive RLS — all rows readable and writable without login
- **Lock-down sprint**: every table gets `auth.uid() = user_id` owner policy; permissive policies dropped
- `contact_email` on `provider_profiles` is fetched only server-side for paid providers — never returned raw to an unpaid client
- Agent actions inherit the requesting user's session; no service-role key used in frontend paths

## Approved-Tools Rule
Only the named tools in `AGENTIC_LAYER.md` may perform writes. No route may call a generic "run any SQL" or "send any message" function. Each tool is a typed server function with explicit inputs and outputs.

## Audit Principle
Every meaningful write (lead created, status changed, payment confirmed) inserts a row into `activities`. Rows are append-only — no update or delete permitted on `activities` even by the owner.

## Stop and Get Help
If payment logic, refund handling, or RLS policy correctness is uncertain — stop and involve a human reviewer before deploying to production.
