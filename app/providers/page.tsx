import { SetupIssue } from "@/components/SetupIssue";
import { listProviders } from "@/lib/my-helper/data";
import { hasSupabaseEnv } from "@/lib/my-helper/env";
import { formatMoney } from "@/lib/my-helper/format";

export const dynamic = "force-dynamic";

export default async function ProvidersPage() {
  let providers = [];

  try {
    providers = hasSupabaseEnv() ? await listProviders() : [];
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
          <p className="eyebrow">Directory</p>
          <h1>Provider profiles</h1>
        </div>
        <a className="primary-button" href="/providers/new">Create profile</a>
      </div>

      {providers.length ? (
        <div className="grid-list">
          {providers.map((provider) => (
            <a className="entity-card" key={provider.id} href={`/providers/${provider.id}`}>
              <span className="pill">{provider.category}</span>
              <h2>{provider.display_name}</h2>
              <p>{provider.bio}</p>
              <div className="meta-row">
                <span>{provider.location}</span>
                <span>{formatMoney(provider.hourly_rate_cents)}/hr</span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <section className="empty-state">
          <h2>No providers listed yet.</h2>
          <a className="primary-button" href="/providers/new">Create profile</a>
        </section>
      )}
    </main>
  );
}
