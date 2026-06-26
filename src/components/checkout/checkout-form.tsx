"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

import { useCart } from "@/components/providers/cart-provider";
import { COD_CHARGE } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import type { PaymentMethod } from "@/types";

export function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart();
  const [method, setMethod] = useState<PaymentMethod>("cod");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ orderNumber: string; total: number } | null>(null);
  const total = useMemo(() => subtotal + (method === "cod" ? COD_CHARGE : 0), [method, subtotal]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items,
        paymentMethod: method,
        customer: {
          fullName: form.get("fullName"),
          phone: form.get("phone"),
          whatsapp: form.get("whatsapp"),
          email: form.get("email"),
          address: form.get("address"),
          city: form.get("city"),
          notes: form.get("notes")
        }
      })
    });

    setLoading(false);
    if (!response.ok) {
      alert("Order could not be placed. Please check your cart and try again.");
      return;
    }

    const data = await response.json();
    setResult({ orderNumber: data.order.orderNumber, total: data.order.total });
    clearCart();
  }

  if (result) {
    return (
      <div className="empty-state">
        <h2>Order Placed</h2>
        <p className="section-copy">
          Your order number is <strong>{result.orderNumber}</strong>. BuildPro.lk will contact your WhatsApp number for
          confirmation.
        </p>
        <p className="price">{formatPrice(result.total)}</p>
        <Link className="btn primary" href="/products">
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="empty-state">
        <h2>Your cart is empty</h2>
        <p className="section-copy">Please add products before checkout.</p>
        <Link className="btn primary" href="/products">
          Shop Products
        </Link>
      </div>
    );
  }

  return (
    <form className="checkout-grid" onSubmit={submit}>
      <div className="panel">
        <h2>Customer Details</h2>
        <div className="form-grid">
          <label className="label">
            Full name
            <input className="field" name="fullName" required />
          </label>
          <label className="label">
            Phone number
            <input className="field" name="phone" required />
          </label>
          <label className="label">
            WhatsApp number
            <input className="field" name="whatsapp" placeholder="Required for order updates" required />
          </label>
          <label className="label">
            Email
            <input className="field" name="email" type="email" />
          </label>
          <label className="label">
            City
            <input className="field" name="city" required />
          </label>
          <label className="label span-2">
            Delivery address
            <textarea className="textarea" name="address" required />
          </label>
          <label className="label span-2">
            Notes
            <textarea className="textarea" name="notes" />
          </label>
        </div>
      </div>

      <aside className="panel">
        <h2>Payment</h2>
        <label className="label" style={{ marginBottom: 10 }}>
          Method
          <select className="select" value={method} onChange={(event) => setMethod(event.target.value as PaymentMethod)}>
            <option value="cod">Cash on Delivery</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </label>
        {method === "cod" ? (
          <div className="notice">Cash on Delivery includes an additional {formatPrice(COD_CHARGE)} service charge.</div>
        ) : (
          <div className="notice">
            Bank account details are not shown here. BuildPro.lk will send bank details to your WhatsApp after checking
            the order.
          </div>
        )}
        <div style={{ marginTop: 18 }}>
          <div className="summary-line">
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <div className="summary-line">
            <span>COD charge</span>
            <strong>{formatPrice(method === "cod" ? COD_CHARGE : 0)}</strong>
          </div>
          <div className="summary-line total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
        <button className="btn primary full" disabled={loading}>
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </aside>
    </form>
  );
}
