import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { ArrowRight, ShoppingBag, Truck, ShieldCheck, Zap, Mail, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import productsData from '../data/products.json';
import toast from 'react-hot-toast';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const Home = () => {
  const featuredProducts = productsData.filter(p => p.isFeatured).slice(0, 4);
  const promotionProducts = productsData.filter(p => p.onSale).slice(0, 4);

  const categories = [
    { name: 'Masculino', image: '/assets/camisa-azul-1.png', path: '/category/masculino' },
    { name: 'Feminino', image: '/assets/vestido-rosa-1.png', path: '/category/feminino' },
    { name: 'Cosméticos', image: '/assets/perfume-1.png', path: '/category/cosmeticos' },
    { name: 'Calçados', image: '/assets/tenis-1.png', path: '/category/calcados' },
  ];

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] overflow-hidden bg-neutral-light">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          pagination={{ clickable: true }}
          autoplay={{ delay: 6000 }}
          className="h-full"
        >
          <SwiperSlide>
            <div className="relative h-full w-full flex items-center justify-center">
              <motion.div 
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, ease: "linear" }}
                className="absolute inset-0 w-full h-full"
              >
                <img 
                  src="/assets/vestido-rosa-1.png" 
                  className="w-full h-full object-cover" 
                  alt="Banner 1"
                />
              </motion.div>
              <div className="absolute inset-0 bg-white/10" />
              <div className="container relative h-full flex flex-col justify-center items-center text-center text-neutral-dark">
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-primary text-primary bg-primary/10"
                >
                  Coleção Exclusiva
                </motion.span>
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-5xl md:text-8xl font-medium leading-tight mb-6 max-w-4xl"
                >
                  A Nova Era da <span className="text-primary italic font-light">Elegância.</span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-lg text-neutral-dark/60 mb-8 max-w-lg"
                >
                  Descubra peças únicas que definem o seu estilo. Qualidade premium com curadoria exclusiva RV_Store.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link to="/category/feminino" className="btn-primary flex items-center space-x-2 rounded-[2px]">
                    <span>Explorar Agora</span>
                    <ArrowRight size={18} />
                  </Link>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative h-full w-full flex items-center justify-center">
              <motion.div 
                initial={{ scale: 1 }}
                animate={{ scale: 1.2 }}
                transition={{ duration: 10, ease: "linear" }}
                className="absolute inset-0 w-full h-full"
              >
                <img 
                  src="/assets/camisa-azul-1.png" 
                  className="w-full h-full object-cover" 
                  alt="Banner 2"
                />
              </motion.div>
              <div className="absolute inset-0 bg-white/10" />
              <div className="container relative h-full flex flex-col justify-center items-center text-center text-neutral-dark">
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-primary text-primary bg-primary/10"
                >
                  Essentials
                </motion.span>
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl md:text-8xl font-medium leading-tight mb-6 max-w-4xl"
                >
                  Estilo que <span className="text-primary italic font-light">Inspira.</span>
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link to="/category/masculino" className="btn-primary flex items-center space-x-2 rounded-[2px]">
                    <span>Ver Coleção</span>
                    <ArrowRight size={18} />
                  </Link>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <Truck size={24} />, title: 'Entrega Rápida', desc: 'Em toda Luanda' },
            { icon: <ShieldCheck size={24} />, title: 'Pagamento Seguro', desc: 'Transações protegidas' },
            { icon: <Zap size={24} />, title: 'Qualidade Premium', desc: 'Produtos originais' },
            { icon: <ShoppingBag size={24} />, title: 'Devolução Fácil', desc: '7 dias garantidos' },
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center space-x-4 p-4 rounded-2xl border border-neutral-light hover:border-primary/30 transition-colors bg-white shadow-sm"
            >
              <div className="text-primary">{feature.icon}</div>
              <div>
                <h3 className="font-bold text-xs">{feature.title}</h3>
                <p className="text-[10px] text-neutral-dark/50">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
            <div>
              <span className="text-primary font-bold uppercase tracking-widest text-xs">Categorias</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">Explore por Estilo</h2>
            </div>
            <Link to="/promotions" className="text-primary font-semibold flex items-center space-x-2 hover:underline">
              <span>Ver todas promoções</span>
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative h-80 rounded-2xl overflow-hidden bg-neutral-light cursor-pointer shadow-sm"
              >
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-sm">
                    <h3 className="text-lg font-bold text-neutral-dark">{cat.name}</h3>
                    <Link to={cat.path} className="text-primary text-xs font-bold flex items-center space-x-1 mt-1">
                      <span>Ver Tudo</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-neutral-light/20">
        <div className="container">
          <div className="text-center mb-16">
            <span className="text-primary font-bold uppercase tracking-widest text-xs">Destaques</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Produtos em Destaque</h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/category/todos" className="btn-secondary">
              Ver Catálogo Completo
            </Link>
          </div>
        </div>
      </section>

      {/* Sale Section */}
      <section className="py-20">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
            <div>
              <span className="text-primary font-bold uppercase tracking-widest text-xs">Oportunidades</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">Promoções Imperdíveis</h2>
            </div>
            <Link to="/promotions" className="text-primary font-semibold flex items-center space-x-2 hover:underline">
              <span>Ver todas</span>
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {promotionProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto bg-primary/5 rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 border border-primary/10">
            <div className="md:w-1/2 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Ganhe 10% OFF agora</h2>
              <p className="text-neutral-dark/60 text-sm font-medium">Assine nossa newsletter e receba ofertas exclusivas.</p>
            </div>
            <div className="md:w-1/2 w-full">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success('Inscrição realizada!');
                  e.target.reset();
                }}
                className="space-y-4"
              >
                <div className="relative">
                  <input 
                    type="email" 
                    required
                    placeholder="Seu email" 
                    className="w-full bg-white border border-neutral-200 rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/10 transition-all text-sm"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full btn-primary py-4"
                >
                  Assinar Agora
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* About Section Preview */}
      <section className="py-20">
        <div className="container">
          <div className="bg-secondary/50 rounded-3xl p-12 md:p-20 relative overflow-hidden border border-primary/10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative z-10 space-y-6">
                <h2 className="text-3xl md:text-5xl font-bold leading-tight text-neutral-dark">RV_Store: A Sua Escolha de Moda</h2>
                <p className="text-neutral-dark/60 text-lg leading-relaxed">
                  Localizada no Morro Bento, somos a sua referência para o que há de mais moderno em moda e beleza em Luanda.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/about" className="btn-primary">Conheça Mais</Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden h-64 border border-white shadow-lg">
                  <img src="/assets/skincare-1.png" className="w-full h-full object-cover" alt="About 1" />
                </div>
                <div className="rounded-2xl overflow-hidden h-64 border border-white shadow-lg">
                  <img src="/assets/bolsa-1.png" className="w-full h-full object-cover" alt="About 2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
