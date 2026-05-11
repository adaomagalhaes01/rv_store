import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Eye, EyeOff, ArrowRight, Lock } from 'lucide-react';
import useAdminStore from '../stores/useAdminStore';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAdminStore(state => state.login);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const success = login({ email, password });
      setLoading(false);
      
      if (success) {
        toast.success('Bem-vindo de volta, Admin!', {
          style: { borderRadius: '12px', background: '#333', color: '#fff' },
        });
        navigate('/admin');
      } else {
        toast.error('Credenciais inválidas. Tente admin@rvstore.com / admin123');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #ff8fa3 0%, #ff4d6d 50%, #ff758f 100%)' }}>
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          {/* Top-right large circle */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}></div>
          
          {/* Floating dots grid */}
          <div className="absolute top-32 left-16 grid grid-cols-4 gap-3 opacity-40">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-white rounded-full"></div>
            ))}
          </div>

          {/* Bottom-left dots */}
          <div className="absolute bottom-48 left-16 grid grid-cols-4 gap-3 opacity-30">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-white rounded-full"></div>
            ))}
          </div>

          {/* X mark */}
          <div className="absolute bottom-44 left-56 text-white/20 text-3xl font-bold">✕</div>

          {/* Hanging decorative lines */}
          <div className="absolute top-10 left-1/3 flex space-x-4">
            <div className="w-2 h-32 bg-white/10 rounded-full"></div>
            <div className="w-2 h-24 bg-white/15 rounded-full mt-4"></div>
            <div className="w-2 h-20 bg-white/10 rounded-full mt-8"></div>
          </div>

          {/* Small floating circles */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-20 right-32 w-8 h-8 bg-white/20 rounded-full"
          />
          <motion.div 
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-52 left-24 w-12 h-12 rounded-full" 
            style={{ background: 'linear-gradient(135deg, #fff0f3, #ff8fa3)' }}
          />

          {/* Semi-circle bottom */}
          <div className="absolute bottom-0 right-20">
            <div className="w-48 h-48 border-[6px] border-white/15 rounded-full translate-y-24">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-full h-full relative"
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full" style={{ background: 'linear-gradient(135deg, #fff0f3, #ff8fa3)' }}></div>
              </motion.div>
            </div>
          </div>

          {/* U-shape decoration */}
          <div className="absolute top-24 left-48 w-12 h-16 border-4 border-white/15 rounded-b-full border-t-0"></div>

          {/* Small circle with ring */}
          <div className="absolute top-16 right-48 w-10 h-10 border-2 border-white/20 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white/30 rounded-full"></div>
          </div>
        </div>

        {/* Text Content */}
        <div className="relative z-10 flex flex-col justify-center px-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold text-white leading-tight tracking-tight">
              A aventura<br />começa aqui
            </h1>
            <p className="text-white/70 text-lg mt-6 max-w-sm leading-relaxed">
              Gerencie sua loja com o painel administrativo mais completo e intuitivo.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white relative p-8">
        {/* Background decorative circles (subtle) */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, #fff0f3 0%, transparent 70%)' }}></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #fff0f3 0%, transparent 70%)' }}></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/10">
              <Lock className="text-primary" size={28} />
            </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-neutral-dark tracking-tight">Olá! Bem-vindo</h2>
            <p className="text-neutral-dark/40 mt-2">Acesse o painel RV Store</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-dark/60 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Insira o seu email"
                  className="w-full bg-white border-2 border-neutral-dark/10 rounded-xl pl-12 pr-6 py-4 focus:border-primary/40 focus:ring-0 transition-all outline-none text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-dark/60 ml-1">Palavra-passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white border-2 border-neutral-dark/10 rounded-xl pl-12 pr-12 py-4 focus:border-primary/40 focus:ring-0 transition-all outline-none text-sm"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-dark/30 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-dark/20 text-primary focus:ring-primary/20 cursor-pointer"
                />
                <span className="text-sm text-neutral-dark/50 group-hover:text-neutral-dark transition-colors">Lembrar-me</span>
              </label>
              <button type="button" className="text-sm text-primary font-medium hover:text-accent transition-colors">
                Esqueceu a senha?
              </button>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center space-x-3 shadow-lg shadow-primary/20 disabled:opacity-50 hover:shadow-xl hover:shadow-primary/30"
              style={{ background: 'linear-gradient(135deg, #ff8fa3 0%, #ff4d6d 100%)' }}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center space-x-4 my-6">
              <div className="flex-1 h-[1px] bg-neutral-dark/10"></div>
              <span className="text-xs text-neutral-dark/30 font-medium">ou</span>
              <div className="flex-1 h-[1px] bg-neutral-dark/10"></div>
            </div>

            {/* Social Login */}
            <div className="flex items-center justify-center space-x-4">
              <button type="button" className="w-14 h-14 bg-white border-2 border-neutral-dark/5 rounded-xl flex items-center justify-center hover:border-primary/20 hover:bg-secondary/20 transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              </button>
              <button type="button" className="w-14 h-14 bg-white border-2 border-neutral-dark/5 rounded-xl flex items-center justify-center hover:border-primary/20 hover:bg-secondary/20 transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </button>
              <button type="button" className="w-14 h-14 bg-white border-2 border-neutral-dark/5 rounded-xl flex items-center justify-center hover:border-primary/20 hover:bg-secondary/20 transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#333"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              </button>
            </div>

            {/* Create Account Link */}
            <p className="text-center text-sm text-neutral-dark/50 mt-6">
              Não tem uma conta?{' '}
              <Link to="/admin/register" className="text-primary font-bold hover:text-accent transition-colors">
                Criar Conta
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
