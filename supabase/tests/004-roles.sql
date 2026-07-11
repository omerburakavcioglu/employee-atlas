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

-- Rol matrisi: tenant_admin/hr yazabilir (is_tenant_staff), manager yazamaz.
select plan(5);

-- ── Manager: okuyabilir ama yazamaz ─────────────────────────
select tests.authenticate_as('tav.manager@demo.com');

-- 1) Pozitif kontrol: manager kendi tenant verisini okuyabiliyor
select ok((select count(*) from public.departments) > 0,
  'Manager departmanları okuyabiliyor');

-- 2) Manager INSERT -> RLS WITH CHECK ihlali, 42501
select throws_ok(
  'insert into public.departments (tenant_id, name)
   values (public.current_tenant_id(), ''Manager Yetki Testi'')',
  '42501', null,
  'Manager: departments INSERT reddediliyor (42501)');

-- 3) Manager UPDATE -> yazma politikasının USING''i satır göstermez, 0 satır
select is_empty(
  'update public.departments set name = ''HACKED''
    where tenant_id = public.current_tenant_id() returning 1',
  'Manager: departments UPDATE 0 satır etkiliyor');

select tests.clear_auth();

-- ── HR: aynı işlem başarılı olmalı ──────────────────────────
select tests.authenticate_as('tav.hr@demo.com');

-- 4) HR INSERT -> başarılı
select lives_ok(
  'insert into public.departments (tenant_id, name)
   values (public.current_tenant_id(), ''HR Yetki Testi'')',
  'HR: departments INSERT başarılı');

-- 5) Eklenen satır HR tarafından görülebiliyor
select is(
  (select count(*)::int from public.departments where name = 'HR Yetki Testi'),
  1, 'HR: eklenen departman görünüyor');

select tests.clear_auth();
select * from finish();
rollback;
