import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Truck, ShieldCheck, ArrowLeft, Plus, Minus, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import productsData from '../data/products.json';
import useCartStore from '../context/useCartStore';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCartStore();

  useEffect(() => {
    const found = productsData.find(p => p.id === parseInt(id));
    if (found) {
      setProduct(found);
      if (found.sizes.length > 0) setSelectedSize(found.sizes[0]);
      if (found.colors.length > 0) setSelectedColor(found.colors[0]);
    }
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    toast.success(`${product.name} adicionado ao carrinho!`, {
      icon: '🛍️',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  const relatedProducts = productsData
    .filter(p => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  if (!product) return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="pt-32 pb-20">
      <div className="container">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center space-x-2 text-neutral-dark/60 hover:text-primary mb-10 transition-colors">
          <ArrowLeft size={18} />
          <span className="font-medium text-sm">Voltar para o Catálogo</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-neutral-light relative group shadow-2xl"
            >
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <button className="absolute top-6 right-6 p-3 rounded-full bg-white/80 backdrop-blur-md text-neutral-dark hover:text-primary transition-all shadow-sm">
                <Heart size={20} />
              </button>
            </motion.div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-primary' : 'border-transparent opacity-60'}`}
                  >
                    <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Details */}
          <div className="flex flex-col justify-center">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="bg-secondary text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                  {product.category}
                </span>
                <button className="text-neutral-dark/40 hover:text-primary transition-colors">
                  <Share2 size={20} />
                </button>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight">{product.name}</h1>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                  ))}
                  <span className="text-neutral-dark font-bold ml-2">{product.rating}</span>
                </div>
                <span className="text-neutral-dark/40 text-sm">|</span>
                <span className="text-neutral-dark/60 text-sm">24 Avaliações</span>
              </div>

              <div className="flex items-baseline space-x-4">
                <span className="text-4xl font-bold text-primary">
                  {product.price.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                </span>
                {product.onSale && (
                  <span className="text-xl text-neutral-dark/30 line-through">
                    {product.originalPrice.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                  </span>
                )}
              </div>

              <p className="text-neutral-dark/70 text-lg leading-relaxed">
                {product.description}
              </p>

              {/* Selections */}
              <div className="space-y-8 pt-6 border-t">
                {product.sizes.length > 0 && (
                  <div>
                    <h3 className="font-bold mb-4 flex items-center justify-between">
                      <span>Tamanho</span>
                      <span className="text-primary text-xs font-bold underline cursor-pointer">Guia de Tamanhos</span>
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {product.sizes.map(size => (
                        <button 
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[50px] h-12 px-4 rounded-xl border-2 font-bold transition-all ${selectedSize === size ? 'border-primary bg-primary text-white' : 'border-neutral-light hover:border-primary/50'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.colors.length > 0 && (
                  <div>
                    <h3 className="font-bold mb-4">Cores Disponíveis</h3>
                    <div className="flex flex-wrap gap-4">
                      {product.colors.map(color => (
                        <button 
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-5 py-2 rounded-full border-2 font-medium transition-all ${selectedColor === color ? 'border-primary bg-secondary text-primary' : 'border-neutral-light hover:border-primary/50'}`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              {/* Quantity and Add to Cart */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
                <div className="flex items-center border border-neutral-200 rounded-xl h-12 overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 h-full hover:text-primary transition-colors border-r border-neutral-100"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 h-full hover:text-primary transition-colors border-l border-neutral-100"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="flex-grow btn-primary flex items-center justify-center space-x-3 h-12 w-full sm:w-auto"
                >
                  <ShoppingBag size={20} />
                  <span>Adicionar ao Carrinho</span>
                </button>
                <button className="h-12 w-12 flex items-center justify-center border-2 border-neutral-light rounded-xl hover:border-primary transition-all group">
                  <Heart size={20} className="group-hover:fill-primary group-hover:text-primary transition-all" />
                </button>
              </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 pt-10 border-t">
                <div className="flex items-center space-x-3 p-4 bg-neutral-light/50 rounded-2xl">
                  <Truck className="text-primary" size={24} />
                  <div>
                    <p className="text-[10px] font-bold uppercase text-neutral-dark/40">Frete</p>
                    <p className="text-sm font-bold">Grátis em Luanda</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-neutral-light/50 rounded-2xl">
                  <ShieldCheck className="text-primary" size={24} />
                  <div>
                    <p className="text-[10px] font-bold uppercase text-neutral-dark/40">Garantia</p>
                    <p className="text-sm font-bold">Qualidade RV_Store</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-32">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-primary font-bold uppercase tracking-widest text-xs">Coleção</span>
                <h2 className="text-3xl font-bold mt-2">Você também pode gostar</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
