import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromRequest, isAdminUser } from "@/lib/auth/session";
import { store } from "@/lib/store";
import { z } from "zod";

const ReviewSchema = z.object({
  submissionId: z.string().min(1),
  status: z.enum(["APPROVED", "REJECTED", "INFO_REQUESTED"]),
  adminReviewNotes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const admin = await getCurrentUserFromRequest(req);
    if (!admin || !isAdminUser(admin)) {
      return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 });
    }

    const submissions = store.getAllSubmissions();
    return NextResponse.json({ success: true, submissions });
  } catch (err) {
    console.error("Admin get submissions error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentUserFromRequest(req);
    if (!admin || !isAdminUser(admin)) {
      return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = ReviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid review decision data" }, { status: 400 });
    }

    const result = store.reviewSubmission(
      parsed.data.submissionId,
      parsed.data.status,
      parsed.data.adminReviewNotes
    );

    if (!result.submission) {
      return NextResponse.json({ success: false, error: "Submission not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      submission: result.submission,
      publishedProperty: result.publishedProperty,
      message: parsed.data.status === "APPROVED" 
        ? "Submission approved and published to discovery catalog!" 
        : `Submission marked as ${parsed.data.status}.`,
    });
  } catch (err) {
    console.error("Admin review submission error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
