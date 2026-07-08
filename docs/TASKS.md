# Tasks — my-helper

## Gantt Overview
```
Sprint 1  [DB + Seed]                  week 1 day 1–2
Sprint 2  [Request Board + Providers]  week 1 day 2–4
Sprint 3  [Lead Engine] ← v1 functional week 1 day 4–5
Sprint 4  [Stripe Checkout]            week 2 day 1–3
Sprint 5  [Lock It Down — Auth + RLS]  week 2 day 3–5
Sprint 6  [Polish + Launch]            week 2 day 5
```

---

## Sprint 1 — DB + Core Seed
**Goal**: All tables exist, demo data is live, RLS policies active.
- [ ] Run migration SQL in Supabase SQL editor
- [ ] Confirm 4 service_requests, 3 provider_profiles, 5 leads, 3 activities rows in dashboard
- [ ] Confirm all v1 permissive policies are active

**Done when**: Supabase table viewer shows seed data; no migration errors.

---

## Sprint 2 — Request Board + Provider Directory
**Goal**: Core browse pages render for anonymous visitors with real DB data.
- [ ] `/requests` page: fetch + list all open requests (loading / empty / error / ready states)
- [ ] `/requests/[id]` detail: show full request info
- [ ] `/requests/new` form: title, category, description, location, budget — POST to DB
- [ ] `/providers` page: list all provider profiles
- [ ] `/providers/[id]` detail: bio, rate, availability
- [ ] `/providers/new` form: create provider profile — POST to DB
- [ ] No login required for any of the above

**Done when**: Visiting `/requests` without a session shows seeded + any newly posted requests; form submission appears in DB.

---

## Sprint 3 — Lead Engine ← v1 functional milestone
**Goal**: Provider can express interest, lead is created, inbox shows it, status updates persist.
- [ ] "I'm interested" button on `/requests/[id]` — calls `insert_lead` tool
- [ ] `insert_lead` computes `match_score` via `compute_match_score` and logs activity
- [ ] `/leads` page: list all leads for a provider profile, ordered by match_score DESC
- [ ] Lead status dropdown: new / contacted / won / lost — calls `update_lead_status` tool, logs activity
- [ ] Empty state on `/leads` when no leads exist
- [ ] Error toast if insert or update fails

**Done when**: Full scenario works end-to-end — post request → express interest → lead in inbox → status changed → activity row logged. No dead buttons.

---

## Sprint 4 — Stripe Checkout + Paid Tier Gate
**Goal**: Provider can pay; payment unlocks full contact info.
- [ ] Create Stripe product "my-helper Pro" + monthly price in Stripe dashboard
- [ ] `/api/checkout` POST: creates Stripe Checkout session server-side, returns URL
- [ ] `/api/webhook` POST: validates signature, sets `is_paid = true`, logs activity
- [ ] Unpaid provider sees blurred contact email on `/leads` and `/requests/[id]`
- [ ] "Unlock full access" CTA triggers checkout flow
- [ ] Paid provider sees contact email clearly
- [ ] Test with card `4242 4242 4242 4242` — confirm `is_paid` flips in DB

**Done when**: Test payment completes → `provider_profiles.is_paid = true` in DB → contact info visible → activity row logged.

---

## Sprint 5 — Lock It Down (Auth + Per-User RLS)
**Goal**: Providers and requesters have accounts; data is owner-scoped.
- [ ] Enable Supabase Auth (email/password)
- [ ] Sign-up / login pages
- [ ] On sign-up, create or link `provider_profiles` / set `user_id`
- [ ] Replace v1 permissive RLS policies with `auth.uid() = user_id` owner policies
- [ ] Anonymous visitors can still browse `/requests` and `/providers` (public read)
- [ ] `/leads` and profile edit require login
- [ ] Smoke test: sign up → post request → express interest → pay → see lead

**Done when**: A logged-out user cannot create or modify rows; a logged-in user sees only their own leads and profile.

---

## Sprint 6 — Polish + Launch
**Goal**: App is production-ready and publicly announced.
- [ ] Loading skeletons on all list pages
- [ ] Error boundaries with user-friendly copy
- [ ] Mobile layout check (request card, lead inbox)
- [ ] SEO: `<title>` and `<meta description>` on key pages
- [ ] Run full TEST_PLAN manually
- [ ] Deploy to Vercel production; verify all env vars
- [ ] Confirm real Stripe key + webhook endpoint registered

**Done when**: Live URL loads, end-to-end success scenario passes with real Stripe key, no console errors.
