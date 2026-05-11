import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAdminStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      
      // Mock Data
      products: [
        { id: 1, name: 'Vestido Rosa Premium', category: 'Femininas', price: 25000, stock: 15, sales: 45, image: '/assets/vestido-rosa-1.png' },
        { id: 2, name: 'Ténis Running Pro', category: 'Calçados', price: 45000, stock: 8, sales: 12, image: '/assets/tenis-1.png' },
        { id: 3, name: 'Perfume Noir Edition', category: 'Cosméticos', price: 32000, stock: 20, sales: 88, image: '/assets/perfume-1.png' },
      ],
      
      orders: [
        { id: '#ORD-7721', customer: 'Ana Silva', total: 57000, status: 'Pago', date: '2026-05-10' },
        { id: '#ORD-7722', customer: 'Carlos Bento', total: 32000, status: 'Pendente', date: '2026-05-11' },
        { id: '#ORD-7723', customer: 'Maria Joana', total: 45000, status: 'Enviado', date: '2026-05-11' },
      ],

      stats: {
        totalSales: '1.250.000 AOA',
        activeProducts: 42,
        pendingOrders: 12,
        totalCustomers: 850
      },

      login: (credentials) => {
        if (credentials.email === 'admin@rvstore.com' && credentials.password === 'admin123') {
          set({ isAuthenticated: true, user: { name: 'Admin Principal', role: 'Super Admin' } });
          return true;
        }
        return false;
      },

      register: ({ name, email }) => {
        // Mock registration - in production this would call an API
        set({ isAuthenticated: false, user: null });
        return true;
      },

      logout: () => set({ isAuthenticated: false, user: null }),

      addProduct: (product) => set((state) => ({ 
        products: [...state.products, { ...product, id: Date.now(), sales: 0 }] 
      })),

      updateProduct: (id, updatedProduct) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...updatedProduct } : p)
      })),

      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
      })),

      updateOrderStatus: (id, status) => set((state) => ({
        orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
      })),
    }),
    {
      name: 'rv-admin-storage',
    }
  )
);

export default useAdminStore;
