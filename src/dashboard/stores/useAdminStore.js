import { create } from 'zustand';
import { supabase, getProfile } from '../../lib/supabase';

const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString('pt-PT') : '');
const splitColors = (str) =>
  String(str || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

const mapProduct = (p) => ({
  id: Number(p.id),
  name: p.name,
  category: p.category,
  price: Number(p.price),
  stock: Number(p.stock),
  sales: Number(p.sales),
  image: p.images?.[0] || '',
  description: p.description || '',
  sizes: p.size_stock || {},
  discountCoupon: p.discount_coupon || '',
  colors: Array.isArray(p.colors) ? p.colors.join(', ') : p.colors || '',
});

const mapUser = (u) => ({
  id: u.id,
  name: u.full_name || '',
  email: u.email || '',
  phone: u.phone || '',
  role: u.role === 'admin' ? 'Admin' : 'Cliente',
  status: u.status === 'ativo' ? 'Ativo' : 'Suspenso',
  joined: formatDate(u.created_at),
});

const mapBanner = (b) => ({
  id: Number(b.id),
  title: b.title,
  subtitle: b.subtitle || '',
  link: b.link || '',
  image: b.image_url || '',
  active: b.active,
});

const mapOrder = (o, items, history = [], proof = null) => ({
  dbId: Number(o.id),
  id: o.order_number || `#${o.id}`,
  customer: o.customer_name,
  status: o.status,
  paymentStatus: o.payment_status,
  notes: o.notes,
  cancellationReason: o.cancellation_reason,
  date: formatDate(o.created_at),
  createdAt: o.created_at,
  total: Number(o.total),
  subtotal: Number(o.subtotal),
  shipping: Number(o.shipping_fee),
  email: o.customer_email || '',
  phone: o.customer_phone || '',
  address: [o.address, o.neighborhood, o.city].filter(Boolean).join(', '),
  paymentMethod: o.payment_method,
  items,
  statusHistory: history,
  latestProof: proof,
});

const useAdminStore = create((set, get) => ({
  isAuthenticated: false,
  user: null,
  products: [],
  orders: [],
  users: [],
  banners: [],
  inventory: [],
  adminNotifications: [],
  stats: {
    totalSales: '0 AOA',
    activeProducts: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    proofSent: 0,
    awaitingPaymentConfirm: 0,
    paymentConfirmed: 0,
    inPreparation: 0,
    readyForDelivery: 0,
    inDelivery: 0,
    delivered: 0,
    cancelled: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalStockIn: 0,
    totalStockOut: 0,
  },
  loading: false,

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    const profile = await getProfile(session.user.id);
    if (profile?.role === 'admin') {
      set({ isAuthenticated: true, user: { name: profile.full_name, role: profile.role, email: profile.email } });
      get().loadProducts();
      get().loadOrders();
      get().loadStats();
      get().loadAdminNotifications();
    }
  },

  loadAdminNotifications: async () => {
    // Buscar encomendas pendentes recentes
    const { data: orders } = await supabase
      .from('orders')
      .select('id, order_number, customer_name, status, payment_method, created_at')
      .in('status', ['Pendente', 'Comprovativo enviado'])
      .order('created_at', { ascending: false })
      .limit(3);

    // Buscar produtos com stock baixo
    const { data: products } = await supabase
      .from('products')
      .select('id, name, stock')
      .lte('stock', 5)
      .eq('active', true)
      .limit(3);

    let notifs = [];
    
    if (orders) {
      orders.forEach(o => {
        notifs.push({
          id: `order-${o.id}`,
          text: o.status === 'Comprovativo enviado' 
            ? `Comprovativo enviado para ${o.order_number || '#' + o.id} (${o.customer_name})`
            : `Nova encomenda ${o.order_number || '#' + o.id} de ${o.customer_name}`,
          type: 'order',
          time: new Date(o.created_at).toLocaleString('pt-PT'),
          timestamp: new Date(o.created_at).getTime(),
          color: o.status === 'Comprovativo enviado' ? '#3b82f6' : '#ff4d6d',
          iconName: o.status === 'Comprovativo enviado' ? 'FileText' : 'ShoppingCart'
        });
      });
    }

    if (products) {
      products.forEach(p => {
        notifs.push({
          id: `stock-${p.id}`,
          text: p.stock === 0 
            ? `Esgotado: ${p.name}` 
            : `Stock baixo: ${p.name} (${p.stock} unid.)`,
          type: 'stock',
          time: 'Agora',
          timestamp: Date.now(),
          color: p.stock === 0 ? '#ef4444' : '#f97316',
          iconName: 'Package'
        });
      });
    }

    notifs.sort((a, b) => b.timestamp - a.timestamp);
    set({ adminNotifications: notifs });
  },

  login: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      const msg = error?.message?.toLowerCase();
      const friendly =
        msg?.includes('invalid login credentials') ? 'Email ou palavra-passe incorretos.'
        : msg?.includes('email not confirmed') ? 'Confirme o seu email antes de entrar.'
        : error?.message || 'Não foi possível entrar. Tente novamente.';
      return { ok: false, error: { message: friendly } };
    }
    const profile = await getProfile(data.user.id);
    if (!profile || profile.role !== 'admin') {
      await supabase.auth.signOut();
      return { ok: false, error: { message: 'Esta conta não tem acesso de administrador.' } };
    }
    set({ isAuthenticated: true, user: { name: profile.full_name, role: profile.role, email: profile.email } });
    get().loadProducts();
    get().loadOrders();
    get().loadStats();
    get().loadUsers();
    return { ok: true, error: null };
  },

  register: async ({ name, email, password }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name }, emailRedirectTo: window.location.origin },
    });
    if (error) {
      const msg = error.message?.toLowerCase();
      const friendly = msg?.includes('user already registered')
        ? 'Já existe uma conta com este email.'
        : msg?.includes('rate limit')
          ? 'Limite de envio de emails atingido. Tente novamente mais tarde.'
          : error.message;
      return { ok: false, error: { message: friendly } };
    }
    return { ok: true, error: null };
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ isAuthenticated: false, user: null, products: [], orders: [], users: [], banners: [] });
  },

  loadProducts: async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sales', { ascending: false });
    if (error) return;
    set({ products: (data || []).map(mapProduct) });
  },

  addProduct: async (product) => {
    const colors = splitColors(product.colors);
    const { error } = await supabase.from('products').insert({
      name: product.name,
      category: product.category,
      sub_category: product.category,
      description: product.description,
      price: Number(product.price) || 0,
      original_price: product.originalPrice ? Number(product.originalPrice) : null,
      stock: Number(product.stock) || 0,
      images: product.image ? [product.image] : ['/assets/perfume-1.png'],
      colors,
      sizes: Object.keys(product.sizes || {}),
      size_stock: product.sizes || {},
      discount_coupon: product.discountCoupon || null,
      is_featured: true,
      on_sale: product.onSale || false,
      active: true,
    });
    if (error) return { ok: false, error: { message: error.message } };
    await get().loadProducts();
    return { ok: true, error: null };
  },

  updateProduct: async (id, product) => {
    const colors = splitColors(product.colors);
    const { error } = await supabase
      .from('products')
      .update({
        name: product.name,
        category: product.category,
        description: product.description,
        price: Number(product.price) || 0,
        stock: Number(product.stock) || 0,
        images: product.image ? Array.isArray(product.image) ? product.image : [product.image] : [],
        colors,
        sizes: Object.keys(product.sizes || {}),
        size_stock: product.sizes || {},
        discount_coupon: product.discountCoupon || null,
      })
      .eq('id', Number(id));
    if (error) return { ok: false, error: { message: error.message } };
    await get().loadProducts();
    return { ok: true, error: null };
  },

  deleteProduct: async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', Number(id));
    if (error) return { ok: false, error: { message: error.message } };
    await get().loadProducts();
    return { ok: true, error: null };
  },

  loadOrders: async () => {
    const { data: ordersData, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return;

    const ids = (ordersData || []).map((o) => o.id);
    let itemsMap = {};
    let historyMap = {};
    let proofsMap = {};

    if (ids.length > 0) {
      const { data: items } = await supabase.from('order_items').select('*').in('order_id', ids);
      itemsMap = (items || []).reduce((acc, it) => {
        if (!acc[it.order_id]) acc[it.order_id] = [];
        acc[it.order_id].push({
          name: it.product_name || 'Produto',
          quantity: it.quantity,
          price: Number(it.price),
          image: it.product_image || '',
        });
        return acc;
      }, {});

      const { data: history } = await supabase.from('order_status_history').select('*').in('order_id', ids).order('created_at', { ascending: false });
      historyMap = (history || []).reduce((acc, h) => {
        if (!acc[h.order_id]) acc[h.order_id] = [];
        acc[h.order_id].push(h);
        return acc;
      }, {});

      const { data: proofs } = await supabase.from('payment_proofs').select('*').in('order_id', ids).order('created_at', { ascending: false });
      proofsMap = (proofs || []).reduce((acc, p) => {
        if (!acc[p.order_id]) acc[p.order_id] = p; // Guarda o mais recente
        return acc;
      }, {});
    }

    set({ orders: (ordersData || []).map((o) => mapOrder(o, itemsMap[o.id] || [], (historyMap[o.id] || []).reverse(), proofsMap[o.id] || null)) });
  },

  updateOrderStatus: async (id, status) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', Number(id));
    if (error) return { ok: false, error: { message: error.message } };
    await get().loadOrders();
    return { ok: true, error: null };
  },

  loadUsers: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return;
    set({ users: (data || []).map(mapUser) });
  },

  addUser: async (userData) => {
    const role = userData.role === 'Admin' ? 'admin' : 'cliente';
    const status = userData.status === 'Ativo' ? 'ativo' : 'suspenso';
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: 'rvstore123',
      options: {
        data: { full_name: userData.name, phone: userData.phone },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) {
      const msg = error.message?.toLowerCase();
      const friendly = msg?.includes('user already registered')
        ? 'Já existe uma conta com este email.'
        : msg?.includes('rate limit')
          ? 'Limite de envio de emails atingido. Tente novamente mais tarde.'
          : error.message;
      return { ok: false, error: { message: friendly } };
    }
    if (data?.user) {
      await supabase
        .from('profiles')
        .update({ role, phone: userData.phone || null, status })
        .eq('id', data.user.id);
    }
    await get().loadUsers();
    return {
      ok: true,
      error: null,
      message: 'Conta criada com acesso imediato.',
    };
  },

  updateUser: async (id, userData) => {
    const role = userData.role === 'Admin' ? 'admin' : 'cliente';
    const status = userData.status === 'Ativo' ? 'ativo' : 'suspenso';
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: userData.name, phone: userData.phone || null, role, status })
      .eq('id', id);
    if (error) return { ok: false, error: { message: error.message } };
    await get().loadUsers();
    return { ok: true, error: null };
  },

  deleteUser: async (id) => {
    const { error } = await supabase
      .from('profiles')
      .update({ status: 'suspenso' })
      .eq('id', id);
    if (error) return { ok: false, error: { message: error.message } };
    await get().loadUsers();
    return { ok: true, error: null };
  },

  loadBanners: async () => {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('position');
    if (error) return;
    set({ banners: (data || []).map(mapBanner) });
  },

  addBanner: async (banner) => {
    const { error } = await supabase.from('banners').insert({
      title: banner.title,
      subtitle: banner.subtitle,
      link: banner.link,
      image_url: banner.image,
      active: banner.active,
      position: 0,
    });
    if (error) return { ok: false, error: { message: error.message } };
    await get().loadBanners();
    return { ok: true, error: null };
  },

  updateBanner: async (id, banner) => {
    const { error } = await supabase
      .from('banners')
      .update({
        title: banner.title,
        subtitle: banner.subtitle,
        link: banner.link,
        image_url: banner.image,
        active: banner.active,
      })
      .eq('id', Number(id));
    if (error) return { ok: false, error: { message: error.message } };
    await get().loadBanners();
    return { ok: true, error: null };
  },

  deleteBanner: async (id) => {
    const { error } = await supabase.from('banners').delete().eq('id', Number(id));
    if (error) return { ok: false, error: { message: error.message } };
    await get().loadBanners();
    return { ok: true, error: null };
  },

  toggleBanner: async (id, active) => {
    const { error } = await supabase
      .from('banners')
      .update({ active: !active })
      .eq('id', Number(id));
    if (error) return { ok: false, error: { message: error.message } };
    await get().loadBanners();
    return { ok: true, error: null };
  },

  loadStats: async () => {
    const { data, error } = await supabase.rpc('get_dashboard_stats');
    if (error) return;
    const s = data || {};
    const total = Number(s.total_sales) || 0;
    set({
      stats: {
        totalSales: `${total.toLocaleString('pt-AO')} AOA`,
        activeProducts:         Number(s.active_products) || 0,
        pendingOrders:          Number(s.pending_orders) || 0,
        totalCustomers:         Number(s.total_customers) || 0,
        proofSent:              Number(s.proof_sent) || 0,
        awaitingPaymentConfirm: Number(s.awaiting_payment_confirm) || 0,
        paymentConfirmed:       Number(s.payment_confirmed) || 0,
        inPreparation:          Number(s.in_preparation) || 0,
        readyForDelivery:       Number(s.ready_for_delivery) || 0,
        inDelivery:             Number(s.in_delivery) || 0,
        delivered:              Number(s.delivered) || 0,
        cancelled:              Number(s.cancelled) || 0,
        lowStockProducts:       Number(s.low_stock_products) || 0,
        outOfStockProducts:     Number(s.out_of_stock_products) || 0,
        totalStockIn:           Number(s.total_stock_in) || 0,
        totalStockOut:          Number(s.total_stock_out) || 0,
      },
    });
  },

  // ─── Confirmar pagamento ───────────────────────────────────────────
  confirmPayment: async (orderId) => {
    const { data: { session } } = await supabase.auth.getSession();
    const adminId = session?.user?.id;
    const { error } = await supabase.rpc('confirm_payment', {
      p_order_id: Number(orderId),
      p_admin_id: adminId,
    });
    if (error) return { ok: false, error: { message: error.message } };
    await get().loadOrders();
    await get().loadStats();
    return { ok: true, error: null };
  },

  // ─── Rejeitar pagamento ───────────────────────────────────────────
  rejectPayment: async (orderId, reason) => {
    const { data: { session } } = await supabase.auth.getSession();
    const adminId = session?.user?.id;
    const { error } = await supabase.rpc('reject_payment', {
      p_order_id: Number(orderId),
      p_admin_id: adminId,
      p_reason:   reason || 'Sem motivo especificado',
    });
    if (error) return { ok: false, error: { message: error.message } };
    await get().loadOrders();
    await get().loadStats();
    return { ok: true, error: null };
  },

  // ─── Atualizar estado com histórico ───────────────────────────────
  updateOrderStatusWithHistory: async (orderId, newStatus, notes = null) => {
    const { data: { session } } = await supabase.auth.getSession();
    const adminId = session?.user?.id;
    const { error } = await supabase.rpc('update_order_status', {
      p_order_id:   Number(orderId),
      p_new_status: newStatus,
      p_admin_id:   adminId,
      p_notes:      notes,
    });
    if (error) return { ok: false, error: { message: error.message } };
    await get().loadOrders();
    await get().loadStats();
    return { ok: true, error: null };
  },

  // ─── Inventário ───────────────────────────────────────────────────
  loadInventory: async () => {
    const { data, error } = await supabase
      .from('inventory_movements')
      .select(`
        *,
        products(name, images),
        profiles(full_name)
      `)
      .order('created_at', { ascending: false })
      .limit(200);
    if (error) return;
    set({
      inventory: (data || []).map(m => ({
        id:           m.id,
        product_id:   m.product_id,
        productName:  m.products?.name || 'Produto',
        productImage: m.products?.images?.[0] || '',
        type:         m.type,
        quantity:     m.quantity,
        stockBefore:  m.stock_before,
        stockAfter:   m.stock_after,
        reason:       m.reason || '',
        orderId:      m.order_id,
        performedBy:  m.profiles?.full_name || 'Sistema',
        date:         formatDate(m.created_at),
        createdAt:    m.created_at,
      })),
    });
  },

  addStockEntry: async (productId, quantity, reason) => {
    const { data: { session } } = await supabase.auth.getSession();
    const adminId = session?.user?.id;
    const { error } = await supabase.rpc('add_stock_entry', {
      p_product_id: Number(productId),
      p_quantity:   Number(quantity),
      p_reason:     reason || 'Entrada manual de stock',
      p_admin_id:   adminId,
    });
    if (error) return { ok: false, error: { message: error.message } };
    await get().loadInventory();
    await get().loadProducts();
    await get().loadStats();
    return { ok: true, error: null };
  },
}));

export default useAdminStore;