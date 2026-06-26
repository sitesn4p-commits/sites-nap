import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminPage } from "@/lib/auth";
import { collections, ensureIndexes, getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getStats() {
  await ensureIndexes();
  const db = await getDb();
  const [products, orders, newOrders, reviews, sliders] = await Promise.all([
    db.collection(collections.products).countDocuments(),
    db.collection(collections.orders).countDocuments(),
    db.collection(collections.orders).countDocuments({ status: "new" }),
    db.collection(collections.reviews).countDocuments(),
    db.collection(collections.sliders).countDocuments()
  ]);

  return { products, orders, newOrders, reviews, sliders };
}

export default async function AdminDashboardPage() {
  await requireAdminPage();
  const stats = await getStats();

  return (
    <AdminShell>
      <div className="admin-title-row">
        <div>
          <span className="eyebrow">Admin</span>
          <h1>Dashboard</h1>
          <p className="section-copy">Manage BuildPro.lk products, orders, sliders, and customer reviews.</p>
        </div>
      </div>
      <div className="stat-grid">
        <div className="stat">
          Products
          <strong>{stats.products}</strong>
        </div>
        <div className="stat">
          Orders
          <strong>{stats.orders}</strong>
        </div>
        <div className="stat">
          New Orders
          <strong>{stats.newOrders}</strong>
        </div>
        <div className="stat">
          Reviews
          <strong>{stats.reviews}</strong>
        </div>
      </div>
      <div className="panel" style={{ marginTop: 18 }}>
        <h2>Home Slider</h2>
        <p className="section-copy">
          Slider entries support separate desktop and mobile images, so the first screen can look sharp on every device.
          Current slider count: {stats.sliders}.
        </p>
      </div>
    </AdminShell>
  );
}
