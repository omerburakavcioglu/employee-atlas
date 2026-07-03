import { createClient } from "@/lib/supabase/server";
import { getTenantContext } from "@/lib/queries/session";
import { LocationsAdmin } from "./locations-admin";

export const metadata = { title: "Admin · Locations" };

export default async function AdminLocationsPage() {
  const supabase = await createClient();
  const { tenantId } = await getTenantContext();
  let query = supabase.from("location_employee_counts").select("*");
  if (tenantId) query = query.eq("tenant_id", tenantId);
  const { data: locations } = await query.order("name");
  return <LocationsAdmin locations={locations ?? []} />;
}
