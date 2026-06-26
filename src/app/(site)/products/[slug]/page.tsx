import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";

import { ProductDetail } from "@/components/products/product-detail";
import { collections, ensureIndexes, getDb } from "@/lib/db";
import { mapProduct, mapReview } from "@/lib/mappers";
import type { Product, Review } from "@/types";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }> | { slug: string };

async function getProduct(slug: string): Promise<{ product: Product; reviews: Review[] } | null> {
  try {
    await ensureIndexes();
    const db = await getDb();
    const productDoc = await db.collection(collections.products).findOne({ slug, active: true });
    if (!productDoc) {
      return null;
    }

    const reviews = await db
      .collection(collections.reviews)
      .find({ productId: productDoc._id as ObjectId, approved: true })
      .sort({ createdAt: -1 })
      .toArray();

    return { product: mapProduct(productDoc), reviews: reviews.map(mapReview) };
  } catch {
    return null;
  }
}

export default async function ProductPage({ params }: { params: Params }) {
  const resolvedParams = await params;
  const data = await getProduct(resolvedParams.slug);

  if (!data) {
    notFound();
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Product details</span>
          <h1>{data.product.title}</h1>
          <p>Check details, add to cart, or leave a customer review.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <ProductDetail product={data.product} reviews={data.reviews} />
        </div>
      </section>
    </>
  );
}
