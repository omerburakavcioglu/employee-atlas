import { requireAdminOrHr } from "@/lib/queries/session";
import { AdminNav } from "./admin-nav";

export const metadata = { title: "Admin" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminOrHr();

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-6">
      <div>
        <div className="eyebrow">Administration</div>
        <h1 className="mt-1 font-heading text-2xl text-primary">Admin panel</h1>
      </div>
      <AdminNav />
      {children}
    </div>
  );
}
