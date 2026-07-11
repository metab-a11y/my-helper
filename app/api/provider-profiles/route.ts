import { dollarsToCents } from "@/lib/my-helper/format";
import { createProviderProfile } from "@/lib/my-helper/tools";
import { getCurrentUser } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Log in to create a provider profile." }, { status: 401 });
    }

    const supabase = await createClient();
    const formData = await request.formData();
    const provider = await createProviderProfile({
      userId: user.id,
      client: supabase,
      displayName: String(formData.get("displayName") || ""),
      category: String(formData.get("category") || ""),
      bio: String(formData.get("bio") || ""),
      location: String(formData.get("location") || ""),
      contactEmail: String(formData.get("contactEmail") || ""),
      hourlyRateCents: dollarsToCents(formData.get("hourlyRate")),
    });

    return NextResponse.json({ provider });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not create provider." },
      { status: 400 },
    );
  }
}
