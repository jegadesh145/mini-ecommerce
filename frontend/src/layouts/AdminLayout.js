// ============================================
// Admin Layout Component
// ============================================
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiHome,
  FiUsers,
  FiShoppingBag,
  FiPackage,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const menuItems = [
    { path: "/admin", icon: FiHome, label: "Dashboard", exact: true },
    { path: "/admin/users", icon: FiUsers, label: "Users" },
    { path: "/admin/products", icon: FiShoppingBag, label: "Products" },
    { path: "/admin/orders", icon: FiPackage, label: "Orders" },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <Link to="/admin" className="sidebar-logo">
            <FiShoppingBag />
            <span>Admin Panel</span>
          </Link>
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${isActive(item.path)}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="sidebar-link">
            <FiHome />
            <span>Back to Store</span>
          </Link>
          <button className="sidebar-link" onClick={handleLogout}>
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <button
            className="header-menu-toggle"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu />
          </button>

          <div className="header-user">
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">Administrator</span>
            </div>
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;