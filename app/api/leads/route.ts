import { insertLead } from "@/lib/my-helper/tools";
import { getCurrentUser } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Log in to express interest." }, { status: 401 });
    }

    const supabase = await createClient();
    const body = await request.json();
    const result = await insertLead({
      userId: user.id,
      client: supabase,
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
