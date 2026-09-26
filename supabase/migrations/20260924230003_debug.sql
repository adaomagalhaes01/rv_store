-- apenas diagnóstico
create or replace view public.debug_auth_users as
  select id, email, role, email_confirmed_at
  from auth.users;