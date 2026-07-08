import { ProviderForm } from "@/components/ProviderForm";

export default function NewProviderPage() {
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
