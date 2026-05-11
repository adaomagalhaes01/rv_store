import { useState } from 'react';
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
  Eye
} from 'lucide-react';
import useAdminStore from '../stores/useAdminStore';
import toast from 'react-hot-toast';

const Products = () => {
  const { products, deleteProduct, addProduct } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', category: 'Femininas', price: '', stock: '', image: ''
  });

  const categories = ['Todas', 'Femininas', 'Masculinas', 'Cosméticos', 'Calçados'];

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
      image: '/assets/perfume-1.png'
    });
    setIsModalOpen(false);
    setNewProduct({ name: '', category: 'Femininas', price: '', stock: '', image: '' });
    toast.success('Produto adicionado com sucesso!');
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduct(id);
      toast.success('Produto removido.');
    }
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
                      <div className="w-11 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
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
                      <button className="p-2 hover:bg-blue-50 hover:text-blue-500 rounded-lg text-gray-400 transition-all">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 hover:bg-amber-50 hover:text-amber-500 rounded-lg text-gray-400 transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
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
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50">
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
                      className="w-full bg-[#f8f9fc] border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option>Femininas</option>
                      <option>Masculinas</option>
                      <option>Cosméticos</option>
                      <option>Calçados</option>
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
                    <div className="w-full bg-[#f8f9fc] border-2 border-dashed border-gray-200 rounded-xl p-3 flex items-center justify-center cursor-pointer hover:border-primary/30 transition-all">
                      <ImageIcon className="text-gray-300 mr-2" size={16} />
                      <span className="text-xs text-gray-400">Upload</span>
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
                    className="flex-1 py-3 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary/20"
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
    </div>
  );
};

export default Products;
