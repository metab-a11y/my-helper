import { ProviderForm } from "@/components/ProviderForm";
import { requireCurrentUser } from "@/lib/auth/server";

export default async function NewProviderPage() {
  await requireCurrentUser("/providers/new");

  return (
    <main className="page-shell narrow">
      <div className="page-heading">
        <div>
          <p className="eyebrow">New profile</p>
          <h1>Create provider profile</h1>
        </div>
      </div>
      <ProviderForm />
    </main>
  );
}
