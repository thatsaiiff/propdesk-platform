import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/getAuthUser";
import { isBuilderUser } from "@/lib/auth/session";
import { store } from "@/lib/store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const user = await getAuthUser(req);

  // SERVER-SIDE SECURITY CHECK: Builder only
  if (!isBuilderUser(user)) {
    return NextResponse.json(
      {
        error: {
          code: "FORBIDDEN",
          message: "Access to Joint Venture opportunities is restricted to verified builder/developer accounts.",
        },
      },
      {
        status: 403,
        headers: {
          "Cache-Control": "private, no-store",
        },
      }
    );
  }

  const { slug } = await params;
  const jv = store.getJVOpportunityBySlug(slug);

  if (!jv) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "JV Opportunity not found." } },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { success: true, data: jv },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
