"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile, getTenantContext } from "@/lib/queries/session";

async function audit(action: string, entity: string, entityId: string, meta: Record<string, string | number> = {}) {
  const { userId, tenantId } = await getSessionProfile();
  const supabase = await createClient();
  await supabase.from("audit_logs").insert({
    actor_id: userId,
    tenant_id: tenantId,
    action,
    entity,
    entity_id: entityId,
    meta,
  });
}

export async function createShortlist(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const employeeId = String(formData.get("employeeId") ?? "") || null;
  if (!name) return { error: "Give the shortlist a name." };

  const { userId } = await getSessionProfile();
  const { tenantId } = await getTenantContext();
  if (!tenantId) return { error: "Shortlists require a tenant context." };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("shortlists")
    .insert({ name, description, created_by: userId, tenant_id: tenantId })
    .select("id")
    .single();
  if (error || !data) return { error: "Could not create the shortlist." };

  if (employeeId) {
    await supabase
      .from("shortlist_employees")
      .insert({ shortlist_id: data.id, employee_id: employeeId, tenant_id: tenantId });
  }
  await audit("create", "shortlist", data.id, { name });
  revalidatePath("/shortlists");
  revalidatePath("/directory");
  return { error: null, id: data.id };
}

export async function renameShortlist(formData: FormData) {
  const id = String(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  if (!name) return { error: "Give the shortlist a name." };
  const { tenantId } = await getTenantContext();
  const supabase = await createClient();
  let query = supabase
    .from("shortlists")
    .update({ name, description })
    .eq("id", id);
  if (tenantId) query = query.eq("tenant_id", tenantId);
  const { error } = await query;
  if (error) return { error: "Could not update the shortlist." };
  revalidatePath("/shortlists");
  revalidatePath(`/shortlists/${id}`);
  return { error: null };
}

export async function deleteShortlist(id: string) {
  const { tenantId } = await getTenantContext();
  const supabase = await createClient();
  let query = supabase.from("shortlists").delete().eq("id", id);
  if (tenantId) query = query.eq("tenant_id", tenantId);
  await query;
  await audit("delete", "shortlist", id);
  revalidatePath("/shortlists");
  redirect("/shortlists");
}

export async function addToShortlist(shortlistId: string, employeeId: string) {
  const { tenantId } = await getTenantContext();
  if (!tenantId) return { error: "Shortlists require a tenant context." };
  const supabase = await createClient();
  // tenant_id comes from the session; a cross-tenant employee or shortlist id
  // fails the composite FKs (and RLS) rather than linking across tenants.
  const { error } = await supabase
    .from("shortlist_employees")
    .upsert({ shortlist_id: shortlistId, employee_id: employeeId, tenant_id: tenantId });
  if (error) return { error: "Could not add to the shortlist." };
  revalidatePath(`/shortlists/${shortlistId}`);
  revalidatePath("/shortlists");
  return { error: null };
}

export async function removeFromShortlist(
  shortlistId: string,
  employeeId: string,
) {
  const { tenantId } = await getTenantContext();
  const supabase = await createClient();
  let query = supabase
    .from("shortlist_employees")
    .delete()
    .eq("shortlist_id", shortlistId)
    .eq("employee_id", employeeId);
  if (tenantId) query = query.eq("tenant_id", tenantId);
  await query;
  revalidatePath(`/shortlists/${shortlistId}`);
  revalidatePath("/shortlists");
  return { error: null };
}
