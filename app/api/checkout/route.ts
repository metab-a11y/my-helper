import { getAppUrl } from "@/lib/my-helper/env";
import { getCurrentUser } from "@/lib/auth/server";
import { getProvider } from "@/lib/my-helper/data";
import { createCheckoutSession, getMyHelperMonthlyPriceId } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Log in to unlock provider access." }, { status: 401 });
    }

    const body = await request.json();
    const providerProfileId = String(body.providerProfileId || "");
    if (!providerProfileId) {
      return NextResponse.json({ error: "providerProfileId is required." }, { status: 400 });
    }

    const provider = await getProvider(providerProfileId);
    if (provider.user_id !== user.id) {
      return NextResponse.json({ error: "You can only unlock your own provider profile." }, { status: 403 });
    }
    const priceId = await getMyHelperMonthlyPriceId();

    const origin = getAppUrl(request.headers.get("origin"));
    const session = await createCheckoutSession({
      priceId,
      providerProfileId,
      customerId: provider.stripe_customer_id || undefined,
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
