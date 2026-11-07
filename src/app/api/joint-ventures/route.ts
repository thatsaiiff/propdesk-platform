import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/getAuthUser";
import { isBuilderUser } from "@/lib/auth/session";
import { store } from "@/lib/store";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);

  // SERVER-SIDE SECURITY CHECK: Builder only
  if (!isBuilderUser(user)) {
    return NextResponse.json(
      {
        error: {
          code: "FORBIDDEN",
          message: "Joint Venture opportunities are restricted to verified builder/developer accounts.",
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

  const jvs = store.getJVOpportunities();

  return NextResponse.json(
    {
      success: true,
      data: jvs,
      meta: { total: jvs.length },
    },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    }
  );
}
