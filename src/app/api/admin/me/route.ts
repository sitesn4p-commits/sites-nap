import { NextResponse, type NextRequest } from "next/server";

import { requireAdminRequest, unauthorized } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = requireAdminRequest(request);
  if (!session) return unauthorized();
  return NextResponse.json({ session: { email: session.email } });
}
