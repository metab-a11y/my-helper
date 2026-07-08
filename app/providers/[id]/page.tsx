import { getProvider } from "@/lib/my-helper/data";
import { formatMoney } from "@/lib/my-helper/format";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProviderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let provider;

  try {
    provider = await getProvider(id);
  } catch {
    notFound();
  }

  return (
    <main className="page-shell">
      <a className="back-link" href="/providers">Back to providers</a>
      <article className="detail-main standalone">
        <span className="pill">{provider.category}</span>
        <h1>{provider.display_name}</h1>
        <p>{provider.bio}</p>
        <div className="fact-grid">
          <div>
            <span>Location</span>
            <strong>{provider.location}</strong>
          </div>
          <div>
            <span>Rate</span>
            <strong>{formatMoney(provider.hourly_rate_cents)}/hr</strong>
          </div>
          <div>
            <span>Availability</span>
            <strong>{provider.is_available ? "Available" : "Unavailable"}</strong>
          </div>
          <div>
            <span>Access</span>
            <strong>{provider.is_paid ? "Paid" : "Unpaid"}</strong>
          </div>
        </div>
        <a className="primary-button" href={`/leads?provider=${provider.id}`}>Open lead inbox</a>
      </article>
    </main>
  );
}
