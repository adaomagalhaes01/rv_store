import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Eye, EyeOff, ArrowRight, Lock, User, Phone } from 'lucide-react';
import useAdminStore from '../stores/useAdminStore';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const register = useAdminStore(state => state.register);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('As palavras-passe não coincidem.');
      return;
    }
    if (!agreeTerms) {
      toast.error('Aceite os termos e condições para continuar.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      register({ name: formData.name, email: formData.email });
      setLoading(false);
      toast.success('Conta criada com sucesso! Faça login.', {
        style: { borderRadius: '12px', background: '#333', color: '#fff' },
      });
      navigate('/admin/login');
    }, 1800);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #ff4d6d 0%, #ff8fa3 50%, #ff758f 100%)' }}>
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          {/* Large circle top-left */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}></div>
          
          {/* Floating dots grid */}
          <div className="absolute bottom-32 right-16 grid grid-cols-4 gap-3 opacity-30">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-white rounded-full"></div>
            ))}
          </div>

          {/* Top dots */}
          <div className="absolute top-24 right-20 grid grid-cols-3 gap-3 opacity-25">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-white rounded-full"></div>
            ))}
          </div>

          {/* X marks */}
          <div className="absolute top-48 right-36 text-white/15 text-2xl font-bold">✕</div>
          <div className="absolute bottom-32 left-40 text-white/15 text-2xl font-bold">✕</div>

          {/* Hanging decorative lines */}
          <div className="absolute top-0 right-1/3 flex space-x-4">
            <div className="w-2 h-28 bg-white/10 rounded-full"></div>
            <div className="w-2 h-20 bg-white/15 rounded-full mt-6"></div>
            <div className="w-2 h-16 bg-white/10 rounded-full mt-10"></div>
          </div>

          {/* Floating circles */}
          <motion.div 
            animate={{ y: [0, -12, 0], x: [0, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-32 left-28 w-10 h-10 rounded-full" 
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))' }}
          />
          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute bottom-60 right-28 w-14 h-14 rounded-full" 
            style={{ background: 'linear-gradient(135deg, #fff0f3, #ff8fa3)' }}
          />
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute top-1/2 left-16 w-6 h-6 bg-white/20 rounded-full"
          />

          {/* Semi-circle bottom */}
          <div className="absolute bottom-0 left-24">
            <div className="w-44 h-44 border-[5px] border-white/12 rounded-full translate-y-20">
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="w-full h-full relative"
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full" style={{ background: 'linear-gradient(135deg, #fff0f3, #ff8fa3)' }}></div>
              </motion.div>
            </div>
          </div>

          {/* U-shape decoration */}
          <div className="absolute top-40 right-24 w-10 h-14 border-4 border-white/12 rounded-b-full border-t-0"></div>

          {/* Circle with ring */}
          <div className="absolute bottom-40 right-48 w-8 h-8 border-2 border-white/15 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white/25 rounded-full"></div>
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
              Junte-se à<br />nossa equipa
            </h1>
            <p className="text-white/70 text-lg mt-6 max-w-sm leading-relaxed">
              Crie a sua conta e comece a gerir a sua loja de forma profissional e eficiente.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white relative p-8 overflow-y-auto">
        {/* Background decorative */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #fff0f3 0%, transparent 70%)' }}></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10 py-8"
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/10">
              <User className="text-primary" size={28} />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-neutral-dark tracking-tight">Criar Conta</h2>
            <p className="text-neutral-dark/40 mt-2">Preencha os dados para começar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-dark/60 ml-1">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  className="w-full bg-white border-2 border-neutral-dark/10 rounded-xl pl-12 pr-6 py-3.5 focus:border-primary/40 focus:ring-0 transition-all outline-none text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-dark/60 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="w-full bg-white border-2 border-neutral-dark/10 rounded-xl pl-12 pr-6 py-3.5 focus:border-primary/40 focus:ring-0 transition-all outline-none text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-dark/60 ml-1">Telemóvel</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9XX XXX XXX"
                  className="w-full bg-white border-2 border-neutral-dark/10 rounded-xl pl-12 pr-6 py-3.5 focus:border-primary/40 focus:ring-0 transition-all outline-none text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-neutral-dark/60 ml-1">Palavra-passe</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-white border-2 border-neutral-dark/10 rounded-xl px-4 py-3.5 focus:border-primary/40 focus:ring-0 transition-all outline-none text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-neutral-dark/60 ml-1">Confirmar</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-white border-2 border-neutral-dark/10 rounded-xl px-4 py-3.5 focus:border-primary/40 focus:ring-0 transition-all outline-none text-sm"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-dark/30 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <label className="flex items-start space-x-3 cursor-pointer group pt-1">
              <input 
                type="checkbox" 
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded border-neutral-dark/20 text-primary focus:ring-primary/20 cursor-pointer mt-0.5"
              />
              <span className="text-xs text-neutral-dark/50 group-hover:text-neutral-dark/70 transition-colors leading-relaxed">
                Concordo com os <button type="button" className="text-primary font-medium">Termos de Serviço</button> e a <button type="button" className="text-primary font-medium">Política de Privacidade</button>
              </span>
            </label>

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
                  <span>Criar Conta</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center space-x-4">
              <div className="flex-1 h-[1px] bg-neutral-dark/10"></div>
              <span className="text-xs text-neutral-dark/30 font-medium">ou</span>
              <div className="flex-1 h-[1px] bg-neutral-dark/10"></div>
            </div>

            {/* Social Register */}
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

            {/* Login Link */}
            <p className="text-center text-sm text-neutral-dark/50">
              Já tem uma conta?{' '}
              <Link to="/admin/login" className="text-primary font-bold hover:text-accent transition-colors">
                Fazer Login
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
