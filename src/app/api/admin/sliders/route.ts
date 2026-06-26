import { NextResponse, type NextRequest } from "next/server";

import { badRequest, requireAdminRequest, unauthorized } from "@/lib/api";
import { collections, ensureIndexes, getDb } from "@/lib/db";
import { mapSlider } from "@/lib/mappers";
import { normalizeText, numberOrZero } from "@/lib/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function payload(body: any) {
  const title = normalizeText(body.title);
  const subtitle = normalizeText(body.subtitle);
  const desktopImage = normalizeText(body.desktopImage);
  const mobileImage = normalizeText(body.mobileImage);

  if (!title || !subtitle || !desktopImage || !mobileImage) {
    throw new Error("Title, subtitle, desktop image, and mobile image are required.");
  }

  return {
    title,
    subtitle,
    buttonLabel: normalizeText(body.buttonLabel) || "Shop Now",
    href: normalizeText(body.href) || "/products",
    desktopImage,
    mobileImage,
    sortOrder: Math.round(numberOrZero(body.sortOrder)),
    active: body.active !== false,
    updatedAt: new Date()
  };
}

export async function GET(request: NextRequest) {
  const session = requireAdminRequest(request);
  if (!session) return unauthorized();

  await ensureIndexes();
  const db = await getDb();
  const sliders = await db.collection(collections.sliders).find({}).sort({ sortOrder: 1 }).toArray();
  return NextResponse.json({ sliders: sliders.map(mapSlider) });
}

export async function POST(request: NextRequest) {
  const session = requireAdminRequest(request);
  if (!session) return unauthorized();

  await ensureIndexes();
  const body = await request.json().catch(() => ({}));

  try {
    const db = await getDb();
    const result = await db.collection(collections.sliders).insertOne({
      ...payload(body),
      createdAt: new Date()
    });
    const slider = await db.collection(collections.sliders).findOne({ _id: result.insertedId });
    return NextResponse.json({ slider: mapSlider(slider) }, { status: 201 });
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Slider could not be saved.");
  }
}
