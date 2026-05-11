import { useState } from 'react';
import { 
  Search, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';
import useAdminStore from '../stores/useAdminStore';
import toast from 'react-hot-toast';

const Orders = () => {
  const { orders, updateOrderStatus } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Todos');

  const tabs = ['Todos', 'Pendente', 'Pago', 'Enviado', 'Entregue'];

  const statusColors = {
    'Pago': { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
    'Pendente': { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' },
    'Enviado': { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-500' },
    'Entregue': { bg: 'bg-primary/10', text: 'text-primary', dot: 'bg-primary' }
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pedidos</h1>
          <p className="text-gray-400 text-sm mt-1">Monitore e gerencie todas as vendas.</p>
        </div>
        <button className="flex items-center space-x-2 bg-gray-800 text-white py-3 px-6 rounded-xl text-sm font-semibold hover:bg-gray-900 transition-all">
          <Download size={16} />
          <span>Exportar</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0">
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
                      <span className="text-sm font-bold text-gray-700">{order.id}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: 'linear-gradient(135deg, #ff8fa3, #ff4d6d)' }}>
                          {order.customer.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm text-gray-600 font-medium">{order.customer}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <button 
                        onClick={() => handleStatusChange(order.id, order.status)}
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${sc.bg} ${sc.text} hover:brightness-95 transition-all`}
                        title="Clique para avançar status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${sc.dot}`}></span>
                        {order.status}
                      </button>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-400">{order.date}</td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-gray-700">
                        {order.total.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-all" title="Ver Detalhes">
                          <Eye size={16} />
                        </button>
                        <button className="px-4 py-2 bg-gray-800 text-white text-xs font-semibold rounded-lg hover:bg-gray-900 transition-colors">
                          VER DETALHES
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400 text-sm">
                    Nenhum pedido encontrado.
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
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
