import { createClient } from "@/lib/supabase/server";
import { getTenantContext } from "@/lib/queries/session";
import type { DirectoryEmployee } from "@/lib/types";

export type DirectoryFilters = {
  q?: string;
  location?: string;
  country?: string;
  department?: string;
  skill?: string;
  language?: string;
  hobby?: string;
  certification?: string;
  education?: string;
  minYears?: number;
};

// MVP scale is ~50 employees: apply structured filters in SQL and do
// free-text matching over the joined view rows in memory.
export async function searchDirectory(
  filters: DirectoryFilters,
): Promise<DirectoryEmployee[]> {
  const supabase = await createClient();
  const { tenantId } = await getTenantContext();
  let query = supabase.from("employee_directory").select("*");
  // RLS already isolates tenants; scope explicitly as defense in depth.
  if (tenantId) query = query.eq("tenant_id", tenantId);

  if (filters.location) query = query.eq("location_id", filters.location);
  if (filters.country) query = query.eq("location_country", filters.country);
  if (filters.department)
    query = query.eq("department_id", filters.department);
  if (filters.education)
    query = query.eq(
      "education_level",
      filters.education as NonNullable<DirectoryEmployee["education_level"]>,
    );
  if (filters.skill) query = query.contains("skill_names", [filters.skill]);
  if (filters.language)
    query = query.contains("language_names", [filters.language]);
  if (filters.hobby) query = query.contains("hobby_names", [filters.hobby]);
  if (filters.certification)
    query = query.contains("certification_names", [filters.certification]);

  const { data } = await query.order("last_name");
  let rows = data ?? [];

  if (filters.minYears) {
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - filters.minYears);
    rows = rows.filter(
      (r) => r.start_date && new Date(r.start_date) <= cutoff,
    );
  }

  const q = filters.q?.trim().toLowerCase();
  if (q) {
    rows = rows.filter((r) => {
      const haystack = [
        r.first_name,
        r.last_name,
        r.title,
        r.department_name,
        r.location_name,
        r.location_city,
        r.location_country,
        r.school,
        r.manager_name,
        ...(r.skill_names ?? []),
        ...(r.certification_names ?? []),
        ...(r.language_names ?? []),
        ...(r.hobby_names ?? []),
        ...(r.expertise_areas ?? []),
        ...(r.tools_technologies ?? []),
        ...((r.past_projects as { name?: string }[] | null)?.map((p) => p.name) ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return q.split(/\s+/).every((term) => haystack.includes(term));
    });
  }

  return rows;
}

export async function getFilterOptions() {
  const supabase = await createClient();
  const { tenantId } = await getTenantContext();
  // Filter vocabularies are tenant-specific; scope on top of RLS.
  const scoped = <T extends { eq: (col: string, v: string) => T }>(q: T) =>
    tenantId ? q.eq("tenant_id", tenantId) : q;
  const [locations, departments, skills, languages, hobbies, certifications] =
    await Promise.all([
      scoped(supabase.from("locations").select("id, name, code, country")).order("name"),
      scoped(supabase.from("departments").select("id, name")).order("name"),
      scoped(supabase.from("skills").select("name")).order("name"),
      scoped(supabase.from("languages").select("name")).order("name"),
      scoped(supabase.from("hobbies").select("name")).order("name"),
      scoped(supabase.from("certifications").select("name")).order("name"),
    ]);
  const countries = [
    ...new Set((locations.data ?? []).map((l) => l.country)),
  ].sort();
  return {
    locations: locations.data ?? [],
    departments: departments.data ?? [],
    skills: (skills.data ?? []).map((s) => s.name),
    languages: (languages.data ?? []).map((s) => s.name),
    hobbies: (hobbies.data ?? []).map((s) => s.name),
    certifications: (certifications.data ?? []).map((s) => s.name),
    countries,
  };
}

export type FilterOptions = Awaited<ReturnType<typeof getFilterOptions>>;
