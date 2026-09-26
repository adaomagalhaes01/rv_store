-- RV_Store | Zerar dados (mantém apenas o admin) + compras só com conta
-- =====================================================================
-- Este ficheiro é idempotente: pode ser executado num SQL editor ou
-- com `supabase db push`. Apaga todos os dados produzidos e mantém
-- apenas a conta do administrador (adaomagalhaes793@gmail.com).
-- =====================================================================

-- =====================================================================
-- 1) Compras apenas para utilizadores com sessão iniciada
-- =====================================================================
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
  -- Só compra quem tem conta
  if p_user_id is null then
    raise exception 'Inicie sessão para confirmar a compra.';
  end if;
  if not exists (select 1 from public.profiles where id = p_user_id) then
    raise exception 'Conta não encontrada. Inicie sessão novamente.';
  end if;
  if jsonb_array_length(coalesce(p_items, '[]'::jsonb)) = 0 then
    raise exception 'O carrinho está vazio.';
  end if;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_product_id := (v_item->>'product_id')::bigint;
    v_quantity := (v_item->>'quantity')::int;
    select price into v_price
      from public.products
      where id = v_product_id and active = true;
    if v_price is null then
      raise exception 'Produto inexistente ou indisponível: %', v_product_id;
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

-- =====================================================================
-- 2) Zerar os dados (apenas o admin é mantido)
-- =====================================================================

-- Apagar produtos, pedidos, itens, banners, cupões e newsletter.
-- `restart identity` repõe os ids a partir de 1.
truncate table
  public.order_items,
  public.orders,
  public.coupons,
  public.banners,
  public.products,
  public.newsletter_subscribers
restart identity
cascade;

-- Apagar todos os utilizadores EXCEPTO o admin.
-- O apagar em auth.users remove automaticamente o respetivo profile
-- (chave estrangeira com on delete cascade).
delete from auth.users
where id <> 'ec04e143-cbd4-4ce2-8a5e-05a5e819f186';

-- =====================================================================
-- 3) Garantir que o admin continua com acesso (idempotente)
-- =====================================================================
insert into public.profiles (id, full_name, role, status)
values ('ec04e143-cbd4-4ce2-8a5e-05a5e819f186', 'Administrador', 'admin', 'ativo')
on conflict (id) do update
  set role = 'admin', status = 'ativo';