import { retrieveCheckoutSession } from "@/lib/stripe";
import { setProviderPaid } from "./tools";

export async function confirmCheckoutSession(sessionId: string, providerProfileId: string) {
  const session = await retrieveCheckoutSession(sessionId);

  if (
    session.metadata?.providerProfileId === providerProfileId &&
    session.payment_status === "paid"
  ) {
    await setProviderPaid({
      providerProfileId,
      stripeSessionId: session.id,
      actor: "Stripe return",
    });
  }
}
