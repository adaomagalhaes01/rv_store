-- ============================================================
-- RV_Store | Sistema Completo de E-Commerce
-- Migration: 20260930000001_ecommerce_complete.sql
-- ============================================================
-- Idempotente: pode ser re-executada sem erros.
-- ============================================================

-- ============================================================
-- 1. ALTERAR TABELA orders — novos campos e constraints
-- ============================================================

-- Adicionar campos novos se ainda não existirem
alter table public.orders
  add column if not exists payment_status text not null default 'pendente'
    check (payment_status in (
      'pendente',
      'comprovativo_enviado',
      'em_analise',
      'confirmado',
      'rejeitado'
    )),
  add column if not exists notes text,
  add column if not exists cancellation_reason text,
  add column if not exists payment_confirmed_at timestamptz,
  add column if not exists shipped_at timestamptz,
  add column if not exists delivered_at timestamptz,
  add column if not exists prepared_at timestamptz;

-- Remover o constraint antigo de status e criar o novo completo
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check
  check (status in (
    'Pendente',
    'Comprovativo enviado',
    'Em análise',
    'Pagamento confirmado',
    'Pagamento rejeitado',
    'Em preparação',
    'Pronto para entrega',
    'Em entrega',
    'Entregue',
    'Cancelado'
  ));

-- Remover constraint antigo de payment_method e criar novo com 'transfer'
alter table public.orders drop constraint if exists orders_payment_method_check;
alter table public.orders add constraint orders_payment_method_check
  check (payment_method in ('card', 'express', 'cash', 'transfer'));

-- Atualizar encomendas antigas: Pago → Pagamento confirmado
update public.orders set status = 'Pagamento confirmado', payment_status = 'confirmado'
  where status = 'Pago';
update public.orders set status = 'Em entrega'
  where status = 'Enviado';

-- ============================================================
-- 2. TABELA payment_proofs — Comprovativos de transferência
-- ============================================================
create table if not exists public.payment_proofs (
  id            bigint generated always as identity primary key,
  order_id      bigint not null references public.orders(id) on delete cascade,
  user_id       uuid   not null references public.profiles(id) on delete cascade,
  bank_name     text   not null check (bank_name in ('Atlântico', 'BAI', 'Express', 'Outro')),
  amount        numeric(12,2) not null check (amount > 0),
  transfer_date date   not null,
  reference     text,
  file_url      text,
  status        text   not null default 'pendente'
    check (status in ('pendente', 'aprovado', 'rejeitado')),
  rejection_reason text,
  reviewed_by   uuid references public.profiles(id) on delete set null,
  reviewed_at   timestamptz,
  created_at    timestamptz not null default now()
);

create index if not exists payment_proofs_order_idx  on public.payment_proofs(order_id);
create index if not exists payment_proofs_user_idx   on public.payment_proofs(user_id);
create index if not exists payment_proofs_status_idx on public.payment_proofs(status);

comment on table public.payment_proofs is 'Comprovativos de transferência bancária enviados pelos clientes';

-- ============================================================
-- 3. TABELA order_status_history — Histórico de estados
-- ============================================================
create table if not exists public.order_status_history (
  id          bigint generated always as identity primary key,
  order_id    bigint not null references public.orders(id) on delete cascade,
  old_status  text,
  new_status  text not null,
  changed_by  uuid references public.profiles(id) on delete set null,
  notes       text,
  created_at  timestamptz not null default now()
);

create index if not exists order_status_history_order_idx on public.order_status_history(order_id);

comment on table public.order_status_history is 'Histórico de alterações de estado das encomendas';

-- ============================================================
-- 4. TABELA inventory_movements — Movimentações de stock
-- ============================================================
create table if not exists public.inventory_movements (
  id           bigint generated always as identity primary key,
  product_id   bigint not null references public.products(id) on delete cascade,
  type         text   not null check (type in ('entrada', 'saida')),
  quantity     int    not null check (quantity > 0),
  stock_before int    not null default 0,
  stock_after  int    not null default 0,
  reason       text,
  order_id     bigint references public.orders(id) on delete set null,
  performed_by uuid   references public.profiles(id) on delete set null,
  created_at   timestamptz not null default now()
);

create index if not exists inventory_movements_product_idx on public.inventory_movements(product_id);
create index if not exists inventory_movements_order_idx   on public.inventory_movements(order_id);
create index if not exists inventory_movements_type_idx    on public.inventory_movements(type);

comment on table public.inventory_movements is 'Auditoria de entradas e saídas de stock';

-- ============================================================
-- 5. TABELA notifications — Notificações in-app para clientes
-- ============================================================
create table if not exists public.notifications (
  id         bigint generated always as identity primary key,
  user_id    uuid   not null references public.profiles(id) on delete cascade,
  title      text   not null,
  message    text   not null,
  type       text   not null default 'info'
    check (type in ('info', 'success', 'warning', 'error', 'order')),
  order_id   bigint references public.orders(id) on delete set null,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_idx  on public.notifications(user_id);
create index if not exists notifications_read_idx  on public.notifications(user_id, read);
create index if not exists notifications_order_idx on public.notifications(order_id);

comment on table public.notifications is 'Notificações in-app para os clientes';

-- ============================================================
-- 6. STORAGE BUCKET — Comprovativos de pagamento (privado)
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'payment-proofs',
  'payment-proofs',
  false,
  10485760,  -- 10 MB
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'application/pdf']
)
on conflict (id) do nothing;

-- Policies do bucket payment-proofs
-- Cliente pode fazer upload para a sua própria pasta (user_id/)
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'payment_proofs_insert'
  ) then
    execute $pol$
      create policy "payment_proofs_insert" on storage.objects
        for insert to authenticated
        with check (
          bucket_id = 'payment-proofs'
          and (storage.foldername(name))[1] = auth.uid()::text
        )
    $pol$;
  end if;
end $$;

-- Cliente pode ver os seus próprios ficheiros; admin vê todos
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'payment_proofs_select'
  ) then
    execute $pol$
      create policy "payment_proofs_select" on storage.objects
        for select to authenticated
        using (
          bucket_id = 'payment-proofs'
          and (
            (storage.foldername(name))[1] = auth.uid()::text
            or public.is_admin()
          )
        )
    $pol$;
  end if;
end $$;

-- Admin pode apagar
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'payment_proofs_delete'
  ) then
    execute $pol$
      create policy "payment_proofs_delete" on storage.objects
        for delete to authenticated
        using (bucket_id = 'payment-proofs' and public.is_admin())
    $pol$;
  end if;
end $$;

-- ============================================================
-- 7. ROW LEVEL SECURITY — Novas tabelas
-- ============================================================

alter table public.payment_proofs       enable row level security;
alter table public.order_status_history enable row level security;
alter table public.inventory_movements  enable row level security;
alter table public.notifications        enable row level security;

-- payment_proofs
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'payment_proofs' and policyname = 'pp_select') then
    create policy "pp_select" on public.payment_proofs
      for select to authenticated
      using (public.is_admin() or user_id = auth.uid());
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'payment_proofs' and policyname = 'pp_insert') then
    create policy "pp_insert" on public.payment_proofs
      for insert to authenticated
      with check (
        user_id = auth.uid()
        and exists (
          select 1 from public.orders o
          where o.id = order_id and o.user_id = auth.uid()
        )
      );
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'payment_proofs' and policyname = 'pp_admin_update') then
    create policy "pp_admin_update" on public.payment_proofs
      for update to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end $$;

-- order_status_history
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'order_status_history' and policyname = 'osh_select') then
    create policy "osh_select" on public.order_status_history
      for select to authenticated
      using (
        public.is_admin()
        or exists (
          select 1 from public.orders o
          where o.id = order_id and o.user_id = auth.uid()
        )
      );
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'order_status_history' and policyname = 'osh_insert') then
    create policy "osh_insert" on public.order_status_history
      for insert to authenticated
      with check (public.is_admin());
  end if;
end $$;

-- inventory_movements (só admin)
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'inventory_movements' and policyname = 'inv_select') then
    create policy "inv_select" on public.inventory_movements
      for select to authenticated using (public.is_admin());
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'inventory_movements' and policyname = 'inv_insert') then
    create policy "inv_insert" on public.inventory_movements
      for insert to authenticated with check (public.is_admin());
  end if;
end $$;

-- notifications (cliente vê as suas; insert só por funções security definer)
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'notifications' and policyname = 'notif_select') then
    create policy "notif_select" on public.notifications
      for select to authenticated
      using (user_id = auth.uid() or public.is_admin());
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'notifications' and policyname = 'notif_update_own') then
    create policy "notif_update_own" on public.notifications
      for update to authenticated
      using (user_id = auth.uid())
      with check (user_id = auth.uid());
  end if;
end $$;

-- ============================================================
-- 8. FUNÇÃO AUXILIAR — Criar notificação interna
-- ============================================================
create or replace function public.create_notification(
  p_user_id  uuid,
  p_title    text,
  p_message  text,
  p_type     text default 'info',
  p_order_id bigint default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (user_id, title, message, type, order_id)
  values (p_user_id, p_title, p_message, p_type, p_order_id);
end;
$$;

-- ============================================================
-- 9. FUNÇÃO create_order — MELHORADA (lock de stock + inventário)
-- ============================================================
create or replace function public.create_order(
  p_user_id        uuid,
  p_customer_name  text,
  p_customer_email text,
  p_customer_phone text,
  p_address        text,
  p_neighborhood   text,
  p_city           text,
  p_payment_method text,
  p_items          jsonb
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id    bigint;
  v_subtotal    numeric(12,2) := 0;
  v_item        jsonb;
  v_product_id  bigint;
  v_quantity    int;
  v_price       numeric(12,2);
  v_stock_now   int;
  v_product_name text;
begin
  -- Apenas utilizadores autenticados com conta
  if p_user_id is null then
    raise exception 'Inicie sessão para confirmar a compra.';
  end if;

  if not exists (select 1 from public.profiles where id = p_user_id) then
    raise exception 'Conta não encontrada. Inicie sessão novamente.';
  end if;

  if jsonb_array_length(coalesce(p_items, '[]'::jsonb)) = 0 then
    raise exception 'O carrinho está vazio.';
  end if;

  -- Validar e reservar stock com lock (evitar concorrência)
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_product_id := (v_item->>'product_id')::bigint;
    v_quantity   := (v_item->>'quantity')::int;

    -- Lock exclusivo no produto para evitar race conditions
    select price, stock, name
      into v_price, v_stock_now, v_product_name
      from public.products
      where id = v_product_id and active = true
      for update;

    if v_price is null then
      raise exception 'Produto % indisponível.', v_product_id;
    end if;

    if v_stock_now < v_quantity then
      raise exception 'Stock insuficiente para "%". Disponível: % unidade(s).', v_product_name, v_stock_now;
    end if;

    v_subtotal := v_subtotal + (v_price * v_quantity);
  end loop;

  -- Criar a encomenda
  insert into public.orders (
    user_id, customer_name, customer_email, customer_phone,
    address, neighborhood, city, payment_method, status, payment_status,
    subtotal, shipping_fee, total
  )
  values (
    p_user_id, p_customer_name, p_customer_email, p_customer_phone,
    p_address, p_neighborhood, p_city, p_payment_method,
    'Pendente', 'pendente',
    v_subtotal, 0, v_subtotal
  )
  returning id into v_order_id;

  -- Número único da encomenda
  update public.orders
    set order_number = 'ORD-' || lpad(v_order_id::text, 6, '0')
    where id = v_order_id;

  -- Inserir itens, descontar stock e registar movimentações
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_product_id := (v_item->>'product_id')::bigint;
    v_quantity   := (v_item->>'quantity')::int;

    -- Buscar dados atuais (já temos lock)
    select price, stock, name
      into v_price, v_stock_now, v_product_name
      from public.products
      where id = v_product_id;

    -- Inserir item
    insert into public.order_items (
      order_id, product_id, product_name, product_image,
      quantity, price, selected_size, selected_color
    )
    values (
      v_order_id,
      v_product_id,
      coalesce(v_item->>'product_name', v_product_name),
      v_item->>'product_image',
      v_quantity,
      v_price,                  -- preço validado no backend
      v_item->>'size',
      v_item->>'color'
    );

    -- Descontar stock
    update public.products
      set stock = stock - v_quantity,
          sales = sales + v_quantity
      where id = v_product_id;

    -- Registar movimentação de saída
    insert into public.inventory_movements (
      product_id, type, quantity, stock_before, stock_after,
      reason, order_id, performed_by
    )
    values (
      v_product_id, 'saida', v_quantity,
      v_stock_now, v_stock_now - v_quantity,
      'Venda — ' || 'ORD-' || lpad(v_order_id::text, 6, '0'),
      v_order_id, p_user_id
    );
  end loop;

  -- Histórico de estado inicial
  insert into public.order_status_history (order_id, old_status, new_status, changed_by, notes)
  values (v_order_id, null, 'Pendente', p_user_id, 'Encomenda criada pelo cliente');

  -- Notificação ao cliente
  perform public.create_notification(
    p_user_id,
    '🛍️ Pedido Criado',
    'O seu pedido ORD-' || lpad(v_order_id::text, 6, '0') || ' foi criado com sucesso! Aguardamos o seu comprovativo de pagamento.',
    'order',
    v_order_id
  );

  return v_order_id;
end;
$$;

-- ============================================================
-- 10. FUNÇÃO confirm_payment — Confirmar pagamento
-- ============================================================
create or replace function public.confirm_payment(
  p_order_id bigint,
  p_admin_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old_status  text;
  v_user_id     uuid;
  v_order_num   text;
begin
  -- Apenas admin
  if not public.is_admin() then
    raise exception 'Acesso negado.';
  end if;

  select status, user_id, order_number
    into v_old_status, v_user_id, v_order_num
    from public.orders
    where id = p_order_id;

  if not found then
    raise exception 'Encomenda não encontrada.';
  end if;

  -- Atualizar encomenda
  update public.orders
    set status            = 'Pagamento confirmado',
        payment_status    = 'confirmado',
        payment_confirmed_at = now(),
        updated_at        = now()
    where id = p_order_id;

  -- Atualizar comprovativo
  update public.payment_proofs
    set status      = 'aprovado',
        reviewed_by = p_admin_id,
        reviewed_at = now()
    where order_id = p_order_id and status = 'pendente';

  -- Histórico
  insert into public.order_status_history (order_id, old_status, new_status, changed_by, notes)
  values (p_order_id, v_old_status, 'Pagamento confirmado', p_admin_id, 'Pagamento confirmado pelo administrador');

  -- Notificação ao cliente
  if v_user_id is not null then
    perform public.create_notification(
      v_user_id,
      '✅ Pagamento Confirmado',
      'O seu pagamento para o pedido ' || coalesce(v_order_num, '#' || p_order_id::text) || ' foi confirmado! A sua encomenda está a ser preparada.',
      'success',
      p_order_id
    );
  end if;

  return true;
end;
$$;

-- ============================================================
-- 11. FUNÇÃO reject_payment — Rejeitar pagamento
-- ============================================================
create or replace function public.reject_payment(
  p_order_id bigint,
  p_admin_id uuid,
  p_reason   text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old_status text;
  v_user_id    uuid;
  v_order_num  text;
begin
  if not public.is_admin() then
    raise exception 'Acesso negado.';
  end if;

  select status, user_id, order_number
    into v_old_status, v_user_id, v_order_num
    from public.orders
    where id = p_order_id;

  if not found then
    raise exception 'Encomenda não encontrada.';
  end if;

  update public.orders
    set status         = 'Pagamento rejeitado',
        payment_status = 'rejeitado',
        updated_at     = now()
    where id = p_order_id;

  update public.payment_proofs
    set status           = 'rejeitado',
        rejection_reason = p_reason,
        reviewed_by      = p_admin_id,
        reviewed_at      = now()
    where order_id = p_order_id and status = 'pendente';

  insert into public.order_status_history (order_id, old_status, new_status, changed_by, notes)
  values (p_order_id, v_old_status, 'Pagamento rejeitado', p_admin_id,
          'Motivo: ' || coalesce(p_reason, 'Não especificado'));

  if v_user_id is not null then
    perform public.create_notification(
      v_user_id,
      '❌ Pagamento Rejeitado',
      'O comprovativo do pedido ' || coalesce(v_order_num, '#' || p_order_id::text) ||
        ' foi rejeitado. Motivo: ' || coalesce(p_reason, 'Não especificado') ||
        '. Por favor, envie um novo comprovativo.',
      'error',
      p_order_id
    );
  end if;

  return true;
end;
$$;

-- ============================================================
-- 12. FUNÇÃO update_order_status — Atualizar estado com histórico
-- ============================================================
create or replace function public.update_order_status(
  p_order_id   bigint,
  p_new_status text,
  p_admin_id   uuid,
  p_notes      text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old_status text;
  v_user_id    uuid;
  v_order_num  text;
  v_notif_title   text;
  v_notif_message text;
  v_notif_type    text := 'info';
begin
  if not public.is_admin() then
    raise exception 'Acesso negado.';
  end if;

  select status, user_id, order_number
    into v_old_status, v_user_id, v_order_num
    from public.orders
    where id = p_order_id;

  if not found then
    raise exception 'Encomenda não encontrada.';
  end if;

  -- Atualizar datas específicas conforme estado
  update public.orders
    set status     = p_new_status,
        updated_at = now(),
        prepared_at  = case when p_new_status = 'Em preparação'       then now() else prepared_at  end,
        shipped_at   = case when p_new_status = 'Em entrega'          then now() else shipped_at   end,
        delivered_at = case when p_new_status = 'Entregue'            then now() else delivered_at end
    where id = p_order_id;

  insert into public.order_status_history (order_id, old_status, new_status, changed_by, notes)
  values (p_order_id, v_old_status, p_new_status, p_admin_id, p_notes);

  -- Notificações por estado
  if p_new_status = 'Em preparação' then
    v_notif_title   := '📦 Em Preparação';
    v_notif_message := 'O seu pedido ' || coalesce(v_order_num, '#' || p_order_id::text) || ' está a ser preparado!';
    v_notif_type    := 'info';
  elsif p_new_status = 'Pronto para entrega' then
    v_notif_title   := '🚀 Pronto para Entrega';
    v_notif_message := 'O seu pedido ' || coalesce(v_order_num, '#' || p_order_id::text) || ' está pronto e será entregue em breve!';
    v_notif_type    := 'success';
  elsif p_new_status = 'Em entrega' then
    v_notif_title   := '🚚 Em Entrega';
    v_notif_message := 'O seu pedido ' || coalesce(v_order_num, '#' || p_order_id::text) || ' está a caminho!';
    v_notif_type    := 'info';
  elsif p_new_status = 'Entregue' then
    v_notif_title   := '🎉 Entregue!';
    v_notif_message := 'O seu pedido ' || coalesce(v_order_num, '#' || p_order_id::text) || ' foi entregue. Obrigado pela sua compra!';
    v_notif_type    := 'success';
  elsif p_new_status = 'Cancelado' then
    v_notif_title   := '🚫 Pedido Cancelado';
    v_notif_message := 'O seu pedido ' || coalesce(v_order_num, '#' || p_order_id::text) ||
                       case when p_notes is not null then '. Motivo: ' || p_notes else '' end;
    v_notif_type    := 'error';
  end if;

  if v_notif_title is not null and v_user_id is not null then
    perform public.create_notification(v_user_id, v_notif_title, v_notif_message, v_notif_type, p_order_id);
  end if;

  return true;
end;
$$;

-- ============================================================
-- 13. FUNÇÃO submit_payment_proof — Registar comprovativo
-- ============================================================
create or replace function public.submit_payment_proof(
  p_order_id      bigint,
  p_bank_name     text,
  p_amount        numeric,
  p_transfer_date date,
  p_reference     text,
  p_file_url      text
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id   uuid := auth.uid();
  v_order_num text;
  v_proof_id  bigint;
begin
  -- Verificar que a encomenda pertence ao utilizador
  select order_number into v_order_num
    from public.orders
    where id = p_order_id and user_id = v_user_id;

  if not found then
    raise exception 'Encomenda não encontrada.';
  end if;

  -- Inserir comprovativo
  insert into public.payment_proofs (
    order_id, user_id, bank_name, amount, transfer_date, reference, file_url, status
  )
  values (
    p_order_id, v_user_id, p_bank_name, p_amount, p_transfer_date,
    p_reference, p_file_url, 'pendente'
  )
  returning id into v_proof_id;

  -- Atualizar estado da encomenda
  update public.orders
    set status         = 'Comprovativo enviado',
        payment_status = 'comprovativo_enviado',
        updated_at     = now()
    where id = p_order_id;

  -- Histórico
  insert into public.order_status_history (order_id, old_status, new_status, changed_by, notes)
  values (p_order_id, 'Pendente', 'Comprovativo enviado', v_user_id, 'Comprovativo de transferência submetido pelo cliente');

  -- Notificação ao cliente
  perform public.create_notification(
    v_user_id,
    '📎 Comprovativo Enviado',
    'O seu comprovativo de pagamento para o pedido ' || coalesce(v_order_num, '#' || p_order_id::text) ||
      ' foi recebido. Aguarde a confirmação.',
    'info',
    p_order_id
  );

  return v_proof_id;
end;
$$;

-- ============================================================
-- 14. FUNÇÃO add_stock_entry — Entrada manual de stock (admin)
-- ============================================================
create or replace function public.add_stock_entry(
  p_product_id bigint,
  p_quantity   int,
  p_reason     text,
  p_admin_id   uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_stock_before int;
begin
  if not public.is_admin() then
    raise exception 'Acesso negado.';
  end if;

  select stock into v_stock_before
    from public.products
    where id = p_product_id
    for update;

  if not found then
    raise exception 'Produto não encontrado.';
  end if;

  update public.products
    set stock = stock + p_quantity,
        updated_at = now()
    where id = p_product_id;

  insert into public.inventory_movements (
    product_id, type, quantity, stock_before, stock_after,
    reason, performed_by
  )
  values (
    p_product_id, 'entrada', p_quantity,
    v_stock_before, v_stock_before + p_quantity,
    coalesce(p_reason, 'Entrada manual de stock'),
    p_admin_id
  );

  return true;
end;
$$;

-- ============================================================
-- 15. FUNÇÃO get_dashboard_stats — KPIs completos
-- ============================================================
create or replace function public.get_dashboard_stats()
returns json
language sql
security definer
set search_path = public
as $$
  select json_build_object(
    -- Vendas
    'total_sales',              coalesce((select sum(total) from public.orders where status in ('Pagamento confirmado', 'Em preparação', 'Pronto para entrega', 'Em entrega', 'Entregue')), 0),
    'total_orders',             (select count(*) from public.orders),
    -- Por estado
    'pending_orders',           (select count(*) from public.orders where status = 'Pendente'),
    'awaiting_proof',           (select count(*) from public.orders where status = 'Pendente' and payment_method = 'transfer'),
    'proof_sent',               (select count(*) from public.orders where status = 'Comprovativo enviado'),
    'payment_confirmed',        (select count(*) from public.orders where payment_status = 'confirmado'),
    'in_preparation',           (select count(*) from public.orders where status = 'Em preparação'),
    'ready_for_delivery',       (select count(*) from public.orders where status = 'Pronto para entrega'),
    'in_delivery',              (select count(*) from public.orders where status = 'Em entrega'),
    'delivered',                (select count(*) from public.orders where status = 'Entregue'),
    'cancelled',                (select count(*) from public.orders where status = 'Cancelado'),
    -- Pagamentos
    'awaiting_payment_confirm', (select count(*) from public.orders where payment_status = 'comprovativo_enviado'),
    -- Produtos
    'active_products',          (select count(*) from public.products where active = true),
    'low_stock_products',       (select count(*) from public.products where active = true and stock > 0 and stock <= 5),
    'out_of_stock_products',    (select count(*) from public.products where active = true and stock = 0),
    -- Clientes
    'total_customers',          (select count(*) from public.profiles where role = 'cliente'),
    -- Inventário
    'total_stock_in',           coalesce((select sum(quantity) from public.inventory_movements where type = 'entrada'), 0),
    'total_stock_out',          coalesce((select sum(quantity) from public.inventory_movements where type = 'saida'), 0)
  );
$$;

-- Manter get_store_stats compatível com código existente
create or replace function public.get_store_stats()
returns json
language sql
security definer
set search_path = public
as $$
  select json_build_object(
    'total_sales',     coalesce((select sum(total) from public.orders where status in ('Pagamento confirmado','Em preparação','Pronto para entrega','Em entrega','Entregue')), 0),
    'active_products', (select count(*) from public.products where active = true),
    'pending_orders',  (select count(*) from public.orders where status = 'Pendente'),
    'total_customers', (select count(*) from public.profiles)
  );
$$;

-- ============================================================
-- 16. ÍNDICES EXTRAS
-- ============================================================
create index if not exists orders_payment_status_idx on public.orders(payment_status);
create index if not exists orders_number_idx         on public.orders(order_number);
create index if not exists products_stock_idx        on public.products(stock);

-- ============================================================
-- 17. GRANT EXECUTE nas funções
-- ============================================================
grant execute on function public.create_order           to authenticated;
grant execute on function public.submit_payment_proof   to authenticated;
grant execute on function public.confirm_payment        to authenticated;
grant execute on function public.reject_payment         to authenticated;
grant execute on function public.update_order_status    to authenticated;
grant execute on function public.add_stock_entry        to authenticated;
grant execute on function public.get_dashboard_stats    to authenticated;
grant execute on function public.get_store_stats        to authenticated, anon;
grant execute on function public.create_notification    to authenticated;
