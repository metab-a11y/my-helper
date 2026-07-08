import { updateLeadStatus } from "@/lib/my-helper/tools";
import type { LeadStatus } from "@/lib/my-helper/types";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const lead = await updateLeadStatus({
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
