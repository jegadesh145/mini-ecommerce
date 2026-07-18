// ============================================
// Responsive Navbar Component
// ============================================
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiHome,
  FiShoppingBag,
  FiShoppingCart,
  FiUser,
  FiLogIn,
  FiLogOut,
  FiMenu,
  FiX,
  FiPackage,
} from "react-icons/fi";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <FiShoppingBag className="logo-icon" />
          <span className="logo-text">MiniShop</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          <NavLink to="/" className="nav-link" end>
            <FiHome /> Home
          </NavLink>
          <NavLink to="/products" className="nav-link">
            <FiPackage /> Products
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/cart" className="nav-link">
                <FiShoppingCart /> Cart
              </NavLink>
              <NavLink to="/orders" className="nav-link">
                <FiPackage /> Orders
              </NavLink>
              <NavLink to="/profile" className="nav-link">
                <FiUser /> Profile
              </NavLink>
            </>
          )}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="navbar-user">
              <span className="user-name">{user?.name}</span>
              <button className="btn-logout" onClick={handleLogout}>
                <FiLogOut /> Logout
              </button>
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="btn btn-login">
                <FiLogIn /> Login
              </Link>
              <Link to="/register" className="btn btn-register">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="hamburger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <NavLink to="/" className="mobile-link" end onClick={closeMenu}>
            <FiHome /> Home
          </NavLink>
          <NavLink to="/products" className="mobile-link" onClick={closeMenu}>
            <FiPackage /> Products
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/cart" className="mobile-link" onClick={closeMenu}>
                <FiShoppingCart /> Cart
              </NavLink>
              <NavLink to="/orders" className="mobile-link" onClick={closeMenu}>
                <FiPackage /> Orders
              </NavLink>
              <NavLink to="/profile" className="mobile-link" onClick={closeMenu}>
                <FiUser /> Profile
              </NavLink>
              <button className="mobile-link mobile-logout" onClick={handleLogout}>
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="mobile-link" onClick={closeMenu}>
                <FiLogIn /> Login
              </NavLink>
              <NavLink to="/register" className="mobile-link" onClick={closeMenu}>
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;