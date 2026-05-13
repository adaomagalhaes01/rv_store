import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Image as ImageIcon, 
  X, 
  Eye, 
  AlertCircle,
  Package,
  ShoppingCart,
  TrendingUp,
  Tag,
  UploadCloud
} from 'lucide-react';
import useAdminStore from '../stores/useAdminStore';
import toast from 'react-hot-toast';

const Products = () => {
  const { products, deleteProduct, addProduct, updateProduct } = useAdminStore();
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: '', category: 'Femininas', price: '', stock: '', image: ''
  });

  const categories = ['Todas', 'Femininas', 'Masculinas', 'Cosméticos', 'Calçados'];

  const handleImageChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas arquivos de imagem.');
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      if (isEdit) {
        setSelectedProduct({ ...selectedProduct, image: imageUrl });
      } else {
        setNewProduct({ ...newProduct, image: imageUrl });
      }
      toast.success('Imagem carregada com sucesso!');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      toast.error('Preencha os campos obrigatórios.');
      return;
    }
    addProduct({
      ...newProduct,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      image: newProduct.image || '/assets/perfume-1.png'
    });
    setIsModalOpen(false);
    setNewProduct({ name: '', category: 'Femininas', price: '', stock: '', image: '' });
    toast.success('Produto adicionado com sucesso!');
  };

  const handleEditProduct = (e) => {
    e.preventDefault();
    updateProduct(selectedProduct.id, {
      ...selectedProduct,
      price: Number(selectedProduct.price),
      stock: Number(selectedProduct.stock)
    });
    setIsEditModalOpen(false);
    toast.success('Produto atualizado com sucesso!');
  };

  const confirmDelete = () => {
    deleteProduct(selectedProduct.id);
    setIsDeleteModalOpen(false);
    toast.success('Produto removido.');
  };

  const openViewModal = (product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct({ ...product });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Produtos</h1>
          <p className="text-gray-400 text-sm mt-1">Gerencie seu catálogo de produtos.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 text-white py-3 px-6 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
          style={{ background: 'linear-gradient(135deg, #ff8fa3, #ff4d6d)' }}
        >
          <Plus size={18} />
          <span>Novo Produto</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Pesquisar produto..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#f8f9fc] border border-gray-100 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold border-b border-gray-50">
                <th className="px-6 py-4 text-left">Produto</th>
                <th className="px-6 py-4 text-left">Categoria</th>
                <th className="px-6 py-4 text-left">Preço</th>
                <th className="px-6 py-4 text-left">Estoque</th>
                <th className="px-6 py-4 text-left">Vendas</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-11 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">{product.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">ID: #{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium px-3 py-1.5 bg-primary/10 text-primary rounded-lg">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-700">
                      {product.price.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${product.stock < 10 ? 'bg-red-400' : 'bg-emerald-400'}`}
                          style={{ width: `${Math.min((product.stock / 30) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-bold ${product.stock < 10 ? 'text-red-500' : 'text-gray-500'}`}>
                        {product.stock}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-medium">{product.sales}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-1">
                      <button 
                        onClick={() => openViewModal(product)}
                        className="p-2 hover:bg-blue-50 hover:text-blue-500 rounded-lg text-gray-400 transition-all"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => openEditModal(product)}
                        className="p-2 hover:bg-amber-50 hover:text-amber-500 rounded-lg text-gray-400 transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => openDeleteModal(product)}
                        className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg text-gray-400 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-5 border-t border-gray-50 flex items-center justify-between text-sm text-gray-400">
          <span>Mostrando <b className="text-gray-600">{filteredProducts.length}</b> de <b className="text-gray-600">{products.length}</b> produtos</span>
          <div className="flex items-center space-x-1">
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30" disabled>
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-xs font-bold">1</button>
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Novo Produto</h2>
                  <p className="text-gray-400 text-xs mt-0.5">Preencha as informações do produto.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                  <X size={18} />
                </button>
              </div>
              
              <form onSubmit={handleAddProduct} className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500">Nome do Produto</label>
                  <input 
                    type="text" required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="Ex: Camisa de Seda Premium"
                    className="w-full bg-[#f8f9fc] border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500">Categoria</label>
                    <select 
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full bg-[#f8f9fc] border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                    >
                      {categories.filter(c => c !== 'Todas').map(c => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500">Preço (AOA)</label>
                    <input 
                      type="number" required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      placeholder="0"
                      className="w-full bg-[#f8f9fc] border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500">Estoque</label>
                    <input 
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                      placeholder="0"
                      className="w-full bg-[#f8f9fc] border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500">Imagem</label>
                    <input 
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e)}
                    />
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full h-[46px] bg-[#f8f9fc] border-2 border-dashed ${newProduct.image ? 'border-primary/30 bg-primary/5' : 'border-gray-200'} rounded-xl flex items-center justify-center cursor-pointer hover:border-primary/30 transition-all overflow-hidden`}
                    >
                      {newProduct.image ? (
                        <div className="flex items-center space-x-2 w-full px-4">
                          <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-primary/20">
                            <img src={newProduct.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-[10px] text-primary font-bold uppercase truncate">Imagem Carregada</span>
                          <X 
                            size={14} 
                            className="text-primary/40 hover:text-primary ml-auto shrink-0" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setNewProduct({ ...newProduct, image: '' });
                            }} 
                          />
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-400 space-x-2">
                          <UploadCloud size={16} />
                          <span className="text-xs font-medium">Selecionar Imagem</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-4 border-t border-gray-50">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 font-semibold text-sm text-gray-500 hover:text-gray-700 bg-gray-50 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, #ff8fa3, #ff4d6d)' }}
                  >
                    Salvar Produto
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Product Modal */}
      <AnimatePresence>
        {isEditModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Editar Produto</h2>
                  <p className="text-gray-400 text-xs mt-0.5">Atualize as informações do produto.</p>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                  <X size={18} />
                </button>
              </div>
              
              <form onSubmit={handleEditProduct} className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500">Nome do Produto</label>
                  <input 
                    type="text" required
                    value={selectedProduct.name}
                    onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})}
                    className="w-full bg-[#f8f9fc] border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500">Categoria</label>
                    <select 
                      value={selectedProduct.category}
                      onChange={(e) => setSelectedProduct({...selectedProduct, category: e.target.value})}
                      className="w-full bg-[#f8f9fc] border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                    >
                      {categories.filter(c => c !== 'Todas').map(c => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500">Preço (AOA)</label>
                    <input 
                      type="number" required
                      value={selectedProduct.price}
                      onChange={(e) => setSelectedProduct({...selectedProduct, price: e.target.value})}
                      className="w-full bg-[#f8f9fc] border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500">Estoque</label>
                    <input 
                      type="number"
                      value={selectedProduct.stock}
                      onChange={(e) => setSelectedProduct({...selectedProduct, stock: e.target.value})}
                      className="w-full bg-[#f8f9fc] border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500">Imagem</label>
                    <input 
                      type="file"
                      ref={editFileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, true)}
                    />
                    <div 
                      onClick={() => editFileInputRef.current?.click()}
                      className="w-full bg-[#f8f9fc] border border-gray-100 rounded-xl p-3 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                        <img src={selectedProduct.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-600 font-bold">Trocar Imagem</span>
                        <span className="text-[10px] text-gray-400">Clique para selecionar</span>
                      </div>
                      <ImageIcon className="text-primary/40 ml-auto shrink-0" size={16} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-4 border-t border-gray-50">
                  <button 
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 py-3 font-semibold text-sm text-gray-500 hover:text-gray-700 bg-gray-50 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, #ff8fa3, #ff4d6d)' }}
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Product Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsViewModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
              {/* Product Image Section */}
              <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-50 relative">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setIsViewModalOpen(false)}
                  className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-800 shadow-lg md:hidden"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Product Info Section */}
              <div className="w-full md:w-1/2 p-8 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider rounded-full">
                    {selectedProduct.category}
                  </span>
                  <button onClick={() => setIsViewModalOpen(false)} className="hidden md:block text-gray-300 hover:text-gray-500 transition-colors">
                    <X size={20} />
                  </button>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-1">{selectedProduct.name}</h2>
                <p className="text-gray-400 text-xs font-medium mb-6">ID: #{selectedProduct.id}</p>

                <div className="text-3xl font-black text-gray-800 mb-8">
                  {selectedProduct.price.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center space-x-2 text-gray-400 mb-1">
                      <Package size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-tight">Estoque</span>
                    </div>
                    <p className={`text-lg font-bold ${selectedProduct.stock < 10 ? 'text-red-500' : 'text-gray-700'}`}>
                      {selectedProduct.stock} und.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center space-x-2 text-gray-400 mb-1">
                      <ShoppingCart size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-tight">Vendas</span>
                    </div>
                    <p className="text-lg font-bold text-gray-700">
                      {selectedProduct.sales} und.
                    </p>
                  </div>
                </div>

                <div className="mt-auto flex items-center space-x-3">
                  <button 
                    onClick={() => {
                      setIsViewModalOpen(false);
                      openEditModal(selectedProduct);
                    }}
                    className="flex-1 py-3 bg-gray-800 text-white text-xs font-bold rounded-xl hover:bg-gray-900 transition-all active:scale-95 shadow-lg shadow-gray-800/10 flex items-center justify-center space-x-2"
                  >
                    <Edit2 size={14} />
                    <span>Editar Produto</span>
                  </button>
                  <button 
                    onClick={() => {
                      setIsViewModalOpen(false);
                      openDeleteModal(selectedProduct);
                    }}
                    className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all active:scale-95"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedProduct && (
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
              <h2 className="text-xl font-bold text-gray-800 mb-2">Excluir Produto?</h2>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Tem certeza que deseja remover o produto <b>{selectedProduct.name}</b>? Esta ação não pode ser desfeita.
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

export default Products;
