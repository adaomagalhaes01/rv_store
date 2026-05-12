import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
          >
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/20 rounded-full translate-y-12 -translate-x-12"></div>

            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-neutral-light rounded-full text-neutral-dark/30 hover:text-neutral-dark transition-all"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-8 relative z-10">
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                <UserPlus size={32} />
              </div>
              <h2 className="text-2xl font-bold text-neutral-dark">Quase lá!</h2>
              <p className="text-neutral-dark/40 mt-2 text-sm">Para finalizar a sua compra, você precisa ter uma conta na RV Store.</p>
            </div>

            <div className="space-y-4 relative z-10">
              <button 
                onClick={() => {
                  onClose();
                  navigate('/admin/login'); // Or a customer login page if created
                }}
                className="w-full bg-primary hover:bg-accent text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center space-x-3 shadow-lg shadow-primary/20"
              >
                <LogIn size={20} />
                <span>Entrar na minha conta</span>
              </button>
              
              <button 
                onClick={() => {
                  onClose();
                  navigate('/admin/register'); // Or a customer register page
                }}
                className="w-full bg-secondary text-primary font-bold py-4 rounded-2xl hover:bg-primary/10 transition-all border-2 border-transparent hover:border-primary/20"
              >
                Criar nova conta
              </button>
            </div>

            <p className="text-center text-[10px] text-neutral-dark/30 mt-8 uppercase tracking-widest font-bold">
              Segurança RV Store • Checkout Protegido
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
