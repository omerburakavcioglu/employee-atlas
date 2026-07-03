import type { Tenant } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Tenant identity mark for the app shell. Uses the tenant's logo when one is
 * configured (e.g. TAV); otherwise renders a text-based monogram in tenant
 * colors — no official third-party logos unless assets are provided.
 */
export function TenantLogo({
  tenant,
  withName = true,
  className,
}: {
  tenant: Tenant | null;
  withName?: boolean;
  className?: string;
}) {
  if (!tenant) {
    return (
      <span className={cn("eyebrow", className)}>All tenants</span>
    );
  }

  return (
    <span className={cn("flex min-w-0 items-center gap-2", className)}>
      {tenant.logo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={tenant.logo_url} alt={tenant.name} className="h-6 w-auto" />
      ) : (
        <span
          aria-hidden
          className="grid size-6 shrink-0 place-items-center rounded-md bg-primary font-heading text-[12px] font-bold text-primary-foreground"
        >
          {tenant.name[0]?.toUpperCase()}
        </span>
      )}
      {withName && (
        <span className="truncate font-heading text-[13px] font-bold tracking-tight text-primary">
          {tenant.name}
        </span>
      )}
    </span>
  );
}
