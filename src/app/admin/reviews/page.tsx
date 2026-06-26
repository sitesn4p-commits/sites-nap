import { AdminReviews } from "@/components/admin/admin-reviews";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminPage } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  await requireAdminPage();

  return (
    <AdminShell>
      <div className="admin-title-row">
        <div>
          <span className="eyebrow">Customers</span>
          <h1>Reviews</h1>
          <p className="section-copy">Approve, hide, reply to, or delete customer reviews.</p>
        </div>
      </div>
      <AdminReviews />
    </AdminShell>
  );
}
