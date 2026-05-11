import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  Lock, 
  ShieldCheck, 
  Smartphone, 
  Wallet,
  ArrowLeft
} from 'lucide-react';
import useCartStore from '../context/useCartStore';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Shipping, 2: Payment

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    neighborhood: '',
    city: 'Luanda',
    paymentMethod: 'card'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFinishPurchase = (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Pedido realizado com sucesso!', {
        duration: 5000,
        icon: '🎉',
        style: {
          borderRadius: '12px',
          background: '#333',
          color: '#fff',
        },
      });
      clearCart();
      navigate('/');
    }, 2500);
  };

  const nextStep = () => {
    if (formData.name && formData.phone && formData.address && formData.neighborhood) {
      setCurrentStep(2);
      window.scrollTo(0, 0);
    } else {
      toast.error('Por favor, preencha todos os campos de entrega.');
    }
  };

  if (cart.length === 0 && !loading) {
    return (
      <div className="pt-40 pb-20 text-center container">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto bg-neutral-light/30 p-12 rounded-[2.5rem] border border-neutral-light"
        >
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <Wallet className="text-primary" size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h2>
          <p className="text-neutral-dark/60 mb-8">Adicione alguns produtos antes de finalizar sua compra.</p>
          <Link to="/" className="btn-primary w-full inline-block py-4">Voltar para a Loja</Link>
        </motion.div>
      </div>
    );
  }

  const paymentMethods = [
    { 
      id: 'card', 
      name: 'Cartão de Débito/Crédito', 
      icon: <CreditCard size={24} />, 
      description: 'Visa, Mastercard e Multicaixa' 
    },
    { 
      id: 'express', 
      name: 'Multicaixa Express', 
      icon: <Smartphone size={24} />, 
      description: 'Pagamento rápido via telemóvel' 
    },
    { 
      id: 'cash', 
      name: 'Pagamento na Entrega', 
      icon: <Truck size={24} />, 
      description: 'Pague ao receber o seu pedido' 
    }
  ];

  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          {/* Header & Steps */}
          <div className="mb-12">
            <Link to="/cart" className="flex items-center text-sm font-medium text-neutral-dark/40 hover:text-primary transition-colors mb-6 group">
              <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Voltar ao carrinho
            </Link>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <h1 className="text-4xl font-bold tracking-tight">Finalizar Compra</h1>
              
              <div className="flex items-center space-x-4">
                <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-primary' : 'text-neutral-dark/20'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${currentStep >= 1 ? 'border-primary bg-primary text-white' : 'border-neutral-light'}`}>1</div>
                  <span className="font-bold text-sm">Entrega</span>
                </div>
                <div className="w-12 h-[2px] bg-neutral-light"></div>
                <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-primary' : 'text-neutral-dark/20'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${currentStep >= 2 ? 'border-primary bg-primary text-white' : 'border-neutral-light'}`}>2</div>
                  <span className="font-bold text-sm">Pagamento</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {currentStep === 1 ? (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-8"
                  >
                    <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-neutral-light">
                      <div className="flex items-center space-x-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary">
                          <MapPin size={24} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">Onde entregamos?</h2>
                          <p className="text-neutral-dark/40 text-sm">Preencha os dados para o envio</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-xs font-bold text-neutral-dark/40 uppercase tracking-wider ml-1">Nome Completo</label>
                          <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Como devemos te chamar?"
                            className="w-full bg-neutral-light/50 border-2 border-transparent rounded-2xl px-6 py-4 focus:bg-white focus:border-primary/20 focus:ring-0 transition-all outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-neutral-dark/40 uppercase tracking-wider ml-1">Telemóvel</label>
                          <input 
                            type="tel" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="9XX XXX XXX"
                            className="w-full bg-neutral-light/50 border-2 border-transparent rounded-2xl px-6 py-4 focus:bg-white focus:border-primary/20 focus:ring-0 transition-all outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-neutral-dark/40 uppercase tracking-wider ml-1">Cidade</label>
                          <div className="w-full bg-neutral-light/20 border-2 border-neutral-light/10 rounded-2xl px-6 py-4 text-neutral-dark/40 cursor-not-allowed">
                            Luanda
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-neutral-dark/40 uppercase tracking-wider ml-1">Bairro</label>
                          <input 
                            type="text" 
                            name="neighborhood"
                            value={formData.neighborhood}
                            onChange={handleInputChange}
                            placeholder="Ex: Talatona"
                            className="w-full bg-neutral-light/50 border-2 border-transparent rounded-2xl px-6 py-4 focus:bg-white focus:border-primary/20 focus:ring-0 transition-all outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-neutral-dark/40 uppercase tracking-wider ml-1">Endereço Detalhado</label>
                          <input 
                            type="text" 
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Rua, Prédio, Apt..."
                            className="w-full bg-neutral-light/50 border-2 border-transparent rounded-2xl px-6 py-4 focus:bg-white focus:border-primary/20 focus:ring-0 transition-all outline-none"
                          />
                        </div>
                      </div>

                      <button 
                        onClick={nextStep}
                        className="btn-primary w-full mt-10 py-5 text-base rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center space-x-2"
                      >
                        <span>Continuar para Pagamento</span>
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-neutral-light">
                      <div className="flex items-center space-x-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary">
                          <CreditCard size={24} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">Como deseja pagar?</h2>
                          <p className="text-neutral-dark/40 text-sm">Escolha sua opção de preferência</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {paymentMethods.map((method) => (
                          <button 
                            key={method.id}
                            onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id }))}
                            className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all group ${
                              formData.paymentMethod === method.id 
                                ? 'border-primary bg-secondary/30 ring-4 ring-primary/5' 
                                : 'border-neutral-light hover:border-primary/30 hover:bg-neutral-light/20'
                            }`}
                          >
                            <div className="flex items-center space-x-5 text-left">
                              <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${
                                formData.paymentMethod === method.id ? 'bg-primary text-white' : 'bg-neutral-light text-neutral-dark/40 group-hover:bg-primary/10 group-hover:text-primary'
                              }`}>
                                {method.icon}
                              </div>
                              <div>
                                <p className="font-bold text-lg">{method.name}</p>
                                <p className="text-sm text-neutral-dark/40">{method.description}</p>
                              </div>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              formData.paymentMethod === method.id ? 'border-primary bg-primary' : 'border-neutral-light'
                            }`}>
                              {formData.paymentMethod === method.id && <CheckCircle2 size={14} className="text-white" />}
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="mt-10 pt-8 border-t border-neutral-light flex items-center justify-between">
                        <button 
                          onClick={() => setCurrentStep(1)}
                          className="text-sm font-bold text-neutral-dark/40 hover:text-primary transition-colors flex items-center"
                        >
                          <ChevronRight size={16} className="rotate-180 mr-1" />
                          Voltar para entrega
                        </button>
                        
                        <button 
                          onClick={handleFinishPurchase}
                          disabled={loading}
                          className="btn-primary px-10 py-5 text-base rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center space-x-3 disabled:opacity-50"
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
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="bg-neutral-dark text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-16 translate-x-16 blur-3xl group-hover:bg-primary/20 transition-colors"></div>
                
                <h3 className="text-xl font-bold mb-8 relative z-10">Resumo da Compra</h3>
                
                <div className="space-y-6 mb-8 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} className="flex items-start justify-between group/item">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-20 rounded-2xl overflow-hidden bg-white/10 shrink-0 border border-white/5 p-1">
                          <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                        </div>
                        <div>
                          <p className="text-sm font-bold leading-tight mb-1">{item.name}</p>
                          <p className="text-[11px] text-white/40 uppercase tracking-wider font-bold">QTD: {item.quantity} • TAM: {item.selectedSize}</p>
                        </div>
                      </div>
                      <span className="font-bold text-sm text-primary">
                        {(item.price * item.quantity).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 mb-10 pt-6 border-t border-white/5 relative z-10">
                  <div className="flex justify-between text-sm text-white/40 font-medium">
                    <span>Subtotal</span>
                    <span className="text-white">{getCartTotal().toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
                  </div>
                  <div className="flex justify-between text-sm text-white/40 font-medium">
                    <span>Taxa de entrega</span>
                    <span className="text-primary font-bold">Grátis</span>
                  </div>
                  <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-1">Valor Total</p>
                      <span className="text-3xl font-bold text-white tracking-tighter">
                        {getCartTotal().toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-2 text-[10px] text-white/20 uppercase tracking-[0.15em] relative z-10">
                  <ShieldCheck size={12} />
                  <span>Ambiente Seguro</span>
                </div>
              </div>

              <div className="bg-neutral-light/50 rounded-3xl p-6 border border-neutral-light flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Truck size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-dark/40 uppercase tracking-wider">Estimativa de Entrega</p>
                  <p className="text-sm font-bold">Amanhã, entre as 09:00 e 18:00</p>
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

