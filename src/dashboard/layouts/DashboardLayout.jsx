import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Menu, Bell, Search, ChevronDown } from 'lucide-react';
import useAdminStore from '../stores/useAdminStore';

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, user } = useAdminStore();

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
            <button className="p-2.5 hover:bg-gray-50 rounded-xl transition-all relative">
              <Bell size={20} className="text-gray-500" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-white"></span>
            </button>

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
