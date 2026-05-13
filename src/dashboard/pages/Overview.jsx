import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
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
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  ArrowRight,
  Star,
  Award,
  Zap,
  X
} from 'lucide-react';
import useAdminStore from '../stores/useAdminStore';

const Overview = () => {
  const { stats, orders, products } = useAdminStore();
  const navigate = useNavigate();
  const [chartType, setChartType] = useState('bar'); // 'bar' or 'line'

  const statCards = [
    { 
      title: 'Vendas Totais', 
      value: stats.totalSales, 
      sub: 'Este Mês',
      trend: '+12%',
      trendUp: true,
      gradient: 'linear-gradient(135deg, #ff8fa3, #ff4d6d)',
      icon: TrendingUp,
      path: '/admin/orders'
    },
    { 
      title: 'Pedidos', 
      value: stats.pendingOrders, 
      sub: 'Pendentes',
      trend: '-3%',
      trendUp: false,
      gradient: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
      icon: ShoppingCart,
      path: '/admin/orders'
    },
    { 
      title: 'Clientes', 
      value: stats.totalCustomers, 
      sub: 'Registrados',
      trend: '+8%',
      trendUp: true,
      gradient: 'linear-gradient(135deg, #f97316, #ef4444)',
      icon: Users,
      path: '/admin/users'
    },
    { 
      title: 'Produtos', 
      value: stats.activeProducts, 
      sub: 'Ativos',
      trend: '+5%',
      trendUp: true,
      gradient: 'linear-gradient(135deg, #34d399, #059669)',
      icon: Package,
      path: '/admin/products'
    },
  ];

  // Custom Chart Data
  const chartData = [45, 70, 55, 85, 60, 95, 75, 100, 80, 110, 90, 120];
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Visão Geral</h1>
          <p className="text-gray-400 text-sm mt-1">Bem-vindo de volta! Aqui está o resumo da sua loja.</p>
        </div>
        <div className="flex items-center space-x-3">
          <select className="bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:ring-2 focus:ring-primary/20 outline-none shadow-sm transition-all hover:border-primary/20">
            <option>Hoje</option>
            <option>Esta Semana</option>
            <option>Este Mês</option>
          </select>
          <button className="hidden sm:flex items-center space-x-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-gray-900/10 hover:bg-gray-800 transition-all">
            <Zap size={16} className="text-amber-400 fill-amber-400" />
            <span>Gerar Relatório</span>
          </button>
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
            onClick={() => navigate(card.path)}
            className="rounded-2xl p-6 text-white relative overflow-hidden cursor-pointer hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
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
              <span className={`flex items-center space-x-1 text-xs font-bold px-2 py-1 rounded-lg ${card.trendUp ? 'bg-emerald-400/30' : 'bg-red-400/30'}`}>
                {card.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                <span>{card.trend}</span>
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Balanço Geral de Vendas</h3>
              <p className="text-gray-400 text-xs mt-1">Comparativo de faturamento mensal acumulado</p>
            </div>
            <div className="flex items-center bg-gray-50 p-1.5 rounded-xl border border-gray-100">
              <button 
                onClick={() => setChartType('bar')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${chartType === 'bar' ? 'bg-white shadow-sm text-gray-700' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Barra
              </button>
              <button 
                onClick={() => setChartType('line')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${chartType === 'line' ? 'bg-white shadow-sm text-gray-700' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Linha
              </button>
            </div>
          </div>

          <div className="relative h-64 w-full">
            {chartType === 'bar' ? (
              <div className="h-full w-full flex items-end justify-between space-x-2 px-2">
                {chartData.map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <div className="bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap">
                        Kz {val * 1000}
                      </div>
                    </div>
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${(val / 120) * 100}%` }}
                      transition={{ delay: i * 0.05, duration: 0.8, ease: "easeOut" }}
                      className="w-full max-w-[40px] rounded-t-lg transition-all duration-300 group-hover:opacity-80"
                      style={{ 
                        background: i % 2 === 0 ? 'linear-gradient(to top, #ff8fa3, #ff4d6d)' : 'linear-gradient(to top, #fecdd3, #fb7185)' 
                      }}
                    />
                    <span className="text-[10px] font-bold text-gray-400 uppercase mt-4 shrink-0">{months[i]}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full w-full">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 200">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff4d6d" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#ff4d6d" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                    <line key={i} x1="0" y1={p * 200} x2="1000" y2={p * 200} stroke="#f1f5f9" strokeWidth="1" />
                  ))}

                  {/* Area */}
                  <motion.path
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    d={`M 0,200 ${chartData.map((val, i) => `L ${(i * 1000) / 11},${200 - (val / 120) * 200}`).join(' ')} L 1000,200 Z`}
                    fill="url(#chartGradient)"
                  />

                  {/* Line */}
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    d={`M 0,${200 - (chartData[0] / 120) * 200} ${chartData.map((val, i) => `L ${(i * 1000) / 11},${200 - (val / 120) * 200}`).join(' ')}`}
                    fill="none"
                    stroke="#ff4d6d"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Dots */}
                  {chartData.map((val, i) => (
                    <motion.circle
                      key={i}
                      initial={{ r: 0 }}
                      animate={{ r: 4 }}
                      transition={{ delay: i * 0.1 }}
                      cx={(i * 1000) / 11}
                      cy={200 - (val / 120) * 200}
                      fill="white"
                      stroke="#ff4d6d"
                      strokeWidth="2"
                    />
                  ))}
                </svg>
                <div className="flex justify-between mt-6 px-1">
                  {months.map(m => (
                    <span key={m} className="text-[10px] font-bold text-gray-400 uppercase">{m}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top Performance Side Column */}
        <div className="space-y-6">
          {/* Top Products */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-800">Mais Vendidos</h3>
              <Star className="text-amber-400 fill-amber-400" size={18} />
            </div>
            <div className="space-y-5">
              {products.slice(0, 3).map((product, i) => (
                <div key={product.id} className="flex items-center space-x-3">
                  <div className="w-12 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                    <img src={product.image} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-700 truncate">{product.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-gray-800">{product.sales}</p>
                    <p className="text-[10px] text-emerald-500 font-bold">Vendas</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigate('/admin/products')}
              className="w-full mt-6 py-2.5 bg-gray-50 text-gray-500 text-xs font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 border border-gray-100"
            >
              <span>Ver Catálogo Completo</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Top Category */}
          <div className="bg-gray-900 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl transition-all duration-500 group-hover:scale-150"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 text-primary mb-3">
                <Award size={18} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Melhor Categoria</span>
              </div>
              <h4 className="text-2xl font-black text-white">Moda Feminina</h4>
              <p className="text-white/50 text-xs mt-1">Representa 42% do faturamento total da loja.</p>
              
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-white font-bold text-lg">1.2k</p>
                  <p className="text-[10px] text-white/40 font-bold uppercase">Vendas</p>
                </div>
                <div className="flex items-center text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded-lg">
                  <Zap size={12} className="mr-1 fill-emerald-400" />
                  <span>+15%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <ShoppingCart size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Últimos Pedidos</h3>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{orders.length} Transações Recentes</p>
            </div>
          </div>
          <Link 
            to="/admin/orders" 
            className="px-6 py-2.5 bg-gray-50 text-gray-500 text-xs font-bold rounded-xl hover:bg-gray-100 transition-all flex items-center space-x-2 border border-gray-100 shadow-sm"
          >
            <span>Gerenciar Todos</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-gray-400 font-bold border-b border-gray-50">
                <th className="px-8 py-5 text-left">Pedido</th>
                <th className="px-8 py-5 text-left">Cliente</th>
                <th className="px-8 py-5 text-left">Status</th>
                <th className="px-8 py-5 text-left">Data</th>
                <th className="px-8 py-5 text-left">Total</th>
                <th className="px-8 py-5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-gray-800">#{order.id}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[11px] font-black group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg, #ff8fa3, #ff4d6d)' }}>
                        {order.customer.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm text-gray-700 font-bold">{order.customer}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      order.status === 'Pago' ? 'bg-emerald-50 text-emerald-600' : 
                      order.status === 'Pendente' ? 'bg-amber-50 text-amber-600' : 
                      order.status === 'Enviado' ? 'bg-blue-50 text-blue-600' :
                      'bg-primary/10 text-primary'
                    }`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        order.status === 'Pago' ? 'bg-emerald-500' : 
                        order.status === 'Pendente' ? 'bg-amber-500' : 
                        order.status === 'Enviado' ? 'bg-blue-500' :
                        'bg-primary'
                      }`}></span>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-gray-500 font-medium">{order.date}</td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-black text-gray-800">
                      {order.total.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <button 
                      onClick={() => navigate('/admin/orders')}
                      className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary hover:border-primary/20 transition-all shadow-sm"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-50 bg-gray-50/30 flex items-center justify-center">
          <button 
            onClick={() => navigate('/admin/orders')}
            className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors"
          >
            Visualizar Log Completo de Transações
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview;
