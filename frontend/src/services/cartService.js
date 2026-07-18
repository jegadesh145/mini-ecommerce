// ============================================
// Cart Service
// ============================================
import api from "./api";

/**
 * Get user's cart
 * @returns {Promise} - { success, data: { items, total, itemCount } }
 */
export const getCart = async () => {
  const response = await api.get("/api/cart");
  return response.data;
};

/**
 * Add item to cart
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise}
 */
export const addToCart = async (productId, quantity = 1) => {
  const response = await api.post("/api/cart", { productId, quantity });
  return response.data;
};

/**
 * Update cart item quantity
 * @param {string} itemId - Cart item ID
 * @param {number} quantity
 * @returns {Promise}
 */
export const updateCartItem = async (itemId, quantity) => {
  const response = await api.put(`/api/cart/${itemId}`, { quantity });
  return response.data;
};

/**
 * Remove item from cart
 * @param {string} itemId - Cart item ID
 * @returns {Promise}
 */
export const removeFromCart = async (itemId) => {
  const response = await api.delete(`/api/cart/${itemId}`);
  return response.data;
};

/**
 * Clear entire cart
 * @returns {Promise}
 */
export const clearCart = async () => {
  const response = await api.delete("/api/cart/clear");
  return response.data;
};