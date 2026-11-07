import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/auth/session";
import { store } from "@/lib/store";
import { z } from "zod";

const SubmissionSchema = z.object({
  category: z.enum([
    "HOUSE",
    "FLAT",
    "PLOT",
    "INDUSTRIAL_LAND",
    "WAREHOUSE",
    "FACTORY",
    "BUILDING_WITH_LAND",
    "DISPUTED",
  ]),
  purpose: z.enum(["SALE", "RENT", "BOTH"]),
  title: z.string().min(5),
  description: z.string().min(10),
  city: z.string().min(2),
  state: z.string().min(2),
  locality: z.string().min(2),
  area: z.number().positive(),
  areaUnit: z.string().default("sq.ft."),
  askingPrice: z.number().positive(),
  isJointVenture: z.boolean().default(false),
  isDisputed: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Authentication required to submit property." }, { status: 401 });
    }

    const body = await req.json();
    const parsed = SubmissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const submission = store.createSubmission({
      ...parsed.data,
      userId: user.id,
      submitterName: user.name || "Anonymous Submitter",
      submitterEmail: user.email,
      submitterPhone: user.phone || "Not specified",
      submitterRole: user.roles[0] || "PROPERTY_OWNER",
    });

    return NextResponse.json({
      success: true,
      message: "Property intake submitted for admin review. Status: PENDING_REVIEW.",
      submission,
    });
  } catch (err) {
    console.error("Property submission error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
