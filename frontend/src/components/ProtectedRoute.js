// ============================================
// Protected Route Component
// ============================================
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute - redirects to login if user is not authenticated
 * @param {object} props
 * @param {React.Component} props.children - Component to render
 * @param {string} props.redirectTo - Path to redirect to (default: /login)
 */
const ProtectedRoute = ({ children, redirectTo = "/login" }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;