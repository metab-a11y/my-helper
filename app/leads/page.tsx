import { SetupIssue } from "@/components/SetupIssue";
import { LeadStatusSelect } from "@/components/LeadStatusSelect";
import { UnlockButton } from "@/components/UnlockButton";
import { confirmCheckoutSession } from "@/lib/my-helper/checkout";
import { getProvider, listLeadsForProvider, listProviders } from "@/lib/my-helper/data";
import { formatMoney, maskEmail } from "@/lib/my-helper/format";
import type { LeadStatus } from "@/lib/my-helper/types";

export const dynamic = "force-dynamic";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const providerId = typeof query.provider === "string" ? query.provider : "";
  const checkout = typeof query.checkout === "string" ? query.checkout : "";
  const sessionId = typeof query.session_id === "string" ? query.session_id : "";

  if (!providerId) {
    let providers = [];

    try {
      providers = await listProviders();
    } catch (error) {
      return (
        <SetupIssue
          message={error instanceof Error ? error.message : "Supabase returned an unknown error."}
        />
      );
    }

    return (
      <main className="page-shell">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Lead inbox</p>
            <h1>Choose a provider profile</h1>
          </div>
          <a className="primary-button" href="/providers/new">Create profile</a>
        </div>
        <div className="grid-list">
          {providers.map((provider) => (
            <a className="entity-card" key={provider.id} href={`/leads?provider=${provider.id}`}>
              <span className="pill">{provider.category}</span>
              <h2>{provider.display_name}</h2>
              <p>{provider.location}</p>
              <div className="meta-row">
                <span>{provider.is_paid ? "Paid access" : "Needs unlock"}</span>
                <span>{formatMoney(provider.hourly_rate_cents)}/hr</span>
              </div>
            </a>
          ))}
        </div>
      </main>
    );
  }

  if (checkout === "success" && sessionId) {
    try {
      await confirmCheckoutSession(sessionId, providerId);
    } catch {
      // Webhook may still complete the unlock; the inbox remains usable either way.
    }
  }

  let provider;
  let leads = [];

  try {
    [provider, leads] = await Promise.all([
      getProvider(providerId),
      listLeadsForProvider(providerId),
    ]);
  } catch (error) {
    return (
      <SetupIssue
        message={error instanceof Error ? error.message : "Supabase returned an unknown error."}
      />
    );
  }
  const showUnlock = !provider.is_paid && (leads.length > 0 || query.unlock === "1");

  return (
    <main className="page-shell">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Lead inbox</p>
          <h1>{provider.display_name}</h1>
          <p>{provider.is_paid ? "Full requester contact details are visible." : "Requester contact details are hidden until monthly access is unlocked."}</p>
        </div>
        <a className="secondary-button" href="/requests">Find more requests</a>
      </div>

      {checkout === "canceled" ? (
        <p className="notice">Checkout was canceled. Your leads are still saved.</p>
      ) : null}
      {showUnlock ? <UnlockButton providerProfileId={provider.id} /> : null}

      {leads.length ? (
        <div className="lead-table">
          {leads.map((lead) => {
            const request = lead.service_requests;
            const contact = request?.contact_email || "";

            return (
              <article className="lead-row" key={lead.id}>
                <div className="lead-main">
                  <span className="pill">{request?.category || "Request"}</span>
                  <h2>{request?.title || "Deleted request"}</h2>
                  <p>{request?.description}</p>
                  <div className="meta-row">
                    <span>{request?.location}</span>
                    <span>{formatMoney(request?.budget_cents)}</span>
                    <span>Score {lead.match_score ?? 0}</span>
                  </div>
                </div>
                <div className="lead-side">
                  <div>
                    <span className="field-label">Requester contact</span>
                    <strong className={provider.is_paid ? "" : "blurred"}>
                      {provider.is_paid ? contact : maskEmail(contact)}
                    </strong>
                  </div>
                  <LeadStatusSelect leadId={lead.id} value={lead.status as LeadStatus} />
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <section className="empty-state">
          <h2>You haven&apos;t expressed interest in any requests yet.</h2>
          <a className="primary-button" href="/requests">Browse requests</a>
        </section>
      )}
    </main>
  );
}
