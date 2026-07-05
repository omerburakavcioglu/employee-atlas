import { notFound } from "next/navigation";
import { getCurrentTenant } from "@/lib/queries/session";

// Tenant guard: the sprint panel belongs to the Grup 43 bootcamp workspace
// only. Any other tenant (TAV, Turkcell) — or a super_admin without the
// grup-43 context — gets a 404. Anonymous users are already redirected to
// /login by the auth middleware before reaching this layout.
export default async function SprintsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tenant = await getCurrentTenant();
  if (tenant?.slug !== "grup-43") notFound();

  return <div className="mx-auto max-w-[1600px] space-y-4 p-6">{children}</div>;
}
