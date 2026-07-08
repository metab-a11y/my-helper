import { getAppUrl } from "@/lib/my-helper/env";
import { getProvider } from "@/lib/my-helper/data";
import { createCheckoutSession } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const providerProfileId = String(body.providerProfileId || "");
    if (!providerProfileId) {
      return NextResponse.json({ error: "providerProfileId is required." }, { status: 400 });
    }

    const provider = await getProvider(providerProfileId);
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY;
    if (!priceId) {
      return NextResponse.json({ error: "Stripe monthly price is not configured." }, { status: 400 });
    }

    const origin = getAppUrl(request.headers.get("origin"));
    const session = await createCheckoutSession({
      priceId,
      providerProfileId,
      customerEmail: provider.contact_email,
      successUrl: `${origin}/leads?provider=${providerProfileId}&checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/leads?provider=${providerProfileId}&checkout=canceled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not start checkout." },
      { status: 500 },
    );
  }
}
