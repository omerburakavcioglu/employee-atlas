import { createClient } from "@/lib/supabase/server";
import { getTenantContext } from "@/lib/queries/session";
import { EDUCATION_LABELS, type EducationLevel } from "@/lib/types";
import { AnalyticsCharts } from "./analytics-charts";

export const metadata = { title: "Analytics" };

function tally(values: (string | null | undefined)[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const v of values) {
    if (!v) continue;
    counts[v] = (counts[v] ?? 0) + 1;
  }
  return counts;
}

function top(counts: Record<string, number>, n: number) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([name, count]) => ({ name, count }));
}

// Fields counted toward profile completeness.
const COMPLETENESS_FIELDS = 10;

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { tenantId } = await getTenantContext();
  let employeesQuery = supabase.from("employee_directory").select("*");
  let locationsQuery = supabase.from("location_employee_counts").select("*");
  if (tenantId) {
    employeesQuery = employeesQuery.eq("tenant_id", tenantId);
    locationsQuery = locationsQuery.eq("tenant_id", tenantId);
  }
  const [{ data: employees }, { data: locations }] = await Promise.all([
    employeesQuery,
    locationsQuery,
  ]);
  const rows = employees ?? [];
  const locs = locations ?? [];

  const departmentDist = top(tally(rows.map((r) => r.department_name)), 8);
  const educationDist = top(
    tally(
      rows.map((r) =>
        r.education_level
          ? EDUCATION_LABELS[r.education_level as EducationLevel]
          : null,
      ),
    ),
    5,
  );
  const topSkills = top(tally(rows.flatMap((r) => r.skill_names ?? [])), 8);
  const topCerts = top(
    tally(rows.flatMap((r) => r.certification_names ?? [])),
    8,
  );
  const languageDist = top(
    tally(rows.flatMap((r) => r.language_names ?? [])),
    8,
  );
  const topLocations = locs
    .filter((l) => (l.employee_count ?? 0) > 0)
    .sort((a, b) => (b.employee_count ?? 0) - (a.employee_count ?? 0))
    .slice(0, 8)
    .map((l) => ({ name: l.code ?? "", count: l.employee_count ?? 0 }));

  const completeness =
    rows.length === 0
      ? 0
      : Math.round(
          (rows.reduce((sum, r) => {
            let filled = 0;
            if (r.photo_url) filled++;
            if (r.email) filled++;
            if (r.phone) filled++;
            if (r.start_date) filled++;
            if (r.education_level) filled++;
            if ((r.skill_names ?? []).length > 0) filled++;
            if ((r.language_names ?? []).length > 0) filled++;
            if ((r.certification_names ?? []).length > 0) filled++;
            if ((r.expertise_areas ?? []).length > 0) filled++;
            if (((r.past_projects as unknown[]) ?? []).length > 0) filled++;
            return sum + filled / COMPLETENESS_FIELDS;
          }, 0) /
            rows.length) *
            100,
        );

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-6">
      <div>
        <div className="eyebrow">Workforce insight</div>
        <h1 className="mt-1 font-heading text-2xl text-primary">Analytics</h1>
      </div>
      <AnalyticsCharts
        kpis={{
          employees: rows.length,
          locations: locs.length,
          departments: departmentDist.length,
          completeness,
        }}
        departmentDist={departmentDist}
        educationDist={educationDist}
        topSkills={topSkills}
        topCerts={topCerts}
        languageDist={languageDist}
        topLocations={topLocations}
      />
    </div>
  );
}
