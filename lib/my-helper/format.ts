export function formatMoney(cents: number | null | undefined) {
  if (typeof cents !== "number") return "Budget open";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function dollarsToCents(value: FormDataEntryValue | null) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return Math.round(amount * 100);
}

export function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!name || !domain) return "Hidden until unlocked";
  return `${name.slice(0, 2)}***@${domain.replace(/^[^.]*/, "***")}`;
}
