"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile, getTenantContext } from "@/lib/queries/session";
import type { ImportRow } from "@/lib/import-schema";

function splitList(s: string | undefined): string[] {
  return (s ?? "")
    .split(/[;,]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

export type ImportResult = {
  error: string | null;
  inserted: number;
};

// Bulk import runs on the service-role client (bypasses RLS), so it must
// enforce the role check AND scope every read/write to the caller's tenant.
export async function importEmployees(rows: ImportRow[]): Promise<ImportResult> {
  const session = await getSessionProfile();
  const { tenantId, isSuperAdmin } = await getTenantContext();
  if (session.role !== "tenant_admin" && session.role !== "hr" && !isSuperAdmin) {
    return { error: "Only admins and HR can import employees.", inserted: 0 };
  }
  // Writes always require an explicit tenant context, super_admin included.
  if (!tenantId) return { error: "No tenant context for this user.", inserted: 0 };
  if (rows.length === 0) return { error: "No valid rows to import.", inserted: 0 };
  if (rows.length > 2000) return { error: "Import at most 2000 rows at a time.", inserted: 0 };

  const admin = createAdminClient();

  const [{ data: locations }, { data: departments }] = await Promise.all([
    admin.from("locations").select("id, code").eq("tenant_id", tenantId),
    admin.from("departments").select("id, name").eq("tenant_id", tenantId),
  ]);
  const locByCode = new Map((locations ?? []).map((l) => [l.code.toUpperCase(), l.id]));
  const deptByName = new Map((departments ?? []).map((d) => [d.name.toLowerCase(), d.id]));

  // Create departments referenced in the file but missing from the vocabulary.
  const newDepts = [
    ...new Set(
      rows
        .map((r) => r.department.trim())
        .filter((d) => d && !deptByName.has(d.toLowerCase())),
    ),
  ];
  if (newDepts.length) {
    const { data: created } = await admin
      .from("departments")
      .insert(newDepts.map((name) => ({ name, tenant_id: tenantId })))
      .select("id, name");
    for (const d of created ?? []) deptByName.set(d.name.toLowerCase(), d.id);
  }

  const { data: inserted, error } = await admin
    .from("employees")
    .insert(
      rows.map((r) => ({
        tenant_id: tenantId,
        first_name: r.first_name,
        last_name: r.last_name,
        title: r.title,
        department_id: deptByName.get(r.department.trim().toLowerCase()) ?? null,
        location_id: locByCode.get(r.location_code.trim().toUpperCase()) ?? null,
        email: r.email || null,
        phone: r.phone || null,
        internal_ext: r.internal_ext || null,
        manager_name: r.manager_name || null,
        start_date: r.start_date || null,
        education_level: r.education_level || null,
        school: r.school || null,
        graduate_info: r.graduate_info || null,
        expertise_areas: splitList(r.expertise_areas),
        tools_technologies: splitList(r.tools_technologies),
      })),
    )
    .select("id");
  if (error || !inserted) return { error: "Import failed while writing employees.", inserted: 0 };

  // Tag vocabularies + junctions
  const specs = [
    { table: "skills", junction: "employee_skills", fk: "skill_id", field: "skills" },
    { table: "certifications", junction: "employee_certifications", fk: "certification_id", field: "certifications" },
    { table: "languages", junction: "employee_languages", fk: "language_id", field: "languages" },
    { table: "hobbies", junction: "employee_hobbies", fk: "hobby_id", field: "hobbies" },
  ] as const;

  for (const spec of specs) {
    const allNames = [...new Set(rows.flatMap((r) => splitList(r[spec.field])))];
    if (allNames.length === 0) continue;
    await admin
      .from(spec.table)
      .upsert(allNames.map((name) => ({ name, tenant_id: tenantId })), {
        onConflict: "tenant_id,name",
        ignoreDuplicates: true,
      });
    const { data: tagRows } = await admin
      .from(spec.table)
      .select("id, name")
      .eq("tenant_id", tenantId)
      .in("name", allNames);
    const idByName = new Map((tagRows ?? []).map((t) => [t.name, t.id]));
    const links = rows.flatMap((r, i) =>
      splitList(r[spec.field])
        .map((name) => idByName.get(name))
        .filter(Boolean)
        .map((tagId) => ({ employee_id: inserted[i].id, [spec.fk]: tagId })),
    );
    if (links.length) await admin.from(spec.junction).upsert(links as never);
  }

  const supabase = await createClient();
  await supabase.from("audit_logs").insert({
    actor_id: session.userId,
    tenant_id: tenantId,
    action: "import",
    entity: "employees",
    entity_id: null,
    meta: { count: inserted.length },
  });

  revalidatePath("/", "layout");
  return { error: null, inserted: inserted.length };
}
