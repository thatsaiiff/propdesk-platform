import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/getAuthUser";
import { PropertySubmissionCreateSchema } from "@/lib/validation/schemas";
import { store } from "@/lib/store";

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Sign in required to submit a property for admin review." } }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = PropertySubmissionCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Please complete all required fields for property submission.",
            fieldErrors: parsed.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // INVARIANT: Property submission creates an intake record with status RECEIVED. NEVER a public listing.
    const submission = store.createSubmission({
      submittedByUserId: user.id,
      submitterName: user.name,
      submitterEmail: user.email,
      submitterPhone: user.phone || "+910000000000",
      submitterRole: user.activeRole || user.roles[0] || "OWNER",
      relationshipToProperty: data.relationshipToProperty,
      category: data.category,
      subtype: data.subtype,
      transactionType: data.transactionType,
      title: data.title,
      description: data.description,
      state: data.state,
      city: data.city,
      locality: data.locality,
      area: data.area,
      areaUnit: data.areaUnit,
      contactPreference: data.contactPreference,
      reviewNotes: data.expectedPriceOrRent ? `Submitter expected value note: ${data.expectedPriceOrRent}` : undefined,
    });

    return NextResponse.json({
      success: true,
      message: "Your property submission has been submitted to the platform curation team. It will be reviewed by an administrator before listing.",
      submission: {
        id: submission.id,
        status: submission.status,
        title: submission.title,
        createdAt: submission.createdAt,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: err.message || "Failed to submit property." } },
      { status: 500 }
    );
  }
}
