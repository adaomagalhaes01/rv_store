import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productsData from '../data/products.json';

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query.trim().length > 1) {
      const filtered = productsData.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-32 px-4">
          {/* Overlay with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-white/20 backdrop-blur-xl"
          />
          
          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-white shadow-[0_30px_100px_rgba(0,0,0,0.1)] rounded-2xl overflow-hidden border border-neutral-100"
          >
            <div className="flex items-center p-6 border-b border-neutral-50">
              <Search className="text-neutral-dark/30 mr-4" size={20} />
              <input 
                autoFocus
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisar..."
                className="flex-grow bg-transparent border-none outline-none text-xl font-medium text-neutral-dark placeholder:text-neutral-dark/20"
              />
              <button 
                onClick={onClose}
                className="ml-4 p-2 text-neutral-dark/40 hover:text-neutral-dark transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {results.length > 0 ? (
                <div className="p-2">
                  {results.map(product => (
                    <Link 
                      key={product.id} 
                      to={`/product/${product.id}`}
                      onClick={onClose}
                      className="flex items-center space-x-4 p-4 rounded-xl hover:bg-neutral-light transition-colors group"
                    >
                      <div className="w-12 h-16 rounded-lg overflow-hidden bg-neutral-light shrink-0">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-neutral-dark text-sm group-hover:text-primary transition-colors">{product.name}</h4>
                        <p className="text-[10px] uppercase font-bold text-neutral-dark/40 tracking-wider">{product.category}</p>
                      </div>
                      <span className="text-sm font-bold text-neutral-dark/60">
                        {product.price.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                      </span>
                    </Link>
                  ))}
                  <Link 
                    to="/category/todos" 
                    onClick={onClose}
                    className="flex items-center justify-center space-x-2 py-4 text-xs font-bold text-primary hover:bg-primary/5 transition-colors border-t border-neutral-50"
                  >
                    <span>Ver todos os resultados</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ) : query.length > 1 ? (
                <div className="p-10 text-center text-neutral-dark/40 text-sm">
                  Nenhum resultado para "{query}"
                </div>
              ) : (
                <div className="p-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-dark/30 mb-4">Sugestões de Busca</p>
                  <div className="flex flex-wrap gap-2">
                    {['Vestidos', 'Masculino', 'Cosméticos', 'Calçados'].map(tag => (
                      <button 
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="px-4 py-2 bg-neutral-light hover:bg-primary hover:text-white rounded-lg text-xs font-bold transition-all text-neutral-dark/60"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
