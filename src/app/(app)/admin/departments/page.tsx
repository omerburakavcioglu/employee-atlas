import { createClient } from "@/lib/supabase/server";
import { getTenantContext } from "@/lib/queries/session";
import { DepartmentsAdmin } from "./departments-admin";

export const metadata = { title: "Admin · Departments" };

export default async function AdminDepartmentsPage() {
  const supabase = await createClient();
  const { tenantId } = await getTenantContext();
  let query = supabase
    .from("departments")
    .select("id, name, employees(count)");
  if (tenantId) query = query.eq("tenant_id", tenantId);
  const { data } = await query.order("name");
  const departments = (data ?? []).map((d) => ({
    id: d.id,
    name: d.name,
    employee_count: d.employees?.[0]?.count ?? 0,
  }));
  return <DepartmentsAdmin departments={departments} />;
}
