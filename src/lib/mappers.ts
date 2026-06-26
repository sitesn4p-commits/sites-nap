import type { Order, Product, Review, Slider } from "@/types";

function idOf(doc: { _id?: unknown; id?: unknown }) {
  return String(doc._id ?? doc.id ?? "");
}

function iso(value: unknown) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string" && value) {
    return new Date(value).toISOString();
  }

  return new Date().toISOString();
}

export function mapProduct(doc: any): Product {
  return {
    id: idOf(doc),
    title: String(doc.title ?? ""),
    slug: String(doc.slug ?? ""),
    brand: String(doc.brand ?? ""),
    category: String(doc.category ?? ""),
    subcategory: String(doc.subcategory ?? ""),
    condition: doc.condition ?? "new",
    price: Number(doc.price ?? 0),
    compareAtPrice: doc.compareAtPrice ? Number(doc.compareAtPrice) : undefined,
    stock: Number(doc.stock ?? 0),
    images: Array.isArray(doc.images) ? doc.images.filter(Boolean).map(String) : [],
    description: String(doc.description ?? ""),
    specs: Array.isArray(doc.specs) ? doc.specs : [],
    featured: Boolean(doc.featured),
    active: doc.active !== false,
    ratingAverage: Number(doc.ratingAverage ?? 0),
    reviewCount: Number(doc.reviewCount ?? 0),
    createdAt: iso(doc.createdAt),
    updatedAt: iso(doc.updatedAt)
  };
}

export function mapSlider(doc: any): Slider {
  return {
    id: idOf(doc),
    title: String(doc.title ?? ""),
    subtitle: String(doc.subtitle ?? ""),
    buttonLabel: String(doc.buttonLabel ?? "Shop Now"),
    href: String(doc.href ?? "/products"),
    desktopImage: String(doc.desktopImage ?? ""),
    mobileImage: String(doc.mobileImage ?? doc.desktopImage ?? ""),
    sortOrder: Number(doc.sortOrder ?? 0),
    active: doc.active !== false,
    createdAt: iso(doc.createdAt),
    updatedAt: iso(doc.updatedAt)
  };
}

export function mapReview(doc: any): Review {
  return {
    id: idOf(doc),
    productId: String(doc.productId ?? ""),
    productTitle: String(doc.productTitle ?? ""),
    name: String(doc.name ?? ""),
    whatsapp: doc.whatsapp ? String(doc.whatsapp) : undefined,
    rating: Number(doc.rating ?? 0),
    title: String(doc.title ?? ""),
    comment: String(doc.comment ?? ""),
    approved: doc.approved !== false,
    reply: doc.reply
      ? {
          message: String(doc.reply.message ?? ""),
          author: String(doc.reply.author ?? "BuildPro.lk"),
          createdAt: iso(doc.reply.createdAt)
        }
      : undefined,
    createdAt: iso(doc.createdAt),
    updatedAt: iso(doc.updatedAt)
  };
}

export function mapOrder(doc: any): Order {
  return {
    id: idOf(doc),
    orderNumber: String(doc.orderNumber ?? ""),
    customer: {
      fullName: String(doc.customer?.fullName ?? ""),
      phone: String(doc.customer?.phone ?? ""),
      whatsapp: String(doc.customer?.whatsapp ?? ""),
      email: doc.customer?.email ? String(doc.customer.email) : undefined,
      address: String(doc.customer?.address ?? ""),
      city: String(doc.customer?.city ?? ""),
      notes: doc.customer?.notes ? String(doc.customer.notes) : undefined
    },
    items: Array.isArray(doc.items) ? doc.items : [],
    paymentMethod: doc.paymentMethod ?? "cod",
    status: doc.status ?? "new",
    subtotal: Number(doc.subtotal ?? 0),
    codCharge: Number(doc.codCharge ?? 0),
    total: Number(doc.total ?? 0),
    createdAt: iso(doc.createdAt),
    updatedAt: iso(doc.updatedAt)
  };
}
