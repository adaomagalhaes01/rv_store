import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/Overview';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';

// Mock components for non-implemented pages
const MockPage = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-neutral-dark/30">
    <h2 className="text-2xl font-bold">{title}</h2>
    <p>Esta funcionalidade será implementada em breve.</p>
  </div>
);

const DashboardRouter = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Overview />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="users" element={<MockPage title="Gestão de Usuários" />} />
        <Route path="banners" element={<MockPage title="Gerenciar Banners" />} />
        <Route path="settings" element={<MockPage title="Configurações" />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default DashboardRouter;
