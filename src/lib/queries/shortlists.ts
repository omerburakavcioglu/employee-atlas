import { createClient } from "@/lib/supabase/server";
import { getSessionProfile, getTenantContext } from "@/lib/queries/session";

export async function getMyShortlists() {
  const { userId } = await getSessionProfile();
  const supabase = await createClient();
  const { data } = await supabase
    .from("shortlists")
    .select("id, name")
    .eq("created_by", userId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAllShortlists() {
  const supabase = await createClient();
  const { tenantId } = await getTenantContext();
  let query = supabase
    .from("shortlists")
    .select(
      "*, shortlist_employees(count), profiles:created_by(full_name)",
    );
  if (tenantId) query = query.eq("tenant_id", tenantId);
  const { data } = await query.order("created_at", { ascending: false });
  return (data ?? []).map((s) => ({
    ...s,
    member_count: s.shortlist_employees?.[0]?.count ?? 0,
    creator_name: s.profiles?.full_name ?? "Unknown",
  }));
}

export async function getShortlistDetail(id: string) {
  const supabase = await createClient();
  const { tenantId } = await getTenantContext();
  let query = supabase
    .from("shortlists")
    .select("*, profiles:created_by(full_name)")
    .eq("id", id);
  // Cross-tenant shortlist IDs resolve to null → the page 404s.
  if (tenantId) query = query.eq("tenant_id", tenantId);
  const { data: shortlist } = await query.single();
  if (!shortlist) return null;

  const { data: members } = await supabase
    .from("shortlist_employees")
    .select("employee_id, added_at")
    .eq("shortlist_id", id)
    .order("added_at");

  const ids = (members ?? []).map((m) => m.employee_id);
  const { data: employees } = ids.length
    ? await supabase
        .from("employee_directory")
        .select("*")
        .in("id", ids)
        .order("last_name")
    : { data: [] };

  return {
    ...shortlist,
    creator_name: shortlist.profiles?.full_name ?? "Unknown",
    employees: employees ?? [],
  };
}
