import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Mail, KeyRound, ArrowLeft, CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import useUserStore from '../context/useUserStore';

const AuthPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, sendPasswordReset, updatePassword } = useUserStore();

  const tabParam = searchParams.get('tab') || 'login';
  const isRecovery = searchParams.get('type') === 'recovery';

  const [tab, setTab] = useState(tabParam);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setTab(searchParams.get('tab') || 'login');
    setError('');
    setSuccess('');
  }, [searchParams]);

  const setField = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const switchTab = (next) => {
    setForm({ name: '', email: '', phone: '', password: '', confirmPassword: '', newPassword: '' });
    setError('');
    setSuccess('');
    setSearchParams({ tab: next }, { replace: true });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await login(form.email, form.password);
    if (error) {
      setError(translateError(error.message));
    } else {
      setSuccess('Login efetuado com sucesso!');
      setTimeout(() => navigate('/'), 800);
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError('A palavra-passe deve ter pelo menos 6 caracteres.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    const { data, error } = await register(form.email, form.password, form.name);
    if (error) {
      setError(translateError(error.message));
    } else if (data?.session) {
      setSuccess('Conta criada com sucesso! Bem-vindo(a) à RV Store.');
      setTimeout(() => navigate('/'), 800);
    } else {
      setSuccess('Conta criada! Enviámos um link de confirmação para o seu email. Verifique a caixa de entrada para ativar a conta antes de entrar.');
      switchTab('login');
    }
    setLoading(false);
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await sendPasswordReset(form.email);
    if (error) {
      setError(translateError(error.message));
    } else {
      setSuccess('Enviámos um link de recuperação para o seu email. Siga as instruções para definir uma nova palavra-passe.');
    }
    setLoading(false);
  };

  const handleRecovery = async (e) => {
    e.preventDefault();
    if (form.newPassword.length < 6) {
      setError('A palavra-passe deve ter pelo menos 6 caracteres.');
      return;
    }
    setLoading(true);
    setError('');
    const { error } = await updatePassword(form.newPassword);
    if (error) {
      setError(translateError(error.message));
    } else {
      setSuccess('Palavra-passe atualizada com sucesso! Já pode entrar com a nova palavra-passe.');
      setTimeout(() => navigate('/auth?tab=login'), 1200);
    }
    setLoading(false);
  };

  const inputClass = 'w-full bg-neutral-light/50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 font-medium outline-none';
  const labelClass = 'block text-xs font-bold uppercase tracking-widest text-neutral-dark/40 mb-2';

  return (
    <div className="pt-40 pb-24 min-h-screen">
      <div className="container max-w-xl">
        <Link to="/" className="inline-flex items-center space-x-2 text-primary font-bold hover:underline mb-8">
          <ArrowLeft size={18} />
          <span>Voltar à loja</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-neutral-light relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/20 rounded-full translate-y-12 -translate-x-12"></div>

          <div className="text-center mb-10 relative z-10">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
              {isRecovery ? <KeyRound size={32} /> : tab === 'login' ? <LogIn size={32} /> : <UserPlus size={32} />}
            </div>
            <h1 className="text-3xl font-bold text-neutral-dark">
              {isRecovery ? 'Nova Palavra-Passe' : tab === 'login' ? 'Entrar na conta' : 'Criar conta'}
            </h1>
            <p className="text-neutral-dark/40 mt-2 text-sm">
              {isRecovery ? 'Escolha uma nova palavra-passe para a sua conta.' : tab === 'login' ? 'Bem-vindo(a) de volta à RV Store!' : 'Crie a sua conta para comprar mais rápido.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start space-x-3 relative z-10">
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start space-x-3 relative z-10">
              <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-600 font-medium">{success}</p>
            </div>
          )}

          {/* Recovery form */}
          {isRecovery ? (
            <form onSubmit={handleRecovery} className="space-y-5 relative z-10">
              <div>
                <label className={labelClass}>Nova Palavra-Passe</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-dark/20" />
                  <input
                    type="password"
                    required
                    value={form.newPassword}
                    onChange={setField('newPassword')}
                    placeholder="Mínimo 6 caracteres"
                    className={`${inputClass} pl-14`}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-accent text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {loading ? 'A atualizar...' : 'Atualizar Palavra-Passe'}
              </button>
            </form>
          ) : tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-5 relative z-10">
              <div>
                <label className={labelClass}>Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-dark/20" />
                  <input type="email" required value={form.email} onChange={setField('email')} placeholder="seu@email.com" className={`${inputClass} pl-14`} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Palavra-Passe</label>
                <div className="relative">
                  <KeyRound size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-dark/20" />
                  <input type="password" required value={form.password} onChange={setField('password')} placeholder="••••••••" className={`${inputClass} pl-14`} />
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={() => switchTab('forgot')} className="text-xs font-bold text-primary hover:underline">
                  Esqueceu a palavra-passe?
                </button>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-accent text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
                {loading ? 'A entrar...' : 'Entrar'}
              </button>

              <p className="text-center text-sm text-neutral-dark/50">
                Ainda não tem conta?{' '}
                <button type="button" onClick={() => switchTab('register')} className="text-primary font-bold hover:underline">
                  Criar conta
                </button>
              </p>
            </form>
          ) : tab === 'register' ? (
            <form onSubmit={handleRegister} className="space-y-5 relative z-10">
              <div>
                <label className={labelClass}>Nome Completo</label>
                <input type="text" required value={form.name} onChange={setField('name')} placeholder="O seu nome" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-dark/20" />
                  <input type="email" required value={form.email} onChange={setField('email')} placeholder="seu@email.com" className={`${inputClass} pl-14`} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Palavra-Passe</label>
                <div className="relative">
                  <KeyRound size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-dark/20" />
                  <input type="password" required value={form.password} onChange={setField('password')} placeholder="Mínimo 6 caracteres" className={`${inputClass} pl-14`} />
                </div>
              </div>
              <p className="text-xs text-neutral-dark/40">Ao criar a conta poderá entrar de imediato.</p>
              <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-accent text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
                {loading ? 'A criar conta...' : 'Criar Conta'}
              </button>
              <p className="text-center text-sm text-neutral-dark/50">
                Já tem conta?{' '}
                <button type="button" onClick={() => switchTab('login')} className="text-primary font-bold hover:underline">
                  Entrar
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleForgot} className="space-y-5 relative z-10">
              <div>
                <label className={labelClass}>Email da conta</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-dark/20" />
                  <input type="email" required value={form.email} onChange={setField('email')} placeholder="seu@email.com" className={`${inputClass} pl-14`} />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-accent text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
                {loading ? 'A enviar...' : 'Enviar Link de Recuperação'}
              </button>
              <p className="text-center text-sm text-neutral-dark/50">
                Lembrou-se?{' '}
                <button type="button" onClick={() => switchTab('login')} className="text-primary font-bold hover:underline">
                  Entrar
                </button>
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

function translateError(message) {
  const m = (message || '').toLowerCase();
  if (m.includes('invalid login credentials')) return 'Email ou palavra-passe incorretos.';
  if (m.includes('email not confirmed')) return 'Confirme o seu email antes de entrar. Verifique a sua caixa de entrada.';
  if (m.includes('user already registered')) return 'Já existe uma conta com este email. Entre com a sua palavra-passe.';
  if (m.includes('password should be at least')) return 'A palavra-passe deve ter pelo menos 6 caracteres.';
  if (m.includes('rate limit')) return 'Demasiadas tentativas. Aguarde uns minutos e tente novamente.';
  if (m.includes('unable to validate email') || m.includes('signup_disabled')) return 'Não foi possível criar a conta. Tente novamente.';
  return message || 'Ocorreu um erro. Tente novamente.';
}

export default AuthPage;