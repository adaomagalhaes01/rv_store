import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Image as ImageIcon, 
  Trash2, 
  Edit2, 
  Eye,
  X,
  ArrowRight,
  MoveUp,
  MoveDown
} from 'lucide-react';
import toast from 'react-hot-toast';

const Banners = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Mock banners data
  const [banners, setBanners] = useState([
    { id: 1, title: 'Coleção de Verão', subtitle: 'Até 50% de Desconto', link: '/category/femininas', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070', active: true },
    { id: 2, title: 'Nova Linha de Cosméticos', subtitle: 'Beleza Natural', link: '/category/cosmeticos', image: 'https://images.unsplash.com/photo-1596462502278-27bfac4033c8?q=80&w=2080', active: true },
    { id: 3, title: 'Calçados Premium', subtitle: 'Estilo em cada passo', link: '/category/calcados', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012', active: false },
  ]);

  const handleDelete = (id) => {
    if (window.confirm('Remover este banner?')) {
      setBanners(banners.filter(b => b.id !== id));
      toast.success('Banner removido com sucesso!');
    }
  };

  const toggleStatus = (id) => {
    setBanners(banners.map(b => b.id === id ? { ...b, active: !b.active } : b));
    toast.success('Status do banner atualizado.');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gerenciar Banners</h1>
          <p className="text-gray-400 text-sm mt-1">Configure os sliders e destaques da página inicial.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 text-white py-3 px-6 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-xl transition-all" 
          style={{ background: 'linear-gradient(135deg, #ff8fa3, #ff4d6d)' }}
        >
          <Plus size={18} />
          <span>Novo Banner</span>
        </button>
      </div>

      {/* Grid of Banners */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {banners.map((banner, index) => (
          <motion.div 
            key={banner.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col sm:flex-row"
          >
            {/* Banner Preview */}
            <div className="w-full sm:w-48 h-48 bg-gray-100 relative group overflow-hidden shrink-0">
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Eye className="text-white" size={24} />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    banner.active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {banner.active ? 'Ativo' : 'Inativo'}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
                      <MoveUp size={14} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
                      <MoveDown size={14} />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-gray-800 line-clamp-1">{banner.title}</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-1">{banner.subtitle}</p>
                <div className="flex items-center space-x-1 mt-3 text-[10px] font-medium text-primary">
                  <ImageIcon size={12} />
                  <span>Link: {banner.link}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => toggleStatus(banner.id)}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${
                      banner.active ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                    }`}
                  >
                    {banner.active ? 'Desativar' : 'Ativar'}
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-all">
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(banner.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {banners.length === 0 && (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-100 p-20 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
            <ImageIcon size={32} />
          </div>
          <h3 className="text-gray-400 font-medium">Nenhum banner configurado</h3>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-primary text-sm font-bold mt-4 hover:underline"
          >
            Adicionar o primeiro banner
          </button>
        </div>
      )}

      {/* Add Modal Placeholder */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Novo Banner</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5 text-center p-8 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50 cursor-pointer hover:border-primary/20 transition-all group">
                  <ImageIcon className="mx-auto text-gray-300 group-hover:text-primary transition-colors" size={32} />
                  <p className="text-xs text-gray-400">Clique para carregar imagem</p>
                </div>
                <input type="text" placeholder="Título do Banner" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                <input type="text" placeholder="Subtítulo / Promoção" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                <input type="text" placeholder="URL de Destino" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                <button 
                  className="w-full py-3 text-white font-bold rounded-xl mt-4 shadow-lg shadow-primary/20"
                  style={{ background: 'linear-gradient(135deg, #ff8fa3, #ff4d6d)' }}
                >
                  Salvar Banner
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Banners;
