import { NextResponse, type NextRequest } from "next/server";

import { badRequest, requireAdminRequest, unauthorized } from "@/lib/api";
import { collections, getDb, objectIdFrom } from "@/lib/db";
import { mapSlider } from "@/lib/mappers";
import { normalizeText, numberOrZero } from "@/lib/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }> | { id: string };

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

export async function PUT(request: NextRequest, context: { params: Params }) {
  const session = requireAdminRequest(request);
  if (!session) return unauthorized();

  const { id } = await context.params;
  const _id = objectIdFrom(id);
  if (!_id) return badRequest("Invalid slider id.");

  const body = await request.json().catch(() => ({}));

  try {
    const db = await getDb();
    await db.collection(collections.sliders).updateOne({ _id }, { $set: payload(body) });
    const slider = await db.collection(collections.sliders).findOne({ _id });
    return NextResponse.json({ slider: mapSlider(slider) });
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Slider could not be updated.");
  }
}

export async function DELETE(request: NextRequest, context: { params: Params }) {
  const session = requireAdminRequest(request);
  if (!session) return unauthorized();

  const { id } = await context.params;
  const _id = objectIdFrom(id);
  if (!_id) return badRequest("Invalid slider id.");

  const db = await getDb();
  await db.collection(collections.sliders).deleteOne({ _id });
  return NextResponse.json({ ok: true });
}
