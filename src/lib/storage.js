import { supabase } from './supabase';

export async function uploadImage(file, folder = 'products') {
  if (!file) return null;
  const ext = (file.name.split('.').pop() || 'png').toLowerCase();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  const { data: publicUrl } = supabase.storage
    .from('product-images')
    .getPublicUrl(data.path);
  return publicUrl.publicUrl;
}