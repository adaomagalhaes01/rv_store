import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ChevronLeft,
  ChevronRight,
  Download,
  X,
  Package,
  User,
  MapPin,
  CreditCard,
  ExternalLink,
  Printer
} from 'lucide-react';
import useAdminStore from '../stores/useAdminStore';
import toast from 'react-hot-toast';

const Orders = () => {
  const { orders, updateOrderStatus } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const tabs = ['Todos', 'Pendente', 'Pago', 'Enviado', 'Entregue'];

  const statusColors = {
    'Pago': { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500', icon: CheckCircle2 },
    'Pendente': { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500', icon: Clock },
    'Enviado': { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-500', icon: Truck },
    'Entregue': { bg: 'bg-primary/10', text: 'text-primary', dot: 'bg-primary', icon: Package }
  };

  const handleStatusChange = (id, currentStatus) => {
    const statuses = ['Pendente', 'Pago', 'Enviado', 'Entregue'];
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    updateOrderStatus(id, nextStatus);
    toast.success(`Pedido ${id} → ${nextStatus}`);
  };

  const filteredOrders = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        o.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTab = activeTab === 'Todos' || o.status === activeTab;
    return matchSearch && matchTab;
  });

  const openOrderDetails = (order) => {
    // Mock detailed data for the selected order
    const detailedOrder = {
      ...order,
      email: 'cliente@exemplo.com',
      phone: '923 456 789',
      address: 'Rua Principal, 123, Luanda, Angola',
      paymentMethod: 'Transferência Bancária',
      items: [
        { name: 'Vestido Rosa Premium', quantity: 1, price: 25000, image: '/assets/vestido-rosa-1.png' },
        { name: 'Perfume Noir Edition', quantity: 1, price: 32000, image: '/assets/perfume-1.png' },
      ],
      subtotal: 57000,
      shipping: 0,
    };
    setSelectedOrder(detailedOrder);
    setIsModalOpen(true);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      toast.success('Relatório exportado com sucesso!');
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pedidos</h1>
          <p className="text-gray-400 text-sm mt-1">Monitore e gerencie todas as vendas da plataforma.</p>
        </div>
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center space-x-2 bg-gray-800 text-white py-3 px-6 rounded-xl text-sm font-semibold hover:bg-gray-900 transition-all disabled:opacity-50"
        >
          {isExporting ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : (
            <Download size={16} />
          )}
          <span>{isExporting ? 'Exportando...' : 'Exportar Relatório'}</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar pedido ou cliente..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#f8f9fc] border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold border-b border-gray-50">
                <th className="px-6 py-4 text-left">Pedido</th>
                <th className="px-6 py-4 text-left">Cliente</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Data</th>
                <th className="px-6 py-4 text-left">Total</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map((order) => {
                const sc = statusColors[order.status] || statusColors['Pendente'];
                return (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-gray-700 uppercase">{order.id}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ background: 'linear-gradient(135deg, #ff8fa3, #ff4d6d)' }}>
                          {order.customer.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm text-gray-600 font-medium whitespace-nowrap">{order.customer}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <button 
                        onClick={() => handleStatusChange(order.id, order.status)}
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${sc.bg} ${sc.text} hover:brightness-95 transition-all shadow-sm shadow-black/5`}
                        title="Clique para avançar status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${sc.dot}`}></span>
                        {order.status}
                      </button>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-400 font-medium">{order.date}</td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-gray-700">
                        {order.total.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          onClick={() => openOrderDetails(order)}
                          className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-700 transition-all group" 
                          title="Ver Detalhes"
                        >
                          <Eye size={18} className="group-hover:scale-110 transition-transform" />
                        </button>
                        <button 
                          onClick={() => openOrderDetails(order)}
                          className="px-4 py-2 bg-gray-800 text-white text-[10px] font-bold rounded-lg hover:bg-gray-900 transition-all hover:scale-[1.02] active:scale-[0.98] tracking-widest uppercase"
                        >
                          Detalhes
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-300">
                      <Package size={48} className="mb-3 opacity-20" />
                      <p className="text-sm font-medium">Nenhum pedido encontrado.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-5 border-t border-gray-50 flex items-center justify-between text-sm text-gray-400">
          <span>Mostrando <b className="text-gray-600">{filteredOrders.length}</b> de <b className="text-gray-600">{orders.length}</b> registros</span>
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

      {/* Order Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedOrder && (
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
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0 bg-gray-50/50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-primary">
                    <Package size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">Pedido {selectedOrder.id}</h2>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-gray-400 text-xs font-medium">{selectedOrder.date}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${statusColors[selectedOrder.status]?.text || 'text-gray-500'}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors" title="Imprimir">
                    <Printer size={18} />
                  </button>
                  <button onClick={() => setIsModalOpen(false)} className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors">
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Info */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <User size={16} />
                      <span className="text-xs font-bold uppercase tracking-widest">Informações do Cliente</span>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                      <p className="text-sm font-bold text-gray-700">{selectedOrder.customer}</p>
                      <div className="mt-2 space-y-1.5">
                        <p className="text-xs text-gray-500 flex items-center space-x-2">
                          <span className="w-4">@</span>
                          <span>{selectedOrder.email}</span>
                        </p>
                        <p className="text-xs text-gray-500 flex items-center space-x-2">
                          <span className="w-4">📞</span>
                          <span>{selectedOrder.phone}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <MapPin size={16} />
                      <span className="text-xs font-bold uppercase tracking-widest">Endereço de Entrega</span>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {selectedOrder.address}
                      </p>
                      <button className="mt-3 text-xs text-primary font-bold flex items-center space-x-1 hover:underline">
                        <span>Ver no mapa</span>
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Package size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">Itens do Pedido</span>
                  </div>
                  <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className={`flex items-center justify-between p-4 bg-white ${idx !== selectedOrder.items.length - 1 ? 'border-b border-gray-50' : ''}`}>
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-700">{item.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Qtd: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-gray-700">
                          {(item.price * item.quantity).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment & Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <CreditCard size={16} />
                      <span className="text-xs font-bold uppercase tracking-widest">Pagamento</span>
                    </div>
                    <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm">
                          <CreditCard size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-700">{selectedOrder.paymentMethod}</p>
                          <p className="text-[10px] text-primary font-bold uppercase mt-0.5 tracking-tighter">Confirmado</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-3">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Subtotal</span>
                      <span>{selectedOrder.subtotal.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Envio</span>
                      <span className="text-emerald-600 font-bold">Grátis</span>
                    </div>
                    <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-800">Total</span>
                      <span className="text-lg font-black text-primary">
                        {selectedOrder.total.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-100 bg-gray-50/50 shrink-0 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mudar Status:</p>
                  <div className="flex space-x-2">
                    {['Pendente', 'Pago', 'Enviado', 'Entregue'].map(status => (
                      <button 
                        key={status}
                        onClick={() => handleStatusChange(selectedOrder.id, status)}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${
                          selectedOrder.status === status 
                            ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105' 
                            : 'bg-white text-gray-400 border border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 bg-gray-800 text-white text-xs font-bold rounded-xl hover:bg-gray-900 transition-all active:scale-95 shadow-lg shadow-gray-800/10"
                >
                  Concluir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
