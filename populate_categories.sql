-- Inserir as categorias padrão se a tabela estiver vazia
INSERT INTO public.categories (name, slug, image_url, description, position, active)
VALUES 
('Masculino', 'masculino', null, 'Moda masculina', 1, true),
('Feminino', 'feminino', null, 'Moda feminina', 2, true),
('Cosméticos', 'cosmeticos', null, 'Perfumes e cuæidados', 3, true),
('Calçados', 'calcados', null, 'Ténis e sapatos', 4, true)
ON CONFLICT (slug) DO NOTHING;
