-- RV_Store | Seed de dados iniciais
-- ===================================================================
-- Utilizador administrador
-- ===================================================================
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, last_sign_in_at, confirmation_sent_at
)
select
  '00000000-0000-0000-0000-000000000000',
  extensions.gen_random_uuid(),
  'authenticated', 'authenticated',
  'adaomagalhaes793@gmail.com',
  extensions.crypt('admin123', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Administrador"}',
  now(), now(), now(), now()
where not exists (
  select 1 from auth.users where email = 'adaomagalhaes793@gmail.com'
);

insert into public.profiles (id, full_name, role, status)
select id, 'Administrador', 'admin', 'ativo'
from auth.users
where email = 'adaomagalhaes793@gmail.com'
on conflict (id) do nothing;

-- ===================================================================
-- Categorias
-- ===================================================================
insert into public.categories (name, slug, image_url, position) values
  ('Masculino', 'masculino', '/assets/camisa-azul-1.png', 1),
  ('Feminino', 'feminino', '/assets/vestido-rosa-1.png', 2),
  ('Cosméticos', 'cosmeticos', '/assets/perfume-1.png', 3),
  ('Calçados', 'calcados', '/assets/tenis-1.png', 4),
  ('Acessórios', 'acessorios', '/assets/bolsa-1.png', 5)
on conflict (slug) do nothing;

-- ===================================================================
-- Produtos
-- ===================================================================
insert into public.products (
  name, slug, description, category, sub_category, category_id,
  price, original_price, rating, images, sizes, colors, size_stock,
  stock, sales, is_featured, on_sale, discount_coupon
) values
  (
    'Vestido Elegante Rosa', 'vestido-elegante-rosa',
    'Um vestido elegante e moderno para ocasiões especiais.',
    'Feminino', 'Vestidos', 2, 25000, 35000, 4.8,
    array['/assets/vestido-rosa-1.png'], array['P','M','G'], array['Rosa','Branco'],
    '{"P":5,"M":8,"G":5}', 18, 45, true, true, 'PROMO20'
  ),
  (
    'Camisa Casual Masculina', 'camisa-casual-masculina',
    'Camisa casual de algodão, perfeita para o dia a dia.',
    'Masculino', 'Camisas', 1, 15000, 15000, 4.5,
    array['/assets/camisa-azul-1.png'], array['M','G','GG'], array['Azul','Preto'],
    '{"M":6,"G":6,"GG":4}', 16, 12, true, false, null
  ),
  (
    'Perfume Elegance', 'perfume-elegance',
    'Fragrância sofisticada com notas florais e amadeiradas.',
    'Cosméticos', 'Perfumes', 3, 45000, 50000, 4.9,
    array['/assets/perfume-1.png'], array['50ml','100ml'], array[]::text[],
    '{"50ml":10,"100ml":6}', 16, 88, true, true, 'PROMO20'
  ),
  (
    'Tênis Runner Pro', 'tenis-runner-pro',
    'Tênis de alta performance para corrida e treinos.',
    'Calçados', 'Tênis', 4, 35000, 35000, 4.7,
    array['/assets/tenis-1.png'], array['38','39','40','41','42'],
    array['Preto','Branco','Cinza'],
    '{"38":4,"39":4,"40":6,"41":4,"42":4}', 22, 20, false, false, null
  ),
  (
    'Bolsa de Couro Premium', 'bolsa-de-couro-premium',
    'Bolsa em couro legítimo com acabamento premium.',
    'Acessórios', 'Bolsas', 5, 55000, 65000, 5.0,
    array['/assets/bolsa-1.png'], array['Único'], array['Caramelo','Preto'],
    '{"Único":8}', 8, 30, true, true, 'PROMO20'
  ),
  (
    'Kit Skincare Hydra', 'kit-skincare-hydra',
    'Kit completo para hidratação e cuidado da pele.',
    'Cosméticos', 'Cuidado Facial', 3, 12000, 12000, 4.6,
    array['/assets/skincare-1.png'], array['Kit'], array[]::text[],
    '{"Kit":12}', 12, 35, false, false, null
  )
on conflict (slug) do nothing;

-- ===================================================================
-- Banners
-- ===================================================================
insert into public.banners (title, subtitle, link, image_url, active, position) values
  (
    'Coleção de Verão', 'Até 50% de Desconto', '/category/feminino',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070',
    true, 1
  ),
  (
    'Nova Linha de Cosméticos', 'Beleza Natural', '/category/cosmeticos',
    'https://images.unsplash.com/photo-1596462502278-27bfac4033c8?q=80&w=2080',
    true, 2
  ),
  (
    'Calçados Premium', 'Estilo em cada passo', '/category/calcados',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012',
    false, 3
  )
on conflict do nothing;

-- ===================================================================
-- Cupões
-- ===================================================================
insert into public.coupons (code, discount_type, discount_value, max_uses, active) values
  ('RVNEW', 'percent', 10, 1000, true),
  ('PROMO20', 'percent', 20, 500, true),
  ('FREEGIFT', 'fixed', 5000, 200, true)
on conflict (code) do nothing;