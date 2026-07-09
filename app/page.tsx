import { SetupIssue } from "@/components/SetupIssue";
import { formatMoney } from "@/lib/my-helper/format";
import { hasSupabaseEnv } from "@/lib/my-helper/env";
import { listOpenRequests, listProviders } from "@/lib/my-helper/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  if (!hasSupabaseEnv()) {
    return (
      <main className="page-shell">
        <section className="empty-state">
          <h1>my-helper</h1>
          <p>Pull the Vercel environment into `.env.local` to connect Supabase and Stripe.</p>
        </section>
      </main>
    );
  }

  let requests = [];
  let providers = [];

  try {
    [requests, providers] = await Promise.all([listOpenRequests(), listProviders()]);
  } catch (error) {
    return (
      <SetupIssue
        message={error instanceof Error ? error.message : "Supabase returned an unknown error."}
      />
    );
  }

  return (
    <main className="page-shell">
      <section className="hero-band">
        <div>
          <p className="eyebrow">Open local leads</p>
          <h1>Find service requests and turn them into paid leads.</h1>
          <p>
            Browse real requests, create a provider profile, express interest, and unlock requester contact details from the lead inbox.
          </p>
        </div>
        <div className="hero-actions">
          <a className="primary-button" href="/requests">Browse requests</a>
          <a className="secondary-button" href="/providers/new">Create provider profile</a>
        </div>
      </section>

      <section className="split-layout">
        <div>
          <div className="section-heading">
            <h2>Newest requests</h2>
            <a href="/requests/new">Post a request</a>
          </div>
          <div className="item-list">
            {requests.slice(0, 4).map((request) => (
              <a className="list-item" key={request.id} href={`/requests/${request.id}`}>
                <span className="pill">{request.category}</span>
                <strong>{request.title}</strong>
                <span>{request.location} · {formatMoney(request.budget_cents)}</span>
              </a>
            ))}
          </div>
        </div>
        <div>
          <div className="section-heading">
            <h2>Available providers</h2>
            <a href="/providers">View all</a>
          </div>
          <div className="item-list">
            {providers.slice(0, 4).map((provider) => (
              <a className="list-item" key={provider.id} href={`/providers/${provider.id}`}>
                <span className="pill">{provider.category}</span>
                <strong>{provider.display_name}</strong>
                <span>{provider.location} · {formatMoney(provider.hourly_rate_cents)}/hr</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
