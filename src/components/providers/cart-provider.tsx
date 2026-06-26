"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { CartItem, Product } from "@/types";

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addProduct: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "buildpro-cart";

function clampQuantity(quantity: number, stock: number) {
  const max = Math.max(1, stock || 1);
  return Math.min(Math.max(1, quantity), max);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      setItems([]);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (ready) {
      window.localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }, [items, ready]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      items,
      count,
      subtotal,
      addProduct(product, quantity = 1) {
        setItems((current) => {
          const existing = current.find((item) => item.productId === product.id);
          if (existing) {
            return current.map((item) =>
              item.productId === product.id
                ? {
                    ...item,
                    quantity: clampQuantity(item.quantity + quantity, product.stock),
                    price: product.price,
                    stock: product.stock
                  }
                : item
            );
          }

          return [
            ...current,
            {
              productId: product.id,
              slug: product.slug,
              title: product.title,
              price: product.price,
              image: product.images[0],
              brand: product.brand,
              stock: product.stock,
              quantity: clampQuantity(quantity, product.stock)
            }
          ];
        });
      },
      updateQuantity(productId, quantity) {
        setItems((current) =>
          current.map((item) =>
            item.productId === productId ? { ...item, quantity: clampQuantity(quantity, item.stock) } : item
          )
        );
      },
      removeItem(productId) {
        setItems((current) => current.filter((item) => item.productId !== productId));
      },
      clearCart() {
        setItems([]);
      }
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }

  return context;
}
