import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

import { badRequest } from "@/lib/api";
import { COD_CHARGE } from "@/lib/constants";
import { collections, ensureIndexes, getDb, objectIdFrom } from "@/lib/db";
import { mapOrder } from "@/lib/mappers";
import { normalizeText } from "@/lib/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RequestedItem = {
  productId?: string;
  quantity?: number;
};

function orderNumber() {
  return `BP-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 999)
    .toString()
    .padStart(3, "0")}`;
}

export async function POST(request: Request) {
  await ensureIndexes();
  const body = await request.json().catch(() => ({}));
  const customer = {
    fullName: normalizeText(body.customer?.fullName),
    phone: normalizeText(body.customer?.phone),
    whatsapp: normalizeText(body.customer?.whatsapp),
    email: normalizeText(body.customer?.email),
    address: normalizeText(body.customer?.address),
    city: normalizeText(body.customer?.city),
    notes: normalizeText(body.customer?.notes)
  };

  if (!customer.fullName || !customer.phone || !customer.whatsapp || !customer.address || !customer.city) {
    return badRequest("Customer name, phone, WhatsApp, address, and city are required.");
  }

  const requestedItems: RequestedItem[] = Array.isArray(body.items) ? body.items : [];
  const ids = requestedItems.map((item) => objectIdFrom(String(item.productId))).filter(Boolean) as ObjectId[];
  if (!ids.length) {
    return badRequest("Cart is empty.");
  }

  const db = await getDb();
  const products = await db.collection(collections.products).find({ _id: { $in: ids }, active: true }).toArray();
  const productMap = new Map(products.map((product) => [String(product._id), product]));
  const items = requestedItems
    .map((item) => {
      const product = productMap.get(String(item.productId));
      if (!product || Number(product.stock ?? 0) <= 0) return null;
      const quantity = Math.min(Math.max(1, Math.round(Number(item.quantity) || 1)), Number(product.stock));
      return {
        productId: String(product._id),
        slug: String(product.slug),
        title: String(product.title),
        price: Number(product.price),
        quantity,
        image: Array.isArray(product.images) ? product.images[0] : undefined
      };
    })
    .filter(Boolean);

  if (!items.length) {
    return badRequest("No available products in cart.");
  }

  const paymentMethod = body.paymentMethod === "bank_transfer" ? "bank_transfer" : "cod";
  const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  const codCharge = paymentMethod === "cod" ? COD_CHARGE : 0;
  const order = {
    orderNumber: orderNumber(),
    customer,
    items,
    paymentMethod,
    status: "new",
    subtotal,
    codCharge,
    total: subtotal + codCharge,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await db.collection(collections.orders).insertOne(order);
  await Promise.all(
    items.map((item: any) =>
      db.collection(collections.products).updateOne({ _id: new ObjectId(item.productId) }, { $inc: { stock: -item.quantity } })
    )
  );

  const saved = await db.collection(collections.orders).findOne({ _id: result.insertedId });
  return NextResponse.json({ order: mapOrder(saved) }, { status: 201 });
}
