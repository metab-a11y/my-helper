import { getProvider } from "@/lib/my-helper/data";
import { getAppUrl } from "@/lib/my-helper/env";
import { createCheckoutSession, getMyHelperMonthlyPriceId } from "@/lib/stripe";
import { NextResponse } from "next/server";

/**
 * POST /api/stripe/checkout
 * Body: { providerProfileId: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const providerProfileId = String(body.providerProfileId || "");
    if (!providerProfileId) {
      return NextResponse.json({ error: "providerProfileId is required" }, { status: 400 });
    }

    const provider = await getProvider(providerProfileId);
    const priceId = await getMyHelperMonthlyPriceId();
    const origin = getAppUrl(request.headers.get("origin"));
    const session = await createCheckoutSession({
      priceId,
      providerProfileId,
      customerEmail: provider.contact_email,
      successUrl: `${origin}/leads?provider=${providerProfileId}&checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/leads?provider=${providerProfileId}&checkout=canceled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[stripe/checkout]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
