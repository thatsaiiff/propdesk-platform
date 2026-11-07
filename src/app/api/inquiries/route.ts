import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/getAuthUser";
import { InquiryCreateSchema } from "@/lib/validation/schemas";
import { store } from "@/lib/store";
import { isBuilderUser } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = InquiryCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Please fill in all required inquiry fields.",
            fieldErrors: parsed.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const data = parsed.data;
    let authUser = await getAuthUser(req);

    // If not signed in via session, create or find user by contact email
    if (!authUser) {
      authUser = store.createOrUpdateUserFromEmail(data.contactEmail, data.intent as any);
    }

    let propertyTitle: string | undefined;
    let jvTitle: string | undefined;

    // Check Property Listing
    if (data.propertyId) {
      const prop = store.getInternalPropertyById(data.propertyId);
      if (!prop || prop.visibility !== "PUBLIC" || (prop.status !== "PUBLISHED" && prop.status !== "SOLD" && prop.status !== "RENTED")) {
        return NextResponse.json(
          { error: { code: "NOT_FOUND", message: "The requested property is not available for inquiry." } },
          { status: 404 }
        );
      }
      propertyTitle = prop.title;
    }

    // Check Joint Venture opportunity
    if (data.jvOpportunityId) {
      if (!isBuilderUser(authUser)) {
        return NextResponse.json(
          { error: { code: "FORBIDDEN", message: "Joint Venture inquiries are restricted to verified builder accounts." } },
          { status: 403 }
        );
      }
      const jv = store.getAllJVsInternal().find(j => j.id === data.jvOpportunityId);
      if (!jv || jv.status !== "PUBLISHED") {
        return NextResponse.json(
          { error: { code: "NOT_FOUND", message: "JV opportunity not found." } },
          { status: 404 }
        );
      }
      jvTitle = jv.title;
    }

    const consentId = `consent-${Date.now()}`;

    const newInquiry = store.createInquiry({
      userId: authUser.id,
      propertyId: data.propertyId,
      propertyTitle,
      jvOpportunityId: data.jvOpportunityId,
      jvTitle,
      intent: data.intent,
      status: "NEW",
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      message: data.message,
      answers: data.answers || {},
      consentRecordId: consentId,
    });

    return NextResponse.json({
      success: true,
      message: "Your inquiry has been successfully received. Our property advisory desk will reach out shortly with detailed pricing and next steps.",
      inquiry: {
        id: newInquiry.id,
        publicReference: newInquiry.publicReference,
        status: newInquiry.status,
        propertyTitle: newInquiry.propertyTitle,
        jvTitle: newInquiry.jvTitle,
        createdAt: newInquiry.createdAt,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: err.message || "Failed to create inquiry." } },
      { status: 500 }
    );
  }
}
