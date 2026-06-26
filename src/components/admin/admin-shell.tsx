"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Boxes, Home, Image, LogOut, MessageSquare, Package, ShoppingBag } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/sliders", label: "Sliders", icon: Image },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="brand" href="/admin">
          <span>
            BuildPro<span className="lk">.lk</span>
          </span>
        </Link>
        <nav className="admin-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link className={active ? "active" : ""} href={item.href} key={item.href}>
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
          <Link href="/" target="_blank">
            <Boxes size={18} />
            View Site
          </Link>
          <button type="button" onClick={logout}>
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
