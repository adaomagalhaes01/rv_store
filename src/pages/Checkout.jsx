import { useState, useEffect } from 'react';
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
  ArrowLeft,
  Building2,
  Upload,
  FileText,
  Calendar,
  Hash,
  AlertCircle,
  Copy,
  CheckCheck,
} from 'lucide-react';
import useCartStore from '../context/useCartStore';
import useUserStore from '../context/useUserStore';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Dados bancários da loja (só expostos quando o método transfer é selecionado)
const BANK_DATA = {
  Atlântico: { label: 'Atlântico', account: '005500000611063010162', holder: 'Deolinda Victor' },
  BAI:       { label: 'BAI',       account: '004000009812405810178', holder: 'Deolinda Victor' },
  Express:   { label: 'Express',   number:  '922690893',              holder: 'Deolinda Victor' },
};

const CopyButton = ({ value }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="ml-2 text-primary hover:text-primary/70 transition-colors" title="Copiar">
      {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
    </button>
  );
};

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCartStore();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Entrega, 2: Pagamento, 3: Comprovativo

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    neighborhood: '',
    city: 'Luanda',
    paymentMethod: 'transfer',
  });

  // Dados do comprovativo de transferência
  const [proofData, setProofData] = useState({
    bank: 'Atlântico',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    reference: '',
    file: null,
    filePreview: null,
  });

  const [uploadingFile, setUploadingFile] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null);

  // Pré-preencher dados do perfil
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.full_name || prev.name,
        phone: user.phone || prev.phone,
      }));
      // Pré-preencher valor do comprovativo
      setProofData(prev => ({ ...prev, amount: getCartTotal().toFixed(2) }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProofChange = (e) => {
    const { name, value } = e.target;
    setProofData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo
    const allowed = ['image/png', 'image/jpeg', 'image/webp', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      toast.error('Tipo de ficheiro não permitido. Use PNG, JPG, WEBP ou PDF.');
      return;
    }

    // Validar tamanho (10 MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Ficheiro demasiado grande. Máximo 10 MB.');
      return;
    }

    const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
    setProofData(prev => ({ ...prev, file, filePreview: preview }));
  };

  const nextStep = () => {
    if (!formData.name || !formData.phone || !formData.address || !formData.neighborhood) {
      toast.error('Por favor, preencha todos os campos de entrega.');
      return;
    }
    setCurrentStep(2);
    window.scrollTo(0, 0);
  };

  const goToProofStep = () => {
    setCurrentStep(3);
    window.scrollTo(0, 0);
  };

  // PASSO 1: Criar encomenda
  const handleCreateOrder = async () => {
    if (!user) {
      toast.error('Inicia sessão para confirmar a compra.');
      navigate('/auth');
      return;
    }

    setLoading(true);

    const items = cart.map(i => ({
      product_id: Number(i.id),
      quantity: i.quantity,
      size: i.selectedSize || null,
      color: i.selectedColor || null,
      price: i.price,
      product_name: i.name,
      product_image: i.images?.[0] || null,
    }));

    try {
      const { data, error } = await supabase.rpc('create_order', {
        p_user_id: user.id,
        p_customer_name: formData.name,
        p_customer_email: user.email || '',
        p_customer_phone: formData.phone,
        p_address: formData.address,
        p_neighborhood: formData.neighborhood,
        p_city: formData.city,
        p_payment_method: formData.paymentMethod,
        p_items: items,
      });

      if (error) throw error;
      if (!data || Number(data) <= 0) throw new Error('Não foi possível registar o pedido.');

      setCreatedOrderId(Number(data));
      setLoading(false);

      if (formData.paymentMethod === 'transfer') {
        // Avançar para o passo de comprovativo
        toast.success('Pedido criado! Envie agora o comprovativo.', { icon: '📋' });
        goToProofStep();
      } else {
        // Pagamento na entrega ou outro
        clearCart();
        toast.success('Pedido realizado com sucesso!', { duration: 5000, icon: '🎉' });
        navigate(`/orders`);
      }
    } catch (err) {
      setLoading(false);
      const message = err?.message || 'Não foi possível concluir o pedido.';
      toast.error(message);
    }
  };

  // PASSO 2: Enviar comprovativo
  const handleSubmitProof = async (e) => {
    e.preventDefault();

    if (!proofData.amount || !proofData.date || !proofData.bank) {
      toast.error('Preencha todos os campos do comprovativo.');
      return;
    }

    setUploadingFile(true);

    try {
      let fileUrl = null;

      // Upload do ficheiro se existir
      if (proofData.file && createdOrderId) {
        const ext = proofData.file.name.split('.').pop();
        const filePath = `${user.id}/${createdOrderId}_${Date.now()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('payment-proofs')
          .upload(filePath, proofData.file, { upsert: false });

        if (uploadError) throw new Error('Erro no upload: ' + uploadError.message);

        const { data: urlData } = supabase.storage
          .from('payment-proofs')
          .getPublicUrl(filePath);

        fileUrl = filePath; // Guardamos o path, não a URL pública (bucket privado)
      }

      // Registar comprovativo via função segura
      const { error: proofError } = await supabase.rpc('submit_payment_proof', {
        p_order_id:      createdOrderId,
        p_bank_name:     proofData.bank,
        p_amount:        Number(proofData.amount),
        p_transfer_date: proofData.date,
        p_reference:     proofData.reference || null,
        p_file_url:      fileUrl,
      });

      if (proofError) throw proofError;

      setUploadingFile(false);
      clearCart();
      toast.success('Comprovativo enviado! Aguarde a confirmação.', { duration: 6000, icon: '✅' });
      navigate('/orders');
    } catch (err) {
      setUploadingFile(false);
      toast.error(err?.message || 'Erro ao enviar comprovativo.');
    }
  };

  const handleSkipProof = () => {
    clearCart();
    toast.success('Pedido criado! Pode enviar o comprovativo mais tarde em "Minhas Encomendas".', { duration: 7000 });
    navigate('/orders');
  };

  if (cart.length === 0 && !loading && !createdOrderId) {
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
      id: 'transfer',
      name: 'Transferência Bancária',
      icon: <Building2 size={24} />,
      description: 'Atlântico, BAI ou Express — envie o comprovativo',
      recommended: true,
    },
    {
      id: 'express',
      name: 'Multicaixa Express',
      icon: <Smartphone size={24} />,
      description: 'Pagamento rápido via telemóvel',
    },
    {
      id: 'cash',
      name: 'Pagamento na Entrega',
      icon: <Truck size={24} />,
      description: 'Pague ao receber o seu pedido',
    },
  ];

  const totalSteps = formData.paymentMethod === 'transfer' ? 3 : 2;

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

              <div className="flex items-center space-x-3">
                {[
                  { n: 1, label: 'Entrega' },
                  { n: 2, label: 'Pagamento' },
                  ...(formData.paymentMethod === 'transfer' || currentStep === 3
                    ? [{ n: 3, label: 'Comprovativo' }]
                    : []),
                ].map((step, i, arr) => (
                  <div key={step.n} className="flex items-center">
                    <div className={`flex items-center space-x-2 ${currentStep >= step.n ? 'text-primary' : 'text-neutral-dark/20'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${currentStep >= step.n ? 'border-primary bg-primary text-white' : 'border-neutral-light'}`}>
                        {currentStep > step.n ? <CheckCircle2 size={14} /> : step.n}
                      </div>
                      <span className="font-bold text-sm hidden sm:block">{step.label}</span>
                    </div>
                    {i < arr.length - 1 && <div className="w-8 h-[2px] bg-neutral-light mx-2" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">

                {/* PASSO 1 — Entrega */}
                {currentStep === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
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
                          <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                            placeholder="Como devemos te chamar?"
                            className="w-full bg-neutral-light/50 border-2 border-transparent rounded-2xl px-6 py-4 focus:bg-white focus:border-primary/20 focus:ring-0 transition-all outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-neutral-dark/40 uppercase tracking-wider ml-1">Telemóvel</label>
                          <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                            placeholder="9XX XXX XXX"
                            className="w-full bg-neutral-light/50 border-2 border-transparent rounded-2xl px-6 py-4 focus:bg-white focus:border-primary/20 focus:ring-0 transition-all outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-neutral-dark/40 uppercase tracking-wider ml-1">Cidade</label>
                          <div className="w-full bg-neutral-light/20 border-2 border-neutral-light/10 rounded-2xl px-6 py-4 text-neutral-dark/40 cursor-not-allowed">Luanda</div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-neutral-dark/40 uppercase tracking-wider ml-1">Bairro</label>
                          <input type="text" name="neighborhood" value={formData.neighborhood} onChange={handleInputChange}
                            placeholder="Ex: Talatona"
                            className="w-full bg-neutral-light/50 border-2 border-transparent rounded-2xl px-6 py-4 focus:bg-white focus:border-primary/20 focus:ring-0 transition-all outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-neutral-dark/40 uppercase tracking-wider ml-1">Endereço Detalhado</label>
                          <input type="text" name="address" value={formData.address} onChange={handleInputChange}
                            placeholder="Rua, Prédio, Apt..."
                            className="w-full bg-neutral-light/50 border-2 border-transparent rounded-2xl px-6 py-4 focus:bg-white focus:border-primary/20 focus:ring-0 transition-all outline-none" />
                        </div>
                      </div>

                      <button onClick={nextStep} className="btn-primary w-full mt-10 py-5 text-base rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center space-x-2">
                        <span>Continuar para Pagamento</span>
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* PASSO 2 — Pagamento */}
                {currentStep === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                    <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-neutral-light">
                      <div className="flex items-center space-x-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary">
                          <CreditCard size={24} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">Como deseja pagar?</h2>
                          <p className="text-neutral-dark/40 text-sm">Escolha a sua opção de preferência</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {paymentMethods.map((method) => (
                          <button
                            key={method.id}
                            onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id }))}
                            className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all group ${formData.paymentMethod === method.id
                              ? 'border-primary bg-secondary/30 ring-4 ring-primary/5'
                              : 'border-neutral-light hover:border-primary/30 hover:bg-neutral-light/20'
                            }`}
                          >
                            <div className="flex items-center space-x-5 text-left">
                              <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${formData.paymentMethod === method.id ? 'bg-primary text-white' : 'bg-neutral-light text-neutral-dark/40 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                                {method.icon}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-lg">{method.name}</p>
                                  {method.recommended && (
                                    <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full uppercase tracking-wide">Recomendado</span>
                                  )}
                                </div>
                                <p className="text-sm text-neutral-dark/40">{method.description}</p>
                              </div>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.paymentMethod === method.id ? 'border-primary bg-primary' : 'border-neutral-light'}`}>
                              {formData.paymentMethod === method.id && <CheckCircle2 size={14} className="text-white" />}
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Dados bancários — só mostra se transfer selecionado */}
                      {formData.paymentMethod === 'transfer' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100"
                        >
                          <div className="flex items-center gap-2 mb-4">
                            <AlertCircle size={18} className="text-blue-600" />
                            <p className="font-bold text-blue-800 text-sm">Dados para Transferência</p>
                          </div>
                          <p className="text-xs text-blue-600 mb-4 font-medium">Titular: <strong>Deolinda Victor</strong></p>
                          <div className="space-y-3">
                            {Object.entries(BANK_DATA).map(([key, bank]) => (
                              <div key={key} className="bg-white rounded-xl p-4 border border-blue-100">
                                <p className="text-xs font-bold text-neutral-dark/40 uppercase tracking-wider mb-1">{bank.label}</p>
                                <div className="flex items-center">
                                  <p className="font-mono text-sm font-bold text-neutral-dark">
                                    {bank.account || bank.number}
                                  </p>
                                  <CopyButton value={bank.account || bank.number} />
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-blue-600 mt-4">
                            ℹ️ Após a transferência, clique em "Confirmar Pedido" e submeta o comprovativo.
                          </p>
                        </motion.div>
                      )}

                      <div className="mt-10 pt-8 border-t border-neutral-light flex items-center justify-between">
                        <button
                          onClick={() => setCurrentStep(1)}
                          className="text-sm font-bold text-neutral-dark/40 hover:text-primary transition-colors flex items-center"
                        >
                          <ChevronRight size={16} className="rotate-180 mr-1" />
                          Voltar para entrega
                        </button>

                        <button
                          onClick={handleCreateOrder}
                          disabled={loading}
                          className="btn-primary px-10 py-5 text-base rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center space-x-3 disabled:opacity-50"
                        >
                          {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <Lock size={18} />
                              <span>{formData.paymentMethod === 'transfer' ? 'Confirmar Pedido' : 'Finalizar Compra'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* PASSO 3 — Comprovativo de Transferência */}
                {currentStep === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                    <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-neutral-light">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary">
                          <FileText size={24} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">Comprovativo de Transferência</h2>
                          <p className="text-neutral-dark/40 text-sm">Envie os dados da sua transferência</p>
                        </div>
                      </div>

                      {/* Dados bancários resumidos */}
                      <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 mb-8">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3">Transferir para:</p>
                        <p className="font-bold text-sm text-blue-900 mb-2">Titular: Deolinda Victor</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {Object.entries(BANK_DATA).map(([key, bank]) => (
                            <div key={key} className="bg-white rounded-xl p-3 border border-blue-100 text-center">
                              <p className="text-xs font-bold text-neutral-dark/50 mb-1">{bank.label}</p>
                              <div className="flex items-center justify-center">
                                <p className="font-mono text-xs font-bold">{bank.account || bank.number}</p>
                                <CopyButton value={bank.account || bank.number} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <form onSubmit={handleSubmitProof} className="space-y-6">
                        {/* Banco */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-neutral-dark/40 uppercase tracking-wider ml-1">Banco Utilizado</label>
                          <div className="grid grid-cols-3 gap-3">
                            {Object.keys(BANK_DATA).map(bank => (
                              <button
                                key={bank}
                                type="button"
                                onClick={() => setProofData(prev => ({ ...prev, bank }))}
                                className={`py-3 rounded-2xl border-2 text-sm font-bold transition-all ${proofData.bank === bank ? 'border-primary bg-secondary/30 text-primary' : 'border-neutral-light text-neutral-dark/50 hover:border-primary/30'}`}
                              >
                                {bank}
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() => setProofData(prev => ({ ...prev, bank: 'Outro' }))}
                              className={`py-3 rounded-2xl border-2 text-sm font-bold transition-all ${proofData.bank === 'Outro' ? 'border-primary bg-secondary/30 text-primary' : 'border-neutral-light text-neutral-dark/50 hover:border-primary/30'}`}
                            >
                              Outro
                            </button>
                          </div>
                        </div>

                        {/* Valor e Data */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-neutral-dark/40 uppercase tracking-wider ml-1">Valor Transferido (AOA)</label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-dark/40 font-bold text-sm">Kz</span>
                              <input
                                type="number"
                                name="amount"
                                value={proofData.amount}
                                onChange={handleProofChange}
                                required
                                min="1"
                                step="0.01"
                                className="w-full bg-neutral-light/50 border-2 border-transparent rounded-2xl pl-12 pr-6 py-4 focus:bg-white focus:border-primary/20 outline-none"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-neutral-dark/40 uppercase tracking-wider ml-1">
                              <Calendar size={12} className="inline mr-1" />Data da Transferência
                            </label>
                            <input
                              type="date"
                              name="date"
                              value={proofData.date}
                              onChange={handleProofChange}
                              required
                              max={new Date().toISOString().split('T')[0]}
                              className="w-full bg-neutral-light/50 border-2 border-transparent rounded-2xl px-6 py-4 focus:bg-white focus:border-primary/20 outline-none"
                            />
                          </div>
                        </div>

                        {/* Referência */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-neutral-dark/40 uppercase tracking-wider ml-1">
                            <Hash size={12} className="inline mr-1" />Referência / Nº Comprovativo (opcional)
                          </label>
                          <input
                            type="text"
                            name="reference"
                            value={proofData.reference}
                            onChange={handleProofChange}
                            placeholder="Ex: TRF20260930001"
                            className="w-full bg-neutral-light/50 border-2 border-transparent rounded-2xl px-6 py-4 focus:bg-white focus:border-primary/20 outline-none"
                          />
                        </div>

                        {/* Upload do comprovativo */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-neutral-dark/40 uppercase tracking-wider ml-1">
                            <Upload size={12} className="inline mr-1" />Comprovativo (Imagem ou PDF)
                          </label>
                          <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${proofData.file ? 'border-primary bg-secondary/20' : 'border-neutral-light bg-neutral-light/30 hover:border-primary/40 hover:bg-neutral-light/50'}`}>
                            {proofData.filePreview ? (
                              <img src={proofData.filePreview} alt="Preview" className="h-full w-full object-contain rounded-2xl p-2" />
                            ) : proofData.file ? (
                              <div className="flex flex-col items-center text-primary">
                                <FileText size={32} className="mb-2" />
                                <p className="text-sm font-bold">{proofData.file.name}</p>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center text-neutral-dark/30">
                                <Upload size={32} className="mb-2" />
                                <p className="text-sm font-medium">Clique para seleccionar</p>
                                <p className="text-xs mt-1">PNG, JPG, WEBP, PDF — máx. 10 MB</p>
                              </div>
                            )}
                            <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
                          </label>
                        </div>

                        <div className="pt-4 flex flex-col sm:flex-row gap-3">
                          <button
                            type="submit"
                            disabled={uploadingFile}
                            className="btn-primary flex-1 py-5 text-base rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center space-x-3 disabled:opacity-50"
                          >
                            {uploadingFile ? (
                              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>
                                <Upload size={18} />
                                <span>Enviar Comprovativo</span>
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={handleSkipProof}
                            className="flex-1 py-5 text-base rounded-2xl border-2 border-neutral-light font-bold text-neutral-dark/50 hover:border-primary/30 hover:text-primary transition-all"
                          >
                            Enviar depois
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="bg-neutral-dark text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-16 translate-x-16 blur-3xl group-hover:bg-primary/20 transition-colors" />
                <h3 className="text-xl font-bold mb-8 relative z-10">Resumo da Compra</h3>

                <div className="space-y-6 mb-8 max-h-[350px] overflow-y-auto pr-2 relative z-10">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-20 rounded-2xl overflow-hidden bg-white/10 shrink-0 border border-white/5 p-1">
                          <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                        </div>
                        <div>
                          <p className="text-sm font-bold leading-tight mb-1">{item.name}</p>
                          <p className="text-[11px] text-white/40 uppercase tracking-wider font-bold">
                            QTD: {item.quantity}{item.selectedSize ? ` • TAM: ${item.selectedSize}` : ''}
                          </p>
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
                  <p className="text-sm font-bold">1 a 3 dias úteis</p>
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
