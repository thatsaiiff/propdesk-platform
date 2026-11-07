import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromRequest, isAdminUser } from "@/lib/auth/session";
import { store } from "@/lib/store";
import { z } from "zod";

const UpdateLeadSchema = z.object({
  leadId: z.string().min(1),
  status: z.enum([
    "NEW",
    "CONTACTED",
    "FOLLOW_UP",
    "NEGOTIATION",
    "SITE_VISIT",
    "CONVERTED",
    "CLOSED",
    "LOST",
  ]),
  assignedTo: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const admin = await getCurrentUserFromRequest(req);
    if (!admin || !isAdminUser(admin)) {
      return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 });
    }

    const leads = store.getAllLeads();
    return NextResponse.json({ success: true, leads });
  } catch (err) {
    console.error("Admin leads API error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await getCurrentUserFromRequest(req);
    if (!admin || !isAdminUser(admin)) {
      return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = UpdateLeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid lead update data" }, { status: 400 });
    }

    const updated = store.updateLeadStatus(
      parsed.data.leadId,
      parsed.data.status,
      parsed.data.assignedTo
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead: updated });
  } catch (err) {
    console.error("Admin update lead error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
