"use client";

import { useEffect, useState } from "react";

import { ORDER_STATUSES } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import type { Order, OrderStatus } from "@/types";

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  async function loadOrders() {
    const response = await fetch("/api/admin/orders", { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      setOrders(data.orders);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(order: Order, status: OrderStatus) {
    const response = await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (response.ok) {
      await loadOrders();
    }
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Payment</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <strong>{order.orderNumber}</strong>
                <p className="section-copy" style={{ margin: 0 }}>
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </td>
              <td>
                <strong>{order.customer.fullName}</strong>
                <p className="section-copy" style={{ margin: 0 }}>
                  {order.customer.phone}
                  <br />
                  <a href={`https://wa.me/${order.customer.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                    WhatsApp: {order.customer.whatsapp}
                  </a>
                  <br />
                  {order.customer.address}, {order.customer.city}
                </p>
              </td>
              <td>
                {order.items.map((item) => (
                  <div key={`${order.id}-${item.productId}`}>
                    {item.quantity} x {item.title}
                  </div>
                ))}
              </td>
              <td>
                {order.paymentMethod === "cod" ? "COD" : "Bank Transfer"}
                <br />
                <span className="section-copy">COD charge: {formatPrice(order.codCharge)}</span>
              </td>
              <td>{formatPrice(order.total)}</td>
              <td>
                <select className="select" value={order.status} onChange={(event) => updateStatus(order, event.target.value as OrderStatus)}>
                  {ORDER_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
