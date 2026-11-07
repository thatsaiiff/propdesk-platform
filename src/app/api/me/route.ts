import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/getAuthUser";
import { UserProfileUpdateSchema } from "@/lib/validation/schemas";
import { store } from "@/lib/store";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      activeRole: user.activeRole,
      roles: user.roles,
      staffRoles: user.staffRoles,
    },
  });
}

export async function PATCH(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Sign in required." } }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = UserProfileUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Invalid input", fieldErrors: parsed.error.flatten().fieldErrors } },
        { status: 400 }
      );
    }

    user.name = parsed.data.name;
    user.phone = parsed.data.phone;
    user.updatedAt = new Date().toISOString();
    store.saveUser(user);

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    return NextResponse.json({ error: { code: "SERVER_ERROR", message: err.message } }, { status: 500 });
  }
}
