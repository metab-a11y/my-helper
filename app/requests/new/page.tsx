import { RequestForm } from "@/components/RequestForm";

export default function NewRequestPage() {
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
