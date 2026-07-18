// ============================================
// Admin Orders Management Page
// ============================================
import React, { useState, useEffect } from "react";
import { getOrders, updateOrderStatus } from "../../services/adminService";
import toast from "react-hot-toast";
import {
  FiPackage,
  FiEye,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiXCircle,
} from "react-icons/fi";
import "./admin.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data);
    } catch (err) {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to update order status");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FiClock />;
      case "processing":
        return <FiPackage />;
      case "shipped":
        return <FiTruck />;
      case "delivered":
        return <FiCheckCircle />;
      case "cancelled":
        return <FiXCircle />;
      default:
        return <FiPackage />;
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <p>{error}</p>
        <button onClick={fetchOrders} className="btn-retry">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Orders Management</h1>
          <p className="page-subtitle">Track and manage customer orders</p>
        </div>
        <div className="page-stats">
          <span className="stat-badge">{orders.length} Total Orders</span>
        </div>
      </div>

      <div className="admin-table-container">
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong>#{order.id}</strong>
                  </td>
                  <td>
                    <div className="customer-cell">
                      <div className="customer-avatar">
                        {order.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="customer-name">{order.user?.name}</div>
                        <div className="customer-email">{order.user?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="items-count">
                      {order.orderItems?.length || 0} items
                    </span>
                  </td>
                  <td>
                    <strong>${order.total.toFixed(2)}</strong>
                  </td>
                  <td>
                    <span className={`status-badge ${order.status}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-view"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowModal(true);
                        }}
                        title="View Details"
                      >
                        <FiEye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order #{selectedOrder.id} Details</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <div className="order-details">
              {/* Customer Info */}
              <div className="detail-section">
                <h3>Customer Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{selectedOrder.user?.name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedOrder.user?.email}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="detail-section">
                <h3>Shipping Address</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Street:</span>
                    <span className="detail-value">{selectedOrder.shippingAddress?.street}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">City:</span>
                    <span className="detail-value">{selectedOrder.shippingAddress?.city}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">State:</span>
                    <span className="detail-value">{selectedOrder.shippingAddress?.state}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">ZIP Code:</span>
                    <span className="detail-value">{selectedOrder.shippingAddress?.zipCode}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Country:</span>
                    <span className="detail-value">{selectedOrder.shippingAddress?.country}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="detail-section">
                <h3>Order Items</h3>
                <div className="order-items-list">
                  {selectedOrder.orderItems?.map((item) => (
                    <div key={item.id} className="order-item-detail">
                      <img
                        src={item.product?.image || "https://via.placeholder.com/60"}
                        alt={item.product?.name}
                        className="item-image"
                      />
                      <div className="item-info">
                        <h4>{item.product?.name}</h4>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ${item.price.toFixed(2)}</p>
                      </div>
                      <div className="item-subtotal">
                        <strong>${(item.quantity * item.price).toFixed(2)}</strong>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="order-total-detail">
                  <strong>Total: ${selectedOrder.total.toFixed(2)}</strong>
                </div>
              </div>

              {/* Payment & Status */}
              <div className="detail-section">
                <h3>Payment & Status</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Payment Method:</span>
                    <span className="detail-value">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Current Status:</span>
                    <span className={`status-badge ${selectedOrder.status}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Update Status */}
              <div className="detail-section">
                <h3>Update Order Status</h3>
                <div className="status-buttons">
                  {["pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                    <button
                      key={status}
                      className={`status-btn ${status} ${selectedOrder.status === status ? "active" : ""}`}
                      onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                      disabled={selectedOrder.status === status}
                    >
                      {getStatusIcon(status)}
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;