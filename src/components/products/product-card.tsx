"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { useCart } from "@/components/providers/cart-provider";
import { RatingStars } from "@/components/site/rating-stars";
import { firstImage, formatPrice } from "@/lib/format";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const { addProduct } = useCart();
  const inStock = product.stock > 0;

  return (
    <article className="product-card">
      <Link className="product-media" href={`/products/${product.slug}`} aria-label={product.title}>
        <img src={firstImage(product.images)} alt={product.title} />
        <div className="product-badges">
          <span className="badge red">{product.condition}</span>
          {inStock ? <span className="badge green">In stock</span> : <span className="badge">Sold out</span>}
        </div>
      </Link>
      <div className="product-body">
        <div className="product-meta">
          <span>{product.brand || "BuildPro"}</span>
          <span>{product.subcategory || product.category}</span>
        </div>
        <h3 className="product-title">
          <Link href={`/products/${product.slug}`}>{product.title}</Link>
        </h3>
        <RatingStars value={product.ratingAverage} count={product.reviewCount} />
        <div className="price-row">
          <span className="price">{formatPrice(product.price)}</span>
          {product.compareAtPrice ? <span className="old-price">{formatPrice(product.compareAtPrice)}</span> : null}
        </div>
        <div className="button-row">
          <button className="btn primary full" type="button" disabled={!inStock} onClick={() => addProduct(product)}>
            <ShoppingCart size={17} />
            Add
          </button>
          <Link className="btn secondary" href={`/products/${product.slug}`}>
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
