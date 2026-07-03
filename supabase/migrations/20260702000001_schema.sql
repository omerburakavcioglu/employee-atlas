-- Employee Atlas — core schema (multi-tenant)
-- Every tenant-owned row carries tenant_id. App users (profiles) belong to a
-- tenant, except super_admin (platform-level, development only).
-- Employees are records only; they do not log in.

create type public.app_role as enum ('super_admin', 'tenant_admin', 'hr', 'manager', 'coordinator');
create type public.education_level as enum ('high_school', 'associate', 'bachelor', 'master', 'phd');
create type public.language_proficiency as enum ('basic', 'conversational', 'professional', 'native');
create type public.location_type as enum ('airport', 'office', 'hq', 'campus', 'datacenter');
create type public.skill_level as enum ('beginner', 'intermediate', 'advanced', 'expert');

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── Tenants ────────────────────────────────────────────────
create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  industry text not null default '',
  display_name text not null,
  logo_url text,
  primary_color text not null default '#031f73',
  secondary_color text not null default '#307fe2',
  accent_color text not null default '#faa634',
  background_color text not null default '#f7f9fc',
  text_color text not null default '#1a2233',
  theme_config jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger tenants_updated_at before update on public.tenants
  for each row execute function public.set_updated_at();

-- ── App users ──────────────────────────────────────────────
create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  tenant_id uuid references public.tenants(id) on delete cascade,
  full_name text not null default '',
  role public.app_role not null default 'coordinator',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- only platform super admins may exist without a tenant
  constraint profiles_tenant_required check (role = 'super_admin' or tenant_id is not null)
);
create index profiles_tenant_idx on public.profiles (tenant_id);
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup; role/tenant come from raw_app_meta_data
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, tenant_id, full_name, role)
  values (
    new.id,
    (new.raw_app_meta_data ->> 'tenant_id')::uuid,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_app_meta_data ->> 'role')::public.app_role, 'coordinator')
  );
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Core entities ──────────────────────────────────────────
create table public.locations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  code text not null, -- IATA-style or internal short code, unique per tenant
  city text not null,
  country text not null,
  lat double precision not null,
  lng double precision not null,
  type public.location_type not null default 'office',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, code),
  unique (id, tenant_id) -- composite target so children can enforce same-tenant FKs
);
create index locations_tenant_idx on public.locations (tenant_id);
create trigger locations_updated_at before update on public.locations
  for each row execute function public.set_updated_at();

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  parent_department_id uuid references public.departments(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (tenant_id, name),
  unique (id, tenant_id)
);
create index departments_tenant_idx on public.departments (tenant_id);

create table public.employees (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  photo_url text,
  title text not null default '',
  department_id uuid,
  location_id uuid,
  email text,
  phone text,
  internal_ext text,
  manager_name text,
  start_date date,
  education_level public.education_level,
  school text,
  graduate_info text, -- master's/PhD program details, if applicable
  expertise_areas text[] not null default '{}',
  tools_technologies text[] not null default '{}',
  past_projects jsonb not null default '[]', -- [{name, role, year}]
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, tenant_id),
  -- composite FKs: an employee can only reference departments/locations of its own tenant
  foreign key (department_id, tenant_id) references public.departments (id, tenant_id) on delete set null (department_id),
  foreign key (location_id, tenant_id) references public.locations (id, tenant_id) on delete set null (location_id)
);
create trigger employees_updated_at before update on public.employees
  for each row execute function public.set_updated_at();
create index employees_tenant_idx on public.employees (tenant_id);
create index employees_location_idx on public.employees (location_id);
create index employees_department_idx on public.employees (department_id);

-- ── Tag vocabularies (per tenant) ──────────────────────────
create table public.skills (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  category text,
  unique (tenant_id, name)
);
create index skills_tenant_idx on public.skills (tenant_id);
create table public.certifications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  unique (tenant_id, name)
);
create index certifications_tenant_idx on public.certifications (tenant_id);
create table public.languages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  unique (tenant_id, name)
);
create index languages_tenant_idx on public.languages (tenant_id);
create table public.hobbies (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  unique (tenant_id, name)
);
create index hobbies_tenant_idx on public.hobbies (tenant_id);

-- Junction tables inherit tenancy from the employee row (RLS checks the parent).
create table public.employee_skills (
  employee_id uuid not null references public.employees(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  level public.skill_level,
  primary key (employee_id, skill_id)
);
create table public.employee_certifications (
  employee_id uuid not null references public.employees(id) on delete cascade,
  certification_id uuid not null references public.certifications(id) on delete cascade,
  issued_year int,
  primary key (employee_id, certification_id)
);
create table public.employee_languages (
  employee_id uuid not null references public.employees(id) on delete cascade,
  language_id uuid not null references public.languages(id) on delete cascade,
  proficiency public.language_proficiency not null default 'professional',
  primary key (employee_id, language_id)
);
create table public.employee_hobbies (
  employee_id uuid not null references public.employees(id) on delete cascade,
  hobby_id uuid not null references public.hobbies(id) on delete cascade,
  primary key (employee_id, hobby_id)
);

-- ── Shortlists ─────────────────────────────────────────────
create table public.shortlists (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  description text,
  created_by uuid not null references public.profiles(user_id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, tenant_id)
);
create index shortlists_tenant_idx on public.shortlists (tenant_id);
create trigger shortlists_updated_at before update on public.shortlists
  for each row execute function public.set_updated_at();

create table public.shortlist_employees (
  shortlist_id uuid not null,
  employee_id uuid not null,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (shortlist_id, employee_id),
  -- both sides must belong to the same tenant as the link row
  foreign key (shortlist_id, tenant_id) references public.shortlists (id, tenant_id) on delete cascade,
  foreign key (employee_id, tenant_id) references public.employees (id, tenant_id) on delete cascade
);
create index shortlist_employees_tenant_idx on public.shortlist_employees (tenant_id);

-- ── Field visibility (per tenant, per role) ────────────────
create table public.field_visibility_settings (
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  field_key text not null, -- e.g. 'email', 'phone', 'hobbies'
  visible_to_roles public.app_role[] not null default '{tenant_admin,hr,manager,coordinator}',
  updated_at timestamptz not null default now(),
  primary key (tenant_id, field_key)
);
create trigger field_visibility_updated_at before update on public.field_visibility_settings
  for each row execute function public.set_updated_at();

-- ── Audit log ──────────────────────────────────────────────
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade, -- null only for platform-level actions
  actor_id uuid references public.profiles(user_id) on delete set null,
  action text not null, -- create / update / delete / import
  entity text not null,
  entity_id text,
  meta jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index audit_logs_tenant_idx on public.audit_logs (tenant_id);

-- ── Views (tenant_id flows through from base tables) ───────
create view public.location_employee_counts
  with (security_invoker = true) as
select l.*, count(e.id)::int as employee_count
from public.locations l
left join public.employees e on e.location_id = l.id
group by l.id;

create view public.employee_directory
  with (security_invoker = true) as
select
  e.*,
  d.name as department_name,
  l.name as location_name,
  l.code as location_code,
  l.city as location_city,
  l.country as location_country,
  coalesce((select array_agg(s.name order by s.name) from public.employee_skills es
    join public.skills s on s.id = es.skill_id where es.employee_id = e.id), '{}') as skill_names,
  coalesce((select array_agg(c.name order by c.name) from public.employee_certifications ec
    join public.certifications c on c.id = ec.certification_id where ec.employee_id = e.id), '{}') as certification_names,
  coalesce((select array_agg(lg.name order by lg.name) from public.employee_languages el
    join public.languages lg on lg.id = el.language_id where el.employee_id = e.id), '{}') as language_names,
  coalesce((select array_agg(h.name order by h.name) from public.employee_hobbies eh
    join public.hobbies h on h.id = eh.hobby_id where eh.employee_id = e.id), '{}') as hobby_names
from public.employees e
left join public.departments d on d.id = e.department_id
left join public.locations l on l.id = e.location_id;

-- ── Storage: employee photos ───────────────────────────────
insert into storage.buckets (id, name, public)
values ('employee-photos', 'employee-photos', true);
