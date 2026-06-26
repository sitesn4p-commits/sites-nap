import { AdminOrders } from "@/components/admin/admin-orders";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminPage } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  await requireAdminPage();

  return (
    <AdminShell>
      <div className="admin-title-row">
        <div>
          <span className="eyebrow">Sales</span>
          <h1>Orders</h1>
          <p className="section-copy">Check COD and bank transfer orders. WhatsApp numbers are shown for follow-up.</p>
        </div>
      </div>
      <AdminOrders />
    </AdminShell>
  );
}
