import { dollarsToCents } from "@/lib/my-helper/format";
import { createProviderProfile } from "@/lib/my-helper/tools";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const provider = await createProviderProfile({
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
