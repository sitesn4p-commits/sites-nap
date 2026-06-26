import { AdminShell } from "@/components/admin/admin-shell";
import { AdminSliders } from "@/components/admin/admin-sliders";
import { requireAdminPage } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminSlidersPage() {
  await requireAdminPage();

  return (
    <AdminShell>
      <div className="admin-title-row">
        <div>
          <span className="eyebrow">Home page</span>
          <h1>Sliders</h1>
          <p className="section-copy">Upload separate desktop and mobile images for the home page slider.</p>
        </div>
      </div>
      <AdminSliders />
    </AdminShell>
  );
}
