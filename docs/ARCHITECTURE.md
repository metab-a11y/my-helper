# Architecture — my-helper

## Stack
- **Frontend**: Next.js 14 (App Router) on Vercel
- **Database + Auth**: Supabase (Postgres + RLS)
- **Payments**: Stripe Checkout (server-side session creation)
- **Email** (later): Resend

## Build Sequence
**Now**: DB tables → request board → provider directory → lead engine → Stripe checkout
**Next**: Auth + per-user RLS, email notifications, request status flow
**Later**: AI match scoring, in-app messaging, reviews

## Key User Action — Step-by-Step
1. Provider visits `/requests` — Supabase returns open `service_requests` rows
2. Provider clicks "I'm interested" — frontend POSTs to `/api/leads`
3. API route inserts a `leads` row and an `activities` row server-side
4. If provider is not paid, response includes a redirect to `/api/checkout`
5. `/api/checkout` creates a Stripe Checkout session (secret key server-only) and returns the URL
6. Provider completes payment — Stripe calls `/api/webhook`
7. Webhook sets `provider_profiles.is_paid = true` and logs an activity row
8. Provider lands on `/leads` — their inbox shows the new lead with full contact info

## Layer Plan
1. **Data first** — tables, constraints, RLS policies, seed data
2. **App logic** — CRUD routes, lead engine, Stripe integration
3. **Smart features** — match scoring, ranked lead feed (later)

## Core Without AI
All lead creation, status updates, and payment gating are pure database + API logic. Removing the AI scoring layer leaves a fully functional product.
