"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RequestForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    const response = await fetch("/api/service-requests", {
      method: "POST",
      body: new FormData(event.currentTarget),
    });
    const result = await response.json();
    setIsSaving(false);

    if (!response.ok) {
      setError(result.error || "Could not post request.");
      return;
    }

    router.push(`/requests/${result.request.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="form-panel">
      <label>
        Title
        <input name="title" required placeholder="Fix a leaking kitchen tap" />
      </label>
      <label>
        Category
        <select name="category" required defaultValue="">
          <option value="" disabled>Choose category</option>
          <option>Cleaning</option>
          <option>Plumbing</option>
          <option>Tutoring</option>
          <option>Repairs</option>
          <option>Moving</option>
          <option>Other</option>
        </select>
      </label>
      <label>
        Description
        <textarea name="description" required rows={5} placeholder="Describe the job, timing, and any details a provider should know." />
      </label>
      <div className="form-grid">
        <label>
          Location
          <input name="location" required placeholder="Austin, TX or Remote" />
        </label>
        <label>
          Budget
          <input name="budget" inputMode="decimal" placeholder="150" />
        </label>
      </div>
      <label>
        Contact email
        <input name="contactEmail" type="email" required placeholder="you@example.com" />
      </label>
      {error ? <p className="form-error">{error}</p> : null}
      <button className="primary-button" disabled={isSaving}>
        {isSaving ? "Posting..." : "Post request"}
      </button>
    </form>
  );
}
