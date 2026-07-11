begin;
create extension if not exists pgtap with schema extensions;

-- JWT taklidi: PostgREST'in yaptığını yapar.
create schema if not exists tests;

create or replace function tests.authenticate_as(user_email text)
returns void language plpgsql as $$
declare uid uuid;
begin
  select id into uid from auth.users where email = user_email;
  if uid is null then
    raise exception 'Test kullanıcısı % bulunamadı — seed uygulanmış mı?', user_email;
  end if;
  perform set_config('request.jwt.claims',
    json_build_object('sub', uid, 'role', 'authenticated', 'email', user_email)::text, true);
  perform set_config('role', 'authenticated', true);
end $$;

create or replace function tests.clear_auth()
returns void language plpgsql as $$
begin
  perform set_config('role', 'postgres', true);
  perform set_config('request.jwt.claims', '', true);
end $$;

-- clear_auth, rol authenticated iken çağrılır; şema erişimi gerekir.
grant usage on schema tests to authenticated;
grant execute on all functions in schema tests to authenticated;

-- Setup: kimlik doğrulamadan ÖNCE (superuser iken) karşı tenant id'lerini
-- GUC'lara yaz. Giriş sonrası bunlar RLS yüzünden sorgulanamaz.
do $$
declare
  v_tav_tenant uuid; v_tc_tenant uuid; v_tc_emp uuid; v_tc_dept uuid;
begin
  select id into v_tav_tenant from public.tenants where slug = 'tav-airports';
  select id into v_tc_tenant  from public.tenants where slug = 'turkcell';
  select id into v_tc_emp  from public.employees   where tenant_id = v_tc_tenant limit 1;
  select id into v_tc_dept from public.departments where tenant_id = v_tc_tenant limit 1;

  if v_tav_tenant is null or v_tc_tenant is null or v_tc_emp is null or v_tc_dept is null then
    raise exception 'Setup verisi eksik (tenant/çalışan/departman) — seed uygulanmış mı?';
  end if;

  perform set_config('tests.tav_tenant_id',        v_tav_tenant::text, true);
  perform set_config('tests.turkcell_tenant_id',   v_tc_tenant::text,  true);
  perform set_config('tests.turkcell_employee_id', v_tc_emp::text,     true);
  perform set_config('tests.turkcell_dept_id',     v_tc_dept::text,    true);
end $$;

select plan(8);

select tests.authenticate_as('tav.admin@demo.com');

-- 1) Pozitif kontrol: kendi verisi görünüyor (bu olmadan negatif testler anlamsız)
select ok((select count(*) from public.employees) > 0,
  'TAV admin kendi çalışanlarını görebiliyor');

-- 2) SELECT: karşı tenant satırları sessizce filtrelenir -> 0 satır beklenir
select is(
  (select count(*)::int from public.employees
    where tenant_id = current_setting('tests.turkcell_tenant_id')::uuid),
  0, 'SELECT: Turkcell çalışanları görünmüyor');

-- 3) id ile doğrudan erişim (profil 404 senaryosunun DB karşılığı)
select is_empty(
  format('select id from public.employees where id = %L',
         current_setting('tests.turkcell_employee_id')),
  'SELECT by id: Turkcell çalışanı id ile de çekilemiyor');

-- 4) INSERT: karşı tenant adına yazma -> WITH CHECK ihlali, 42501
--    (employees zorunlu kolonları: tenant_id, first_name, last_name)
select throws_ok(
  format('insert into public.employees (tenant_id, first_name, last_name)
          values (%L, ''Sizma'', ''Denemesi'')',
         current_setting('tests.turkcell_tenant_id')),
  '42501', null,
  'INSERT: Turkcell tenant_id ile yazma reddediliyor (42501)');

-- 5) UPDATE: hata YOK, etkilenen satır 0 olmalı
--    (returning hiç satır döndürmemeli; data-modifying CTE skaler alt sorguda
--    kullanılamadığı için is_empty ile assert ediliyor)
select is_empty(
  format('update public.employees set first_name = ''HACKED''
           where id = %L returning 1',
         current_setting('tests.turkcell_employee_id')),
  'UPDATE: cross-tenant güncelleme 0 satır etkiliyor');

-- 6) DELETE: aynı mantık, 0 satır
select is_empty(
  format('delete from public.employees
           where id = %L returning 1',
         current_setting('tests.turkcell_employee_id')),
  'DELETE: cross-tenant silme 0 satır etkiliyor');

-- 7) Composite FK (employees_department_id_tenant_id_fkey):
--    kendi tenant'ında çalışan + karşı tenant'ın departmanı -> 23503
select throws_ok(
  format('insert into public.employees (tenant_id, first_name, last_name, department_id)
          values (%L, ''FK'', ''Testi'', %L)',
         current_setting('tests.tav_tenant_id'),
         current_setting('tests.turkcell_dept_id')),
  '23503', null,
  'Composite FK: cross-tenant department_id reddediliyor (23503)');

-- 8) Tenant reassignment trigger'ı (profiles_guard_change).
--    profiles'ta kullanıcı kolonu user_id'dir (id değil).
select throws_ok(
  format('update public.profiles set tenant_id = %L where user_id = (select auth.uid())',
         current_setting('tests.turkcell_tenant_id')),
  'P0001', 'only super admins can change a profile''s tenant',
  'Trigger: tenant reassignment engellendi');

select tests.clear_auth();
select * from finish();
rollback;
