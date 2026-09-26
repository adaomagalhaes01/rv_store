-- RV_Store | Backend completo
-- ===================================================================
-- Extensões
-- ===================================================================
create extension if not exists "pgcrypto";

-- ===================================================================
-- Tabelas
-- ===================================================================

-- Perfis de utilizador (liga ao auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  role text not null default 'cliente' check (role in ('cliente', 'admin')),
  status text not null default 'ativo' check (status in ('ativo', 'suspenso')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Perfil público de cada utilizador registado';

-- Categorias
create table public.categories (
  id bigint generated always as identity primary key,
  name text not null unique,
  slug text not null unique,
  image_url text,
  description text,
  position int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Produtos
create table public.products (
  id bigint generated always as identity primary key,
  name text not null,
  slug text unique,
  description text,
  category text not null,
  sub_category text,
  category_id bigint references public.categories (id) on delete set null,
  price numeric(12,2) not null default 0 check (price >= 0),
  original_price numeric(12,2) check (original_price >= 0),
  rating numeric(2,1) not null default 5.0,
  images text[] not null default '{}',
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  size_stock jsonb not null default '{}',
  stock int not null default 0 check (stock >= 0),
  sales int not null default 0,
  is_featured boolean not null default false,
  on_sale boolean not null default false,
  discount_coupon text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_idx on public.products (category);
create index products_active_idx on public.products (active);

-- Banners
create table public.banners (
  id bigint generated always as identity primary key,
  title text not null,
  subtitle text,
  link text,
  image_url text not null,
  active boolean not null default true,
  position int not null default 0,
  created_at timestamptz not null default now()
);

-- Cupões de desconto
create table public.coupons (
  id bigint generated always as identity primary key,
  code text not null unique,
  discount_type text not null default 'percent' check (discount_type in ('percent', 'fixed')),
  discount_value numeric(12,2) not null default 0,
  valid_from timestamptz,
  valid_until timestamptz,
  max_uses int,
  used_count int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Encomendas
create table public.orders (
  id bigint generated always as identity primary key,
  order_number text unique,
  user_id uuid references public.profiles (id) on delete set null,
  customer_name text not null,
  customer_email text,
  customer_phone text,
  address text not null,
  neighborhood text,
  city text not null default 'Luanda',
  payment_method text not null default 'card'
    check (payment_method in ('card', 'express', 'cash')),
  status text not null default 'Pendente'
    check (status in ('Pendente', 'Pago', 'Enviado', 'Entregue', 'Cancelado')),
  subtotal numeric(12,2) not null default 0,
  shipping_fee numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_status_idx on public.orders (status);
create index orders_user_idx on public.orders (user_id);

-- Itens de cada encomenda
create table public.order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.orders (id) on delete cascade,
  product_id bigint references public.products (id) on delete set null,
  product_name text not null,
  product_image text,
  quantity int not null default 1 check (quantity > 0),
  price numeric(12,2) not null default 0,
  selected_size text,
  selected_color text,
  created_at timestamptz not null default now()
);

-- Subscritores da newsletter
create table public.newsletter_subscribers (
  id bigint generated always as identity primary key,
  email text not null unique,
  created_at timestamptz not null default now()
);

-- Configurações da loja (singleton)
create table public.store_settings (
  id smallint primary key default 1 check (id = 1),
  store_name text not null default 'RV_Store',
  currency text not null default 'AOA',
  delivery_fee numeric(12,2) not null default 0,
  free_delivery_threshold numeric(12,2) not null default 50000,
  address text,
  phone text,
  email text,
  message text default 'Bem-vindo à RV_Store'
);

insert into public.store_settings (id) values (1) on conflict (id) do nothing;

-- ===================================================================
-- Funções e triggers
-- ===================================================================

-- Cria perfil automaticamente no registo
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
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Mantém updated_at atualizado
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at
  before update on public.products
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at
  before update on public.orders
  for each row execute procedure public.set_updated_at();

-- Ajudante: é administrador?
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and status = 'ativo'
  );
$$;

-- Cria encomenda com itens (transação) e atualiza stock/vendas
create or replace function public.create_order(
  p_user_id uuid,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_address text,
  p_neighborhood text,
  p_city text,
  p_payment_method text,
  p_items jsonb
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id bigint;
  v_subtotal numeric(12,2) := 0;
  v_item jsonb;
  v_product_id bigint;
  v_quantity int;
  v_price numeric(12,2);
begin
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_product_id := (v_item->>'product_id')::bigint;
    v_quantity := (v_item->>'quantity')::int;
    select price into v_price from public.products where id = v_product_id;
    if v_price is null then
      raise exception 'Produto inexistente: %', v_product_id;
    end if;
    v_subtotal := v_subtotal + (v_price * v_quantity);
    update public.products
      set stock = greatest(0, stock - v_quantity),
          sales = sales + v_quantity
      where id = v_product_id;
  end loop;

  insert into public.orders (
    user_id, customer_name, customer_email, customer_phone,
    address, neighborhood, city, payment_method, status,
    subtotal, shipping_fee, total
  )
  values (
    p_user_id, p_customer_name, p_customer_email, p_customer_phone,
    p_address, p_neighborhood, p_city, p_payment_method, 'Pendente',
    v_subtotal, 0, v_subtotal
  )
  returning id into v_order_id;

  update public.orders
    set order_number = 'ORD-' || lpad(v_order_id::text, 6, '0')
    where id = v_order_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_product_id := (v_item->>'product_id')::bigint;
    v_quantity := (v_item->>'quantity')::int;
    v_price := (v_item->>'price')::numeric(12,2);
    insert into public.order_items (
      order_id, product_id, product_name, product_image,
      quantity, price, selected_size, selected_color
    )
    values (
      v_order_id,
      v_product_id,
      coalesce(
        v_item->>'product_name',
        (select name from public.products where id = v_product_id)
      ),
      v_item->>'product_image',
      v_quantity,
      v_price,
      v_item->>'size',
      v_item->>'color'
    );
  end loop;

  return v_order_id;
end;
$$;

-- Estatísticas para o painel
create or replace function public.get_store_stats()
returns json
language sql
security definer
set search_path = public
as $$
  select json_build_object(
    'total_sales', coalesce((select sum(total) from public.orders where status in ('Pago', 'Enviado', 'Entregue')), 0),
    'active_products', (select count(*) from public.products where active = true),
    'pending_orders', (select count(*) from public.orders where status = 'Pendente'),
    'total_customers', (select count(*) from public.profiles)
  );
$$;

-- ===================================================================
-- Row Level Security
-- ===================================================================
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.banners enable row level security;
alter table public.coupons enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.store_settings enable row level security;

-- profiles
create policy "profiles_select" on public.profiles
  for select to authenticated
  using (auth.uid() = id or public.is_admin());
create policy "profiles_update" on public.profiles
  for update to authenticated
  using (auth.uid() = id or public.is_admin());
create policy "profiles_admin_write" on public.profiles
  for insert to authenticated
  with check (public.is_admin());

-- categories
create policy "categories_read" on public.categories
  for select to anon, authenticated
  using (true);
create policy "categories_admin_write" on public.categories
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- products
create policy "products_read" on public.products
  for select to anon, authenticated
  using (active = true or public.is_admin());
create policy "products_admin_write" on public.products
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- banners
create policy "banners_read" on public.banners
  for select to anon, authenticated
  using (active = true or public.is_admin());
create policy "banners_admin_write" on public.banners
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- coupons
create policy "coupons_read" on public.coupons
  for select to anon, authenticated
  using (active = true or public.is_admin());
create policy "coupons_admin_write" on public.coupons
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- orders
create policy "orders_read" on public.orders
  for select to authenticated
  using (public.is_admin() or user_id = auth.uid());
create policy "orders_insert" on public.orders
  for insert to anon, authenticated
  with check (true);
create policy "orders_update" on public.orders
  for update to authenticated
  using (public.is_admin());
create policy "orders_delete" on public.orders
  for delete to authenticated
  using (public.is_admin());

-- order_items
create policy "order_items_read" on public.order_items
  for select to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );
create policy "order_items_insert" on public.order_items
  for insert to anon, authenticated
  with check (true);
create policy "order_items_admin_write" on public.order_items
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- newsletter_subscribers
create policy "newsletter_insert" on public.newsletter_subscribers
  for insert to anon, authenticated
  with check (true);
create policy "newsletter_read" on public.newsletter_subscribers
  for select to authenticated
  using (public.is_admin());

-- store_settings
create policy "settings_read" on public.store_settings
  for select to anon, authenticated
  using (true);
create policy "settings_update" on public.store_settings
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());