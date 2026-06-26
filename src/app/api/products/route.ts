import { NextResponse, type NextRequest } from "next/server";

import { collections, ensureIndexes, getDb } from "@/lib/db";
import { mapProduct } from "@/lib/mappers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  await ensureIndexes();
  const db = await getDb();
  const { searchParams } = new URL(request.url);
  const filter: Record<string, unknown> = { active: true };

  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const condition = searchParams.get("condition");
  const q = searchParams.get("q");

  if (category) filter.category = category;
  if (brand) filter.brand = brand;
  if (condition) filter.condition = condition;
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { brand: { $regex: q, $options: "i" } },
      { category: { $regex: q, $options: "i" } },
      { subcategory: { $regex: q, $options: "i" } }
    ];
  }

  const products = await db.collection(collections.products).find(filter).sort({ updatedAt: -1 }).toArray();
  return NextResponse.json({ products: products.map(mapProduct) });
}
