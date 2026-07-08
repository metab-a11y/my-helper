import { InterestPanel } from "@/components/InterestPanel";
import { getRequest, listProviders } from "@/lib/my-helper/data";
import { formatMoney, maskEmail } from "@/lib/my-helper/format";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let request;
  let providers = [];

  try {
    [request, providers] = await Promise.all([getRequest(id), listProviders()]);
  } catch {
    notFound();
  }

  return (
    <main className="page-shell">
      <a className="back-link" href="/requests">Back to requests</a>
      <section className="detail-layout">
        <article className="detail-main">
          <span className="pill">{request.category}</span>
          <h1>{request.title}</h1>
          <p>{request.description}</p>
          <div className="fact-grid">
            <div>
              <span>Location</span>
              <strong>{request.location}</strong>
            </div>
            <div>
              <span>Budget</span>
              <strong>{formatMoney(request.budget_cents)}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>{request.status}</strong>
            </div>
            <div>
              <span>Requester contact</span>
              <strong className="blurred">{maskEmail(request.contact_email)}</strong>
            </div>
          </div>
        </article>
        <InterestPanel requestId={request.id} providers={providers} />
      </section>
    </main>
  );
}
