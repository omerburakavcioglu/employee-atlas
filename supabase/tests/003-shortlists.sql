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

grant usage on schema tests to authenticated;
grant execute on all functions in schema tests to authenticated;

-- Setup (superuser iken): seed'de Turkcell'e ait shortlist yok; (a) senaryosu
-- için geçici bir tane oluştur (transaction rollback'leneceği için kalıcı olmaz).
do $$
declare
  v_tav_tenant uuid; v_tc_tenant uuid; v_tc_admin uuid;
  v_tc_shortlist uuid; v_tav_shortlist uuid; v_tc_emp uuid;
begin
  select id into v_tav_tenant from public.tenants where slug = 'tav-airports';
  select id into v_tc_tenant  from public.tenants where slug = 'turkcell';
  select user_id into v_tc_admin from public.profiles
    where tenant_id = v_tc_tenant and role = 'tenant_admin' limit 1;
  select id into v_tav_shortlist from public.shortlists
    where tenant_id = v_tav_tenant limit 1;
  select id into v_tc_emp from public.employees
    where tenant_id = v_tc_tenant limit 1;

  if v_tav_tenant is null or v_tc_tenant is null or v_tc_admin is null
     or v_tav_shortlist is null or v_tc_emp is null then
    raise exception 'Setup verisi eksik — seed uygulanmış mı?';
  end if;

  insert into public.shortlists (tenant_id, name, description, created_by)
  values (v_tc_tenant, 'Turkcell Test Shortlist', 'İzolasyon testi için geçici kayıt', v_tc_admin)
  returning id into v_tc_shortlist;

  perform set_config('tests.tav_tenant_id',        v_tav_tenant::text,   true);
  perform set_config('tests.turkcell_tenant_id',   v_tc_tenant::text,    true);
  perform set_config('tests.tav_shortlist_id',     v_tav_shortlist::text, true);
  perform set_config('tests.turkcell_shortlist_id', v_tc_shortlist::text, true);
  perform set_config('tests.turkcell_employee_id', v_tc_emp::text,       true);
end $$;

select plan(4);

select tests.authenticate_as('tav.admin@demo.com');

-- 1) Pozitif kontrol: kendi shortlist'leri görünüyor
select ok((select count(*) from public.shortlists) > 0,
  'TAV admin kendi shortlist''lerini görebiliyor');

-- 2) (a) Turkcell'e ait shortlist id ile SELECT -> boş
select is_empty(
  format('select id from public.shortlists where id = %L',
         current_setting('tests.turkcell_shortlist_id')),
  'SELECT by id: Turkcell shortlist''i görünmüyor');

-- 3) (b1) Kendi shortlist'ine Turkcell çalışanı ekleme (kendi tenant_id'siyle):
--    RLS WITH CHECK geçer (tenant_id kendi tenant'ı), composite FK
--    shortlist_employees_employee_id_tenant_id_fkey yakalar -> 23503
select throws_ok(
  format('insert into public.shortlist_employees (shortlist_id, employee_id, tenant_id)
          values (%L, %L, %L)',
         current_setting('tests.tav_shortlist_id'),
         current_setting('tests.turkcell_employee_id'),
         current_setting('tests.tav_tenant_id')),
  '23503', null,
  'Shortlist: cross-tenant çalışan ekleme composite FK''ye takılıyor (23503)');

-- 4) (b2) Aynı ekleme karşı tenant_id'siyle: FK'ye gelmeden RLS WITH CHECK
--    reddeder -> 42501
select throws_ok(
  format('insert into public.shortlist_employees (shortlist_id, employee_id, tenant_id)
          values (%L, %L, %L)',
         current_setting('tests.tav_shortlist_id'),
         current_setting('tests.turkcell_employee_id'),
         current_setting('tests.turkcell_tenant_id')),
  '42501', null,
  'Shortlist: karşı tenant_id ile ekleme RLS''e takılıyor (42501)');

select tests.clear_auth();
select * from finish();
rollback;
