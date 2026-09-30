import { supabase } from './supabase';

const FIELDS = [
  'id',
  'name',
  'description',
  'category',
  'subCategory:sub_category',
  'price',
  'originalPrice:original_price',
  'rating',
  'images',
  'sizes',
  'colors',
  'stock',
  'sales',
  'isFeatured:is_featured',
  'onSale:on_sale',
  'createdAt:created_at',
].join(',');

const normalize = (p) => {
  if (!p) return p;
  return {
    ...p,
    id: Number(p.id),
    price: Number(p.price) || 0,
    originalPrice: Number(p.originalPrice) || Number(p.price) || 0,
    rating: p.rating != null ? Number(p.rating) : 0,
    stock: p.stock != null ? Number(p.stock) : 0,
    sales: p.sales != null ? Number(p.sales) : 0,
    isFeatured: Boolean(p.isFeatured),
    onSale: Boolean(p.onSale),
  };
};

const single = (row) => (row ? normalize(row) : null);

export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(FIELDS)
    .order('id');
  if (error) throw error;
  return (data || []).map(normalize);
}

export async function fetchFeatured(limit = 8) {
  const { data, error } = await supabase
    .from('products')
    .select(FIELDS)
    .eq('is_featured', true)
    .order('id')
    .limit(limit);
  if (error) throw error;
  return (data || []).map(normalize);
}

export async function fetchOnSale() {
  const { data, error } = await supabase
    .from('products')
    .select(FIELDS)
    .eq('on_sale', true)
    .order('id');
  if (error) throw error;
  return (data || []).map(normalize);
}

export async function fetchByCategory(category) {
  let query = supabase.from('products').select(FIELDS);
  if (category && category !== 'todos') {
    query = query.ilike('category', category);
  }
  const { data, error } = await query.order('id');
  if (error) throw error;
  return (data || []).map(normalize);
}

export async function fetchProduct(id) {
  const { data, error } = await supabase
    .from('products')
    .select(FIELDS)
    .eq('id', Number(id))
    .single();
  if (error) throw error;
  return single(data);
}

export async function searchProducts(query) {
  const q = `%${query}%`;
  const { data, error } = await supabase
    .from('products')
    .select(FIELDS)
    .or(`name.ilike.${q},category.ilike.${q},description.ilike.${q}`)
    .order('id')
    .limit(5);
  if (error) throw error;
  return (data || []).map(normalize);
}

export async function fetchBanners() {
  const { data, error } = await supabase
    .from('banners')
    .select('id,title,subtitle,link,image_url:image,active,position')
    .eq('active', true)
    .order('position');
  if (error) throw error;
  return data || [];
}