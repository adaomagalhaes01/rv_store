import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  MoreVertical,
  Shield,
  User,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock users data
  const users = [
    { id: 1, name: 'Ana Silva', email: 'ana.silva@example.com', phone: '923 000 111', role: 'Cliente', joined: '2026-01-15', status: 'Ativo' },
    { id: 2, name: 'Carlos Bento', email: 'carlos.b@example.com', phone: '912 333 444', role: 'Cliente', joined: '2026-02-10', status: 'Ativo' },
    { id: 3, name: 'Maria Joana', email: 'm.joana@example.com', phone: '944 555 666', role: 'Admin', joined: '2025-11-20', status: 'Ativo' },
    { id: 4, name: 'João Paulo', email: 'jp.lima@example.com', phone: '933 222 111', role: 'Cliente', joined: '2026-03-05', status: 'Suspenso' },
    { id: 5, name: 'Beatriz Costa', email: 'bea.costa@example.com', phone: '922 888 777', role: 'Cliente', joined: '2026-04-12', status: 'Ativo' },
  ];

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (name) => {
    if (window.confirm(`Tem certeza que deseja remover ${name}?`)) {
      toast.success(`Usuário ${name} removido.`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestão de Usuários</h1>
          <p className="text-gray-400 text-sm mt-1">Gerencie clientes e administradores da plataforma.</p>
        </div>
        <button className="flex items-center space-x-2 text-white py-3 px-6 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-xl transition-all" style={{ background: 'linear-gradient(135deg, #ff8fa3, #ff4d6d)' }}>
          <User size={18} />
          <span>Novo Usuário</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#f8f9fc] border border-gray-100 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2.5 bg-gray-50 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-100 transition-all border border-gray-100">
              <Filter size={16} />
              <span>Filtros</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold border-b border-gray-50">
                <th className="px-6 py-4 text-left">Usuário</th>
                <th className="px-6 py-4 text-left">Função</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Membro desde</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #ff8fa3, #ff4d6d)' }}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">{user.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {user.role === 'Admin' ? (
                        <Shield size={14} className="text-primary" />
                      ) : (
                        <User size={14} className="text-gray-400" />
                      )}
                      <span className="text-xs font-medium text-gray-600">{user.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      user.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        user.status === 'Ativo' ? 'bg-emerald-500' : 'bg-red-500'
                      }`}></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <Calendar size={14} />
                      <span>{user.joined}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-primary transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.name)}
                        className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-5 border-t border-gray-50 flex items-center justify-between text-sm text-gray-400">
          <span>Mostrando {filteredUsers.length} de {users.length} registros</span>
          <div className="flex items-center space-x-1">
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30" disabled>
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-xs font-bold">1</button>
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
