import { ObjectId } from "mongodb";

import { collections, getDb } from "@/lib/db";

export async function recalculateProductRating(productId: ObjectId) {
  const db = await getDb();
  const [summary] = await db
    .collection(collections.reviews)
    .aggregate<{ average: number; count: number }>([
      { $match: { productId, approved: true } },
      { $group: { _id: "$productId", average: { $avg: "$rating" }, count: { $sum: 1 } } }
    ])
    .toArray();

  await db.collection(collections.products).updateOne(
    { _id: productId },
    {
      $set: {
        ratingAverage: summary ? Math.round(summary.average * 10) / 10 : 0,
        reviewCount: summary?.count ?? 0,
        updatedAt: new Date()
      }
    }
  );
}
