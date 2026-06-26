"use client";

import { FormEvent, useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";

import { useCart } from "@/components/providers/cart-provider";
import { RatingStars } from "@/components/site/rating-stars";
import { firstImage, formatPrice } from "@/lib/format";
import type { Product, Review } from "@/types";

export function ProductDetail({ product, reviews }: { product: Product; reviews: Review[] }) {
  const images = useMemo(() => (product.images.length ? product.images : [firstImage(product.images)]), [product.images]);
  const [activeImage, setActiveImage] = useState(images[0]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { addProduct } = useCart();

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    const form = new FormData(event.currentTarget);

    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        name: form.get("name"),
        whatsapp: form.get("whatsapp"),
        rating: form.get("rating"),
        title: form.get("title"),
        comment: form.get("comment")
      })
    });

    setSubmitting(false);
    if (!response.ok) {
      setMessage("Review could not be submitted. Please check the form and try again.");
      return;
    }

    event.currentTarget.reset();
    setMessage("Thank you. Your review is now visible on this product.");
    window.setTimeout(() => window.location.reload(), 900);
  }

  return (
    <div className="detail-grid">
      <div className="gallery">
        <div className="gallery-main">
          <img src={activeImage} alt={product.title} />
        </div>
        <div className="thumbs">
          {images.map((image) => (
            <button
              key={image}
              className={`thumb ${image === activeImage ? "active" : ""}`}
              type="button"
              onClick={() => setActiveImage(image)}
              aria-label="Select product image"
            >
              <img src={image} alt="" />
            </button>
          ))}
        </div>
      </div>

      <div className="panel">
        <span className="badge red">{product.condition}</span>
        <h1 style={{ margin: "14px 0 8px", fontSize: "2.2rem" }}>{product.title}</h1>
        <p className="section-copy" style={{ marginTop: 0 }}>
          {product.brand} / {product.category} / {product.subcategory}
        </p>
        <RatingStars value={product.ratingAverage} count={product.reviewCount} />
        <div className="price-row" style={{ margin: "18px 0" }}>
          <span className="price" style={{ fontSize: "1.8rem" }}>
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice ? <span className="old-price">{formatPrice(product.compareAtPrice)}</span> : null}
        </div>
        <p style={{ lineHeight: 1.75 }}>{product.description || "Contact BuildPro.lk for more details about this item."}</p>
        <div className="button-row" style={{ margin: "20px 0" }}>
          <button className="btn primary full" disabled={product.stock <= 0} onClick={() => addProduct(product)}>
            <ShoppingCart size={18} />
            Add to Cart
          </button>
        </div>
        <div className="notice">
          COD orders include an additional LKR 250 charge. Bank transfer details are shared by WhatsApp after the order is
          placed.
        </div>
      </div>

      <div className="panel">
        <h2>Specifications</h2>
        {product.specs.length ? (
          <div className="spec-list">
            {product.specs.map((spec) => (
              <div className="spec-item" key={`${spec.name}-${spec.value}`}>
                <strong>{spec.name}</strong>
                {spec.value}
              </div>
            ))}
          </div>
        ) : (
          <p className="section-copy">Specifications will be updated soon.</p>
        )}
      </div>

      <div className="panel">
        <h2>Customer Reviews</h2>
        <form className="admin-form" onSubmit={submitReview}>
          <div className="form-grid">
            <label className="label">
              Name
              <input className="field" name="name" required />
            </label>
            <label className="label">
              WhatsApp
              <input className="field" name="whatsapp" placeholder="07XXXXXXXX" />
            </label>
            <label className="label">
              Rating
              <select className="select" name="rating" defaultValue="5" required>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} Stars
                  </option>
                ))}
              </select>
            </label>
            <label className="label">
              Review title
              <input className="field" name="title" required />
            </label>
            <label className="label span-2">
              Comment
              <textarea className="textarea" name="comment" required />
            </label>
          </div>
          <button className="btn primary" disabled={submitting}>
            {submitting ? "Submitting..." : "Post Review"}
          </button>
          {message && <p className="section-copy">{message}</p>}
        </form>
      </div>

      <div className="reviews">
        {reviews.length ? (
          reviews.map((review) => (
            <article className="review" key={review.id}>
              <div className="review-head">
                <div>
                  <strong>{review.name}</strong>
                  <p className="section-copy" style={{ margin: "4px 0 0" }}>
                    {review.title}
                  </p>
                </div>
                <RatingStars value={review.rating} />
              </div>
              <p style={{ lineHeight: 1.7 }}>{review.comment}</p>
              {review.reply && (
                <div className="reply">
                  <strong>{review.reply.author}</strong>
                  <p style={{ margin: "6px 0 0", lineHeight: 1.6 }}>{review.reply.message}</p>
                </div>
              )}
            </article>
          ))
        ) : (
          <div className="empty-state">
            <h3>No reviews yet</h3>
            <p className="section-copy">Be the first customer to review this product.</p>
          </div>
        )}
      </div>
    </div>
  );
}
