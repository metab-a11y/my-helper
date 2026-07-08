"use client";

import type { ProviderProfile } from "@/lib/my-helper/types";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export function InterestPanel({
  requestId,
  providers,
}: {
  requestId: string;
  providers: ProviderProfile[];
}) {
  const router = useRouter();
  const [providerId, setProviderId] = useState(providers[0]?.id || "");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const selectedProvider = useMemo(
    () => providers.find((provider) => provider.id === providerId),
    [providerId, providers],
  );

  useEffect(() => {
    const stored = window.localStorage.getItem("my-helper-provider");
    if (stored && providers.some((provider) => provider.id === stored)) {
      setProviderId(stored);
    }
  }, [providers]);

  async function createLead() {
    if (!providerId) {
      setError("Create or choose a provider profile first.");
      return;
    }

    setError("");
    setIsSaving(true);
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ providerProfileId: providerId, serviceRequestId: requestId, note }),
    });
    const result = await response.json();
    setIsSaving(false);

    if (!response.ok) {
      setError(result.error || "Could not create lead.");
      return;
    }

    window.localStorage.setItem("my-helper-provider", providerId);
    router.push(`/leads?provider=${providerId}${result.provider?.is_paid ? "" : "&unlock=1"}`);
    router.refresh();
  }

  return (
    <section className="action-panel">
      <div>
        <p className="eyebrow">Provider action</p>
        <h2>Express interest</h2>
      </div>
      {providers.length ? (
        <>
          <label>
            Acting as
            <select value={providerId} onChange={(event) => setProviderId(event.target.value)}>
              {providers.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.display_name} - {provider.category}
                </option>
              ))}
            </select>
          </label>
          <label>
            Private note
            <textarea
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Available Tuesday afternoon."
            />
          </label>
          <p className="muted">
            {selectedProvider?.is_paid
              ? "This provider has full access."
              : "Unpaid providers can create leads, then unlock contact details."}
          </p>
          {error ? <p className="form-error">{error}</p> : null}
          <button className="primary-button" onClick={createLead} disabled={isSaving}>
            {isSaving ? "Creating lead..." : "I'm interested"}
          </button>
        </>
      ) : (
        <a className="primary-button" href="/providers/new">Create provider profile</a>
      )}
    </section>
  );
}
