import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, ShoppingBag, DollarSign, Package, Clock, 
  CheckCircle2, AlertCircle, FileText, ArrowUpRight, Truck
} from 'lucide-react';
import useAdminStore from '../stores/useAdminStore';

const StatCard = ({ title, value, icon: Icon, colorClass, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-3xl p-6 border border-neutral-light shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
  >
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500 ${colorClass.bg}`} />
    
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div>
        <p className="text-xs font-bold text-neutral-dark/40 uppercase tracking-wider mb-2">{title}</p>
        <h3 className="text-3xl font-black text-neutral-dark">{value}</h3>
        {subtitle && <p className="text-xs font-bold text-neutral-dark/60 mt-1">{subtitle}</p>}
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${colorClass.bg} ${colorClass.text}`}>
        <Icon size={24} />
      </div>
    </div>
  </motion.div>
);

const Overview = () => {
  const { stats, loadStats } = useAdminStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats().then(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 pb-20">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-neutral-dark/40">Visão geral do desempenho da sua loja</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Faturação Confirmada"
          value={stats.totalSales}
          icon={DollarSign}
          colorClass={{ bg: 'bg-emerald-100', text: 'text-emerald-600' }}
        />
        <StatCard
          title="Pedidos Pendentes"
          value={stats.pendingOrders}
          subtitle={`${stats.proofSent} aguardam análise`}
          icon={Clock}
          colorClass={{ bg: 'bg-amber-100', text: 'text-amber-600' }}
        />
        <StatCard
          title="Produtos Ativos"
          value={stats.activeProducts}
          subtitle={`${stats.lowStockProducts + stats.outOfStockProducts} com stock crítico`}
          icon={ShoppingBag}
          colorClass={{ bg: 'bg-primary/20', text: 'text-primary' }}
        />
        <StatCard
          title="Clientes"
          value={stats.totalCustomers}
          icon={Users}
          colorClass={{ bg: 'bg-indigo-100', text: 'text-indigo-600' }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-neutral-light shadow-sm">
          <h2 className="text-lg font-bold mb-6">Estado das Encomendas Ativas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center">
              <FileText className="text-blue-500 mb-2" size={24}/>
              <span className="text-2xl font-black">{stats.proofSent}</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase mt-1">Comprovativos</span>
            </div>
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex flex-col items-center justify-center text-center">
              <Package className="text-orange-500 mb-2" size={24}/>
              <span className="text-2xl font-black">{stats.inPreparation}</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase mt-1">Em Preparação</span>
            </div>
            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex flex-col items-center justify-center text-center">
              <Truck className="text-indigo-500 mb-2" size={24}/>
              <span className="text-2xl font-black">{stats.inDelivery}</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase mt-1">Em Entrega</span>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col items-center justify-center text-center">
              <CheckCircle2 className="text-emerald-500 mb-2" size={24}/>
              <span className="text-2xl font-black">{stats.delivered}</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase mt-1">Entregues</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-neutral-light shadow-sm">
          <h2 className="text-lg font-bold mb-6">Stock & Inventário</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-red-50 text-red-700 rounded-xl font-bold text-sm">
              <span className="flex items-center gap-2"><AlertCircle size={16}/> Produtos Esgotados</span>
              <span>{stats.outOfStockProducts}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 text-amber-700 rounded-xl font-bold text-sm">
              <span className="flex items-center gap-2"><Package size={16}/> Stock Baixo (≤5)</span>
              <span>{stats.lowStockProducts}</span>
            </div>
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Total Entradas</span>
                <span className="font-bold text-gray-800">{stats.totalStockIn} unid.</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Total Saídas</span>
                <span className="font-bold text-gray-800">{stats.totalStockOut} unid.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
