-- Restore the stock Supabase table privileges on the public schema.
-- Authorization is enforced by RLS (see 20260702000002_rls.sql); the API
-- roles need base DML grants for PostgREST queries to reach RLS at all.
-- Without these, every profiles select fails with 42501 and the proxy
-- misreads a valid login as a stale session (login redirect loop).

grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on all functions in schema public to anon, authenticated, service_role;

alter default privileges in schema public
  grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public
  grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public
  grant all on functions to anon, authenticated, service_role;
