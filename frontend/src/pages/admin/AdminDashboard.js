/* eslint-disable no-unused-vars */
// ============================================
// Admin Dashboard Page
// ============================================
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../../services/adminService";
import {
  FiUsers,
  FiShoppingBag,
  FiPackage,
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
import "./admin.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data);
    } catch (err) {
      setError("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <p>{error}</p>
        <button onClick={fetchStats} className="btn-retry">
          Retry
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: FiUsers,
      color: "#3b82f6",
      bgColor: "#dbeafe",
      link: "/admin/users",
    },
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: FiShoppingBag,
      color: "#10b981",
      bgColor: "#d1fae5",
      link: "/admin/products",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: FiPackage,
      color: "#f59e0b",
      bgColor: "#fef3c7",
      link: "/admin/orders",
    },
    {
      title: "Total Revenue",
      value: `$${(stats?.totalRevenue || 0).toFixed(2)}`,
      icon: FiDollarSign,
      color: "#8b5cf6",
      bgColor: "#ede9fe",
      link: "/admin/orders",
    },
  ];

  const orderStats = [
    {
      title: "Pending Orders",
      value: stats?.pendingOrders || 0,
      icon: FiClock,
      color: "#f59e0b",
    },
    {
      title: "Processing Orders",
      value: stats?.processingOrders || 0,
      icon: FiTrendingUp,
      color: "#3b82f6",
    },
    {
      title: "Delivered Orders",
      value: stats?.deliveredOrders || 0,
      icon: FiCheckCircle,
      color: "#10b981",
    },
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p className="dashboard-subtitle">Welcome to the admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <Link to={stat.link} key={index} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: stat.bgColor, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Order Stats */}
      <div className="order-stats-section">
        <h2>Order Statistics</h2>
        <div className="order-stats-grid">
          {orderStats.map((stat, index) => (
            <div key={index} className="order-stat-card">
              <div className="order-stat-icon" style={{ backgroundColor: stat.bgColor, color: stat.color }}>
                <stat.icon size={20} />
              </div>
              <div className="order-stat-info">
                <h3>{stat.value}</h3>
                <p>{stat.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/admin/products" className="action-card">
            <FiShoppingBag size={32} />
            <span>Manage Products</span>
          </Link>
          <Link to="/admin/orders" className="action-card">
            <FiPackage size={32} />
            <span>View Orders</span>
          </Link>
          <Link to="/admin/users" className="action-card">
            <FiUsers size={32} />
            <span>Manage Users</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;