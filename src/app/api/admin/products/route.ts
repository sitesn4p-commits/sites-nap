import { NextResponse, type NextRequest } from "next/server";

import { badRequest, requireAdminRequest, unauthorized } from "@/lib/api";
import { collections, ensureIndexes, getDb } from "@/lib/db";
import { mapProduct } from "@/lib/mappers";
import { createUniqueProductSlug } from "@/lib/slug";
import { numberOrZero, normalizeText } from "@/lib/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeSpecs(specs: unknown) {
  return Array.isArray(specs)
    ? specs
        .map((spec) => ({ name: normalizeText(spec?.name), value: normalizeText(spec?.value) }))
        .filter((spec) => spec.name && spec.value)
    : [];
}

function normalizeImages(images: unknown) {
  return Array.isArray(images) ? images.map(normalizeText).filter(Boolean) : [];
}

async function productPayload(body: any, currentId?: string) {
  const title = normalizeText(body.title);
  const price = numberOrZero(body.price);
  if (!title) throw new Error("Product title is required.");
  if (price <= 0) throw new Error("Product price must be greater than zero.");

  return {
    title,
    slug: await createUniqueProductSlug(title, currentId),
    brand: normalizeText(body.brand) || "BuildPro",
    category: normalizeText(body.category),
    subcategory: normalizeText(body.subcategory),
    condition: normalizeText(body.condition) || "new",
    price,
    compareAtPrice: numberOrZero(body.compareAtPrice) > 0 ? numberOrZero(body.compareAtPrice) : undefined,
    stock: Math.max(0, Math.round(numberOrZero(body.stock))),
    images: normalizeImages(body.images),
    description: normalizeText(body.description),
    specs: normalizeSpecs(body.specs),
    featured: Boolean(body.featured),
    active: body.active !== false,
    updatedAt: new Date()
  };
}

export async function GET(request: NextRequest) {
  const session = requireAdminRequest(request);
  if (!session) return unauthorized();

  await ensureIndexes();
  const db = await getDb();
  const products = await db.collection(collections.products).find({}).sort({ updatedAt: -1 }).toArray();
  return NextResponse.json({ products: products.map(mapProduct) });
}

export async function POST(request: NextRequest) {
  const session = requireAdminRequest(request);
  if (!session) return unauthorized();

  await ensureIndexes();
  const body = await request.json().catch(() => ({}));

  try {
    const payload = await productPayload(body);
    const db = await getDb();
    const result = await db.collection(collections.products).insertOne({
      ...payload,
      ratingAverage: 0,
      reviewCount: 0,
      createdAt: new Date()
    });
    const product = await db.collection(collections.products).findOne({ _id: result.insertedId });
    return NextResponse.json({ product: mapProduct(product) }, { status: 201 });
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Product could not be saved.");
  }
}
