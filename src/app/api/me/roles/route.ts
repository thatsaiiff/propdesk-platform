import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/getAuthUser";
import { UserRoleEnum } from "@/lib/validation/schemas";
import { store } from "@/lib/store";

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Sign in required." } }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = UserRoleEnum.safeParse(body.role);

    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Invalid role specified." } },
        { status: 400 }
      );
    }

    const newRole = parsed.data;

    if (!user.roles.includes(newRole)) {
      user.roles.push(newRole);
      store.saveUser(user);

      store.addAuditLog({
        actorUserId: user.id,
        actorName: user.name,
        action: "USER_ROLE_ADDED",
        entityType: "USER_ROLE",
        entityId: user.id,
        afterSnapshot: { addedRole: newRole, roles: user.roles },
      });
    }

    return NextResponse.json({
      success: true,
      roles: user.roles,
    });
  } catch (err: any) {
    return NextResponse.json({ error: { code: "SERVER_ERROR", message: err.message } }, { status: 500 });
  }
}
