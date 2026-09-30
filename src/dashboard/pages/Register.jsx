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

  const handleSubmit = async (e) => {
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
    const { ok, error } = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
    setLoading(false);

    if (ok) {
      toast.success('Conta criada! Já pode entrar.', {
        style: { borderRadius: '12px', background: '#333', color: '#fff' },
      });
      navigate('/admin/login');
    } else {
      toast.error(error?.message || 'Não foi possível criar a conta.');
    }
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
