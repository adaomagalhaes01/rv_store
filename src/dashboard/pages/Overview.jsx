import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Package, 
  Users, 
  ShoppingCart,
  ArrowUpRight, 
  ArrowDownRight,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react';
import useAdminStore from '../stores/useAdminStore';

const Overview = () => {
  const { stats, orders, products } = useAdminStore();

  const statCards = [
    { 
      title: 'Vendas Totais', 
      value: stats.totalSales, 
      sub: 'Este Mês',
      trend: '+12%',
      trendUp: true,
      gradient: 'linear-gradient(135deg, #ff8fa3, #ff4d6d)',
      icon: TrendingUp
    },
    { 
      title: 'Pedidos', 
      value: stats.pendingOrders, 
      sub: 'Pendentes',
      trend: '-3%',
      trendUp: false,
      gradient: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
      icon: ShoppingCart
    },
    { 
      title: 'Clientes', 
      value: stats.totalCustomers, 
      sub: 'Registrados',
      trend: '+8%',
      trendUp: true,
      gradient: 'linear-gradient(135deg, #f97316, #ef4444)',
      icon: Users
    },
    { 
      title: 'Produtos', 
      value: stats.activeProducts, 
      sub: 'Ativos',
      trend: '+5%',
      trendUp: true,
      gradient: 'linear-gradient(135deg, #34d399, #059669)',
      icon: Package
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Visão Geral</h1>
          <p className="text-gray-400 text-sm mt-1">Bem-vindo de volta! Aqui está o resumo da sua loja.</p>
        </div>
        <div className="flex items-center space-x-3">
          <select className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:ring-2 focus:ring-primary/20 outline-none">
            <option>Hoje</option>
            <option>Esta Semana</option>
            <option>Este Mês</option>
          </select>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((card, index) => (
          <motion.div 
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="rounded-2xl p-6 text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            style={{ background: card.gradient }}
          >
            {/* Decorative circle */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-2 right-4 opacity-10">
              <card.icon size={60} />
            </div>
            
            <p className="text-white/80 text-sm font-medium mb-3">{card.title}</p>
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-3xl font-bold tracking-tight">{card.value}</h3>
                <p className="text-white/60 text-xs mt-1">{card.sub}</p>
              </div>
              <span className={`flex items-center space-x-1 text-xs font-bold px-2 py-1 rounded-lg ${card.trendUp ? 'bg-white/20' : 'bg-white/20'}`}>
                {card.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                <span>{card.trend}</span>
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-gray-800">Pedidos Recentes</h3>
            <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full font-medium">{orders.length} pedidos</span>
          </div>
          <Link to="/admin/orders" className="text-primary text-sm font-semibold hover:underline">
            Ver Todos →
          </Link>
        </div>

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
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-700">{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: 'linear-gradient(135deg, #ff8fa3, #ff4d6d)' }}>
                        {order.customer.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">{order.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.status === 'Pago' ? 'bg-emerald-50 text-emerald-600' : 
                      order.status === 'Pendente' ? 'bg-amber-50 text-amber-600' : 
                      order.status === 'Enviado' ? 'bg-blue-50 text-blue-600' :
                      'bg-primary/10 text-primary'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        order.status === 'Pago' ? 'bg-emerald-500' : 
                        order.status === 'Pendente' ? 'bg-amber-500' : 
                        order.status === 'Enviado' ? 'bg-blue-500' :
                        'bg-primary'
                      }`}></span>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{order.date}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-700">
                      {order.total.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="px-4 py-2 bg-gray-800 text-white text-xs font-semibold rounded-lg hover:bg-gray-900 transition-colors">
                      VER DETALHES
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-5 border-t border-gray-50 flex items-center justify-between text-sm text-gray-400">
          <span>Mostrando {orders.length} de {orders.length} registros</span>
          <div className="flex items-center space-x-1">
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30" disabled>
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-xs font-bold">1</button>
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-xs transition-colors">2</button>
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
