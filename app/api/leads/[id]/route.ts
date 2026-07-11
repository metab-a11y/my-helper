import { updateLeadStatus } from "@/lib/my-helper/tools";
import { getCurrentUser } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import type { LeadStatus } from "@/lib/my-helper/types";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Log in to update leads." }, { status: 401 });
    }

    const supabase = await createClient();
    const { id } = await context.params;
    const body = await request.json();
    const lead = await updateLeadStatus({
      userId: user.id,
      client: supabase,
      leadId: id,
      status: String(body.status || "new") as LeadStatus,
    });

    return NextResponse.json({ lead });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not update lead." },
      { status: 400 },
    );
  }
}
