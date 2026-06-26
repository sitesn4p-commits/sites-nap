import { NextResponse, type NextRequest } from "next/server";

import { requireAdminRequest, unauthorized } from "@/lib/api";
import { collections, ensureIndexes, getDb } from "@/lib/db";
import { mapOrder } from "@/lib/mappers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = requireAdminRequest(request);
  if (!session) return unauthorized();

  await ensureIndexes();
  const db = await getDb();
  const orders = await db.collection(collections.orders).find({}).sort({ createdAt: -1 }).limit(250).toArray();
  return NextResponse.json({ orders: orders.map(mapOrder) });
}
