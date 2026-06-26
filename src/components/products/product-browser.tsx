"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { ProductCard } from "@/components/products/product-card";
import { CONDITIONS, PRODUCT_CATEGORIES } from "@/lib/constants";
import type { Product } from "@/types";

export function ProductBrowser({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [brand, setBrand] = useState("all");
  const [condition, setCondition] = useState("all");
  const [sort, setSort] = useState("latest");

  const brands = useMemo(() => {
    return Array.from(new Set(products.map((product) => product.brand).filter(Boolean))).sort();
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter((product) => {
      const matchesQuery =
        !q ||
        [product.title, product.brand, product.category, product.subcategory, product.description]
          .join(" ")
          .toLowerCase()
          .includes(q);
      const matchesCategory = category === "all" || product.category === category;
      const matchesBrand = brand === "all" || product.brand === brand;
      const matchesCondition = condition === "all" || product.condition === condition;
      return matchesQuery && matchesCategory && matchesBrand && matchesCondition;
    });

    return list.sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "rating") return b.ratingAverage - a.ratingAverage;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [brand, category, condition, products, query, sort]);

  return (
    <>
      <div className="toolbar">
        <label className="label">
          <span>Search</span>
          <span style={{ position: "relative" }}>
            <Search size={18} style={{ left: 12, position: "absolute", top: 13, color: "#777" }} />
            <input
              className="field"
              style={{ paddingLeft: 38 }}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search processors, RAM, VGA..."
            />
          </span>
        </label>
        <label className="label">
          <span>Category</span>
          <select className="select" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">All categories</option>
            {PRODUCT_CATEGORIES.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="label">
          <span>Brand</span>
          <select className="select" value={brand} onChange={(event) => setBrand(event.target.value)}>
            <option value="all">All brands</option>
            {brands.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="label">
          <span>Sort</span>
          <select className="select" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="latest">Latest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </label>
      </div>
      <div className="button-row" style={{ flexWrap: "wrap", marginBottom: 20 }}>
        <button className={`btn ${condition === "all" ? "primary" : "secondary"}`} onClick={() => setCondition("all")}>
          All
        </button>
        {CONDITIONS.map((item) => (
          <button
            key={item.value}
            className={`btn ${condition === item.value ? "primary" : "secondary"}`}
            onClick={() => setCondition(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {filtered.length ? (
        <div className="grid products">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No products found</h3>
          <p className="section-copy">Try another search or check back soon for updated stock.</p>
        </div>
      )}
    </>
  );
}
