import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, CalendarDays, GraduationCap, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getVisibleFields, getTenantContext } from "@/lib/queries/session";
import { getMyShortlists } from "@/lib/queries/shortlists";
import {
  fullName,
  initials,
  tenure,
  EDUCATION_LABELS,
  PROFICIENCY_LABELS,
  type PastProject,
} from "@/lib/types";
import { AddToShortlist } from "@/components/add-to-shortlist";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="gap-3 py-4 shadow-none">
      <CardHeader className="px-4">
        <CardTitle className="eyebrow">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-4">{children}</CardContent>
    </Card>
  );
}

export default async function EmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { tenantId } = await getTenantContext();
  let employeeQuery = supabase
    .from("employees")
    .select(
      `*,
      departments(name),
      locations(name, code, city, country),
      employee_skills(level, skills(name)),
      employee_certifications(issued_year, certifications(name)),
      employee_languages(proficiency, languages(name)),
      employee_hobbies(hobbies(name))`,
    )
    .eq("id", id);
  // Cross-tenant employee IDs resolve to null → notFound below.
  if (tenantId) employeeQuery = employeeQuery.eq("tenant_id", tenantId);
  const [{ data: e }, visible, shortlists] = await Promise.all([
    employeeQuery.single(),
    getVisibleFields(),
    getMyShortlists(),
  ]);

  if (!e) notFound();

  const projects = (e.past_projects ?? []) as PastProject[];
  const skills = (e.employee_skills ?? [])
    .map((s) => ({ name: s.skills?.name ?? "", level: s.level }))
    .filter((s) => s.name)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="mx-auto max-w-5xl space-y-4 p-6">
      <Link
        href="/directory"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Directory
      </Link>

      {/* Header card */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex flex-wrap items-start gap-5">
          <Avatar className="size-20 border-2 border-secondary">
            {e.photo_url && <AvatarImage src={e.photo_url} alt="" />}
            <AvatarFallback className="bg-secondary font-heading text-xl font-bold text-primary">
              {initials(e)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-2xl text-primary">{fullName(e)}</h1>
            <p className="mt-0.5 text-[15px] text-muted-foreground">{e.title}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {e.locations && (
                <>
                  <span className="code-chip">{e.locations.code}</span>
                  <span className="text-sm text-muted-foreground">
                    {e.locations.name} · {e.locations.city}, {e.locations.country}
                  </span>
                </>
              )}
              {e.departments && (
                <Badge variant="secondary">{e.departments.name}</Badge>
              )}
            </div>
          </div>
          <AddToShortlist employeeId={e.id} shortlists={shortlists} />
        </div>

        {/* Quick facts strip */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-4 text-sm sm:grid-cols-4">
          {visible.email && e.email && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="size-4 shrink-0 text-sky" />
              <a href={`mailto:${e.email}`} className="truncate hover:text-primary">
                {e.email}
              </a>
            </div>
          )}
          {visible.phone && (e.phone || e.internal_ext) && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="size-4 shrink-0 text-sky" />
              <span className="truncate">
                {e.phone}
                {visible.internal_ext && e.internal_ext ? ` · Ext ${e.internal_ext}` : ""}
              </span>
            </div>
          )}
          {visible.start_date && e.start_date && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="size-4 shrink-0 text-sky" />
              <span>
                Since {new Date(e.start_date).getFullYear()} · {tenure(e.start_date)}
              </span>
            </div>
          )}
          {visible.manager_name && e.manager_name && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <UserRound className="size-4 shrink-0 text-sky" />
              <span className="truncate">Reports to {e.manager_name}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {skills.length > 0 && (
          <Section title="Skills">
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <Badge key={s.name} variant="secondary" className="font-normal">
                  {s.name}
                  {s.level && (
                    <span className="ml-1 text-[10px] uppercase tracking-wide opacity-60">
                      {s.level}
                    </span>
                  )}
                </Badge>
              ))}
            </div>
          </Section>
        )}

        {(e.expertise_areas ?? []).length > 0 && (
          <Section title="Expertise areas">
            <div className="flex flex-wrap gap-1.5">
              {e.expertise_areas.map((x) => (
                <Badge key={x} variant="outline" className="font-normal">
                  {x}
                </Badge>
              ))}
            </div>
          </Section>
        )}

        {visible.education && (e.education_level || e.school) && (
          <Section title="Education">
            <div className="flex items-start gap-2.5 text-sm">
              <GraduationCap className="mt-0.5 size-4 shrink-0 text-sky" />
              <div>
                {e.education_level && (
                  <p className="font-medium">{EDUCATION_LABELS[e.education_level]}</p>
                )}
                {e.school && <p className="text-muted-foreground">{e.school}</p>}
                {e.graduate_info && (
                  <p className="text-muted-foreground">{e.graduate_info}</p>
                )}
              </div>
            </div>
          </Section>
        )}

        {visible.languages && (e.employee_languages ?? []).length > 0 && (
          <Section title="Languages">
            <ul className="space-y-1.5 text-sm">
              {e.employee_languages.map((l) => (
                <li key={l.languages?.name} className="flex justify-between">
                  <span>{l.languages?.name}</span>
                  <span className="text-muted-foreground">
                    {PROFICIENCY_LABELS[l.proficiency]}
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {visible.certifications && (e.employee_certifications ?? []).length > 0 && (
          <Section title="Certifications">
            <ul className="space-y-1.5 text-sm">
              {e.employee_certifications.map((c) => (
                <li key={c.certifications?.name} className="flex justify-between">
                  <span>{c.certifications?.name}</span>
                  {c.issued_year && (
                    <span className="text-muted-foreground tabular-nums">
                      {c.issued_year}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {visible.past_projects && projects.length > 0 && (
          <Section title="Past projects">
            <ul className="space-y-2 text-sm">
              {projects.map((p, i) => (
                <li key={i} className="flex justify-between gap-3">
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-muted-foreground">{p.role}</p>
                  </div>
                  <span className="text-muted-foreground tabular-nums">{p.year}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {(e.tools_technologies ?? []).length > 0 && (
          <Section title="Tools & technologies">
            <div className="flex flex-wrap gap-1.5">
              {e.tools_technologies.map((t) => (
                <Badge key={t} variant="outline" className="font-normal">
                  {t}
                </Badge>
              ))}
            </div>
          </Section>
        )}

        {visible.hobbies && (e.employee_hobbies ?? []).length > 0 && (
          <Section title="Hobbies">
            <div className="flex flex-wrap gap-1.5">
              {e.employee_hobbies.map((h) => (
                <Badge
                  key={h.hobbies?.name}
                  variant="secondary"
                  className="bg-secondary/60 font-normal"
                >
                  {h.hobbies?.name}
                </Badge>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}
