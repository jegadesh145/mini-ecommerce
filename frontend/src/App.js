// ============================================
// Main App Component
// ============================================
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderSuccess from "./pages/OrderSuccess";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        {/* Auth pages without layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Pages with MainLayout (navbar + footer) */}
        <Route
          path="/"
          element={
            <MainLayout>
              <div className="home-page">
                <div className="container">
                  <h1>Welcome to MiniShop</h1>
                  <p>Your one-stop shop for everything.</p>
                </div>
              </div>
            </MainLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <MainLayout>
              <Products />
            </MainLayout>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Cart />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <h1>Dashboard (Protected)</h1>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Checkout />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Orders />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-success/:orderId"
          element={
            <ProtectedRoute>
              <MainLayout>
                <OrderSuccess />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminUsers />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminProducts />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminOrders />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;