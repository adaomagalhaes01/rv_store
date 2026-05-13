import { AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Image as ImageIcon, 
  Settings, 
  LogOut,
  X,
  HelpCircle
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAdminStore from '../stores/useAdminStore';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, stats } = useAdminStore();

  const mainMenu = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: ShoppingBag, label: 'Produtos', path: '/admin/products', badge: stats.activeProducts },
    { icon: Package, label: 'Pedidos', path: '/admin/orders', badge: stats.pendingOrders },
    { icon: Users, label: 'Usuários', path: '/admin/users' },
    { icon: ImageIcon, label: 'Banners', path: '/admin/banners' },
  ];

  const bottomMenu = [
    { icon: Settings, label: 'Configurações', path: '/admin/settings' },
    { icon: HelpCircle, label: 'Ajuda', path: '/admin/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-sm"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-100 z-50 transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center px-7 border-b border-gray-50 shrink-0">
          <Link to="/admin" className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ff8fa3, #ff4d6d)' }}>
              <span className="text-white font-bold text-sm">RV</span>
            </div>
            <span className="text-lg font-bold text-neutral-dark tracking-tight">RV Store</span>
          </Link>
          <button onClick={onClose} className="lg:hidden ml-auto text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 px-4 pt-6 space-y-1 overflow-y-auto">
          {mainMenu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all group ${
                isActive(item.path) 
                  ? 'bg-primary/10 text-primary font-semibold' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon size={18} strokeWidth={isActive(item.path) ? 2.5 : 1.8} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isActive(item.path) ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom Menu */}
        <div className="px-4 pb-4 pt-2 border-t border-gray-50 space-y-1 shrink-0">
          {bottomMenu.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={onClose}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition-all ${
                isActive(item.path) 
                  ? 'bg-primary/10 text-primary font-semibold' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <item.icon size={18} strokeWidth={1.8} />
              <span>{item.label}</span>
            </Link>
          ))}
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-50 hover:text-red-500 transition-all w-full"
          >
            <LogOut size={18} strokeWidth={1.8} />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
