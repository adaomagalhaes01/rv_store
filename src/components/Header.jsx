import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '../context/useCartStore';
import useUserStore from '../context/useUserStore';
import SearchModal from './SearchModal';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { toggleCart, getCartCount } = useCartStore();
  const { isAuthenticated, user } = useUserStore();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Masculino', path: '/category/masculino' },
    { name: 'Feminino', path: '/category/feminino' },
    { name: 'Cosméticos', path: '/category/cosmeticos' },
    { name: 'Calçados', path: '/category/calcados' },
    { name: 'Promoções', path: '/promotions' },
    { name: 'Contato', path: '/contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 transition-all duration-300 ${isScrolled ? 'shadow-sm' : ''}`}
    >
      <div className={`${isScrolled ? 'py-3' : 'py-5'} transition-all duration-300`}>
        <div className="container flex items-center justify-between">
          <button 
            className="lg:hidden p-2 text-neutral-dark"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          <Link to="/" className="text-2xl font-medium tracking-tighter text-neutral-dark">
            RV<span className="text-primary">_Store</span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={`text-sm font-bold uppercase tracking-widest transition-colors duration-300 ${
                  location.pathname === link.path ? 'text-primary' : 'text-neutral-dark/60 hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:block p-2 text-neutral-dark/80 hover:text-primary transition-colors duration-300"
            >
              <Search size={20} />
            </button>

            <Link 
              to="/admin" 
              className="hidden md:flex items-center space-x-1 p-2 text-neutral-dark/80 hover:text-primary transition-colors duration-300"
              title="Painel Admin"
            >
              <LayoutDashboard size={20} />
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-secondary rounded-full border border-primary/10">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="hidden lg:block text-[11px] font-bold text-neutral-dark">{user.name}</span>
              </div>
            ) : (
              <Link 
                to="/admin/login" 
                className="p-2 text-neutral-dark/80 hover:text-primary transition-colors duration-300"
                title="Entrar"
              >
                <User size={20} />
              </Link>
            )}

            <button 
              onClick={toggleCart}
              className="p-2 text-neutral-dark/80 hover:text-primary transition-colors duration-300 relative"
            >
              <ShoppingBag size={20} />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white z-[70] lg:hidden p-6"
            >
              <div className="flex items-center justify-between mb-10">
                <Link to="/" className="text-2xl font-bold tracking-tighter">
                  RV<span className="text-primary">_Store</span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <nav className="flex flex-col space-y-6">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-bold hover:text-primary transition-colors text-neutral-dark"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-6 border-t">
                  <Link to="/admin" className="flex items-center space-x-3 text-lg font-bold text-neutral-dark/60">
                    <LayoutDashboard size={24} />
                    <span>Painel Administrativo</span>
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </header>
  );
};

export default Header;
