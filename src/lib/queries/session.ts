import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { computeVisibleFields, type VisibleFields } from "@/lib/visibility";
import type { AppRole, Profile, Tenant } from "@/lib/types";

export type SessionProfile = {
  userId: string;
  email: string;
  profile: Profile;
  role: AppRole;
  /** Tenant of the logged-in user; null only for super_admin. */
  tenantId: string | null;
};

// Cached per-request: layout and pages can both call this cheaply.
export const getSessionProfile = cache(async (): Promise<SessionProfile> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();
  if (!profile) redirect("/login");

  return {
    userId: user.id,
    email: user.email ?? "",
    profile,
    role: profile.role,
    tenantId: profile.tenant_id,
  };
});

export type TenantContext = {
  /** Tenant every read/write must be scoped to; null only for super_admin
   * without a pinned tenant (reads may then span tenants, writes are denied). */
  tenantId: string | null;
  isSuperAdmin: boolean;
};

// DEVELOPMENT ONLY: cookie a super_admin can set by hand (browser devtools)
// to pin a tenant context. There is deliberately no UI for this; a real
// tenant switcher is a later phase. Ignored outside development and for
// every non-super_admin role.
const DEV_TENANT_COOKIE = "ea-dev-tenant";

export const getTenantContext = cache(async (): Promise<TenantContext> => {
  const session = await getSessionProfile();
  if (session.role !== "super_admin") {
    // Normal users can never switch tenants: context comes from the profile
    // row alone, which only super_admin can reassign (enforced by trigger).
    return { tenantId: session.tenantId, isSuperAdmin: false };
  }
  let tenantId: string | null = null;
  if (process.env.NODE_ENV === "development") {
    const store = await cookies();
    tenantId = store.get(DEV_TENANT_COOKIE)?.value ?? null;
  }
  return { tenantId, isSuperAdmin: true };
});

// The active tenant row (branding + theme). Null for super_admin without a
// pinned tenant context.
export const getCurrentTenant = cache(async (): Promise<Tenant | null> => {
  const { tenantId } = await getTenantContext();
  if (!tenantId) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("tenants")
    .select("*")
    .eq("id", tenantId)
    .single();
  return data;
});

export const getVisibleFields = cache(async (): Promise<VisibleFields> => {
  const { role } = await getSessionProfile();
  const supabase = await createClient();
  const { data } = await supabase
    .from("field_visibility_settings")
    .select("field_key, visible_to_roles");
  return computeVisibleFields(data ?? [], role);
});

const STAFF_ROLES: AppRole[] = ["super_admin", "tenant_admin", "hr"];

export async function requireAdminOrHr(): Promise<SessionProfile> {
  const session = await getSessionProfile();
  if (!STAFF_ROLES.includes(session.role)) redirect("/");
  return session;
}
