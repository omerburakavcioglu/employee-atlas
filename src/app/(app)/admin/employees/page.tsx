import { createClient } from "@/lib/supabase/server";
import { getTenantContext } from "@/lib/queries/session";
import { getFilterOptions } from "@/lib/queries/directory";
import { EmployeesAdmin } from "./employees-admin";

export const metadata = { title: "Admin · Employees" };

export default async function AdminEmployeesPage() {
  const supabase = await createClient();
  const { tenantId } = await getTenantContext();
  let query = supabase.from("employee_directory").select("*");
  if (tenantId) query = query.eq("tenant_id", tenantId);
  const [{ data: employees }, options] = await Promise.all([
    query.order("last_name"),
    getFilterOptions(),
  ]);

  return (
    <EmployeesAdmin
      employees={employees ?? []}
      locations={options.locations}
      departments={options.departments}
    />
  );
}
