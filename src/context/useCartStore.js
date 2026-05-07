import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      isOpen: false,
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      addToCart: (product, quantity = 1, size = null, color = null) => {
        const { cart } = get();
        const existingItemIndex = cart.findIndex(
          (item) => 
            item.id === product.id && 
            item.selectedSize === size && 
            item.selectedColor === color
        );

        if (existingItemIndex > -1) {
          const newCart = [...cart];
          newCart[existingItemIndex].quantity += quantity;
          set({ cart: newCart });
        } else {
          set({ 
            cart: [...cart, { ...product, quantity, selectedSize: size, selectedColor: color }] 
          });
        }
      },

      removeFromCart: (productId, size, color) => {
        set((state) => ({
          cart: state.cart.filter(
            (item) => 
              !(item.id === productId && item.selectedSize === size && item.selectedColor === color)
          ),
        }));
      },

      updateQuantity: (productId, size, color, quantity) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId && item.selectedSize === size && item.selectedColor === color
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        }));
      },

      clearCart: () => set({ cart: [] }),

      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getCartCount: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'rv-store-cart',
    }
  )
);

export default useCartStore;
