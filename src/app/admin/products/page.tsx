import { AdminProducts } from "@/components/admin/admin-products";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminPage } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requireAdminPage();

  return (
    <AdminShell>
      <div className="admin-title-row">
        <div>
          <span className="eyebrow">Catalog</span>
          <h1>Products</h1>
          <p className="section-copy">Add, edit, hide, feature, and upload images for products.</p>
        </div>
      </div>
      <AdminProducts />
    </AdminShell>
  );
}
