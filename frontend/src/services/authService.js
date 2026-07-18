// ============================================
// Authentication Service
// ============================================
import api from "./api";

/**
 * Register a new user
 * @param {object} userData - { name, email, password, confirmPassword }
 * @returns {Promise} - { success, message, data }
 */
export const registerUser = async (userData) => {
  const response = await api.post("/api/auth/register", userData);
  return response.data;
};

/**
 * Login user
 * @param {object} credentials - { email, password }
 * @returns {Promise} - { success, message, data }
 */
export const loginUser = async (credentials) => {
  const response = await api.post("/api/auth/login", credentials);
  return response.data;
};

/**
 * Logout user
 * @returns {Promise} - { success, message }
 */
export const logoutUser = async () => {
  const response = await api.post("/api/auth/logout");
  return response.data;
};

/**
 * Get current user profile
 * @returns {Promise} - { success, data }
 */
export const getCurrentUser = async () => {
  const response = await api.get("/api/auth/me");
  return response.data;
};

/**
 * Refresh access token
 * @returns {Promise} - { success, data }
 */
export const refreshToken = async () => {
  const response = await api.post("/api/auth/refresh");
  return response.data;
};