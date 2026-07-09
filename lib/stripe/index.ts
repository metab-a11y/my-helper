import Stripe from "stripe";

/**
 * Stripe client.
 *
 * Works in two modes — controlled entirely by env vars, no code changes needed:
 *
 * STANDALONE (your own Stripe account):
 *   STRIPE_SECRET_KEY = sk_live_xxx   (your secret key)
 *   STRIPE_CONNECT_ACCOUNT_ID not set
 *   STRIPE_PLATFORM_FEE_PERCENT not set
 *
 * PLATFORM (provisioned through Vibe Launchpad — platform takes a cut):
 *   STRIPE_SECRET_KEY = sk_live_xxx   (platform's key OR your connected account key)
 *   STRIPE_CONNECT_ACCOUNT_ID = acct_xxx   (your connected Stripe account)
 *   STRIPE_PLATFORM_FEE_PERCENT = 1   (platform takes 1% of every transaction)
 */
// Fall back to a placeholder so `new Stripe()` doesn't throw at build time
// when STRIPE_SECRET_KEY isn't configured. Real Stripe calls still require a
// valid key at runtime — this only keeps `next build` from crashing while
// collecting page data for projects that don't use Stripe.
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder_build_only",
  {
    apiVersion: "2025-02-24.acacia",
    typescript: true,
  },
);

// Set when this app was provisioned through a Connect platform
export const CONNECT_ACCOUNT_ID = process.env.STRIPE_CONNECT_ACCOUNT_ID as
  | string
  | undefined;

// Platform fee percentage (0–100). Only active when CONNECT_ACCOUNT_ID is set.
export const PLATFORM_FEE_PERCENT = CONNECT_ACCOUNT_ID
  ? Number(process.env.STRIPE_PLATFORM_FEE_PERCENT ?? "0")
  : 0;

// Pass this to Stripe API calls when running through a Connect platform
export const stripeAccountOptions = (): Stripe.RequestOptions | undefined =>
  CONNECT_ACCOUNT_ID ? { stripeAccount: CONNECT_ACCOUNT_ID } : undefined;

export async function getMyHelperMonthlyPriceId() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  const configuredPriceId = process.env.STRIPE_PRICE_ID?.trim();
  if (configuredPriceId) {
    return configuredPriceId;
  }

  const lookupKeyMatches = await stripe.prices.list(
    {
      active: true,
      lookup_keys: ["my-helper-pro-monthly"],
      type: "recurring",
      limit: 1,
    },
    stripeAccountOptions(),
  );

  if (lookupKeyMatches.data[0]) {
    return lookupKeyMatches.data[0].id;
  }

  const products = await stripe.products.search(
    { query: "active:'true' AND name:'my-helper Pro'", limit: 1 },
    stripeAccountOptions(),
  );
  const product = products.data[0];

  if (!product) {
    throw new Error(
      "Stripe product `my-helper Pro` was not found. Add STRIPE_PRICE_ID in Vercel or create it with a monthly recurring price.",
    );
  }

  const prices = await stripe.prices.list(
    {
      active: true,
      product: product.id,
      type: "recurring",
      limit: 10,
    },
    stripeAccountOptions(),
  );
  const monthlyPrice = prices.data.find((price) => price.recurring?.interval === "month");

  if (!monthlyPrice) {
    throw new Error("Stripe product `my-helper Pro` needs an active monthly recurring price.");
  }

  return monthlyPrice.id;
}

// ─── Checkout ─────────────────────────────────────────────────────────────────

export async function createCheckoutSession({
  priceId,
  customerId,
  customerEmail,
  providerProfileId,
  successUrl,
  cancelUrl,
  mode = "subscription",
}: {
  priceId: string;
  customerId?: string;
  customerEmail?: string;
  providerProfileId: string;
  successUrl: string;
  cancelUrl: string;
  mode?: "payment" | "subscription";
}) {
  const params: Stripe.Checkout.SessionCreateParams = {
    mode,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { providerProfileId },
    ...(customerId
      ? { customer: customerId }
      : customerEmail
        ? { customer_email: customerEmail }
        : { customer_creation: "always" }),

    // Subscription platform fee
    ...(mode === "subscription" && PLATFORM_FEE_PERCENT > 0
      ? {
          subscription_data: {
            metadata: { providerProfileId },
            application_fee_percent: PLATFORM_FEE_PERCENT,
          },
        }
      : mode === "subscription"
      ? { subscription_data: { metadata: { providerProfileId } } }
      : {}),

    // One-time payment platform fee — calculated after price lookup
    // (handled in checkout route where we have the amount)
  };

  return stripe.checkout.sessions.create(params, stripeAccountOptions());
}

export async function retrieveCheckoutSession(sessionId: string) {
  return stripe.checkout.sessions.retrieve(sessionId, stripeAccountOptions());
}

// ─── Billing portal ───────────────────────────────────────────────────────────

export async function createPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  return stripe.billingPortal.sessions.create(
    { customer: customerId, return_url: returnUrl },
    stripeAccountOptions(),
  );
}

// ─── Webhook ──────────────────────────────────────────────────────────────────

export function constructWebhookEvent(payload: string, signature: string) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured.");
  }

  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  );
}
