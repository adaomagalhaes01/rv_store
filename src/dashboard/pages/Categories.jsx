import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Image as ImageIcon, Search, Eye, EyeOff, FileImage } from 'lucide-react';
import useAdminStore from '../stores/useAdminStore';
import { uploadImage } from '../../lib/storage';
import toast from 'react-hot-toast';

const Categories = () => {
  const { categories, loadCategories, addCategory, updateCategory, deleteCategory, toggleCategory } = useAdminStore();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    active: true,
  });

  useEffect(() => {
    loadCategories().then(() => setLoading(false));
  }, []);

  const openModal = (category = null) => {
    if (category) {
      setSelectedCategory(category);
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        image_url: category.image_url || '',
        active: category.active ?? true,
      });
    } else {
      setSelectedCategory(null);
      setFormData({ name: '', slug: '', description: '', image_url: '', active: true });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      toast.error('Preencha os campos obrigatórios (Nome e Slug)');
      return;
    }
    const action = selectedCategory ? updateCategory(selectedCategory.id, formData) : addCategory(formData);
    const { ok, error } = await action;
    if (ok) {
      toast.success(`Categoria ${selectedCategory ? 'atualizada' : 'criada'} com sucesso!`);
      setIsModalOpen(false);
    } else {
      toast.error(error.message || 'Ocorreu um erro.');
    }
  };

  const confirmDelete = async () => {
    const { ok, error } = await deleteCategory(selectedCategory.id);
    if (ok) {
      toast.success('Categoria removida.');
      setIsDeleteModalOpen(false);
    } else {
      toast.error(error.message || 'Erro ao remover.');
    }
  };

  const filtered = categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categorias</h1>
          <p className="text-gray-400 text-sm mt-1">Gira as categorias e fotos da página inicial.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center space-x-2 bg-primary text-white py-3 px-6 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all"
        >
          <Plus size={18} />
          <span>Nova Categoria</span>
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Pesquisar..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-primary outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase">Imagem</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase">Nome</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase">Slug</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-10">A carregar...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-10 text-gray-400">Nenhuma categoria encontrada.</td></tr>
              ) : filtered.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-6">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                      {cat.image_url ? (
                        <img src={cat.image_url} alt={cat.name} className="w-full h-full object-contain p-1" />
                      ) : (
                        <FileImage size={20} className="text-gray-400 m-auto mt-3" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-6 font-semibold text-gray-800">{cat.name}</td>
                  <td className="py-3 px-6 text-sm text-gray-500">{cat.slug}</td>
                  <td className="py-3 px-6">
                    <button 
                      onClick={() => toggleCategory(cat.id, cat.active)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold ${
                        cat.active ? 'bg-emerald-100 text-emerald-700 hover:bg-red-100 hover:text-red-700' : 'bg-gray-100 text-gray-500 hover:bg-emerald-100 hover:text-emerald-700'
                      }`}
                      title="Clique para alternar estado"
                    >
                      {cat.active ? <><Eye size={12}/> Visível</> : <><EyeOff size={12}/> Oculto</>}
                    </button>
                  </td>
                  <td className="py-3 px-6 text-right">
                    <button onClick={() => openModal(cat)} className="p-2 text-gray-400 hover:text-primary transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => { setSelectedCategory(cat); setIsDeleteModalOpen(true); }} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Criar/Editar */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-3xl shadow-xl w-full max-w-lg p-6">
              <h3 className="text-xl font-bold mb-6">{selectedCategory ? 'Editar Categoria' : 'Nova Categoria'}</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Nome</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value, slug: selectedCategory ? formData.slug : e.target.value.toLowerCase().replace(/\s+/g, '-')})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" required />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Slug (URL)</label>
                    <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" required />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Imagem da Categoria</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        toast.loading('A fazer upload da imagem...', { id: 'upload' });
                        try {
                          const url = await uploadImage(file, 'categories');
                          setFormData({...formData, image_url: url});
                          toast.success('Imagem carregada!', { id: 'upload' });
                        } catch (err) {
                          toast.error('Erro ao fazer upload.', { id: 'upload' });
                        }
                      }
                    }} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" 
                  />
                  {formData.image_url && <img src={formData.image_url} alt="Preview" className="mt-2 h-24 rounded-xl border border-gray-200 object-contain p-2 bg-white" />}
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Descrição (opcional)</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none resize-none h-24" />
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl">Cancelar</button>
                  <button type="submit" className="flex-1 py-3 bg-primary text-white font-bold rounded-xl">Salvar Categoria</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Apagar */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-3xl shadow-xl w-full max-w-sm p-6 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={24} /></div>
              <h3 className="text-xl font-bold mb-2">Remover Categoria?</h3>
              <p className="text-gray-500 text-sm mb-6">Esta ação apagará a categoria permanentemente. Os produtos associados poderão ficar sem categoria.</p>
              <div className="flex gap-3">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl">Cancelar</button>
                <button onClick={confirmDelete} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl">Remover</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Categories;
