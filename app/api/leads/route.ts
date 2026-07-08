import { insertLead } from "@/lib/my-helper/tools";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await insertLead({
      providerProfileId: String(body.providerProfileId || ""),
      serviceRequestId: String(body.serviceRequestId || ""),
      note: typeof body.note === "string" ? body.note : undefined,
    });

    return NextResponse.json({
      lead: result.lead,
      provider: result.provider,
      wasCreated: result.wasCreated,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not create lead." },
      { status: 400 },
    );
  }
}
