export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function firstImage(images?: string[]) {
  return images?.find(Boolean) || "/assets/product-placeholder.png";
}

export function normalizeText(value: unknown) {
  return String(value ?? "").trim();
}

export function numberOrZero(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}
