begin;
create extension if not exists pgtap with schema extensions;

-- RLS'i açık olması gereken tabloların TAM listesi (migration 20260702000002_rls.sql
-- ile senkron): 13 tenant-owned tablo + 4 employee-tag junction tablosu.
-- Yeni tenant-owned tablo eklerken buraya da ekle ve plan() sayısını güncelle.
select plan(17);

select ok((select relrowsecurity from pg_class where oid = 'public.tenants'::regclass),                   'tenants: RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.profiles'::regclass),                  'profiles: RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.employees'::regclass),                 'employees: RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.locations'::regclass),                 'locations: RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.departments'::regclass),               'departments: RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.skills'::regclass),                    'skills: RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.certifications'::regclass),            'certifications: RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.languages'::regclass),                 'languages: RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.hobbies'::regclass),                   'hobbies: RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.shortlists'::regclass),                'shortlists: RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.shortlist_employees'::regclass),       'shortlist_employees: RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.field_visibility_settings'::regclass), 'field_visibility_settings: RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.audit_logs'::regclass),                'audit_logs: RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.employee_skills'::regclass),           'employee_skills: RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.employee_certifications'::regclass),   'employee_certifications: RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.employee_languages'::regclass),        'employee_languages: RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.employee_hobbies'::regclass),          'employee_hobbies: RLS enabled');

select * from finish();
rollback;
