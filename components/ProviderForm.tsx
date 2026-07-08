"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ProviderForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    const response = await fetch("/api/provider-profiles", {
      method: "POST",
      body: new FormData(event.currentTarget),
    });
    const result = await response.json();
    setIsSaving(false);

    if (!response.ok) {
      setError(result.error || "Could not create provider profile.");
      return;
    }

    window.localStorage.setItem("my-helper-provider", result.provider.id);
    router.push(`/leads?provider=${result.provider.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="form-panel">
      <label>
        Display name
        <input name="displayName" required placeholder="Maria Santos" />
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
        Bio
        <textarea name="bio" required rows={5} placeholder="Tell requesters what you do and where you shine." />
      </label>
      <div className="form-grid">
        <label>
          Location
          <input name="location" required placeholder="Austin, TX or Remote" />
        </label>
        <label>
          Hourly rate
          <input name="hourlyRate" inputMode="decimal" placeholder="80" />
        </label>
      </div>
      <label>
        Contact email
        <input name="contactEmail" type="email" required placeholder="provider@example.com" />
      </label>
      {error ? <p className="form-error">{error}</p> : null}
      <button className="primary-button" disabled={isSaving}>
        {isSaving ? "Saving..." : "Create provider profile"}
      </button>
    </form>
  );
}
