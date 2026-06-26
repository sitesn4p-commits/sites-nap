import { ProductBrowser } from "@/components/products/product-browser";
import { collections, ensureIndexes, getDb } from "@/lib/db";
import { mapProduct } from "@/lib/mappers";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Products"
};

async function getProducts(): Promise<Product[]> {
  try {
    await ensureIndexes();
    const db = await getDb();
    const products = await db
      .collection(collections.products)
      .find({ active: true })
      .sort({ updatedAt: -1 })
      .toArray();
    return products.map(mapProduct);
  } catch {
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Products</span>
          <h1>Shop computer parts</h1>
          <p>Find desktops, processors, motherboards, VGA cards, RAM, SSDs, HDDs, peripherals, and gaming gear.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <ProductBrowser products={products} />
        </div>
      </section>
    </>
  );
}
