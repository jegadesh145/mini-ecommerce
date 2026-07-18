// ============================================
// Product Service
// ============================================
import api from "./api";

/**
 * Get products with filters and pagination
 * @param {object} params - { page, limit, category, search, sortBy, sortOrder, minPrice, maxPrice, minRating }
 * @returns {Promise}
 */
export const getProducts = async (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.append(key, value);
  });
  const response = await api.get(`/api/products?${query.toString()}`);
  return response.data;
};

/**
 * Get single product by ID
 * @param {string} id - Product ID
 * @returns {Promise}
 */
export const getProduct = async (id) => {
  const response = await api.get(`/api/products/${id}`);
  return response.data;
};