import { NextResponse, type NextRequest } from "next/server";

import { badRequest, requireAdminRequest, unauthorized } from "@/lib/api";
import { collections, getDb, objectIdFrom } from "@/lib/db";
import { mapReview } from "@/lib/mappers";
import { recalculateProductRating } from "@/lib/reviews";
import { normalizeText } from "@/lib/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }> | { id: string };

export async function PATCH(request: NextRequest, context: { params: Params }) {
  const session = requireAdminRequest(request);
  if (!session) return unauthorized();

  const { id } = await context.params;
  const _id = objectIdFrom(id);
  if (!_id) return badRequest("Invalid review id.");

  const body = await request.json().catch(() => ({}));
  const update: Record<string, unknown> = { updatedAt: new Date() };

  if (typeof body.approved === "boolean") {
    update.approved = body.approved;
  }

  if (typeof body.reply === "string") {
    const message = normalizeText(body.reply);
    update.reply = message ? { message, author: "BuildPro.lk", createdAt: new Date() } : undefined;
  }

  const db = await getDb();
  await db.collection(collections.reviews).updateOne({ _id }, { $set: update });
  const review = await db.collection(collections.reviews).findOne({ _id });
  if (review?.productId) {
    await recalculateProductRating(review.productId);
  }

  return NextResponse.json({ review: mapReview(review) });
}

export async function DELETE(request: NextRequest, context: { params: Params }) {
  const session = requireAdminRequest(request);
  if (!session) return unauthorized();

  const { id } = await context.params;
  const _id = objectIdFrom(id);
  if (!_id) return badRequest("Invalid review id.");

  const db = await getDb();
  const review = await db.collection(collections.reviews).findOne({ _id });
  await db.collection(collections.reviews).deleteOne({ _id });
  if (review?.productId) {
    await recalculateProductRating(review.productId);
  }

  return NextResponse.json({ ok: true });
}
