import { motion } from 'framer-motion';
import { Award, Users, Heart, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="pt-32 pb-20">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-24">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-primary font-bold uppercase tracking-widest text-sm"
            >
              Nossa Jornada
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mt-4 leading-tight"
            >
              Elegância e Estilo <br /> <span className="text-primary italic font-light">Para Todos.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-neutral-dark/60 text-lg mt-8 max-w-2xl mx-auto"
            >
              A RV_Store nasceu da paixão por moda e do desejo de trazer o que há de mais moderno e sofisticado para o mercado angolano. Localizada no coração do Morro Bento, somos mais que uma loja, somos um estilo de vida.
            </motion.p>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32">
            {[
              { val: '5k+', label: 'Clientes Felizes' },
              { val: '100%', label: 'Qualidade' },
              { val: '24h', label: 'Entrega Média' },
              { val: '2024', label: 'Fundada em' },
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-neutral-light/50 p-8 rounded-3xl text-center"
              >
                <h3 className="text-3xl font-bold text-primary">{stat.val}</h3>
                <p className="text-sm font-medium text-neutral-dark/40 uppercase tracking-widest mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </section>

          {/* Values */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold">Nossos Valores</h2>
              <p className="text-neutral-dark/70 text-lg leading-relaxed">
                Acreditamos que a moda é uma forma de expressão poderosa. Por isso, selecionamos cada peça com cuidado, priorizando qualidade, conforto e design.
              </p>
              <div className="space-y-6">
                {[
                  { icon: <Award size={20} />, title: 'Excelência', desc: 'Buscamos o melhor em tudo que fazemos.' },
                  { icon: <Users size={20} />, title: 'Comunidade', desc: 'Nossos clientes são parte da nossa família.' },
                  { icon: <Target size={20} />, title: 'Inovação', desc: 'Sempre antenados nas tendências globais.' },
                ].map((v, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary shrink-0">
                      {v.icon}
                    </div>
                    <div>
                      <h4 className="font-bold">{v.title}</h4>
                      <p className="text-sm text-neutral-dark/60">{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-neutral-light shadow-2xl rotate-3 group">
                <img src="/assets/vestido-rosa-1.png" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="About Image" />
              </div>
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-primary rounded-[2rem] p-6 text-white flex flex-col justify-end shadow-xl -rotate-6">
                <Heart size={32} fill="white" className="mb-4" />
                <p className="font-bold leading-tight">Feito com Amor para Você</p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-neutral-dark rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="relative z-10 space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold">Pronto para elevar seu estilo?</h2>
              <p className="text-white/60 text-lg max-w-xl mx-auto">
                Explore nossa coleção cuidadosamente selecionada e descubra peças que combinam com você.
              </p>
              <Link to="/category/todos" className="btn-primary inline-flex items-center space-x-2">
                <span>Ir para a Loja</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
