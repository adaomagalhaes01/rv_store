import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Search, Filter, Eye, Clock, CheckCircle2, XCircle, 
  Truck, ArrowRight, X, Calendar, MapPin, Phone, Mail, 
  CreditCard, FileText, Check, AlertCircle, RotateCcw
} from 'lucide-react';
import useAdminStore from '../stores/useAdminStore';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  'Pendente':              { color: 'bg-amber-50 text-amber-700 border-amber-200',   dot: 'bg-amber-500',   icon: Clock },
  'Comprovativo enviado':  { color: 'bg-blue-50 text-blue-700 border-blue-200',      dot: 'bg-blue-500',    icon: FileText },
  'Em análise':            { color: 'bg-purple-50 text-purple-700 border-purple-200',dot: 'bg-purple-500',  icon: Clock },
  'Pagamento confirmado':  { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', icon: CheckCircle2 },
  'Pagamento rejeitado':   { color: 'bg-red-50 text-red-700 border-red-200',         dot: 'bg-red-500',     icon: XCircle },
  'Em preparação':         { color: 'bg-orange-50 text-orange-700 border-orange-200',dot: 'bg-orange-500',  icon: Package },
  'Pronto para entrega':   { color: 'bg-cyan-50 text-cyan-700 border-cyan-200',      dot: 'bg-cyan-500',    icon: CheckCircle2 },
  'Em entrega':            { color: 'bg-indigo-50 text-indigo-700 border-indigo-200',dot: 'bg-indigo-500',  icon: Truck },
  'Entregue':              { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-600', icon: CheckCircle2 },
  'Cancelado':             { color: 'bg-gray-50 text-gray-500 border-gray-200',      dot: 'bg-gray-400',    icon: XCircle },
};

const NEXT_STATUS_MAP = {
  'Pagamento confirmado': 'Em preparação',
  'Em preparação': 'Pronto para entrega',
  'Pronto para entrega': 'Em entrega',
  'Em entrega': 'Entregue',
};

// Modal de visualização de comprovativo (imagem ou pdf)
const ProofViewer = ({ proofUrl, onClose }) => {
  if (!proofUrl) return null;
  // Como o bucket é privado, temos de criar url assinada ou assumir que quem tem acesso RLS pode abrir via supabase.storage
  // Para simplificar no admin, usamos publicUrl ou link assinado (aqui o componente supõe link pronto ou fazemos query)
  // No caso de RLS, precisaria de supabase.storage.from('payment-proofs').createSignedUrl(proofUrl, 3600)
  
  const [url, setUrl] = useState(null);
  useEffect(() => {
    import('../../lib/supabase').then(({ supabase }) => {
      supabase.storage.from('payment-proofs').createSignedUrl(proofUrl, 3600).then(({ data }) => {
        if (data) setUrl(data.signedUrl);
      });
    });
  }, [proofUrl]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden flex flex-col shadow-2xl">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-bold">Comprovativo de Pagamento</h3>
          <button onClick={onClose} className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-auto p-4 flex justify-center items-center bg-gray-100">
          {!url ? (
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          ) : url.includes('.pdf') ? (
            <iframe src={url} className="w-full h-full min-h-[60vh] rounded-xl" />
          ) : (
            <img src={url} className="max-w-full max-h-full object-contain rounded-xl" />
          )}
        </div>
      </div>
    </div>
  );
};

const OrderDetailsModal = ({ order, onClose, onAction }) => {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [viewingProof, setViewingProof] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!order) return null;

  const StatusIcon = STATUS_CONFIG[order.status]?.icon || Package;
  const cfg = STATUS_CONFIG[order.status];

  const handleAction = async (action, data = null) => {
    setLoading(true);
    await onAction(order.dbId, action, data);
    setLoading(false);
    if (action === 'confirm' || action === 'reject') {
      onClose(); // Fechar após aprovar/rejeitar para recarregar
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-primary">
              <Package size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Pedido {order.id}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                <Calendar size={14} />
                <span>{order.date}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${cfg?.color}`}>
              <StatusIcon size={14} />
              {order.status}
            </span>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X size={20} /></button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              
              {/* Alerta de Ação Necessária (Comprovativo) */}
              {order.status === 'Comprovativo enviado' && order.latestProof && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="flex items-start gap-3">
                    <FileText className="text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-blue-900 text-sm">Comprovativo Aguarda Análise</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Banco: {order.latestProof.bank_name} | Valor: {Number(order.latestProof.amount).toLocaleString('pt-AO')} Kz
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    {order.latestProof.file_url && (
                      <button onClick={() => setViewingProof(true)} className="flex-1 md:flex-none px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-xl text-xs font-bold transition-colors">
                        Ver Documento
                      </button>
                    )}
                    <button onClick={() => setShowRejectInput(!showRejectInput)} className="flex-1 md:flex-none px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl text-xs font-bold transition-colors">
                      Rejeitar
                    </button>
                    <button onClick={() => handleAction('confirm')} disabled={loading} className="flex-1 md:flex-none px-4 py-2 bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl text-xs font-bold transition-colors disabled:opacity-50">
                      Confirmar
                    </button>
                  </div>
                </div>
              )}

              {/* Input Rejeitar */}
              <AnimatePresence>
                {showRejectInput && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-3">
                      <input type="text" placeholder="Motivo da rejeição (ex: Comprovativo ilegível)" value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                        className="flex-1 bg-white border border-red-200 rounded-xl px-4 text-sm outline-none focus:border-red-400" />
                      <button onClick={() => handleAction('reject', rejectReason)} disabled={!rejectReason || loading} className="px-6 py-2 bg-red-500 text-white font-bold rounded-xl text-sm hover:bg-red-600 disabled:opacity-50">
                        Confirmar Rejeição
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tabela de Produtos */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
                <div className="bg-gray-50/50 px-5 py-3 border-b border-gray-100">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Produtos Encomendados</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {order.items.map((item, index) => (
                    <div key={index} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                          {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <Package size={20} className="m-auto mt-4 text-gray-400" />}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-800">{item.name}</p>
                          <p className="text-xs text-gray-500">Qtd: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-bold text-sm text-gray-800">{item.price.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 p-5 space-y-2 border-t border-gray-100">
                  <div className="flex justify-between text-xs font-medium text-gray-500"><span>Subtotal</span><span>{order.subtotal.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span></div>
                  <div className="flex justify-between text-xs font-medium text-gray-500"><span>Taxa de Entrega</span><span>Grátis</span></div>
                  <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-200">
                    <span className="font-bold text-sm text-gray-800">Total</span>
                    <span className="text-lg font-black text-primary">{order.total.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Right */}
            <div className="space-y-6">
              {/* Cliente */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Dados do Cliente</h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-bold text-sm text-gray-800">{order.customer}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1"><Mail size={12} /> {order.email || 'N/A'}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1"><Phone size={12} /> {order.phone}</div>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex gap-2 text-xs text-gray-500"><MapPin size={12} className="shrink-0 mt-0.5" /> <p className="leading-relaxed">{order.address}</p></div>
                  </div>
                </div>
              </div>

              {/* Pagamento */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Pagamento</h3>
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard size={14} className="text-gray-400" />
                  <span className="text-sm font-bold capitalize text-gray-800">{order.paymentMethod === 'transfer' ? 'Transferência Bancária' : order.paymentMethod === 'cash' ? 'Pronto Pagamento' : order.paymentMethod}</span>
                </div>
                <div className="mb-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    order.paymentStatus === 'confirmado' ? 'bg-emerald-100 text-emerald-700' :
                    order.paymentStatus === 'comprovativo_enviado' ? 'bg-blue-100 text-blue-700' :
                    order.paymentStatus === 'rejeitado' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {order.paymentStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Histórico */}
              {(order.statusHistory || []).length > 0 && (
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Histórico</h3>
                  <div className="space-y-3">
                    {order.statusHistory.map((h, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-2 h-2 rounded-full mt-1.5 ${STATUS_CONFIG[h.new_status]?.dot || 'bg-gray-300'}`} />
                          {i < order.statusHistory.length - 1 && <div className="w-0.5 h-full bg-gray-200 mt-1" />}
                        </div>
                        <div className="pb-1">
                          <p className="text-xs font-bold text-gray-800">{h.new_status}</p>
                          <p className="text-[10px] text-gray-400">{new Date(h.created_at).toLocaleString('pt-PT')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 shrink-0 flex items-center justify-between">
          <div>
            {NEXT_STATUS_MAP[order.status] && (
              <button onClick={() => handleAction('next_status', NEXT_STATUS_MAP[order.status])} disabled={loading}
                className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 flex items-center gap-2 shadow-sm shadow-primary/20 disabled:opacity-50 transition-all">
                Mover para {NEXT_STATUS_MAP[order.status]} <ArrowRight size={16} />
              </button>
            )}
          </div>
          <div className="flex gap-3">
            {order.status !== 'Cancelado' && order.status !== 'Entregue' && (
              <button onClick={() => handleAction('cancel')} disabled={loading} className="px-5 py-2.5 bg-white border border-gray-200 text-red-500 font-bold rounded-xl text-sm hover:bg-red-50 hover:border-red-100 transition-colors">
                Cancelar Pedido
              </button>
            )}
          </div>
        </div>
      </motion.div>
      {viewingProof && <ProofViewer proofUrl={order.latestProof?.file_url} onClose={() => setViewingProof(false)} />}
    </div>
  );
};

const Orders = () => {
  const { orders, loadOrders, confirmPayment, rejectPayment, updateOrderStatusWithHistory } = useAdminStore();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders().then(() => setLoading(false));
  }, []);

  const TABS = ['Todos', 'Pendente', 'Comprovativo enviado', 'Pagamento confirmado', 'Em preparação', 'Pronto para entrega', 'Em entrega', 'Entregue', 'Cancelado'];

  const filteredOrders = orders.filter(o => {
    const matchesTab = activeTab === 'Todos' || o.status === activeTab;
    const matchesSearch = 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleOrderAction = async (dbId, action, data) => {
    if (action === 'confirm') {
      const { ok, error } = await confirmPayment(dbId);
      if (ok) toast.success('Pagamento confirmado!');
      else toast.error(error.message);
    } 
    else if (action === 'reject') {
      const { ok, error } = await rejectPayment(dbId, data);
      if (ok) toast.success('Pagamento rejeitado!');
      else toast.error(error.message);
    }
    else if (action === 'next_status') {
      const { ok, error } = await updateOrderStatusWithHistory(dbId, data);
      if (ok) toast.success(`Estado atualizado para ${data}`);
      else toast.error(error.message);
    }
    else if (action === 'cancel') {
      if (!window.confirm('Tem certeza que deseja cancelar esta encomenda?')) return;
      const { ok, error } = await updateOrderStatusWithHistory(dbId, 'Cancelado', 'Cancelado pelo administrador');
      if (ok) toast.success('Encomenda cancelada');
      else toast.error(error.message);
    }
  };

  return (
    <div className="p-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Pedidos</h1>
          <p className="text-neutral-dark/40">Faça a gestão das encomendas dos seus clientes</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-light shadow-sm overflow-hidden flex flex-col h-[calc(100vh-200px)] min-h-[500px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-neutral-light flex flex-col md:flex-row gap-4 items-center justify-between shrink-0 bg-gray-50/50">
          <div className="flex overflow-x-auto w-full md:w-auto gap-2 pb-2 md:pb-0 scrollbar-hide">
            {TABS.map(tab => {
              const count = tab === 'Todos' ? orders.length : orders.filter(o => o.status === tab).length;
              return (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === tab ? 'bg-primary text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-500 hover:border-primary/30'
                  }`}>
                  {tab}
                  {count > 0 && <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab ? 'bg-white/20' : 'bg-gray-100'}`}>{count}</span>}
                </button>
              );
            })}
          </div>
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Procurar (Nome ou ID)..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all" />
          </div>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-auto bg-gray-50/30 p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-sm font-medium">A carregar pedidos...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white rounded-2xl border border-gray-100 border-dashed">
              <Package size={48} className="mb-4 text-gray-300" />
              <p className="font-bold text-lg text-gray-500 mb-1">Nenhum pedido encontrado</p>
              <p className="text-sm">Não há pedidos com o estado "{activeTab}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredOrders.map(order => (
                <div key={order.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                  {order.status === 'Comprovativo enviado' && (
                    <div className="absolute top-0 right-0 w-2 h-full bg-blue-500" />
                  )}
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-bold text-gray-800">{order.id}</p>
                      <p className="text-[11px] text-gray-400 font-medium mt-0.5">{order.date}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold border ${STATUS_CONFIG[order.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-bold text-gray-700">{order.customer}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1.5 capitalize"><CreditCard size={12}/> {order.paymentMethod === 'transfer' ? 'Transferência' : order.paymentMethod}</span>
                      <span className="font-bold text-gray-800">{order.items.length} {order.items.length === 1 ? 'item' : 'itens'}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Total</p>
                      <p className="font-black text-primary text-base">{order.total.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</p>
                    </div>
                    <button onClick={() => setSelectedOrder(order)} className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 hover:bg-primary hover:text-white flex items-center justify-center transition-colors">
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailsModal 
            order={selectedOrder} 
            onClose={() => setSelectedOrder(null)} 
            onAction={handleOrderAction}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
