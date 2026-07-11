import { dollarsToCents } from "@/lib/my-helper/format";
import { createServiceRequest } from "@/lib/my-helper/tools";
import { getCurrentUser } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Log in to post a service request." }, { status: 401 });
    }

    const supabase = await createClient();
    const formData = await request.formData();
    const created = await createServiceRequest({
      userId: user.id,
      client: supabase,
      title: String(formData.get("title") || ""),
      category: String(formData.get("category") || ""),
      description: String(formData.get("description") || ""),
      location: String(formData.get("location") || ""),
      contactEmail: String(formData.get("contactEmail") || ""),
      budgetCents: dollarsToCents(formData.get("budget")),
    });

    return NextResponse.json({ request: created });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not create request." },
      { status: 400 },
    );
  }
}
