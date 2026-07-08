# PRD — my-helper

## Problem
Service providers (cleaners, plumbers, tutors, etc.) struggle to find people who need their services. People posting service requests can't easily discover available local providers. There's no lightweight place for both to connect without a large platform taking a cut.

## Target User
Primary: independent service providers who want a steady stream of leads.
Secondary: people who need a specific service and want to post a request quickly.

## Core Objects
- **Service Request** — posted by someone who needs a job done
- **Provider Profile** — created by a service provider listing their skills
- **Lead** — created when a provider expresses interest in a request
- **Activity** — audit trail of meaningful actions

## MVP Must-Haves
- [ ] Anyone can post a service request (title, category, description, location, budget)
- [ ] Providers can create a profile (name, category, bio, rate, contact)
- [ ] Providers can browse open requests and click "I'm interested" to create a lead
- [ ] Providers have a lead inbox showing all their active leads with status
- [ ] Lead status can be updated (new → contacted → won → lost)
- [ ] Unpaid providers see blurred contact info; paid providers see it clearly
- [ ] Stripe checkout lets a provider pay for monthly access
- [ ] All core pages render for anonymous visitors (demo-first)

## Non-Goals (v1)
- In-app messaging between provider and requester
- Reviews / ratings
- Multi-provider team accounts
- AI match scoring (schema ready, logic deferred)
- Admin dashboard

## Definition of Done — Success Scenario
A provider visits the site, sees open requests, clicks "I'm interested" on one, is prompted to pay, completes Stripe checkout with test card `4242 4242 4242 4242`, and immediately sees the requester's contact details in their lead inbox. The lead row exists in the database and an activity row is logged.
