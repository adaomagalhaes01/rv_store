import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, Camera, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.', {
      duration: 5000,
      icon: '📩',
    });
    e.target.reset();
  };

  return (
    <div className="pt-32 pb-20">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-primary font-bold uppercase tracking-widest text-sm"
            >
              Fale Conosco
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mt-4"
            >
              Estamos aqui para <br /> <span className="text-primary italic font-light">te ouvir.</span>
            </motion.h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Info Side */}
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: <Phone size={20} />, label: 'Telefone', val: '+244 936 094 537' },
                  { icon: <Mail size={20} />, label: 'Email', val: 'contato@rvstore.ao' },
                  { icon: <MapPin size={20} />, label: 'Localização', val: 'Morro Bento, Luanda' },
                  { icon: <MessageCircle size={20} />, label: 'WhatsApp', val: '936 094 537' },
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-6 rounded-2xl border border-neutral-light hover:border-primary/30 transition-all group shadow-sm"
                  >
                    <div className="text-primary mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                    <div>
                      <p className="text-[10px] font-bold text-neutral-dark/30 uppercase tracking-widest">{item.label}</p>
                      <p className="font-bold text-sm mt-1">{item.val}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-neutral-dark text-white rounded-2xl p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                <h3 className="text-2xl font-bold mb-6">Horário de Atendimento</h3>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-white/10 pb-4">
                    <span className="text-white/60">Segunda - Sexta</span>
                    <span className="font-bold">08:00 - 19:00</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-4">
                    <span className="text-white/60">Sábado</span>
                    <span className="font-bold">09:00 - 17:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Domingo</span>
                    <span className="text-primary font-bold">Fechado</span>
                  </div>
                </div>
                <div className="mt-10 flex space-x-6">
                  <a href="#" className="hover:text-primary transition-colors"><Camera size={24} /></a>
                  <a href="#" className="hover:text-primary transition-colors"><MessageCircle size={24} /></a>
                </div>
              </div>
            </div>

            {/* Form Side */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-10 shadow-sm border border-neutral-light"
            >
              <h2 className="text-3xl font-bold mb-8 text-neutral-dark">Envie uma Mensagem</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-dark/40 ml-1 uppercase tracking-wider">Nome</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Seu nome"
                      className="w-full bg-neutral-light border border-neutral-100 rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/20 text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-dark/40 ml-1 uppercase tracking-wider">Email</label>
                    <input 
                      type="email" 
                      required
                      placeholder="seu@email.com"
                      className="w-full bg-neutral-light border border-neutral-100 rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/20 text-sm outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-dark/40 ml-1 uppercase tracking-wider">Assunto</label>
                  <select className="w-full bg-neutral-light border border-neutral-100 rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/20 appearance-none text-sm outline-none">
                    <option>Dúvida sobre Produto</option>
                    <option>Status do Pedido</option>
                    <option>Parcerias</option>
                    <option>Outros</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-dark/40 ml-1 uppercase tracking-wider">Mensagem</label>
                  <textarea 
                    rows="5"
                    required
                    placeholder="Como podemos ajudar?"
                    className="w-full bg-neutral-light border border-neutral-100 rounded-xl px-6 py-4 focus:ring-2 focus:ring-primary/20 resize-none text-sm outline-none"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full btn-primary py-4"
                >
                  Enviar Mensagem
                </button>
              </form>
            </motion.div>
          </div>
          
          {/* Map Placeholder */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-32 h-[400px] bg-neutral-light rounded-2xl overflow-hidden relative border border-neutral-light shadow-sm"
          >
            <div className="absolute inset-0 bg-neutral-200 animate-pulse flex items-center justify-center">
              <div className="text-center">
                <MapPin size={48} className="text-primary mx-auto mb-4" />
                <p className="font-bold text-neutral-dark/40 uppercase tracking-widest">Mapa em carregamento...</p>
                <p className="text-xs mt-2">Morro Bento, Luanda, Angola</p>
              </div>
            </div>
            {/* Real map would be integrated here */}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
