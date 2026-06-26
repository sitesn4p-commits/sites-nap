"use client";

import { useEffect, useState } from "react";

import { RatingStars } from "@/components/site/rating-stars";
import type { Review } from "@/types";

export function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [replies, setReplies] = useState<Record<string, string>>({});

  async function loadReviews() {
    const response = await fetch("/api/admin/reviews", { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      setReviews(data.reviews);
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  async function patch(review: Review, body: Record<string, unknown>) {
    const response = await fetch(`/api/admin/reviews/${review.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (response.ok) {
      await loadReviews();
    }
  }

  async function remove(review: Review) {
    if (!window.confirm("Delete this review?")) return;
    const response = await fetch(`/api/admin/reviews/${review.id}`, { method: "DELETE" });
    if (response.ok) {
      await loadReviews();
    }
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Review</th>
            <th>Product</th>
            <th>Customer</th>
            <th>Reply</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id}>
              <td>
                <RatingStars value={review.rating} />
                <p>
                  <strong>{review.title}</strong>
                  <br />
                  {review.comment}
                </p>
              </td>
              <td>{review.productTitle}</td>
              <td>
                {review.name}
                {review.whatsapp ? (
                  <>
                    <br />
                    <span className="section-copy">{review.whatsapp}</span>
                  </>
                ) : null}
              </td>
              <td>
                {review.reply && (
                  <div className="reply" style={{ marginTop: 0, marginBottom: 10 }}>
                    {review.reply.message}
                  </div>
                )}
                <textarea
                  className="textarea"
                  value={replies[review.id] ?? ""}
                  onChange={(event) => setReplies((current) => ({ ...current, [review.id]: event.target.value }))}
                  placeholder="Write admin reply"
                />
                <button className="btn primary" type="button" onClick={() => patch(review, { reply: replies[review.id] || "" })}>
                  Reply
                </button>
              </td>
              <td>
                <div className="button-row" style={{ flexWrap: "wrap" }}>
                  <button className={`btn ${review.approved ? "primary" : "secondary"}`} onClick={() => patch(review, { approved: !review.approved })}>
                    {review.approved ? "Approved" : "Hidden"}
                  </button>
                  <button className="btn secondary" onClick={() => remove(review)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
