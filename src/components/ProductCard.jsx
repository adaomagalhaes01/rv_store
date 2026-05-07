import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import useCartStore from '../context/useCartStore';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCartStore();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} adicionado ao carrinho!`, {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block overflow-hidden rounded-xl bg-neutral-light relative aspect-[3/4]">
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {product.onSale && (
            <span className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full">
              PROMO
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-neutral-dark text-white text-[10px] font-bold px-3 py-1 rounded-full">
              NOVO
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-md text-neutral-dark hover:text-primary transition-colors shadow-sm opacity-0 group-hover:opacity-100 transform translate-y-[-10px] group-hover:translate-y-0 duration-300">
          <Heart size={16} />
        </button>

        {/* Product Image */}
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />

        {/* Quick Add Button */}
        <div className="absolute bottom-4 left-4 right-4 z-10 opacity-0 group-hover:opacity-100 transform translate-y-[10px] group-hover:translate-y-0 transition-all duration-300">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-white/95 backdrop-blur-md hover:bg-primary hover:text-white text-neutral-dark font-bold py-2 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-sm text-xs"
          >
            <ShoppingCart size={14} />
            <span>Adicionar</span>
          </button>
        </div>
      </Link>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-dark/50 uppercase tracking-widest">{product.category}</span>
          <div className="flex items-center text-yellow-400">
            <Star size={12} fill="currentColor" />
            <span className="text-[10px] font-bold ml-1 text-neutral-dark/60">{product.rating}</span>
          </div>
        </div>
        <Link to={`/product/${product.id}`} className="block font-semibold text-neutral-dark hover:text-primary transition-colors line-clamp-1">
          {product.name}
        </Link>
        <div className="flex items-center space-x-2">
          <span className="text-primary font-bold text-lg">
            {product.price.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
          </span>
          {product.onSale && (
            <span className="text-neutral-dark/30 line-through text-sm">
              {product.originalPrice.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
