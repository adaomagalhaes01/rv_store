import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Category from '../pages/Category';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Promotions from '../pages/Promotions';
import NotFound from '../pages/NotFound';

// Dashboard imports
import DashboardLayout from '../dashboard/layouts/DashboardLayout';
import Login from '../dashboard/pages/Login';
import Register from '../dashboard/pages/Register';
import Overview from '../dashboard/pages/Overview';
import Products from '../dashboard/pages/Products';
import Orders from '../dashboard/pages/Orders';
import Users from '../dashboard/pages/Users';
import Banners from '../dashboard/pages/Banners';
import Settings from '../dashboard/pages/Settings';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* ======= Loja Virtual ======= */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="category/:id" element={<Category />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="promotions" element={<Promotions />} />
        </Route>

        {/* ======= Painel Administrativo ======= */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />

        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="banners" element={<Banners />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
