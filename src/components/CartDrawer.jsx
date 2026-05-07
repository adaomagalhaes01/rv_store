import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCartStore from '../context/useCartStore';

const CartDrawer = () => {
  const { cart, isOpen, toggleCart, removeFromCart, updateQuantity, getCartTotal } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[110] shadow-2xl flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-neutral-100">
              <div className="flex items-center space-x-2">
                <ShoppingBag size={18} className="text-primary" />
                <h2 className="text-lg font-bold">Carrinho</h2>
              </div>
              <button onClick={toggleCart} className="p-2 hover:bg-neutral-light rounded-[2px] transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center text-primary">
                    <ShoppingBag size={40} />
                  </div>
                  <p className="text-neutral-dark/60 font-medium">Seu carrinho está vazio.</p>
                  <button 
                    onClick={toggleCart}
                    className="btn-primary"
                  >
                    Começar a Comprar
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div 
                    layout
                    key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} 
                    className="flex space-x-4 group"
                  >
                    <div className="w-24 h-32 bg-neutral-light rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-neutral-dark line-clamp-1">{item.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                            className="text-neutral-dark/40 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-sm text-neutral-dark/60 mt-1">
                          {item.selectedSize && `${item.selectedSize}`} {item.selectedColor && `| ${item.selectedColor}`}
                        </p>
                        <p className="text-primary font-bold mt-1">
                          {item.price.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-neutral-100 rounded-[2px] p-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                            className="p-1 hover:text-primary transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                            className="p-1 hover:text-primary transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-neutral-100 space-y-4 bg-neutral-light/30">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-neutral-dark/40 uppercase tracking-widest">Total Estimado</span>
                  <span className="text-2xl font-bold text-neutral-dark">
                    {getCartTotal().toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                  </span>
                </div>
                <Link 
                  to="/cart" 
                  onClick={toggleCart}
                  className="btn-primary w-full flex items-center justify-center space-x-2 rounded-[2px] py-4"
                >
                  <span>Finalizar Compra</span>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
