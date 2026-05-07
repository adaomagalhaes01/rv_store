import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="h-screen flex items-center justify-center pt-20">
      <div className="container text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-[120px] md:text-[200px] font-bold text-neutral-light leading-none">404</h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Página Não Encontrada</h2>
            <p className="text-neutral-dark/60 text-lg mb-10 max-w-md mx-auto">
              Ops! Parece que o conteúdo que você procura não existe ou foi movido.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/" className="btn-primary flex items-center space-x-2">
                <ArrowLeft size={20} />
                <span>Voltar para o Início</span>
              </Link>
              <Link to="/category/todos" className="btn-secondary flex items-center space-x-2">
                <ShoppingBag size={20} />
                <span>Ver Catálogo</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
