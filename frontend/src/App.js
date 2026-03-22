import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { useWishlistStore } from './store/wishlistStore';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import OrdersListPage from './pages/OrdersListPage';
import WishlistPage from './pages/WishlistPage';
import ShopkeeperDashboard from './pages/ShopkeeperDashboard';
import ShopkeeperAddProductPage from './pages/ShopkeeperAddProductPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminSpecificationsPage from './pages/AdminSpecificationsPage';

// Protected Route Component
function ProtectedRoute({ children, requiredRole }) {
  const { user, isLoggedIn } = useAuthStore();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (requiredRole) {
    const userRoles = Array.isArray(user?.roles) ? user.roles : (user?.role ? [user.role] : []);
    if (!userRoles.includes(requiredRole)) {
      return <Navigate to="/" />;
    }
  }

  return children;
}

export default function App() {
  const { loadUser, isLoggedIn } = useAuthStore();
  const { fetchWishlist } = useWishlistStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchWishlist();
    }
  }, [isLoggedIn]);

  return (
    <BrowserRouter>
      <Header />
      <main className="min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />

          {/* Customer Routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute requiredRole="customer">
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute requiredRole="customer">
                <WishlistPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute requiredRole="customer">
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute requiredRole="customer">
                <OrdersListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetailsPage />
              </ProtectedRoute>
            }
          />

          {/* Shopkeeper Routes */}
          <Route
            path="/shopkeeper/dashboard"
            element={
              <ProtectedRoute requiredRole="shopkeeper">
                <ShopkeeperDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shopkeeper/add-product"
            element={
              <ProtectedRoute requiredRole="shopkeeper">
                <ShopkeeperAddProductPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/specifications"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminSpecificationsPage />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}
