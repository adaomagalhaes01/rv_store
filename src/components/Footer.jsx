import { Link } from 'react-router-dom';
import { MessageCircle, Camera, Share2, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-neutral-light/50 border-t pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand info */}
          <div className="space-y-6">
            <Link to="/" className="text-3xl font-bold tracking-tighter">
              RV<span className="text-primary">_Store</span>
            </Link>
            <p className="text-neutral-dark/70 leading-relaxed max-w-xs">
              A RV_Store é focada em oferecer o que há de melhor em moda, beleza e estilo. Elegância e sofisticação para o seu dia a dia.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-neutral-dark hover:bg-primary hover:text-white transition-all duration-300 shadow-sm">
                <Camera size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-neutral-dark hover:bg-primary hover:text-white transition-all duration-300 shadow-sm">
                <MessageCircle size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-neutral-dark hover:bg-primary hover:text-white transition-all duration-300 shadow-sm">
                <Share2 size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Links Rápidos</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-neutral-dark/70 hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-neutral-dark/70 hover:text-primary transition-colors">Sobre Nós</Link></li>
              <li><Link to="/contact" className="text-neutral-dark/70 hover:text-primary transition-colors">Contacto</Link></li>
              <li><Link to="/promotions" className="text-neutral-dark/70 hover:text-primary transition-colors">Promoções</Link></li>
              <li><Link to="/faq" className="text-neutral-dark/70 hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold mb-6">Categorias</h4>
            <ul className="space-y-4">
              <li><Link to="/category/masculino" className="text-neutral-dark/70 hover:text-primary transition-colors">Masculino</Link></li>
              <li><Link to="/category/feminino" className="text-neutral-dark/70 hover:text-primary transition-colors">Feminino</Link></li>
              <li><Link to="/category/cosmeticos" className="text-neutral-dark/70 hover:text-primary transition-colors">Cosméticos</Link></li>
              <li><Link to="/category/calcados" className="text-neutral-dark/70 hover:text-primary transition-colors">Calçados</Link></li>
              <li><Link to="/category/acessorios" className="text-neutral-dark/70 hover:text-primary transition-colors">Acessórios</Link></li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-lg font-bold mb-6">Informações</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-neutral-dark/70">
                <MapPin size={20} className="text-primary mt-1 shrink-0" />
                <span>Morro Bento, Luanda, Angola</span>
              </li>
              <li className="flex items-center space-x-3 text-neutral-dark/70">
                <Phone size={20} className="text-primary shrink-0" />
                <span>+244 936 094 537</span>
              </li>
              <li className="flex items-center space-x-3 text-neutral-dark/70">
                <Mail size={20} className="text-primary shrink-0" />
                <span>contato@rvstore.ao</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <p className="text-sm text-neutral-dark/50">
            © {new Date().getFullYear()} RV_Store. Todos os direitos reservados.
          </p>
          <div className="flex items-center space-x-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
