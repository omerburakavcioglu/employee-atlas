import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTenantContext, getCurrentTenant } from "@/lib/queries/session";
import { MapDashboard } from "@/components/map/map-dashboard";

export const metadata = { title: "Map" };

export default async function MapPage() {
  // Grup 43 is a bootcamp documentation workspace with no map data — send it
  // straight to its sprint panel. Other tenants keep the map as their home.
  const currentTenant = await getCurrentTenant();
  if (currentTenant?.slug === "grup-43") redirect("/sprints");

  const supabase = await createClient();
  const { tenantId } = await getTenantContext();
  let query = supabase.from("location_employee_counts").select("*");
  if (tenantId) query = query.eq("tenant_id", tenantId);
  const { data: locations } = await query.order("employee_count", {
    ascending: false,
  });

  return <MapDashboard locations={locations ?? []} />;
}
