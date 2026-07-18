// ============================================
// Admin Service - API calls for admin panel
// ============================================
import api from "./api";

// Get dashboard stats
export const getDashboardStats = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

// Get all users
export const getUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

// Get single user
export const getUser = async (id) => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
};

// Update user
export const updateUser = async (id, userData) => {
  const response = await api.put(`/admin/users/${id}`, userData);
  return response.data;
};

// Delete user
export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

// Get all orders
export const getOrders = async () => {
  const response = await api.get("/admin/orders");
  return response.data;
};

// Update order status
export const updateOrderStatus = async (id, status) => {
  const response = await api.put(`/admin/orders/${id}/status`, { status });
  return response.data;
};

// Get all products (admin view)
export const getAdminProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

// Create product
export const createProduct = async (productData) => {
  const response = await api.post("/products", productData);
  return response.data;
};

// Update product
export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

// Delete product
export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};