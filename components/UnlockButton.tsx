"use client";

import { useState } from "react";

export function UnlockButton({ providerProfileId }: { providerProfileId: string }) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function unlock() {
    setError("");
    setIsLoading(true);
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ providerProfileId }),
    });
    const result = await response.json();
    setIsLoading(false);

    if (!response.ok || !result.url) {
      setError(result.error || "Could not start checkout.");
      return;
    }

    window.location.href = result.url;
  }

  return (
    <div className="unlock-strip">
      <div>
        <strong>Unlock full access</strong>
        <span>Monthly access reveals requester contact details for every lead.</span>
      </div>
      <button className="primary-button" onClick={unlock} disabled={isLoading}>
        {isLoading ? "Opening checkout..." : "Unlock full access"}
      </button>
      {error ? <p className="form-error">{error}</p> : null}
    </div>
  );
}
