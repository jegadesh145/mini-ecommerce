// ============================================
// Order Service
// ============================================
import api from "./api";

/**
 * Create order from cart
 * @param {object} data - { shippingAddress, phone }
 * @returns {Promise}
 */
export const createOrder = async (data) => {
  const response = await api.post("/api/orders", data);
  return response.data;
};

/**
 * Get user's orders
 * @returns {Promise}
 */
export const getOrders = async () => {
  const response = await api.get("/api/orders");
  return response.data;
};

/**
 * Get single order
 * @param {string} id
 * @returns {Promise}
 */
export const getOrder = async (id) => {
  const response = await api.get(`/api/orders/${id}`);
  return response.data;
};