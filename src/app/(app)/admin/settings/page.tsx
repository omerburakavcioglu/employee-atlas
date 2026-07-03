import { createClient } from "@/lib/supabase/server";
import { getTenantContext } from "@/lib/queries/session";
import { VisibilityMatrix } from "./visibility-matrix";

export const metadata = { title: "Admin · Visibility" };

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { tenantId } = await getTenantContext();
  let query = supabase
    .from("field_visibility_settings")
    .select("field_key, visible_to_roles");
  if (tenantId) query = query.eq("tenant_id", tenantId);
  const { data: settings } = await query;

  return (
    <div className="max-w-2xl space-y-3">
      <p className="text-sm text-muted-foreground">
        Choose which profile fields each role can see. Hidden fields disappear
        from employee profiles for that role. Names, titles, departments,
        locations, and skills are always visible.
      </p>
      <VisibilityMatrix settings={settings ?? []} />
    </div>
  );
}
