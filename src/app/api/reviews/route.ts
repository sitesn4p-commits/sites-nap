import { NextResponse } from "next/server";

import { badRequest } from "@/lib/api";
import { collections, ensureIndexes, getDb, objectIdFrom } from "@/lib/db";
import { mapReview } from "@/lib/mappers";
import { recalculateProductRating } from "@/lib/reviews";
import { normalizeText } from "@/lib/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  await ensureIndexes();
  const body = await request.json().catch(() => ({}));
  const productId = objectIdFrom(String(body.productId || ""));
  if (!productId) return badRequest("Invalid product.");

  const rating = Math.min(5, Math.max(1, Math.round(Number(body.rating) || 0)));
  const name = normalizeText(body.name);
  const title = normalizeText(body.title);
  const comment = normalizeText(body.comment);

  if (!name || !title || !comment) {
    return badRequest("Name, review title, and comment are required.");
  }

  const db = await getDb();
  const product = await db.collection(collections.products).findOne({ _id: productId, active: true });
  if (!product) return badRequest("Product not found.");

  const result = await db.collection(collections.reviews).insertOne({
    productId,
    productTitle: String(product.title),
    name,
    whatsapp: normalizeText(body.whatsapp),
    rating,
    title,
    comment,
    approved: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  await recalculateProductRating(productId);

  const review = await db.collection(collections.reviews).findOne({ _id: result.insertedId });
  return NextResponse.json({ review: mapReview(review) }, { status: 201 });
}
