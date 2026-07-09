import { SetupIssue } from "@/components/SetupIssue";
import { listOpenRequests } from "@/lib/my-helper/data";
import { hasSupabaseEnv } from "@/lib/my-helper/env";
import { formatMoney } from "@/lib/my-helper/format";

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  let requests = [];

  try {
    requests = hasSupabaseEnv() ? await listOpenRequests() : [];
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
          <p className="eyebrow">Request board</p>
          <h1>Open service requests</h1>
        </div>
        <a className="primary-button" href="/requests/new">Post a request</a>
      </div>

      {requests.length ? (
        <div className="grid-list">
          {requests.map((request) => (
            <a className="entity-card" key={request.id} href={`/requests/${request.id}`}>
              <span className="pill">{request.category}</span>
              <h2>{request.title}</h2>
              <p>{request.description}</p>
              <div className="meta-row">
                <span>{request.location}</span>
                <span>{formatMoney(request.budget_cents)}</span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <section className="empty-state">
          <h2>No requests yet.</h2>
          <p>Be the first to post one.</p>
          <a className="primary-button" href="/requests/new">Post a request</a>
        </section>
      )}
    </main>
  );
}
