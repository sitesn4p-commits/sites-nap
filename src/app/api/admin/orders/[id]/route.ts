import { NextResponse, type NextRequest } from "next/server";

import { badRequest, requireAdminRequest, unauthorized } from "@/lib/api";
import { ORDER_STATUSES } from "@/lib/constants";
import { collections, getDb, objectIdFrom } from "@/lib/db";
import { mapOrder } from "@/lib/mappers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }> | { id: string };

export async function PATCH(request: NextRequest, context: { params: Params }) {
  const session = requireAdminRequest(request);
  if (!session) return unauthorized();

  const { id } = await context.params;
  const _id = objectIdFrom(id);
  if (!_id) return badRequest("Invalid order id.");

  const body = await request.json().catch(() => ({}));
  const status = String(body.status || "");
  if (!ORDER_STATUSES.some((item) => item.value === status)) {
    return badRequest("Invalid status.");
  }

  const db = await getDb();
  await db.collection(collections.orders).updateOne({ _id }, { $set: { status, updatedAt: new Date() } });
  const order = await db.collection(collections.orders).findOne({ _id });
  return NextResponse.json({ order: mapOrder(order) });
}
