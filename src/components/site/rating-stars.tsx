import { Star } from "lucide-react";

export function RatingStars({ value, count }: { value: number; count?: number }) {
  const rounded = Math.round(value);

  return (
    <span className="rating" aria-label={`${value || 0} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} size={15} fill={index < rounded ? "currentColor" : "none"} />
      ))}
      <span>{value ? value.toFixed(1) : "No reviews"}{typeof count === "number" && count > 0 ? ` (${count})` : ""}</span>
    </span>
  );
}
