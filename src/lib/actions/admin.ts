"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionProfile, getTenantContext } from "@/lib/queries/session";
import type { AppRole } from "@/lib/types";
import { VISIBILITY_FIELDS } from "@/lib/visibility";

type ActionResult = { error: string | null };

// Staff check with a concrete tenant context. Writes always require one:
// tenant_admin/hr act within their own tenant; super_admin may write only
// with an explicitly pinned tenant context (development-only cookie).
async function requireTenantStaff() {
  const session = await getSessionProfile();
  const { tenantId, isSuperAdmin } = await getTenantContext();
  const isStaff = session.role === "tenant_admin" || session.role === "hr";
  if (!isStaff && !isSuperAdmin) throw new Error("Not authorized");
  if (!tenantId) throw new Error("No tenant context");
  return { ...session, tenantId };
}

async function audit(action: string, entity: string, entityId: string, meta: Record<string, string | number> = {}) {
  const { userId, tenantId } = await getSessionProfile();
  const supabase = await createClient();
  await supabase.from("audit_logs").insert({
    actor_id: userId, tenant_id: tenantId, action, entity, entity_id: entityId, meta,
  });
}

function revalidateAll() {
  revalidatePath("/", "layout");
}

// ── Locations ────────────────────────────────────────────────
const locationSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  name: z.string().min(1),
  code: z.string().min(1).max(8).transform((s) => s.toUpperCase()),
  city: z.string().min(1),
  country: z.string().min(1),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  type: z.enum(["airport", "office", "hq", "campus", "datacenter"]),
});

export async function upsertLocation(formData: FormData): Promise<ActionResult> {
  const { tenantId } = await requireTenantStaff();
  const parsed = locationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Check the location fields — latitude/longitude must be valid coordinates." };
  const { id, ...values } = parsed.data;
  const supabase = await createClient();
  const { error } = id
    ? await supabase.from("locations").update(values).eq("id", id).eq("tenant_id", tenantId)
    : await supabase.from("locations").insert({ ...values, tenant_id: tenantId });
  if (error) return { error: error.code === "23505" ? "That location code is already in use." : "Could not save the location." };
  await audit(id ? "update" : "create", "location", id || values.code);
  revalidateAll();
  return { error: null };
}

export async function deleteLocation(id: string): Promise<ActionResult> {
  const { tenantId } = await requireTenantStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("locations").delete().eq("id", id).eq("tenant_id", tenantId);
  if (error) return { error: "Could not delete the location." };
  await audit("delete", "location", id);
  revalidateAll();
  return { error: null };
}

// ── Departments ──────────────────────────────────────────────
export async function upsertDepartment(formData: FormData): Promise<ActionResult> {
  const { tenantId } = await requireTenantStaff();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Enter a department name." };
  const supabase = await createClient();
  const { error } = id
    ? await supabase.from("departments").update({ name }).eq("id", id).eq("tenant_id", tenantId)
    : await supabase.from("departments").insert({ name, tenant_id: tenantId });
  if (error) return { error: "A department with that name already exists." };
  revalidateAll();
  return { error: null };
}

export async function deleteDepartment(id: string): Promise<ActionResult> {
  const { tenantId } = await requireTenantStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("departments").delete().eq("id", id).eq("tenant_id", tenantId);
  if (error) return { error: "Could not delete the department." };
  revalidateAll();
  return { error: null };
}

// ── Tag vocabularies ─────────────────────────────────────────
const VOCAB_TABLES = ["skills", "certifications", "languages", "hobbies"] as const;
export type VocabTable = (typeof VOCAB_TABLES)[number];

export async function addVocabItem(table: VocabTable, name: string): Promise<ActionResult> {
  const { tenantId } = await requireTenantStaff();
  if (!VOCAB_TABLES.includes(table)) return { error: "Unknown tag type." };
  const trimmed = name.trim();
  if (!trimmed) return { error: "Enter a name." };
  const supabase = await createClient();
  const { error } = await supabase.from(table).insert({ name: trimmed, tenant_id: tenantId });
  if (error) return { error: "That tag already exists." };
  revalidateAll();
  return { error: null };
}

export async function deleteVocabItem(table: VocabTable, id: string): Promise<ActionResult> {
  const { tenantId } = await requireTenantStaff();
  if (!VOCAB_TABLES.includes(table)) return { error: "Unknown tag type." };
  const supabase = await createClient();
  const { error } = await supabase.from(table).delete().eq("id", id).eq("tenant_id", tenantId);
  if (error) return { error: "Could not delete the tag." };
  revalidateAll();
  return { error: null };
}

// ── Employees ────────────────────────────────────────────────
const employeeSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  title: z.string().default(""),
  department_id: z.string().uuid().nullable().catch(null),
  location_id: z.string().uuid().nullable().catch(null),
  email: z.string().email().nullable().or(z.literal("").transform(() => null)),
  phone: z.string().transform((s) => s || null),
  internal_ext: z.string().transform((s) => s || null),
  manager_name: z.string().transform((s) => s || null),
  start_date: z.string().transform((s) => s || null),
  education_level: z
    .enum(["high_school", "associate", "bachelor", "master", "phd"])
    .nullable()
    .catch(null),
  school: z.string().transform((s) => s || null),
  graduate_info: z.string().transform((s) => s || null),
  photo_url: z.string().transform((s) => s || null),
});

function splitList(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// Ensure the named tags exist in the vocabulary, then relink the employee.
// Runs on the service-role client (bypasses RLS), so it must verify the
// employee belongs to the caller's tenant before touching anything.
async function syncEmployeeTags(employeeId: string, tenantId: string, formData: FormData) {
  const admin = createAdminClient();
  const { data: employee } = await admin
    .from("employees")
    .select("tenant_id")
    .eq("id", employeeId)
    .single();
  if (!employee || employee.tenant_id !== tenantId) {
    throw new Error("Employee does not belong to this tenant");
  }
  const specs = [
    { table: "skills", junction: "employee_skills", fk: "skill_id", field: "skills" },
    { table: "certifications", junction: "employee_certifications", fk: "certification_id", field: "certifications" },
    { table: "languages", junction: "employee_languages", fk: "language_id", field: "languages" },
    { table: "hobbies", junction: "employee_hobbies", fk: "hobby_id", field: "hobbies" },
  ] as const;

  for (const spec of specs) {
    const names = splitList(formData.get(spec.field));
    await admin.from(spec.junction).delete().eq("employee_id", employeeId);
    if (names.length === 0) continue;
    await admin
      .from(spec.table)
      .upsert(names.map((name) => ({ name, tenant_id: tenantId })), {
        onConflict: "tenant_id,name",
        ignoreDuplicates: true,
      });
    const { data: tagRows } = await admin
      .from(spec.table)
      .select("id, name")
      .eq("tenant_id", tenantId)
      .in("name", names);
    if (!tagRows?.length) continue;
    await admin.from(spec.junction).insert(
      tagRows.map((t) => ({ employee_id: employeeId, [spec.fk]: t.id })) as never,
    );
  }
}

export async function upsertEmployee(formData: FormData): Promise<ActionResult> {
  const { tenantId } = await requireTenantStaff();
  const parsed = employeeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Check the employee fields — first name, last name, and a valid email are required." };
  const { id, ...values } = parsed.data;
  const record = {
    ...values,
    expertise_areas: splitList(formData.get("expertise_areas")),
    tools_technologies: splitList(formData.get("tools_technologies")),
  };

  const supabase = await createClient();
  let employeeId = id || "";
  if (id) {
    const { error } = await supabase
      .from("employees")
      .update(record)
      .eq("id", id)
      .eq("tenant_id", tenantId);
    if (error) return { error: "Could not save the employee." };
  } else {
    const { data, error } = await supabase
      .from("employees")
      .insert({ ...record, tenant_id: tenantId })
      .select("id")
      .single();
    if (error || !data) return { error: "Could not create the employee." };
    employeeId = data.id;
  }

  await syncEmployeeTags(employeeId, tenantId, formData);
  await audit(id ? "update" : "create", "employee", employeeId);
  revalidateAll();
  return { error: null };
}

export async function deleteEmployee(id: string): Promise<ActionResult> {
  const { tenantId } = await requireTenantStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("employees").delete().eq("id", id).eq("tenant_id", tenantId);
  if (error) return { error: "Could not delete the employee." };
  await audit("delete", "employee", id);
  revalidateAll();
  return { error: null };
}

// ── Field visibility ─────────────────────────────────────────
export async function updateVisibility(formData: FormData): Promise<ActionResult> {
  const { tenantId } = await requireTenantStaff();
  const supabase = await createClient();
  const roles: AppRole[] = ["tenant_admin", "hr", "manager", "coordinator"];
  for (const { key } of VISIBILITY_FIELDS) {
    const visibleTo = roles.filter((r) => formData.get(`${key}:${r}`) === "on");
    const { error } = await supabase
      .from("field_visibility_settings")
      .upsert({ tenant_id: tenantId, field_key: key, visible_to_roles: visibleTo });
    if (error) return { error: "Could not save the visibility settings." };
  }
  await audit("update", "field_visibility_settings", "all");
  revalidateAll();
  return { error: null };
}
