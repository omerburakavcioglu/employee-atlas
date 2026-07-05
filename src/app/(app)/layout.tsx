import { getSessionProfile, getCurrentTenant } from "@/lib/queries/session";
import { AppSidebar } from "@/components/shell/app-sidebar";
import { AppHeader } from "@/components/shell/app-header";
import { TenantThemeProvider } from "@/components/tenant/TenantThemeProvider";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, tenant] = await Promise.all([
    getSessionProfile(),
    getCurrentTenant(),
  ]);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <TenantThemeProvider tenant={tenant} />
      <AppSidebar
        role={session.role}
        tenantName={tenant?.name ?? "All tenants"}
        tenantSlug={tenant?.slug ?? null}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader
          fullName={session.profile.full_name}
          email={session.email}
          role={session.role}
          tenant={tenant}
        />
        <main className="min-h-0 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
