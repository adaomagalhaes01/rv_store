import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      
      login: (userData) => {
        // Mock login
        set({ isAuthenticated: true, user: userData });
        return true;
      },
      
      register: (userData) => {
        // Mock registration
        set({ isAuthenticated: true, user: userData });
        return true;
      },
      
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: 'rv-user-storage',
    }
  )
);

export default useUserStore;
