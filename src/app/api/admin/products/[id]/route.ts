import { NextResponse, type NextRequest } from "next/server";

import { badRequest, requireAdminRequest, unauthorized } from "@/lib/api";
import { collections, ensureIndexes, getDb, objectIdFrom } from "@/lib/db";
import { mapProduct } from "@/lib/mappers";
import { createUniqueProductSlug } from "@/lib/slug";
import { normalizeText, numberOrZero } from "@/lib/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }> | { id: string };

function normalizeSpecs(specs: unknown) {
  return Array.isArray(specs)
    ? specs
        .map((spec) => ({ name: normalizeText(spec?.name), value: normalizeText(spec?.value) }))
        .filter((spec) => spec.name && spec.value)
    : [];
}

async function payload(body: any, id: string) {
  const title = normalizeText(body.title);
  const price = numberOrZero(body.price);
  if (!title) throw new Error("Product title is required.");
  if (price <= 0) throw new Error("Product price must be greater than zero.");

  return {
    title,
    slug: await createUniqueProductSlug(title, id),
    brand: normalizeText(body.brand) || "BuildPro",
    category: normalizeText(body.category),
    subcategory: normalizeText(body.subcategory),
    condition: normalizeText(body.condition) || "new",
    price,
    compareAtPrice: numberOrZero(body.compareAtPrice) > 0 ? numberOrZero(body.compareAtPrice) : undefined,
    stock: Math.max(0, Math.round(numberOrZero(body.stock))),
    images: Array.isArray(body.images) ? body.images.map(normalizeText).filter(Boolean) : [],
    description: normalizeText(body.description),
    specs: normalizeSpecs(body.specs),
    featured: Boolean(body.featured),
    active: body.active !== false,
    updatedAt: new Date()
  };
}

export async function PUT(request: NextRequest, context: { params: Params }) {
  const session = requireAdminRequest(request);
  if (!session) return unauthorized();

  const { id } = await context.params;
  const _id = objectIdFrom(id);
  if (!_id) return badRequest("Invalid product id.");

  await ensureIndexes();
  const body = await request.json().catch(() => ({}));

  try {
    const db = await getDb();
    const update = await payload(body, id);
    await db.collection(collections.products).updateOne({ _id }, { $set: update });
    const product = await db.collection(collections.products).findOne({ _id });
    return NextResponse.json({ product: mapProduct(product) });
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Product could not be updated.");
  }
}

export async function DELETE(request: NextRequest, context: { params: Params }) {
  const session = requireAdminRequest(request);
  if (!session) return unauthorized();

  const { id } = await context.params;
  const _id = objectIdFrom(id);
  if (!_id) return badRequest("Invalid product id.");

  const db = await getDb();
  await db.collection(collections.products).deleteOne({ _id });
  await db.collection(collections.reviews).deleteMany({ productId: _id });
  return NextResponse.json({ ok: true });
}
