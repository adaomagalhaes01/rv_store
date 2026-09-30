import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  AlertCircle,
  Eye,
  RefreshCw,
  ShoppingBag,
  FileText,
  Upload,
  Calendar,
  Hash,
  Building2,
  ArrowLeft,
  MapPin,
  CreditCard,
  Copy,
  CheckCheck,
  X,
  ChevronDown,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import useUserStore from '../context/useUserStore';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Dados bancários — para upload de comprovativo adicional
const BANK_DATA = {
  Atlântico: '005500000611063010162',
  BAI:       '004000009812405810178',
  Express:   '922690893',
};

const STATUS_CONFIG = {
  'Pendente':              { color: 'bg-amber-50 text-amber-700 border-amber-200',   dot: 'bg-amber-500',   icon: Clock,          label: 'Pendente' },
  'Comprovativo enviado':  { color: 'bg-blue-50 text-blue-700 border-blue-200',      dot: 'bg-blue-500',    icon: FileText,       label: 'Comprovativo Enviado' },
  'Em análise':            { color: 'bg-purple-50 text-purple-700 border-purple-200',dot: 'bg-purple-500',  icon: RefreshCw,      label: 'Em Análise' },
  'Pagamento confirmado':  { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', icon: CheckCircle2, label: 'Pagamento Confirmado' },
  'Pagamento rejeitado':   { color: 'bg-red-50 text-red-700 border-red-200',         dot: 'bg-red-500',     icon: XCircle,        label: 'Pagamento Rejeitado' },
  'Em preparação':         { color: 'bg-orange-50 text-orange-700 border-orange-200',dot: 'bg-orange-500',  icon: Package,        label: 'Em Preparação' },
  'Pronto para entrega':   { color: 'bg-cyan-50 text-cyan-700 border-cyan-200',      dot: 'bg-cyan-500',    icon: CheckCircle2,   label: 'Pronto para Entrega' },
  'Em entrega':            { color: 'bg-indigo-50 text-indigo-700 border-indigo-200',dot: 'bg-indigo-500',  icon: Truck,          label: 'Em Entrega' },
  'Entregue':              { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-600', icon: CheckCircle2, label: 'Entregue' },
  'Cancelado':             { color: 'bg-gray-50 text-gray-500 border-gray-200',      dot: 'bg-gray-400',    icon: XCircle,        label: 'Cancelado' },
};

const CopyButton = ({ value }) => {
  const [copied, setCopied] = useState(false);
  const handle = () => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <button onClick={handle} className="ml-1 text-primary/70 hover:text-primary transition-colors">
      {copied ? <CheckCheck size={13} /> : <Copy size={13} />}
    </button>
  );
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Pendente'];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${cfg.color}`}>
      <Icon size={12} />
      {cfg.label}
    </span>
  );
};

// Modal de upload de comprovativo adicional
const ProofUploadModal = ({ order, onClose, onSuccess }) => {
  const { user } = useUserStore();
  const [proofData, setProofData] = useState({
    bank: 'Atlântico',
    amount: order?.total?.toString() || '',
    date: new Date().toISOString().split('T')[0],
    reference: '',
    file: null,
    filePreview: null,
  });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ['image/png', 'image/jpeg', 'image/webp', 'application/pdf'];
    if (!allowed.includes(file.type)) { toast.error('Tipo de ficheiro inválido.'); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error('Ficheiro demasiado grande. Máximo 10 MB.'); return; }
    const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
    setProofData(prev => ({ ...prev, file, filePreview: preview }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proofData.amount || !proofData.date) { toast.error('Preencha todos os campos.'); return; }
    setLoading(true);
    try {
      let fileUrl = null;
      if (proofData.file && user) {
        const ext = proofData.file.name.split('.').pop();
        const filePath = `${user.id}/${order.id}_${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('payment-proofs').upload(filePath, proofData.file, { upsert: false });
        if (uploadError) throw new Error('Erro no upload: ' + uploadError.message);
        fileUrl = filePath;
      }

      const { error } = await supabase.rpc('submit_payment_proof', {
        p_order_id:      order.id,
        p_bank_name:     proofData.bank,
        p_amount:        Number(proofData.amount),
        p_transfer_date: proofData.date,
        p_reference:     proofData.reference || null,
        p_file_url:      fileUrl,
      });
      if (error) throw error;

      toast.success('Comprovativo enviado com sucesso!');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err?.message || 'Erro ao enviar comprovativo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="text-lg font-bold">Enviar Comprovativo</h3>
            <p className="text-xs text-gray-400 mt-0.5">Pedido {order?.order_number}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Dados bancários rápidos */}
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <p className="text-xs font-bold text-blue-700 mb-2">Titular: Deolinda Victor</p>
            <div className="space-y-1.5">
              {Object.entries(BANK_DATA).map(([bank, acc]) => (
                <div key={bank} className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-800">{bank}:</span>
                  <div className="flex items-center font-mono text-blue-700">{acc}<CopyButton value={acc} /></div>
                </div>
              ))}
            </div>
          </div>

          {/* Banco */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Banco Utilizado</label>
            <div className="grid grid-cols-4 gap-2">
              {[...Object.keys(BANK_DATA), 'Outro'].map(b => (
                <button key={b} type="button" onClick={() => setProofData(p => ({ ...p, bank: b }))}
                  className={`py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${proofData.bank === b ? 'border-primary bg-secondary/30 text-primary' : 'border-gray-200 text-gray-400 hover:border-primary/30'}`}>
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Valor e data */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Valor (AOA)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">Kz</span>
                <input type="number" required min="1" step="0.01" value={proofData.amount}
                  onChange={e => setProofData(p => ({ ...p, amount: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Data da Transferência</label>
              <input type="date" required max={new Date().toISOString().split('T')[0]} value={proofData.date}
                onChange={e => setProofData(p => ({ ...p, date: e.target.value }))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10" />
            </div>
          </div>

          {/* Referência */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Referência (opcional)</label>
            <input type="text" value={proofData.reference} onChange={e => setProofData(p => ({ ...p, reference: e.target.value }))}
              placeholder="Nº comprovativo..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10" />
          </div>

          {/* Upload */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Comprovativo (opcional)</label>
            <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${proofData.file ? 'border-primary bg-secondary/10' : 'border-gray-200 hover:border-primary/40 hover:bg-gray-50'}`}>
              {proofData.filePreview ? (
                <img src={proofData.filePreview} alt="Preview" className="h-full w-full object-contain rounded-2xl p-1" />
              ) : proofData.file ? (
                <div className="flex flex-col items-center text-primary text-xs font-bold">
                  <FileText size={24} className="mb-1" />{proofData.file.name}
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <Upload size={24} className="mb-1" />
                  <p className="text-xs font-medium">Clique para seleccionar</p>
                  <p className="text-[10px] mt-0.5">PNG, JPG, PDF — máx. 10 MB</p>
                </div>
              )}
              <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Upload size={16} /><span>Enviar Comprovativo</span></>}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// Card de encomenda
const OrderCard = ({ order, onViewDetails }) => {
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['Pendente'];
  const canUploadProof = order.payment_method === 'transfer' &&
    ['Pendente', 'Pagamento rejeitado'].includes(order.status);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="font-bold text-gray-800 text-base">{order.order_number || `#${order.id}`}</p>
            <p className="text-xs text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Itens resumo */}
        <div className="flex items-center gap-2 mb-4">
          {(order.items || []).slice(0, 3).map((item, i) => (
            <div key={i} className="w-12 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
              {item.product_image ? (
                <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={16} className="text-gray-300" />
                </div>
              )}
            </div>
          ))}
          {(order.items?.length || 0) > 3 && (
            <div className="w-12 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
              +{order.items.length - 3}
            </div>
          )}
          <div className="flex-1 ml-2">
            <p className="text-xs text-gray-500 font-medium">
              {order.items?.length || 0} {order.items?.length === 1 ? 'produto' : 'produtos'}
            </p>
            <p className="font-bold text-gray-800">
              {Number(order.total).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
            </p>
          </div>
        </div>

        {/* Alerta de pagamento rejeitado */}
        {order.status === 'Pagamento rejeitado' && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4 flex items-start gap-2">
            <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-red-700">Comprovativo rejeitado</p>
              {order.latestProof?.rejection_reason && (
                <p className="text-xs text-red-600 mt-0.5">{order.latestProof.rejection_reason}</p>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={() => onViewDetails(order)}
            className="flex-1 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center gap-1.5">
            <Eye size={15} />Ver Detalhes
          </button>
          {canUploadProof && (
            <button onClick={() => onViewDetails(order, true)}
              className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-primary/20">
              <Upload size={15} />Enviar Comprovativo
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Modal de detalhe da encomenda
const OrderDetailModal = ({ order, onClose, onProofSuccess, openProof }) => {
  const [showProofUpload, setShowProofUpload] = useState(openProof || false);

  if (!order) return null;

  const canUploadProof = order.payment_method === 'transfer' &&
    ['Pendente', 'Pagamento rejeitado'].includes(order.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0 bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-primary">
              <Package size={22} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">{order.order_number || `#${order.id}`}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('pt-PT')}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <StatusBadge status={order.status} />
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X size={18} /></button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Itens */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Package size={13} />Produtos</p>
            <div className="border border-gray-100 rounded-2xl overflow-hidden">
              {(order.items || []).map((item, i) => (
                <div key={i} className={`flex items-center justify-between p-4 bg-white ${i < (order.items.length - 1) ? 'border-b border-gray-50' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                      {item.product_image
                        ? <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><Package size={18} className="text-gray-300" /></div>}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-700">{item.product_name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Qtd: {item.quantity}{item.selected_size ? ` • ${item.selected_size}` : ''}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-700">
                    {(Number(item.price) * item.quantity).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Endereço e Pagamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><MapPin size={13} />Entrega</p>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-sm font-bold text-gray-700">{order.customer_name}</p>
                <p className="text-xs text-gray-500 mt-1">{order.customer_phone}</p>
                <p className="text-xs text-gray-500 mt-0.5">{[order.address, order.neighborhood, order.city].filter(Boolean).join(', ')}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><CreditCard size={13} />Pagamento</p>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-sm font-bold text-gray-700 capitalize">{order.payment_method === 'transfer' ? 'Transferência Bancária' : order.payment_method === 'cash' ? 'Pagamento na Entrega' : order.payment_method}</p>
                <div className="mt-2">
                  <StatusBadge status={order.status} />
                </div>
              </div>
            </div>
          </div>

          {/* Totais */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Subtotal</span>
              <span>{Number(order.subtotal).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mb-3">
              <span>Entrega</span>
              <span className="text-emerald-600 font-bold">Grátis</span>
            </div>
            <div className="pt-3 border-t border-gray-200 flex justify-between">
              <span className="font-bold text-gray-800">Total</span>
              <span className="font-black text-primary text-base">
                {Number(order.total).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
              </span>
            </div>
          </div>

          {/* Comprovativo rejeitado */}
          {order.status === 'Pagamento rejeitado' && order.latestProof?.rejection_reason && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
              <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-700 mb-1">Comprovativo Rejeitado</p>
                <p className="text-sm text-red-600">{order.latestProof.rejection_reason}</p>
              </div>
            </div>
          )}

          {/* Histórico */}
          {(order.statusHistory || []).length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Clock size={13} />Histórico</p>
              <div className="space-y-2">
                {order.statusHistory.map((entry, i) => (
                  <div key={entry.id} className="flex items-start gap-3">
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1 ${(STATUS_CONFIG[entry.new_status] || {}).dot || 'bg-gray-300'}`} />
                      {i < order.statusHistory.length - 1 && <div className="w-0.5 h-6 bg-gray-200 mt-1" />}
                    </div>
                    <div className="flex-1 pb-2">
                      <p className="text-xs font-bold text-gray-700">{entry.new_status}</p>
                      {entry.notes && <p className="text-xs text-gray-400 mt-0.5">{entry.notes}</p>}
                      <p className="text-[10px] text-gray-300 mt-0.5">{new Date(entry.created_at).toLocaleString('pt-PT')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {canUploadProof && (
          <div className="p-6 border-t border-gray-100 bg-gray-50/50 shrink-0">
            <button onClick={() => setShowProofUpload(true)}
              className="w-full py-3.5 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              <Upload size={16} />Enviar Comprovativo
            </button>
          </div>
        )}

        {showProofUpload && (
          <ProofUploadModal order={order} onClose={() => setShowProofUpload(false)} onSuccess={onProofSuccess} />
        )}
      </motion.div>
    </div>
  );
};

// ─── Página principal ─────────────────────────────────────────────────────────
const MyOrders = () => {
  const { user, isAuthenticated, loading: authLoading } = useUserStore();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openProofDirectly, setOpenProofDirectly] = useState(false);

  const filters = ['Todos', 'Pendente', 'Comprovativo enviado', 'Pagamento confirmado', 'Em preparação', 'Em entrega', 'Entregue', 'Cancelado'];

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [authLoading, isAuthenticated]);

  const loadOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Buscar encomendas
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      if (!ordersData || ordersData.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const ids = ordersData.map(o => o.id);

      // Buscar itens
      const { data: itemsData } = await supabase
        .from('order_items')
        .select('*')
        .in('order_id', ids);

      // Buscar histórico de estados
      const { data: historyData } = await supabase
        .from('order_status_history')
        .select('*')
        .in('order_id', ids)
        .order('created_at', { ascending: false });

      // Buscar comprovativo mais recente de cada encomenda
      const { data: proofsData } = await supabase
        .from('payment_proofs')
        .select('*')
        .in('order_id', ids)
        .order('created_at', { ascending: false });

      // Mapear
      const itemsMap = (itemsData || []).reduce((acc, item) => {
        if (!acc[item.order_id]) acc[item.order_id] = [];
        acc[item.order_id].push(item);
        return acc;
      }, {});

      const historyMap = (historyData || []).reduce((acc, h) => {
        if (!acc[h.order_id]) acc[h.order_id] = [];
        acc[h.order_id].push(h);
        return acc;
      }, {});

      const proofsMap = (proofsData || []).reduce((acc, p) => {
        if (!acc[p.order_id]) acc[p.order_id] = p; // guarda o mais recente
        return acc;
      }, {});

      const enriched = ordersData.map(o => ({
        ...o,
        items: itemsMap[o.id] || [],
        statusHistory: (historyMap[o.id] || []).reverse(), // ordenar do mais antigo
        latestProof: proofsMap[o.id] || null,
      }));

      setOrders(enriched);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao carregar encomendas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadOrders();
  }, [user]);

  const filtered = activeFilter === 'Todos'
    ? orders
    : orders.filter(o => o.status === activeFilter);

  const handleViewDetails = (order, openProof = false) => {
    setSelectedOrder(order);
    setOpenProofDirectly(openProof);
  };

  if (authLoading) {
    return (
      <div className="pt-40 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen bg-gray-50/50">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Minhas Encomendas</h1>
              <p className="text-neutral-dark/50 text-sm mt-1">{orders.length} {orders.length === 1 ? 'encomenda encontrada' : 'encomendas encontradas'}</p>
            </div>
            <Link to="/" className="flex items-center gap-2 text-sm font-bold text-neutral-dark/40 hover:text-primary transition-colors">
              <ShoppingBag size={16} />Continuar a comprar
            </Link>
          </div>

          {/* Filtros */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
            {filters.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeFilter === f ? 'bg-primary text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-500 hover:border-primary/30'}`}>
                {f}
                {f !== 'Todos' && orders.filter(o => o.status === f).length > 0 && (
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${activeFilter === f ? 'bg-white/20' : 'bg-gray-100'}`}>
                    {orders.filter(o => o.status === f).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Lista */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                  <div className="h-3 bg-gray-100 rounded w-1/4 mb-4" />
                  <div className="flex gap-2 mb-4">
                    {[1, 2, 3].map(j => <div key={j} className="w-12 h-14 bg-gray-100 rounded-xl" />)}
                  </div>
                  <div className="h-9 bg-gray-100 rounded-xl" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package size={32} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-400 mb-2">Nenhuma encomenda</h3>
              <p className="text-gray-400 text-sm mb-6">
                {activeFilter === 'Todos' ? 'Ainda não realizou nenhuma compra.' : `Não tem encomendas com estado "${activeFilter}".`}
              </p>
              <Link to="/" className="btn-primary inline-flex items-center gap-2 py-3 px-6">
                <ShoppingBag size={16} />Ir às compras
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(order => (
                <OrderCard key={order.id} order={order} onViewDetails={handleViewDetails} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalhe */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => { setSelectedOrder(null); setOpenProofDirectly(false); }}
            onProofSuccess={loadOrders}
            openProof={openProofDirectly}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyOrders;
