import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Truck, MapPin, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import useCartStore from '../context/useCartStore';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    neighborhood: '',
    city: 'Luanda',
    paymentMethod: 'express'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFinishPurchase = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Pedido realizado com sucesso!', {
        duration: 5000,
        icon: '🎉',
      });
      clearCart();
      navigate('/');
    }, 2000);
  };

  if (cart.length === 0 && !loading) {
    return (
      <div className="pt-40 pb-20 text-center">
        <h2 className="text-2xl font-bold">Seu carrinho está vazio</h2>
        <Link to="/" className="btn-primary mt-6 inline-block">Voltar para a Loja</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-10">Finalizar Compra</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form Side */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Info */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-light"
              >
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary">
                    <MapPin size={20} />
                  </div>
                  <h2 className="text-2xl font-bold">Informações de Entrega</h2>
                </div>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold text-neutral-dark/60 ml-2">Nome Completo</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      placeholder="Ex: Ana Paula"
                      className="w-full bg-neutral-light/50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-neutral-dark/60 ml-2">Telemóvel</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      placeholder="9XX XXX XXX"
                      className="w-full bg-neutral-light/50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-neutral-dark/60 ml-2">Cidade</label>
                    <input 
                      type="text" 
                      name="city"
                      value="Luanda"
                      readOnly
                      className="w-full bg-neutral-light/20 border-none rounded-2xl px-6 py-4 text-neutral-dark/40 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-neutral-dark/60 ml-2">Bairro</label>
                    <input 
                      type="text" 
                      name="neighborhood"
                      required
                      placeholder="Ex: Morro Bento"
                      className="w-full bg-neutral-light/50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-neutral-dark/60 ml-2">Endereço Detalhado</label>
                    <input 
                      type="text" 
                      name="address"
                      required
                      placeholder="Rua, Casa, Referência"
                      className="w-full bg-neutral-light/50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20"
                      onChange={handleInputChange}
                    />
                  </div>
                </form>
              </motion.div>

              {/* Payment Method */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-light"
              >
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary">
                    <CreditCard size={20} />
                  </div>
                  <h2 className="text-2xl font-bold">Método de Pagamento</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'express', name: 'Multicaixa Express', icon: '📱' },
                    { id: 'transfer', name: 'Transferência Bancária', icon: '🏦' },
                    { id: 'cash', name: 'Pagamento na Entrega', icon: '💵' },
                    { id: 'card', name: 'Cartão de Débito', icon: '💳' },
                  ].map((method) => (
                    <button 
                      key={method.id}
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id }))}
                      className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${formData.paymentMethod === method.id ? 'border-primary bg-secondary/30' : 'border-neutral-light hover:border-primary/30'}`}
                    >
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl">{method.icon}</span>
                        <span className="font-bold">{method.name}</span>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === method.id ? 'border-primary bg-primary' : 'border-neutral-light'}`}>
                        {formData.paymentMethod === method.id && <CheckCircle2 size={14} className="text-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Summary Side */}
            <div className="space-y-6">
              <div className="bg-neutral-dark text-white rounded-[2.5rem] p-8 shadow-xl sticky top-32">
                <h3 className="text-xl font-bold mb-8">Resumo do Pedido</h3>
                
                <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} className="flex items-center justify-between py-2 border-b border-white/10">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-16 rounded-lg overflow-hidden bg-white/10 shrink-0">
                          <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-bold line-clamp-1">{item.name}</p>
                          <p className="text-[10px] text-white/40">{item.quantity}x • {item.selectedSize}</p>
                        </div>
                      </div>
                      <span className="font-bold text-sm">
                        {(item.price * item.quantity).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 mb-10">
                  <div className="flex justify-between text-white/60">
                    <span>Subtotal</span>
                    <span>{getCartTotal().toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Frete</span>
                    <span className="text-primary font-bold">Grátis</span>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                    <span className="text-lg font-medium">Total</span>
                    <span className="text-3xl font-bold text-primary">
                      {getCartTotal().toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={handleFinishPurchase}
                  disabled={loading}
                  className="w-full bg-primary hover:bg-accent text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center space-x-3 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Lock size={18} />
                      <span>Confirmar Pedido</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-white/30 text-center mt-6 uppercase tracking-widest flex items-center justify-center space-x-2">
                  <ShieldCheck size={12} />
                  <span>Checkout Seguro & Criptografado</span>
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-neutral-light">
                <div className="flex items-center space-x-3 text-neutral-dark/60">
                  <Truck size={20} />
                  <p className="text-sm">Estimativa de entrega: <b>Amanhã</b></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
