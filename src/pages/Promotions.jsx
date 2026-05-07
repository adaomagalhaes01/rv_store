import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import productsData from '../data/products.json';
import { Sparkles, Timer, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Promotions = () => {
  const saleProducts = productsData.filter(p => p.onSale);

  return (
    <div className="pt-32 pb-20">
      <div className="container">
        {/* Banner */}
        <section className="bg-primary rounded-[3rem] p-12 md:p-20 text-white mb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md w-fit px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                <Sparkles size={14} />
                <span>Ofertas de Temporada</span>
              </div>
              <h1 className="text-4xl md:text-7xl font-bold leading-tight">Liquidação <br /> <span className="italic font-light opacity-80 underline underline-offset-8">Relâmpago.</span></h1>
              <p className="text-white/80 text-lg max-w-lg">
                Aproveite descontos exclusivos de até 40% em produtos selecionados. Por tempo limitado ou enquanto durarem os estoques!
              </p>
              <div className="flex items-center space-x-4 pt-4">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold">24</span>
                  <span className="text-[10px] uppercase font-bold opacity-60">Horas</span>
                </div>
                <span className="text-2xl font-light opacity-40">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold">15</span>
                  <span className="text-[10px] uppercase font-bold opacity-60">Minutos</span>
                </div>
                <span className="text-2xl font-light opacity-40">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold">42</span>
                  <span className="text-[10px] uppercase font-bold opacity-60">Segundos</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <img 
                src="/assets/bolsa-1.png" 
                className="w-full h-80 object-contain drop-shadow-2xl rotate-12 hover:rotate-0 transition-transform duration-500" 
                alt="Promo Image" 
              />
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <div className="mb-20">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-primary font-bold uppercase tracking-widest text-xs">Aproveite</span>
              <h2 className="text-3xl font-bold mt-2">Ofertas em Destaque</h2>
            </div>
          </div>
          
          {saleProducts.length === 0 ? (
            <div className="text-center py-20 bg-neutral-light rounded-3xl border-2 border-dashed">
              <p className="text-neutral-dark/40 font-bold uppercase tracking-widest">Novas promoções em breve!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {saleProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* Extra Banner */}
        <section className="bg-neutral-light rounded-[3rem] p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-4">Combo <br /> Cosméticos</h3>
              <p className="text-neutral-dark/60 text-sm">Leve 3 e pague 2 em toda linha de cuidados faciais.</p>
            </div>
            <Link to="/category/cosmeticos" className="mt-8 text-primary font-bold flex items-center space-x-2">
              <span>Ver Itens</span>
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm flex flex-col justify-between md:scale-105 shadow-primary/10 border-2 border-primary/20">
            <div>
              <div className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full w-fit mb-4 uppercase">Mais Popular</div>
              <h3 className="text-2xl font-bold mb-4">Frete Grátis <br /> em Luanda</h3>
              <p className="text-neutral-dark/60 text-sm">Em todas as compras acima de 50.000 AOA.</p>
            </div>
            <Link to="/category/todos" className="mt-8 btn-primary text-center py-3">Aproveitar</Link>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-4">Primeira <br /> Compra</h3>
              <p className="text-neutral-dark/60 text-sm">Use o cupom <b>RVNEW</b> e ganhe 10% OFF no total.</p>
            </div>
            <Link to="/category/todos" className="mt-8 text-primary font-bold flex items-center space-x-2">
              <span>Copiar Cupom</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Promotions;
