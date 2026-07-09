import { getProvider } from "@/lib/my-helper/data";
import { createPortalSession } from "@/lib/stripe";
import { NextResponse } from "next/server";

/**
 * POST /api/stripe/portal
 *
 * Redirects the authenticated user to the Stripe Billing Portal where they
 * can manage their subscription, update payment method, cancel, etc.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const providerProfileId = String(body.providerProfileId || "");

    if (!providerProfileId) {
      return NextResponse.json({ error: "providerProfileId is required" }, { status: 400 });
    }

    const provider = await getProvider(providerProfileId);

    if (!provider.stripe_customer_id) {
      return NextResponse.json(
        { error: "No billing account found. Subscribe first." },
        { status: 404 },
      );
    }

    const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "";

    const portalSession = await createPortalSession({
      customerId: provider.stripe_customer_id,
      returnUrl: `${origin}/leads?provider=${provider.id}`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    console.error("[stripe/portal]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
