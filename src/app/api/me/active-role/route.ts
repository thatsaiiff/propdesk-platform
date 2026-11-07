import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/getAuthUser";
import { ActiveRoleSwitchSchema, UserRoleEnum } from "@/lib/validation/schemas";
import { store } from "@/lib/store";

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Sign in required." } }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = ActiveRoleSwitchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Invalid role selected." } },
        { status: 400 }
      );
    }

    const targetRole = parsed.data.role;

    // SECURITY CHECK: active role MUST be one of the user's assigned roles
    if (!user.roles.includes(targetRole as any)) {
      return NextResponse.json(
        {
          error: {
            code: "FORBIDDEN_ROLE",
            message: `You do not have the ${targetRole} role assigned. Add this role to your account first.`,
          },
        },
        { status: 403 }
      );
    }

    user.activeRole = targetRole;
    store.saveUser(user);

    return NextResponse.json({
      success: true,
      activeRole: user.activeRole,
    });
  } catch (err: any) {
    return NextResponse.json({ error: { code: "SERVER_ERROR", message: err.message } }, { status: 500 });
  }
}
