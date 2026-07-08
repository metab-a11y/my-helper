"use client";

import type { LeadStatus } from "@/lib/my-helper/types";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LeadStatusSelect({ leadId, value }: { leadId: string; value: LeadStatus }) {
  const router = useRouter();
  const [status, setStatus] = useState(value);
  const [error, setError] = useState("");

  async function update(nextStatus: LeadStatus) {
    setStatus(nextStatus);
    setError("");

    const response = await fetch(`/api/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    const result = await response.json();

    if (!response.ok) {
      setStatus(status);
      setError(result.error || "Could not update status.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="status-control">
      <select value={status} onChange={(event) => update(event.target.value as LeadStatus)}>
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="won">Won</option>
        <option value="lost">Lost</option>
      </select>
      {error ? <span className="form-error">{error}</span> : null}
    </div>
  );
}
