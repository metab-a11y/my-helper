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
      stripeCustomerId:
        typeof session.customer === "string" ? session.customer : session.customer?.id,
      stripeSessionId: session.id,
      stripeSubscriptionId:
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id,
      actor: "Stripe return",
    });
  }
}
