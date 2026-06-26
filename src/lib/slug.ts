import { collections, getDb } from "@/lib/db";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

export async function createUniqueProductSlug(title: string, currentId?: string) {
  const db = await getDb();
  const base = slugify(title) || `product-${Date.now()}`;
  let slug = base;
  let suffix = 1;

  while (true) {
    const existing = await db.collection(collections.products).findOne({ slug });
    if (!existing || String(existing._id) === currentId) {
      return slug;
    }

    suffix += 1;
    slug = `${base}-${suffix}`;
  }
}
