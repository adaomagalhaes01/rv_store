import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Filter, ChevronDown, SlidersHorizontal, Grid, List } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SkeletonProduct from '../components/SkeletonProduct';
import productsData from '../data/products.json';
import { motion, AnimatePresence } from 'framer-motion';

const Category = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [sortBy, setSortBy] = useState('relevant');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 100000]);

  useEffect(() => {
    let filtered = productsData;
    if (id && id !== 'todos') {
      filtered = productsData.filter(p => p.category.toLowerCase() === id.toLowerCase());
      setCategoryName(id.charAt(0).toUpperCase() + id.slice(1));
    } else {
      setCategoryName('Todos os Produtos');
    }
    
    // Sort logic
    if (sortBy === 'price-low') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    }

    setProducts(filtered);
    
    // Simulate loading delay for better UX
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [id, sortBy]);

  return (
    <div className="pt-32 pb-20">
      <div className="container">
        {/* Breadcrumbs & Title */}
        <div className="mb-12">
          <span className="text-neutral-dark/40 text-sm">Home / Catálogo / <span className="text-primary font-medium">{categoryName}</span></span>
          <h1 className="text-4xl font-bold mt-4">{categoryName}</h1>
          <p className="text-neutral-dark/60 mt-2">Encontramos {products.length} produtos para você.</p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-8 border-b space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-neutral-light px-5 py-2.5 rounded-full font-medium hover:bg-secondary transition-colors"
            >
              <SlidersHorizontal size={18} />
              <span>Filtros</span>
            </button>
            <div className="hidden sm:flex items-center bg-neutral-light rounded-full p-1">
              <button className="p-1.5 bg-white shadow-sm rounded-full text-primary"><Grid size={18} /></button>
              <button className="p-1.5 text-neutral-dark/40 hover:text-primary"><List size={18} /></button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-neutral-dark/60">Ordenar por:</span>
            <div className="relative group">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-neutral-light border-none rounded-full px-6 py-2.5 pr-10 text-sm font-bold focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="relevant">Mais Relevantes</option>
                <option value="price-low">Menor Preço</option>
                <option value="price-high">Maior Preço</option>
                <option value="rating">Melhor Avaliados</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-dark/40" />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar (Mobile Overlay + Desktop Inline) */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full lg:w-64 space-y-10"
              >
                <div>
                  <h3 className="font-bold mb-5 flex items-center justify-between">
                    <span>Faixa de Preço</span>
                    <ChevronDown size={16} />
                  </h3>
                  <div className="space-y-4">
                    <input type="range" min="0" max="100000" className="w-full accent-primary" />
                    <div className="flex items-center justify-between text-sm font-bold">
                      <span>0 AOA</span>
                      <span>100.000 AOA</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-5 flex items-center justify-between">
                    <span>Tamanhos</span>
                    <ChevronDown size={16} />
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['P', 'M', 'G', 'GG', '38', '39', '40', '41'].map(size => (
                      <button key={size} className="w-10 h-10 rounded-xl border flex items-center justify-center text-xs font-bold hover:border-primary hover:text-primary transition-all">
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-5 flex items-center justify-between">
                    <span>Cores</span>
                    <ChevronDown size={16} />
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {['bg-black', 'bg-white border', 'bg-rose-400', 'bg-blue-400', 'bg-neutral-400'].map(color => (
                      <button key={color} className={`w-8 h-8 rounded-full ${color} shadow-sm border-2 border-transparent hover:border-primary transition-all`}>
                      </button>
                    ))}
                  </div>
                </div>

                <button className="w-full btn-primary py-3">Aplicar Filtros</button>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-grow">
            {loading ? (
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${showFilters ? 'lg:grid-cols-2 xl:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-8`}>
                {[...Array(8)].map((_, i) => <SkeletonProduct key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-bold">Nenhum produto encontrado.</h3>
                <p className="text-neutral-dark/60">Tente ajustar seus filtros ou mude de categoria.</p>
              </div>
            ) : (
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${showFilters ? 'lg:grid-cols-2 xl:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-8`}>
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
