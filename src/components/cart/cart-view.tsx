"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import { useCart } from "@/components/providers/cart-provider";
import { firstImage, formatPrice } from "@/lib/format";

export function CartView() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  if (!items.length) {
    return (
      <div className="empty-state">
        <h2>Your cart is empty</h2>
        <p className="section-copy">Add products to your cart before checkout.</p>
        <Link className="btn primary" href="/products">
          Shop Products
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-grid">
      <div className="cart-list">
        {items.map((item) => (
          <div className="cart-row" key={item.productId}>
            <img src={firstImage(item.image ? [item.image] : [])} alt={item.title} />
            <div>
              <h3 style={{ margin: "0 0 6px" }}>{item.title}</h3>
              <p className="section-copy" style={{ margin: 0 }}>
                {item.brand} / {formatPrice(item.price)}
              </p>
            </div>
            <div className="button-row">
              <div className="qty">
                <button type="button" onClick={() => updateQuantity(item.productId, item.quantity - 1)} aria-label="Reduce">
                  <Minus size={15} />
                </button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => updateQuantity(item.productId, item.quantity + 1)} aria-label="Increase">
                  <Plus size={15} />
                </button>
              </div>
              <button className="icon-button dark" type="button" onClick={() => removeItem(item.productId)} aria-label="Remove">
                <Trash2 size={17} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <aside className="panel">
        <h2>Cart Summary</h2>
        <div className="summary-line">
          <span>Subtotal</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>
        <div className="summary-line total">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <Link className="btn primary full" href="/checkout">
          Checkout
        </Link>
      </aside>
    </div>
  );
}
