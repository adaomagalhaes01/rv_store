import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Menu, Bell, Search, ChevronDown, ShoppingCart, Users, Package, CheckCircle2, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAdminStore from '../stores/useAdminStore';

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { isAuthenticated, user } = useAdminStore();

  const notifications = [
    { id: 1, text: 'Novo pedido recebido de Maria Silva', type: 'order', time: '5 min atrás', icon: ShoppingCart, color: '#ff4d6d' },
    { id: 2, text: 'Estoque baixo: Perfume de Rosas (3 unid.)', type: 'stock', time: '1 hora atrás', icon: Package, color: '#f97316' },
    { id: 3, text: 'Novo cliente registrado: João Paulo', type: 'user', time: '3 horas atrás', icon: Users, color: '#7c3aed' },
    { id: 4, text: 'Pagamento confirmado: Pedido #ORD-001', type: 'payment', time: '5 horas atrás', icon: CheckCircle2, color: '#059669' },
  ];

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Top Bar */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Menu size={22} className="text-gray-600" />
            </button>

            {/* Search */}
            <div className="hidden md:flex items-center bg-[#f8f9fc] rounded-xl px-4 py-2.5 w-80 border border-gray-100">
              <Search size={16} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2.5 placeholder-gray-400 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Notification */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 hover:bg-gray-50 rounded-xl transition-all relative"
              >
                <Bell size={20} className="text-gray-500" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-white"></span>
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="font-bold text-gray-800">Notificações</h3>
                        <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
                      </div>
                      <div className="max-h-[400px] overflow-y-auto">
                        {notifications.map(n => (
                          <div key={n.id} className="p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer flex space-x-3">
                            <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-white" style={{ backgroundColor: n.color }}>
                              <n.icon size={18} />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-700 leading-tight mb-1">{n.text}</p>
                              <div className="flex items-center text-[10px] text-gray-400">
                                <Clock size={10} className="mr-1" />
                                <span>{n.time}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="w-full py-3 text-xs font-bold text-primary hover:bg-primary/5 transition-colors border-t border-gray-50">
                        Ver todas as notificações
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-gray-100 mx-1"></div>

            {/* User */}
            <button className="flex items-center space-x-3 hover:bg-gray-50 rounded-xl px-3 py-2 transition-all">
              <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #ff8fa3, #ff4d6d)' }}>
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-gray-700 leading-none">{user?.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{user?.role}</p>
              </div>
              <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
