import { createClient } from "@/lib/supabase/server";
import { getTenantContext } from "@/lib/queries/session";
import { MapDashboard } from "@/components/map/map-dashboard";

export const metadata = { title: "Map" };

export default async function MapPage() {
  const supabase = await createClient();
  const { tenantId } = await getTenantContext();
  let query = supabase.from("location_employee_counts").select("*");
  if (tenantId) query = query.eq("tenant_id", tenantId);
  const { data: locations } = await query.order("employee_count", {
    ascending: false,
  });

  return <MapDashboard locations={locations ?? []} />;
}
