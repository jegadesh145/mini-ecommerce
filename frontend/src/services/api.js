// ============================================
// Axios API Configuration
// ============================================
import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
  withCredentials: true, // Include cookies (refresh token)
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor - attach access token to headers
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor - handle 401 errors and refresh token
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const response = await axios.post(
          `${api.defaults.baseURL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (response.data.success) {
          const newToken = response.data.data.accessToken;
          localStorage.setItem("accessToken", newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - clear auth
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;