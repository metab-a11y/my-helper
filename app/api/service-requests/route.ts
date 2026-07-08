import { dollarsToCents } from "@/lib/my-helper/format";
import { createServiceRequest } from "@/lib/my-helper/tools";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const created = await createServiceRequest({
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
