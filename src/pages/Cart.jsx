import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import useCartStore from '../context/useCartStore';
import useUserStore from '../context/useUserStore';
import AuthModal from '../components/AuthModal';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCartStore();
  const { isAuthenticated } = useUserStore();
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCheckoutClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setAuthModalOpen(true);
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="pt-40 pb-20 text-center">
        <div className="container">
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center text-primary mx-auto mb-8">
            <ShoppingBag size={48} />
          </div>
          <h1 className="text-4xl font-bold mb-4">Seu carrinho está vazio</h1>
          <p className="text-neutral-dark/60 text-lg mb-10">Parece que você ainda não adicionou nenhum item.</p>
          <Link to="/" className="btn-primary">Explorar Coleções</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20">
      <div className="container">
        <h1 className="text-4xl font-bold mb-12">Seu Carrinho</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-neutral-light overflow-hidden">
              <div className="hidden md:grid grid-cols-4 gap-4 pb-6 border-b text-xs font-bold uppercase tracking-widest text-neutral-dark/40">
                <div className="col-span-2">Produto</div>
                <div className="text-center">Quantidade</div>
                <div className="text-right">Total</div>
              </div>

              <div className="divide-y">
                {cart.map((item) => (
                  <motion.div 
                    key={`${item.id}-${item.selectedSize}`}
                    layout
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 py-8 items-center"
                  >
                    <div className="col-span-2 flex items-center space-x-6">
                      <div className="w-24 h-32 rounded-2xl overflow-hidden bg-neutral-light shrink-0">
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <p className="text-sm text-neutral-dark/40">
                          {item.selectedSize && `Tamanho: ${item.selectedSize}`} {item.selectedColor && `| Cor: ${item.selectedColor}`}
                        </p>
                        <p className="text-primary font-bold">
                          {item.price.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                        </p>
                        <button 
                          onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                          className="text-red-500 text-xs font-bold flex items-center space-x-1 pt-2 hover:opacity-70 transition-opacity"
                        >
                          <Trash2 size={14} />
                          <span>Remover</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="flex items-center border-2 border-neutral-light rounded-2xl p-1 w-fit">
                        <button 
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                          className="p-2 hover:text-primary transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                          className="p-2 hover:text-primary transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="text-right font-bold text-xl text-neutral-dark">
                      {(item.price * item.quantity).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <Link to="/" className="inline-flex items-center space-x-2 text-primary font-bold hover:underline">
              <ArrowLeft size={18} />
              <span>Continuar Comprando</span>
            </Link>
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-neutral-light">
              <h2 className="text-2xl font-bold mb-8">Resumo</h2>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between text-neutral-dark/60">
                  <span>Subtotal</span>
                  <span className="font-bold text-neutral-dark">
                    {getCartTotal().toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-dark/60">
                  <span>Frete Estimado</span>
                  <span className="text-emerald-500 font-bold">Grátis</span>
                </div>
                <div className="pt-6 border-t flex justify-between items-end">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-3xl font-bold text-primary">
                    {getCartTotal().toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Cupom de Desconto" 
                    className="w-full bg-neutral-light/50 border-none rounded-2xl px-6 py-4 pr-24 focus:ring-2 focus:ring-primary/20 font-medium"
                  />
                  <button className="absolute right-2 top-2 bottom-2 bg-neutral-dark text-white text-xs font-bold px-4 rounded-xl hover:bg-black transition-colors">
                    Aplicar
                  </button>
                </div>

                <button 
                  onClick={handleCheckoutClick}
                  className="btn-primary w-full flex items-center justify-center space-x-3 py-5 mt-6 shadow-xl"
                >
                  <span className="text-lg">Ir para Checkout</span>
                  <ArrowRight size={22} />
                </button>
              </div>

              <div className="mt-10 space-y-4 border-t pt-10">
                <div className="flex items-center space-x-3 text-sm text-neutral-dark/60">
                  <ShieldCheck size={20} className="text-primary" />
                  <span>Pagamento 100% Seguro</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-neutral-dark/60">
                  <Truck size={20} className="text-primary" />
                  <span>Entrega em toda Luanda</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </div>
  );
};

export default Cart;
