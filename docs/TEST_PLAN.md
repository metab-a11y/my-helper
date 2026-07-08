# Test Plan — my-helper

## Success Scenario (manual, run after Sprint 4)
1. Open the site URL without logging in
2. **Verify**: `/requests` loads with at least the seeded requests — no login wall
3. Click "Post a Request" → fill in title, category, description, location, budget → submit
4. **Verify**: new request appears at top of list; row exists in Supabase `service_requests` table
5. Navigate to `/providers/new` → create a provider profile → submit
6. **Verify**: provider appears in `/providers` list; row in DB
7. Go back to the new request → click "I'm interested"
8. **Verify**: lead row created in `leads` table; `match_score` populated; activity row logged
9. Navigate to `/leads` → see the new lead with status "new"
10. Change status to "contacted" → **Verify**: DB row updated; activity row logged
11. Click "Unlock full access" → Stripe Checkout opens
12. Enter card `4242 4242 4242 4242`, any future date, any CVC → complete payment
13. **Verify**: redirected back to app; `provider_profiles.is_paid = true` in DB; contact email now visible on lead; payment activity row logged

## Empty States
- `/requests` with no rows: shows "No requests yet. Be the first to post one." + CTA button
- `/leads` with no leads: shows "You haven't expressed interest in any requests yet." + link to `/requests`
- `/providers` with no profiles: shows "No providers listed yet."

## Error Cases
- Submit request form with missing required field → inline validation error, no DB write
- "I'm interested" fails (network error) → error toast; no duplicate lead row
- Stripe webhook with invalid signature → 400 response; `is_paid` unchanged
- Visiting `/leads` for a nonexistent provider → 404 page, not a crash

## Permission Checks (after Sprint 5)
- Logged-out user tries to POST to `/api/leads` → 401
- Logged-in user A cannot see user B's leads (RLS blocks the query)
- `activities` rows cannot be deleted via the Supabase client (RLS policy has no delete)
