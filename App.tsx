import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrders from './pages/admin/AdminOrders';
import UserProfile from './pages/UserProfile';
import Wishlist from './pages/Wishlist';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen font-sans bg-slate-50 dark:bg-[#111418]">
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<OrderHistory />} />

                {/* Admin Routes */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/products/new" element={<AdminProductForm />} />
                  <Route path="/admin/products/edit/:id" element={<AdminProductForm />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                </Route>
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/wishlist" element={<Wishlist />} />
              </Routes>
              <Footer />
            </div>
          </BrowserRouter>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;