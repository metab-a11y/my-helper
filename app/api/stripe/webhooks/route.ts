import { constructWebhookEvent } from "@/lib/stripe";
import { setProviderPaid } from "@/lib/my-helper/tools";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

/**
 * POST /api/stripe/webhooks
 *
 * Receives and processes Stripe webhook events.
 * Register this URL in your Stripe dashboard:
 *   https://dashboard.stripe.com/webhooks → add endpoint → /api/stripe/webhooks
 *
 * Required events to enable in Stripe dashboard:
 *   - checkout.session.completed
 *   - customer.subscription.updated
 *   - customer.subscription.deleted
 *   - invoice.payment_failed
 */
export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = constructWebhookEvent(payload, signature);
  } catch (err) {
    console.error("[stripe/webhooks] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      // ── New subscription or one-time purchase ─────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const providerProfileId = session.metadata?.providerProfileId;
        if (providerProfileId && session.payment_status === "paid") {
          await setProviderPaid({
            providerProfileId,
            stripeSessionId: session.id,
            actor: "Stripe webhook",
          });
        }
        break;
      }

      // ── Subscription created or updated ───────────────────────────────────
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const sub = event.data.object as Stripe.Subscription;
        const providerProfileId = sub.metadata?.providerProfileId;
        if (providerProfileId && ["active", "trialing"].includes(sub.status)) {
          await setProviderPaid({
            providerProfileId,
            stripeSessionId: sub.latest_invoice?.toString(),
            actor: "Stripe subscription",
          });
        }
        break;
      }

      // ── Subscription cancelled ────────────────────────────────────────────
      case "customer.subscription.deleted": {
        // Subscription cancellation does not hide existing paid leads in v1.
        break;
      }

      // ── Payment failed — notify user ──────────────────────────────────────
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.warn("[stripe/webhooks] payment failed for customer:", invoice.customer);
        // TODO: send email via Supabase Edge Function or Resend
        break;
      }

      default:
        // Unhandled event — safe to ignore
        break;
    }
  } catch (err) {
    console.error(`[stripe/webhooks] error handling ${event.type}:`, err);
    // Return 200 anyway — Stripe will retry on 5xx, not on handler errors
  }

  return NextResponse.json({ received: true });
}
