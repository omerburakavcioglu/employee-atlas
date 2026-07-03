-- Employee Atlas — RLS policies (multi-tenant). Deny by default: enable RLS
-- everywhere. Every policy scopes rows to the caller's tenant; super_admin
-- (platform-level, development only) bypasses tenant scoping.

-- ── Helpers ────────────────────────────────────────────────
-- Current user's app role (stable, security definer: bypasses RLS on profiles)
create or replace function public.current_app_role()
returns public.app_role
language sql stable security definer set search_path = public as $$
  select role from public.profiles where user_id = auth.uid();
$$;

-- Current user's tenant (null for super_admin)
create or replace function public.current_tenant_id()
returns uuid
language sql stable security definer set search_path = public as $$
  select tenant_id from public.profiles where user_id = auth.uid();
$$;

create or replace function public.is_super_admin()
returns boolean language sql stable as $$
  select public.current_app_role() = 'super_admin';
$$;

-- Staff who may write people data within their tenant
create or replace function public.is_tenant_staff()
returns boolean language sql stable as $$
  select public.current_app_role() in ('tenant_admin', 'hr');
$$;

-- ── tenants ────────────────────────────────────────────────
alter table public.tenants enable row level security;
create policy "tenants: read own or super" on public.tenants
  for select to authenticated
  using (id = public.current_tenant_id() or public.is_super_admin());
create policy "tenants: update by tenant_admin or super" on public.tenants
  for update to authenticated
  using (public.is_super_admin()
    or (id = public.current_tenant_id() and public.current_app_role() = 'tenant_admin'))
  with check (public.is_super_admin()
    or (id = public.current_tenant_id() and public.current_app_role() = 'tenant_admin'));
create policy "tenants: insert super only" on public.tenants
  for insert to authenticated with check (public.is_super_admin());
create policy "tenants: delete super only" on public.tenants
  for delete to authenticated using (public.is_super_admin());

-- ── profiles ───────────────────────────────────────────────
alter table public.profiles enable row level security;
create policy "profiles: read own tenant or super" on public.profiles
  for select to authenticated
  using (user_id = auth.uid()
    or tenant_id = public.current_tenant_id()
    or public.is_super_admin());
create policy "profiles: update own, tenant_admin, or super" on public.profiles
  for update to authenticated
  using (user_id = auth.uid()
    or public.is_super_admin()
    or (tenant_id = public.current_tenant_id() and public.current_app_role() = 'tenant_admin'))
  with check (user_id = auth.uid()
    or public.is_super_admin()
    or (tenant_id = public.current_tenant_id() and public.current_app_role() = 'tenant_admin'));

-- Role/tenant reassignment guard: only tenant_admin (within tenant, not to
-- super_admin) or super_admin may change roles; only super_admin may move a
-- profile between tenants.
create or replace function public.guard_profile_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.tenant_id is distinct from old.tenant_id and not public.is_super_admin() then
    raise exception 'only super admins can change a profile''s tenant';
  end if;
  if new.role is distinct from old.role then
    if public.is_super_admin() then
      return new;
    end if;
    if public.current_app_role() = 'tenant_admin'
       and old.tenant_id = public.current_tenant_id()
       and new.role <> 'super_admin' then
      return new;
    end if;
    raise exception 'not allowed to change this role';
  end if;
  return new;
end;
$$;
create trigger profiles_guard_change before update on public.profiles
  for each row execute function public.guard_profile_change();

-- ── tenant-owned tables: read within tenant, write tenant staff ──
do $$
declare t text;
begin
  foreach t in array array[
    'locations', 'departments', 'employees',
    'skills', 'certifications', 'languages', 'hobbies'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy "%s: read own tenant" on public.%I for select to authenticated
       using (tenant_id = public.current_tenant_id() or public.is_super_admin())', t, t);
    execute format(
      'create policy "%s: write tenant staff" on public.%I for all to authenticated
       using (public.is_super_admin()
         or (tenant_id = public.current_tenant_id() and public.is_tenant_staff()))
       with check (public.is_super_admin()
         or (tenant_id = public.current_tenant_id() and public.is_tenant_staff()))', t, t);
  end loop;
end $$;

-- ── employee tag junctions: scope via the parent employee ──
do $$
declare t text;
begin
  foreach t in array array[
    'employee_skills', 'employee_certifications', 'employee_languages', 'employee_hobbies'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy "%s: read own tenant" on public.%I for select to authenticated
       using (exists (select 1 from public.employees e where e.id = employee_id
         and (e.tenant_id = public.current_tenant_id() or public.is_super_admin())))', t, t);
    execute format(
      'create policy "%s: write tenant staff" on public.%I for all to authenticated
       using (exists (select 1 from public.employees e where e.id = employee_id
         and (public.is_super_admin()
           or (e.tenant_id = public.current_tenant_id() and public.is_tenant_staff()))))
       with check (exists (select 1 from public.employees e where e.id = employee_id
         and (public.is_super_admin()
           or (e.tenant_id = public.current_tenant_id() and public.is_tenant_staff()))))', t, t);
  end loop;
end $$;

-- ── shortlists: tenant-scoped, creator-owned, all roles may create ──
alter table public.shortlists enable row level security;
create policy "shortlists: read own tenant" on public.shortlists
  for select to authenticated
  using (tenant_id = public.current_tenant_id() or public.is_super_admin());
create policy "shortlists: insert own in tenant" on public.shortlists
  for insert to authenticated
  with check (created_by = auth.uid() and tenant_id = public.current_tenant_id());
create policy "shortlists: update own, tenant_admin, or super" on public.shortlists
  for update to authenticated
  using (public.is_super_admin()
    or (tenant_id = public.current_tenant_id()
      and (created_by = auth.uid() or public.current_app_role() = 'tenant_admin')));
create policy "shortlists: delete own, tenant_admin, or super" on public.shortlists
  for delete to authenticated
  using (public.is_super_admin()
    or (tenant_id = public.current_tenant_id()
      and (created_by = auth.uid() or public.current_app_role() = 'tenant_admin')));

alter table public.shortlist_employees enable row level security;
create policy "shortlist_employees: read own tenant" on public.shortlist_employees
  for select to authenticated
  using (tenant_id = public.current_tenant_id() or public.is_super_admin());
create policy "shortlist_employees: manage own list" on public.shortlist_employees
  for all to authenticated
  using (exists (select 1 from public.shortlists s
    where s.id = shortlist_id
      and (public.is_super_admin()
        or (s.tenant_id = public.current_tenant_id()
          and (s.created_by = auth.uid() or public.current_app_role() = 'tenant_admin')))))
  with check (tenant_id = public.current_tenant_id() or public.is_super_admin());

-- ── field visibility: read within tenant, write tenant staff ──
alter table public.field_visibility_settings enable row level security;
create policy "visibility: read own tenant" on public.field_visibility_settings
  for select to authenticated
  using (tenant_id = public.current_tenant_id() or public.is_super_admin());
create policy "visibility: write tenant staff" on public.field_visibility_settings
  for all to authenticated
  using (public.is_super_admin()
    or (tenant_id = public.current_tenant_id() and public.is_tenant_staff()))
  with check (public.is_super_admin()
    or (tenant_id = public.current_tenant_id() and public.is_tenant_staff()));

-- ── audit logs: tenant_admin reads own tenant, super reads all ──
alter table public.audit_logs enable row level security;
create policy "audit: tenant_admin read own tenant" on public.audit_logs
  for select to authenticated
  using (public.is_super_admin()
    or (tenant_id = public.current_tenant_id() and public.current_app_role() = 'tenant_admin'));
create policy "audit: insert own in tenant" on public.audit_logs
  for insert to authenticated
  with check (actor_id = auth.uid()
    and (tenant_id = public.current_tenant_id() or public.is_super_admin()));

-- ── storage: photos public read, tenant staff write ────────
-- Note: bucket is public; photo URLs are not tenant-isolated (known MVP risk).
create policy "photos: public read" on storage.objects
  for select using (bucket_id = 'employee-photos');
create policy "photos: tenant staff write" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'employee-photos' and (public.is_tenant_staff() or public.is_super_admin()));
create policy "photos: tenant staff update" on storage.objects
  for update to authenticated
  using (bucket_id = 'employee-photos' and (public.is_tenant_staff() or public.is_super_admin()));
create policy "photos: tenant staff delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'employee-photos' and (public.is_tenant_staff() or public.is_super_admin()));
