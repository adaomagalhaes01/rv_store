-- Correção: remove o utilizador admin criado via SQL (mal formado para o GoTrue)
delete from auth.users where email = 'adaomagalhaes793@gmail.com';

-- limpeza de utilizadores de teste criados manualmente
delete from auth.users where email in ('maria.cliente793@gmail.com', 'novo.admin793@gmail.com');

-- a view de diagnóstico já não é necessária
drop view if exists public.debug_auth_users;

-- garante que o seed de perfil de admin, se repetido, nunca recua a role
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(coalesce(new.email, ''), '@', 1)
    ),
    'cliente'
  )
  on conflict (id) do update set full_name = excluded.full_name;
  return new;
end;
$$;