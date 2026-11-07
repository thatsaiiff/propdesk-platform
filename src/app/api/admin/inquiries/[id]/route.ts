import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/getAuthUser";
import { canManageLeads } from "@/lib/auth/session";
import { store } from "@/lib/store";
import { z } from "zod";

const UpdateInquirySchema = z.object({
  status: z.enum([
    "NEW",
    "ASSIGNED",
    "CONTACT_ATTEMPTED",
    "CONTACTED",
    "QUALIFIED",
    "VISIT_SCHEDULED",
    "NEGOTIATION",
    "WON",
    "LOST",
    "SPAM",
    "ON_HOLD",
    "NEEDS_INFORMATION",
  ]),
  assignedStaffId: z.string().optional(),
  note: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser(req);
  if (!canManageLeads(user)) {
    return NextResponse.json({ error: { code: "FORBIDDEN", message: "Lead management authorization required." } }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = UpdateInquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "Invalid lead update payload." } }, { status: 400 });
    }

    const { status, assignedStaffId, note } = parsed.data;
    const updated = store.updateInquiryStatus(
      id,
      status,
      user!.id,
      user!.name,
      assignedStaffId,
      note
    );

    const activities = store.getLeadActivities(id);

    return NextResponse.json({ success: true, inquiry: updated, activities });
  } catch (err: any) {
    return NextResponse.json({ error: { code: "SERVER_ERROR", message: err.message } }, { status: 500 });
  }
}
