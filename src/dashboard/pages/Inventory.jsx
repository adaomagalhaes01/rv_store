import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Plus, Search, Filter, History, 
  ArrowUpRight, ArrowDownRight, AlertCircle, X
} from 'lucide-react';
import useAdminStore from '../stores/useAdminStore';
import toast from 'react-hot-toast';

const AddStockModal = ({ isOpen, onClose, product, onConfirm }) => {
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('Entrada de fornecedor');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
      toast.error('Introduza uma quantidade válida');
      return;
    }
    setLoading(true);
    const { ok, error } = await onConfirm(product.id, Number(quantity), reason);
    setLoading(false);
    if (ok) {
      toast.success('Stock adicionado com sucesso');
      onClose();
    } else {
      toast.error(error?.message || 'Erro ao adicionar stock');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-neutral-dark/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-[2rem] shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-neutral-light flex justify-between items-center">
          <h3 className="text-xl font-bold">Adicionar Stock</h3>
          <button onClick={onClose} className="p-2 hover:bg-neutral-light/50 rounded-full transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-neutral-light/20 rounded-xl border border-neutral-light">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white shrink-0">
              {product?.image ? <img src={product.image} className="w-full h-full object-cover" /> : <Package />}
            </div>
            <div>
              <p className="font-bold text-sm">{product?.name}</p>
              <p className="text-xs text-neutral-dark/40">Stock Atual: {product?.stock}</p>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-neutral-dark/40 uppercase tracking-wider mb-2 block">Quantidade a Adicionar</label>
            <input type="number" min="1" required value={quantity} onChange={e => setQuantity(e.target.value)}
              className="w-full bg-neutral-light/30 border border-neutral-light rounded-xl px-4 py-3 outline-none focus:border-primary/50" />
          </div>
          <div>
            <label className="text-xs font-bold text-neutral-dark/40 uppercase tracking-wider mb-2 block">Motivo / Origem</label>
            <input type="text" required value={reason} onChange={e => setReason(e.target.value)}
              className="w-full bg-neutral-light/30 border border-neutral-light rounded-xl px-4 py-3 outline-none focus:border-primary/50" />
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-neutral-light text-neutral-dark font-bold rounded-xl">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 flex justify-center items-center">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Confirmar'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const Inventory = () => {
  const { inventory, products, loadInventory, addStockEntry } = useAdminStore();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('histórico'); // histórico, alertas
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadInventory().then(() => setLoading(false));
  }, []);

  const lowStockProducts = products.filter(p => p.stock <= 5);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  const filteredHistory = inventory.filter(i => 
    i.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (i.reason && i.reason.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Gestão de Inventário</h1>
          <p className="text-neutral-dark/40">Controlo de entradas e saídas de stock</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-6 border border-neutral-light shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center"><AlertCircle size={24} /></div>
            <div>
              <p className="text-sm font-bold text-neutral-dark/40">Esgotados</p>
              <h3 className="text-2xl font-black">{outOfStockProducts.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-neutral-light shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center"><Package size={24} /></div>
            <div>
              <p className="text-sm font-bold text-neutral-dark/40">Stock Baixo (&lt;= 5)</p>
              <h3 className="text-2xl font-black">{lowStockProducts.length}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button onClick={() => setActiveTab('histórico')} className={`px-6 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'histórico' ? 'bg-primary text-white shadow-sm shadow-primary/20' : 'bg-white border border-neutral-light text-neutral-dark/60 hover:border-primary/30'}`}>
          Histórico de Movimentos
        </button>
        <button onClick={() => setActiveTab('alertas')} className={`px-6 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 ${activeTab === 'alertas' ? 'bg-primary text-white shadow-sm shadow-primary/20' : 'bg-white border border-neutral-light text-neutral-dark/60 hover:border-primary/30'}`}>
          Alertas de Stock
          {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
            <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] ${activeTab === 'alertas' ? 'bg-white/20' : 'bg-red-500 text-white'}`}>
              {lowStockProducts.length + outOfStockProducts.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'histórico' ? (
        <div className="bg-white rounded-3xl border border-neutral-light shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-light flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-dark/40" size={18} />
              <input type="text" placeholder="Procurar produto ou motivo..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-neutral-light/30 border border-transparent rounded-xl focus:bg-white focus:border-primary/20 outline-none transition-all text-sm" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-light/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-dark/40 uppercase">Data</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-dark/40 uppercase">Produto</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-dark/40 uppercase">Tipo</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-neutral-dark/40 uppercase">Qtd</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-neutral-dark/40 uppercase">Stock Resultante</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-dark/40 uppercase">Motivo</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-dark/40 uppercase">Operador</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-light">
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-10"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"/></td></tr>
                ) : filteredHistory.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-10 text-neutral-dark/40">Nenhum movimento encontrado.</td></tr>
                ) : filteredHistory.map(mov => (
                  <tr key={mov.id} className="hover:bg-neutral-light/10">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark/60">{new Date(mov.createdAt).toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' })}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-neutral-light/50 overflow-hidden shrink-0">
                          {mov.productImage && <img src={mov.productImage} className="w-full h-full object-cover" />}
                        </div>
                        <span className="text-sm font-bold truncate max-w-[200px]" title={mov.productName}>{mov.productName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {mov.type === 'entrada' 
                        ? <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-xs font-bold"><ArrowUpRight size={14}/> Entrada</span>
                        : <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-md text-xs font-bold"><ArrowDownRight size={14}/> Saída</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold">
                      {mov.type === 'entrada' ? '+' : '-'}{mov.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-neutral-dark/50">
                      {mov.stockAfter}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-dark/60 truncate max-w-[200px]" title={mov.reason}>{mov.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark/60">{mov.performedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-neutral-light shadow-sm p-6">
          <h3 className="text-lg font-bold mb-6">Produtos a precisar de atenção</h3>
          {lowStockProducts.length === 0 && outOfStockProducts.length === 0 ? (
            <div className="text-center py-10">
              <Package size={40} className="mx-auto text-emerald-200 mb-4" />
              <p className="font-bold text-emerald-600">O stock está regularizado.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {[...outOfStockProducts, ...lowStockProducts].map(p => (
                <div key={p.id} className="flex items-center justify-between p-4 bg-neutral-light/20 rounded-2xl border border-neutral-light">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white overflow-hidden shrink-0 border border-neutral-light">
                      <img src={p.image} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{p.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                          {p.stock === 0 ? 'ESGOTADO' : 'STOCK BAIXO'}
                        </span>
                        <span className="text-xs text-neutral-dark/50 font-bold">{p.stock} unidades</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => { setSelectedProduct(p); setIsAddModalOpen(true); }} className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors rounded-xl text-xs font-bold flex items-center gap-2">
                    <Plus size={14} /> Adicionar Stock
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        <AddStockModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} product={selectedProduct} onConfirm={addStockEntry} />
      </AnimatePresence>
    </div>
  );
};

export default Inventory;
