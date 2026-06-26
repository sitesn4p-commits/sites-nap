import { NextResponse, type NextRequest } from "next/server";

import { getAdminSessionFromRequest } from "@/lib/auth";

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function requireAdminRequest(request: NextRequest) {
  return getAdminSessionFromRequest(request);
}
