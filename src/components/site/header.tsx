"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import { useState } from "react";

import { useCart } from "@/components/providers/cart-provider";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/privacy", label: "Privacy" }
];

export function Header() {
  const pathname = usePathname();
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <div className="container">
        <div className="header-inner">
          <Link className="brand" href="/" aria-label="BuildPro.lk home">
            <span>
              BuildPro<span className="lk">.lk</span>
            </span>
          </Link>

          <nav className="nav desktop-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <Link key={item.href} className={`nav-link ${pathname === item.href ? "active" : ""}`} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <Link className="icon-button hide-mobile" href="/products" aria-label="Search products" title="Search products">
              <Search size={19} />
            </Link>
            <Link className="icon-button" href="/cart" aria-label="Cart" title="Cart">
              <ShoppingCart size={19} />
              {count > 0 && <span className="cart-badge">{count}</span>}
            </Link>
            <button
              className="icon-button mobile-toggle"
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label="Toggle menu"
              title="Menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <nav className={`mobile-nav ${open ? "open" : ""}`} aria-label="Mobile navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              className={`nav-link ${pathname === item.href ? "active" : ""}`}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
