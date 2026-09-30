import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tag, Star, Percent, Search, Edit2, Trash2, X, Eye, EyeOff,
  Image as ImageIcon, UploadCloud, ChevronDown, AlertCircle
} from 'lucide-react';
import useAdminStore from '../stores/useAdminStore';
import { uploadImage } from '../../lib/storage';
import toast from 'react-hot-toast';

// ─── Helpers ────────────────────────────────────────────────────────
const CATEGORIES = ['Feminino', 'Masculino', 'Cosméticos', 'Calçados'];

const emptyForm = {
  name: '', category: 'Feminino', price: '', originalPrice: '',
  description: '', image: '', onSale: true, isFeatured: false,
  stock: '', colors: '', discountCoupon: '',
};

export default function Promotions() {
  const { products, loadProducts, updateProduct } = useAdminStore();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all'); // 'all' | 'onSale' | 'featured'
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    if (tab === 'onSale') return matchSearch && p.onSale;
    if (tab === 'featured') return matchSearch && p.isFeatured;
    return matchSearch && (p.onSale || p.isFeatured);
  });

  const openEdit = (p) => {
    setEditingProduct({
      ...p,
      originalPrice: p.originalPrice || '',
      image: p.image || '',
      colors: Array.isArray(p.colors) ? p.colors : p.colors || '',
    });
    setIsEditModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    toast.loading('A fazer upload...', { id: 'imgup' });
    try {
      const url = await uploadImage(file, 'products');
      setEditingProduct(prev => ({ ...prev, image: url }));
      toast.success('Imagem carregada!', { id: 'imgup' });
    } catch {
      toast.error('Erro ao fazer upload.', { id: 'imgup' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const { ok, error } = await updateProduct(editingProduct.id, editingProduct);
    if (!ok) { toast.error(error?.message || 'Erro ao guardar.'); return; }
    toast.success('Produto actualizado!');
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  const toggleOnSale = async (p) => {
    const { ok, error } = await updateProduct(p.id, { ...p, onSale: !p.onSale });
    if (!ok) toast.error(error?.message || 'Erro.');
    else toast.success(p.onSale ? 'Removido das promoções.' : 'Adicionado às promoções!');
  };

  const toggleFeatured = async (p) => {
    const { ok, error } = await updateProduct(p.id, { ...p, isFeatured: !p.isFeatured });
    if (!ok) toast.error(error?.message || 'Erro.');
    else toast.success(p.isFeatured ? 'Removido dos destaques.' : 'Adicionado aos destaques!');
  };

  const inputCls = 'w-full bg-[#f8f9fc] border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Promoções & Destaques</h1>
          <p className="text-sm text-gray-400 mt-1">
            Gerencie quais produtos aparecem em <span className="font-semibold text-primary">Promoções</span> e em <span className="font-semibold text-purple-600">Destaques</span> no site.
          </p>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total de Produtos', value: products.length, color: 'bg-gray-100 text-gray-700' },
          { label: 'Em Promoção', value: products.filter(p => p.onSale).length, color: 'bg-amber-100 text-amber-700' },
          { label: 'Em Destaque', value: products.filter(p => p.isFeatured).length, color: 'bg-purple-100 text-purple-700' },
          { label: 'Ambos', value: products.filter(p => p.onSale && p.isFeatured).length, color: 'bg-primary/10 text-primary' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-2xl p-4 ${color}`}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs font-semibold mt-1 opacity-70">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex rounded-xl bg-gray-100 p-1 gap-1">
          {[
            { key: 'all', label: 'Todos' },
            { key: 'onSale', label: '🏷 Em Promoção' },
            { key: 'featured', label: '⭐ Destaques' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                tab === t.key ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-0 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Pesquisar produto..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold border-b border-gray-50">
                <th className="px-6 py-4 text-left">Produto</th>
                <th className="px-6 py-4 text-left">Categoria</th>
                <th className="px-6 py-4 text-left">Preço</th>
                <th className="px-6 py-4 text-center">Em Promoção</th>
                <th className="px-6 py-4 text-center">Destaque</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400">
                    <AlertCircle size={32} className="mx-auto mb-3 opacity-30" />
                    <p>Nenhum produto encontrado.</p>
                    <p className="text-xs mt-1">Edita um produto na página de Produtos e activa "Em Promoção" ou "Destaque".</p>
                  </td>
                </tr>
              ) : filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                        <img src={p.image || '/assets/perfume-1.png'} alt={p.name} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 line-clamp-1">{p.name}</p>
                        <p className="text-[10px] text-gray-400">ID #{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium px-3 py-1 bg-primary/10 text-primary rounded-lg">{p.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-700">
                      {Number(p.price).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleOnSale(p)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        p.onSale
                          ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                          : 'bg-gray-100 text-gray-400 hover:bg-amber-50 hover:text-amber-600'
                      }`}
                    >
                      {p.onSale ? <><Eye size={12}/> Ativo</> : <><EyeOff size={12}/> Inativo</>}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleFeatured(p)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        p.isFeatured
                          ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                          : 'bg-gray-100 text-gray-400 hover:bg-purple-50 hover:text-purple-600'
                      }`}
                    >
                      <Star size={12} fill={p.isFeatured ? 'currentColor' : 'none'} />
                      {p.isFeatured ? 'Ativo' : 'Inativo'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => openEdit(p)}
                      className="p-2 text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-primary/5"
                    >
                      <Edit2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-3xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Editar Promoção</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Nome do Produto</label>
                  <input type="text" value={editingProduct.name} onChange={e => setEditingProduct(p => ({...p, name: e.target.value}))} className={inputCls} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Preço Actual (AOA)</label>
                    <input type="number" value={editingProduct.price} onChange={e => setEditingProduct(p => ({...p, price: e.target.value}))} className={inputCls} required />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Preço Original (opcional)</label>
                    <input type="number" value={editingProduct.originalPrice} onChange={e => setEditingProduct(p => ({...p, originalPrice: e.target.value}))} placeholder="Antes do desconto" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Categoria</label>
                  <select value={editingProduct.category} onChange={e => setEditingProduct(p => ({...p, category: e.target.value}))} className={inputCls}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Imagem</label>
                  <label className={`w-full flex items-center gap-3 cursor-pointer px-4 py-3 bg-gray-50 border-2 border-dashed ${editingProduct.image ? 'border-primary/30' : 'border-gray-200'} rounded-xl hover:border-primary/40 transition-all`}>
                    <UploadCloud size={18} className="text-primary/50 shrink-0" />
                    <span className="text-sm text-gray-500 truncate">{editingProduct.image ? 'Imagem carregada — clique para trocar' : 'Clique para fazer upload'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                  {editingProduct.image && <img src={editingProduct.image} alt="preview" className="mt-2 h-24 rounded-xl object-contain border border-gray-200 bg-white w-full" />}
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Cupom de Desconto</label>
                  <input type="text" value={editingProduct.discountCoupon} onChange={e => setEditingProduct(p => ({...p, discountCoupon: e.target.value}))} placeholder="Ex: PROMO20" className={`${inputCls} uppercase`} />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-gray-100 hover:bg-amber-50 transition">
                    <input type="checkbox" checked={editingProduct.onSale} onChange={e => setEditingProduct(p => ({...p, onSale: e.target.checked}))} className="w-4 h-4 text-amber-500 rounded" />
                    <span className="text-sm font-semibold text-gray-700">🏷 Em Promoção</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-gray-100 hover:bg-purple-50 transition">
                    <input type="checkbox" checked={editingProduct.isFeatured} onChange={e => setEditingProduct(p => ({...p, isFeatured: e.target.checked}))} className="w-4 h-4 text-purple-500 rounded" />
                    <span className="text-sm font-semibold text-gray-700">⭐ Em Destaque</span>
                  </label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition">Cancelar</button>
                  <button type="submit" className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-accent transition">Guardar</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
