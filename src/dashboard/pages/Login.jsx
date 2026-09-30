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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { ok, error } = await login({ email, password });
    setLoading(false);

    if (ok) {
      toast.success('Bem-vindo de volta, Admin!', {
        style: { borderRadius: '12px', background: '#333', color: '#fff' },
      });
      navigate('/admin');
    } else {
      toast.error(error?.message || 'Credenciais inválidas.');
    }
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
