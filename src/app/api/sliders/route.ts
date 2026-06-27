import { NextResponse } from "next/server";

import { collections, ensureIndexes, getDb } from "@/lib/db";
import { mapSlider } from "@/lib/mappers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureIndexes();
    const db = await getDb();
    const sliders = await db.collection(collections.sliders).find({ active: true }).sort({ sortOrder: 1 }).toArray();
    return NextResponse.json({ sliders: sliders.map(mapSlider) });
  } catch {
    return NextResponse.json({ sliders: [] });
  }
}
