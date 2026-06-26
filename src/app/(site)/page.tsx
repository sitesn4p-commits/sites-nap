import Link from "next/link";

import { HomeSlider } from "@/components/home/home-slider";
import { ProductCard } from "@/components/products/product-card";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { collections, ensureIndexes, getDb } from "@/lib/db";
import { mapProduct, mapSlider } from "@/lib/mappers";
import type { Product, Slider } from "@/types";

export const dynamic = "force-dynamic";

async function getHomeData(): Promise<{ sliders: Slider[]; featured: Product[] }> {
  try {
    await ensureIndexes();
    const db = await getDb();
    const [sliders, featured] = await Promise.all([
      db.collection(collections.sliders).find({ active: true }).sort({ sortOrder: 1 }).limit(8).toArray(),
      db
        .collection(collections.products)
        .find({ active: true, featured: true })
        .sort({ updatedAt: -1 })
        .limit(8)
        .toArray()
    ]);

    return { sliders: sliders.map(mapSlider), featured: featured.map(mapProduct) };
  } catch {
    return { sliders: [], featured: [] };
  }
}

const categoryImages = [
  "/assets/category-desktops.png",
  "/assets/category-components.png",
  "/assets/category-peripherals.png",
  "/assets/category-gaming.png",
  "/assets/category-laptop.png"
];

export default async function HomePage() {
  const { sliders, featured } = await getHomeData();

  return (
    <>
      <HomeSlider sliders={sliders} />

      <section className="section tight">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow">Shop by category</span>
              <h2 className="section-title">Parts, PCs, and gaming gear</h2>
              <p className="section-copy">Browse the product groups built from your current price-list categories.</p>
            </div>
            <Link className="btn secondary" href="/products">
              View All
            </Link>
          </div>
          <div className="grid categories">
            {PRODUCT_CATEGORIES.map((category, index) => (
              <Link className="category-tile" href={`/products?category=${encodeURIComponent(category.name)}`} key={category.name}>
                <img src={categoryImages[index] || categoryImages[0]} alt="" />
                <h3>{category.name}</h3>
                <span>{category.subcategories.length} product groups</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow">Featured stock</span>
              <h2 className="section-title">Ready to order</h2>
              <p className="section-copy">Featured products and best deals appear here as stock is updated.</p>
            </div>
            <Link className="btn primary" href="/products">
              Shop Products
            </Link>
          </div>
          {featured.length ? (
            <div className="grid products">
              {featured.map((product) => (
                <ProductCard product={product} key={product.id} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No featured products yet</h3>
              <p className="section-copy">Featured products will appear here soon. Browse all available products for now.</p>
              <Link className="btn primary" href="/products">
                Browse Products
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="section tight" style={{ background: "#111", color: "#fff" }}>
        <div className="container section-header" style={{ marginBottom: 0 }}>
          <div>
            <span className="eyebrow">Payment options</span>
            <h2 className="section-title">COD or bank transfer</h2>
            <p className="section-copy" style={{ color: "rgba(255,255,255,0.72)" }}>
              Customers can place orders without seeing bank details publicly. Bank details can be sent manually through
              WhatsApp after order review.
            </p>
          </div>
          <Link className="btn primary" href="/checkout">
            Checkout
          </Link>
        </div>
      </section>
    </>
  );
}
