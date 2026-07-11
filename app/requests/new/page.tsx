import { RequestForm } from "@/components/RequestForm";
import { requireCurrentUser } from "@/lib/auth/server";

export default async function NewRequestPage() {
  await requireCurrentUser("/requests/new");

  return (
    <main className="page-shell narrow">
      <div className="page-heading">
        <div>
          <p className="eyebrow">New request</p>
          <h1>Post a service request</h1>
        </div>
      </div>
      <RequestForm />
    </main>
  );
}
