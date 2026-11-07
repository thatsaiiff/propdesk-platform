import { NextRequest } from "next/server";
import { verifySessionToken } from "./session";
import { store } from "../store";
import { User } from "@/types";

export async function getAuthUser(req: NextRequest): Promise<User | null> {
  const sessionCookie = req.cookies.get("propdesk_session")?.value;
  const authHeader = req.headers.get("authorization");
  const token = sessionCookie || (authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null);

  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload || !payload.userId) return null;

  return store.getUserById(payload.userId);
}
