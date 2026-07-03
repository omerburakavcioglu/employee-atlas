import { createClient } from "@/lib/supabase/server";
import { getTenantContext } from "@/lib/queries/session";
import { TagsAdmin } from "./tags-admin";

export const metadata = { title: "Admin · Tags" };

export default async function AdminTagsPage() {
  const supabase = await createClient();
  const { tenantId } = await getTenantContext();
  const scoped = <T extends { eq: (col: string, v: string) => T }>(q: T) =>
    tenantId ? q.eq("tenant_id", tenantId) : q;
  const [skills, certifications, languages, hobbies] = await Promise.all([
    scoped(supabase.from("skills").select("id, name")).order("name"),
    scoped(supabase.from("certifications").select("id, name")).order("name"),
    scoped(supabase.from("languages").select("id, name")).order("name"),
    scoped(supabase.from("hobbies").select("id, name")).order("name"),
  ]);

  return (
    <TagsAdmin
      vocabularies={{
        skills: skills.data ?? [],
        certifications: certifications.data ?? [],
        languages: languages.data ?? [],
        hobbies: hobbies.data ?? [],
      }}
    />
  );
}
