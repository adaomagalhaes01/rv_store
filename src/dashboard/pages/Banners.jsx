import { useState, useRef } from 'react';
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
  MoveDown,
  UploadCloud,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

const Banners = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);
  
  // Mock banners data
  const [banners, setBanners] = useState([
    { id: 1, title: 'Coleção de Verão', subtitle: 'Até 50% de Desconto', link: '/category/femininas', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070', active: true },
    { id: 2, title: 'Nova Linha de Cosméticos', subtitle: 'Beleza Natural', link: '/category/cosmeticos', image: 'https://images.unsplash.com/photo-1596462502278-27bfac4033c8?q=80&w=2080', active: true },
    { id: 3, title: 'Calçados Premium', subtitle: 'Estilo em cada passo', link: '/category/calcados', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012', active: false },
  ]);

  const [newBanner, setNewBanner] = useState({
    title: '', subtitle: '', link: '', image: '', active: true
  });

  const handleImageChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas arquivos de imagem.');
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      if (isEdit) {
        setSelectedBanner({ ...selectedBanner, image: imageUrl });
      } else {
        setNewBanner({ ...newBanner, image: imageUrl });
      }
      toast.success('Imagem carregada com sucesso!');
    }
  };

  const handleAddBanner = () => {
    if (!newBanner.title || !newBanner.image) {
      toast.error('Preencha o título e selecione uma imagem.');
      return;
    }
    const bannerToAdd = {
      ...newBanner,
      id: Date.now()
    };
    setBanners([bannerToAdd, ...banners]);
    setIsModalOpen(false);
    setNewBanner({ title: '', subtitle: '', link: '', image: '', active: true });
    toast.success('Banner adicionado com sucesso!');
  };

  const handleEditBanner = () => {
    if (!selectedBanner.title || !selectedBanner.image) {
      toast.error('Preencha o título e selecione uma imagem.');
      return;
    }
    setBanners(banners.map(b => b.id === selectedBanner.id ? selectedBanner : b));
    setIsEditModalOpen(false);
    toast.success('Banner atualizado!');
  };

  const confirmDelete = () => {
    setBanners(banners.filter(b => b.id !== selectedBanner.id));
    setIsDeleteModalOpen(false);
    toast.success('Banner removido!');
  };

  const toggleStatus = (id) => {
    setBanners(banners.map(b => b.id === id ? { ...b, active: !b.active } : b));
    toast.success('Status do banner atualizado.');
  };

  const openViewModal = (banner) => {
    setSelectedBanner(banner);
    setIsViewModalOpen(true);
  };

  const openEditModal = (banner) => {
    setSelectedBanner({ ...banner });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (banner) => {
    setSelectedBanner(banner);
    setIsDeleteModalOpen(true);
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
            <div className="w-full sm:w-48 h-48 bg-gray-100 relative group overflow-hidden shrink-0 cursor-pointer" onClick={() => openViewModal(banner)}>
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
                  <span className="truncate max-w-[150px]">Link: {banner.link}</span>
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
                  <button 
                    onClick={() => openEditModal(banner)}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => openDeleteModal(banner)}
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

      {/* Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
              onClick={() => setIsModalOpen(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Novo Banner</h2>
                  <p className="text-gray-400 text-xs mt-0.5">Configure o destaque da página inicial.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500">Imagem do Banner</label>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative w-full h-40 bg-[#f8f9fc] border-2 border-dashed ${newBanner.image ? 'border-primary/30 bg-primary/5' : 'border-gray-200'} rounded-xl flex items-center justify-center cursor-pointer hover:border-primary/30 transition-all overflow-hidden group`}
                  >
                    {newBanner.image ? (
                      <>
                        <img src={newBanner.image} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                          <UploadCloud className="text-white" size={20} />
                          <span className="text-white text-xs font-bold">Trocar Imagem</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                          <UploadCloud className="text-primary" size={20} />
                        </div>
                        <p className="text-xs text-gray-400 font-medium">Clique para carregar imagem</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500">Título</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Coleção de Verão" 
                      value={newBanner.title}
                      onChange={(e) => setNewBanner({...newBanner, title: e.target.value})}
                      className="w-full bg-[#f8f9fc] border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500">Subtítulo</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Até 50% de Desconto" 
                      value={newBanner.subtitle}
                      onChange={(e) => setNewBanner({...newBanner, subtitle: e.target.value})}
                      className="w-full bg-[#f8f9fc] border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500">Link de Destino</label>
                    <input 
                      type="text" 
                      placeholder="Ex: /categoria/femininas" 
                      value={newBanner.link}
                      onChange={(e) => setNewBanner({...newBanner, link: e.target.value})}
                      className="w-full bg-[#f8f9fc] border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-4 border-t border-gray-50">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 font-semibold text-sm text-gray-500 hover:text-gray-700 bg-gray-50 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleAddBanner}
                    className="flex-1 py-3 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, #ff8fa3, #ff4d6d)' }}
                  >
                    Salvar Banner
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && selectedBanner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
              onClick={() => setIsEditModalOpen(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Editar Banner</h2>
                  <p className="text-gray-400 text-xs mt-0.5">Atualize as informações do banner.</p>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500">Imagem do Banner</label>
                  <input 
                    type="file"
                    ref={editFileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, true)}
                  />
                  <div 
                    onClick={() => editFileInputRef.current?.click()}
                    className="relative w-full h-40 bg-[#f8f9fc] border-2 border-dashed border-primary/30 bg-primary/5 rounded-xl flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all overflow-hidden group"
                  >
                    <img src={selectedBanner.image} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <UploadCloud className="text-white" size={20} />
                      <span className="text-white text-xs font-bold">Trocar Imagem</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500">Título</label>
                    <input 
                      type="text" 
                      value={selectedBanner.title}
                      onChange={(e) => setSelectedBanner({...selectedBanner, title: e.target.value})}
                      className="w-full bg-[#f8f9fc] border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500">Subtítulo</label>
                    <input 
                      type="text" 
                      value={selectedBanner.subtitle}
                      onChange={(e) => setSelectedBanner({...selectedBanner, subtitle: e.target.value})}
                      className="w-full bg-[#f8f9fc] border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500">Link de Destino</label>
                    <input 
                      type="text" 
                      value={selectedBanner.link}
                      onChange={(e) => setSelectedBanner({...selectedBanner, link: e.target.value})}
                      className="w-full bg-[#f8f9fc] border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-4 border-t border-gray-50">
                  <button 
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 py-3 font-semibold text-sm text-gray-500 hover:text-gray-700 bg-gray-50 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleEditBanner}
                    className="flex-1 py-3 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, #ff8fa3, #ff4d6d)' }}
                  >
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedBanner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md" 
              onClick={() => setIsViewModalOpen(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="relative aspect-[21/9] bg-gray-100">
                <img src={selectedBanner.image} alt={selectedBanner.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-10">
                  <div className="max-w-2xl">
                    <h2 className="text-4xl font-black text-white mb-2 leading-tight">{selectedBanner.title}</h2>
                    <p className="text-xl text-white/80 font-medium mb-6">{selectedBanner.subtitle}</p>
                    <div className="flex items-center space-x-4">
                      <span className="px-8 py-3 bg-white text-gray-900 rounded-full font-bold text-sm">Ver Coleção</span>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        selectedBanner.active ? 'bg-emerald-400 text-emerald-950' : 'bg-gray-400 text-gray-900'
                      }`}>
                        {selectedBanner.active ? 'No Ar' : 'Pausado'}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsViewModalOpen(false)}
                  className="absolute top-6 right-6 p-3 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">ID do Banner</p>
                    <p className="text-sm font-bold text-gray-800">#{selectedBanner.id}</p>
                  </div>
                  <div className="w-px h-8 bg-gray-200" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Link de Redirecionamento</p>
                    <div className="flex items-center space-x-2 text-primary font-bold text-sm">
                      <span>{selectedBanner.link}</span>
                      <ExternalLink size={14} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => {
                      setIsViewModalOpen(false);
                      openEditModal(selectedBanner);
                    }}
                    className="px-6 py-3 bg-gray-800 text-white rounded-xl text-sm font-bold hover:bg-gray-900 transition-all shadow-lg shadow-gray-800/10 flex items-center space-x-2"
                  >
                    <Edit2 size={16} />
                    <span>Editar</span>
                  </button>
                  <button 
                    onClick={() => {
                      setIsViewModalOpen(false);
                      openDeleteModal(selectedBanner);
                    }}
                    className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedBanner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden p-6 text-center"
            >
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Excluir Banner?</h2>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Tem certeza que deseja remover o banner <b>{selectedBanner.title}</b>? Esta ação não pode ser desfeita.
              </p>
              
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-3 font-semibold text-sm text-gray-500 hover:text-gray-700 bg-gray-50 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3 bg-red-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-red-500/20 transition-all hover:bg-red-600 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Confirmar
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
