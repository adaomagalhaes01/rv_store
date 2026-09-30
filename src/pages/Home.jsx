import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { ArrowRight, ShoppingBag, Truck, ShieldCheck, Zap, Mail, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { fetchFeatured, fetchOnSale, fetchBanners, fetchCategories } from '../lib/products';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [promotionProducts, setPromotionProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetchFeatured(4).catch(() => []), 
      fetchOnSale().catch(() => []),
      fetchBanners().catch(() => []),
      fetchCategories().catch(() => [])
    ]).then(([featured, sale, fetchedBanners, fetchedCategories]) => {
      if (!active) return;
      setFeaturedProducts(featured.slice(0, 4));
      setPromotionProducts(sale.slice(0, 4));
      setBanners(fetchedBanners);
      setCategories(fetchedCategories);
    });
    return () => { active = false; };
  }, []);

  const subscribeNewsletter = async (e) => {
    e.preventDefault();
    const email = e.target.elements.email.value;
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email });
    if (error) {
      const m = (error.message || '').toLowerCase();
      if (m.includes('duplicate') || m.includes('already')) {
        toast.success('Este email já está registado na nossa newsletter!');
      } else {
        toast.error('Não foi possível fazer a inscrição. Tente novamente.');
      }
    } else {
      toast.success('Inscrição realizada! Receberá as nossas novidades.');
    }
    e.target.reset();
  };

  const defaultCategories = [
    { name: 'Masculino', image: '/assets/camisa-azul-1.png', path: '/category/masculino' },
    { name: 'Feminino', image: '/assets/vestido-rosa-1.png', path: '/category/feminino' },
    { name: 'Cosméticos', image: '/assets/perfume-1.png', path: '/category/cosmeticos' },
    { name: 'Calçados', image: '/assets/tenis-1.png', path: '/category/calcados' },
  ];

  const displayCategories = categories.length > 0 
    ? categories.map(c => ({ name: c.name, image: c.image_url || '/assets/perfume-1.png', path: `/category/${c.slug}` }))
    : defaultCategories;

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] overflow-hidden bg-neutral-light">
        {banners.length > 0 ? (
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            pagination={{ clickable: true }}
            autoplay={{ delay: 6000 }}
            className="h-full"
          >
            {banners.map((banner) => (
              <SwiperSlide key={banner.id}>
                <div className="relative h-full w-full flex items-center justify-center">
                  <div className="absolute inset-0 w-full h-full">
                    <img 
                      src={banner.image_url} 
                      className="w-full h-full object-cover" 
                      alt={banner.title}
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="container relative h-full flex flex-col justify-center items-center text-center text-white">
                    {banner.subtitle && (
                      <span className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-white/50 bg-white/10">
                        {banner.subtitle}
                      </span>
                    )}
                    <h1 className="text-5xl md:text-8xl font-medium leading-tight mb-6 max-w-4xl drop-shadow-lg">
                      {banner.title}
                    </h1>
                    {banner.link && (
                      <div>
                        <Link to={banner.link} className="btn-primary flex items-center space-x-2 rounded-[2px] bg-white text-black hover:bg-neutral-light">
                          <span>Ver Mais</span>
                          <ArrowRight size={18} />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            pagination={{ clickable: true }}
            autoplay={{ delay: 6000 }}
            className="h-full"
          >
            <SwiperSlide>
              <div className="relative h-full w-full flex items-center justify-center">
                <div className="absolute inset-0 w-full h-full">
                  <img src="/assets/vestido-rosa-1.png" className="w-full h-full object-cover" alt="Banner 1" />
                </div>
                <div className="absolute inset-0 bg-white/10" />
                <div className="container relative h-full flex flex-col justify-center items-center text-center text-neutral-dark">
                  <span className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-primary text-primary bg-primary/10">
                    Coleção Exclusiva
                  </span>
                  <h1 className="text-5xl md:text-8xl font-medium leading-tight mb-6 max-w-4xl">
                    A Nova Era da <span className="text-primary italic font-light">Elegância.</span>
                  </h1>
                  <p className="text-lg text-neutral-dark/60 mb-8 max-w-lg">
                    Descubra peças únicas que definem o seu estilo. Qualidade premium com curadoria exclusiva RV_Store.
                  </p>
                  <div>
                    <Link to="/category/feminino" className="btn-primary flex items-center space-x-2 rounded-[2px]">
                      <span>Explorar Agora</span>
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        )}
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
            <div 
              key={idx}
              className="flex items-center space-x-4 p-4 rounded-2xl border border-neutral-light hover:border-primary/30 transition-colors bg-white shadow-sm"
            >
              <div className="text-primary">{feature.icon}</div>
              <div>
                <h3 className="font-bold text-xs">{feature.title}</h3>
                <p className="text-[10px] text-neutral-dark/50">{feature.desc}</p>
              </div>
            </div>
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
            {displayCategories.map((cat, idx) => (
              <div
                key={idx}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-white border border-neutral-light/50 cursor-pointer shadow-sm flex flex-col items-center justify-center p-6"
              >
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-sm flex flex-col items-center text-center">
                    <h3 className="text-sm md:text-base font-bold text-neutral-dark">{cat.name}</h3>
                    <Link to={cat.path} className="text-primary text-[10px] uppercase font-bold flex items-center space-x-1 mt-1">
                      <span>Ver Tudo</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
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
                onSubmit={subscribeNewsletter}
                className="space-y-4"
              >
                <div className="relative">
                  <input 
                    type="email" 
                    name="email"
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
