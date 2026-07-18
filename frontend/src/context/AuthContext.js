// ============================================
// Authentication Context
// ============================================
import React, { createContext, useState, useEffect, useContext } from "react";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../services/authService";
import toast from "react-hot-toast";

// Create context
const AuthContext = createContext(null);

/**
 * AuthProvider - wraps the app and provides auth state
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount (token exists in localStorage)
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          // Verify token is still valid by fetching current user
          const response = await getCurrentUser();
          if (response.success) {
            setUser(response.data);
            localStorage.setItem("user", JSON.stringify(response.data));
          } else {
            // Token invalid
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            setUser(null);
          }
        } catch (error) {
          // Token expired - refresh interceptor will handle it
          // If refresh also fails, user will be null
          setUser(JSON.parse(storedUser));
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  /**
   * Register a new user
   */
  const register = async (userData) => {
    try {
      const response = await registerUser(userData);

      if (response.success) {
        const { user: userData, accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        toast.success(response.message);
        return { success: true };
      }

      return { success: false, message: response.message };
    } catch (error) {
      const message =
        error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(message);
      return { success: false, message };
    }
  };

  /**
   * Login user
   */
  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials);

      if (response.success) {
        const { user: userData, accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        toast.success(response.message);
        return { success: true };
      }

      return { success: false, message: response.message };
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
      return { success: false, message };
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setUser(null);
      toast.success("Logged out successfully");
    }
  };

  // Context value
  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;