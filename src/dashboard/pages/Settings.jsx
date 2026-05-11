import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Lock, 
  Bell, 
  Globe, 
  Shield, 
  CreditCard,
  Mail,
  Camera,
  Save,
  ChevronRight
} from 'lucide-react';
import useAdminStore from '../stores/useAdminStore';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useAdminStore();
  const [activeSection, setActiveSection] = useState('profile');

  const sections = [
    { id: 'profile', label: 'Meu Perfil', icon: User },
    { id: 'security', label: 'Segurança', icon: Lock },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'store', label: 'Loja', icon: Globe },
    { id: 'payments', label: 'Pagamentos', icon: CreditCard },
  ];

  const handleSave = () => {
    toast.success('Configurações salvas com sucesso!', {
      style: { borderRadius: '12px', background: '#333', color: '#fff' },
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
        <p className="text-gray-400 text-sm mt-1">Gerencie sua conta e as preferências da loja.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-64 space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm transition-all ${
                activeSection === section.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 font-bold' 
                  : 'text-gray-500 hover:bg-white hover:text-gray-800 border border-transparent hover:border-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <section.icon size={18} />
                <span>{section.label}</span>
              </div>
              <ChevronRight size={14} className={activeSection === section.id ? 'opacity-100' : 'opacity-0'} />
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {activeSection === 'profile' && (
            <div className="p-8 space-y-8">
              <div className="flex items-center space-x-6 pb-8 border-b border-gray-50">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-50 bg-secondary flex items-center justify-center text-primary text-3xl font-bold">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg border-2 border-white hover:scale-110 transition-transform">
                    <Camera size={14} />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{user?.name || 'Administrador'}</h3>
                  <p className="text-sm text-gray-400">{user?.role || 'Super Admin'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
                  <input 
                    type="text" 
                    defaultValue={user?.name}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Corporativo</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="email" 
                      defaultValue="admin@rvstore.com"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Telefone</label>
                  <input 
                    type="tel" 
                    defaultValue="+244 923 000 000"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Idioma</label>
                  <select className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none appearance-none">
                    <option>Português (AO)</option>
                    <option>English</option>
                  </select>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={handleSave}
                  className="flex items-center space-x-2 text-white py-4 px-8 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
                  style={{ background: 'linear-gradient(135deg, #ff8fa3, #ff4d6d)' }}
                >
                  <Save size={18} />
                  <span>Guardar Alterações</span>
                </button>
              </div>
            </div>
          )}

          {activeSection !== 'profile' && (
            <div className="p-20 text-center space-y-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                <Shield size={32} />
              </div>
              <div>
                <h3 className="text-gray-800 font-bold">Funcionalidade Avançada</h3>
                <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">Esta seção de configurações está sendo preparada para a próxima atualização do sistema.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
